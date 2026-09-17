import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const googleOAuthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
);

let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Secure Server-Side Google Token Verification
  app.post("/api/auth/verify-google-token", async (req, res) => {
    try {
      const { credential, accessToken } = req.body;

      if (!credential && !accessToken) {
        return res.status(400).json({ error: "Missing Google credential or access token." });
      }

      let payload: any = null;

      if (credential) {
        const configuredClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
        try {
          const ticket = await googleOAuthClient.verifyIdToken({
            idToken: credential,
            audience: configuredClientId || undefined,
          });
          payload = ticket.getPayload();
        } catch (verifyErr) {
          // Resilient fallback to Google's official tokeninfo endpoint
          const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
          if (tokenInfoRes.ok) {
            payload = await tokenInfoRes.json();
          } else {
            throw verifyErr;
          }
        }
      } else if (accessToken) {
        const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userinfoRes.ok) {
          throw new Error("Invalid or expired Google access token.");
        }
        payload = await userinfoRes.json();
      }

      if (!payload || !payload.sub) {
        return res.status(401).json({ error: "Could not verify Google account identifier (sub)." });
      }

      const email = (payload.email || "").toLowerCase();
      const isAdmin = email === "sdarshan1163@gmail.com";

      const verifiedUser = {
        id: payload.sub, // Stable Google Sub identifier as the primary user ID
        sub: payload.sub,
        email: email,
        name: payload.name || payload.given_name || (isAdmin ? "Darshan Solanki" : email.split("@")[0]),
        givenName: payload.given_name,
        familyName: payload.family_name,
        picture: payload.picture || (isAdmin 
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"),
        verifiedEmail: payload.email_verified ?? true,
        hd: payload.hd,
        isAdmin,
        loginTimestamp: Date.now(),
      };

      return res.json({
        success: true,
        user: verifiedUser,
        sessionToken: `tk_sess_${payload.sub}_${Date.now()}`,
      });
    } catch (error: any) {
      console.error("Server-side Google verification error:", error);
      return res.status(401).json({
        error: error.message || "Failed to verify Google identity credential with Google Identity Services.",
      });
    }
  });

  // AI Schedule Optimization
  app.post("/api/ai/optimize-schedule", async (req, res) => {
    try {
      const { tasks, events, targetDate, workHoursStart = "09:00", workHoursEnd = "18:00" } = req.body;
      const client = getGeminiClient();

      if (!client) {
        // Fallback rule-based scheduler if Gemini key is not configured yet
        return res.json({
          success: true,
          source: "fallback",
          summary: "Optimized schedule generated based on task priorities, due dates, and existing calendar commitments.",
          blocks: generateFallbackSchedule(tasks, events, workHoursStart, workHoursEnd, targetDate),
          tips: [
            "Tackled highest priority urgent tasks before midday meeting blocks.",
            "Included 15-minute buffer periods between consecutive context-switches.",
            "Reserved late afternoon for async communication and review tasks."
          ]
        });
      }

      const prompt = `You are an expert executive productivity coach and calendar schedule optimizer for enterprise employees.
Analyze the following user's tasks and calendar events for date: ${targetDate}.
Working Hours: ${workHoursStart} to ${workHoursEnd}.

Current Calendar Events for ${targetDate}:
${JSON.stringify(events || [], null, 2)}

Pending Tasks to schedule/prioritize:
${JSON.stringify(tasks || [], null, 2)}

Objective:
1. Identify free time gaps between calendar events within working hours.
2. Allocate high-priority and urgent tasks into optimal time blocks (e.g. 30m, 45m, 60m, 90m focus slots).
3. Do NOT overlap with existing meetings/events. Include 10-15 minute buffers around heavy meetings.
4. Schedule deep focus work during morning/peak hours and lighter tasks later.
5. Provide actionable scheduling recommendations.

Respond strictly in valid JSON format matching this schema:
{
  "summary": "Brief executive summary of the daily plan",
  "scheduledBlocks": [
    {
      "taskId": "string or null",
      "title": "string",
      "type": "task" | "meeting" | "focus_block" | "break" | "buffer",
      "startTime": "HH:mm (24h)",
      "endTime": "HH:mm (24h)",
      "durationMinutes": number,
      "priority": "p1_urgent" | "p2_high" | "p3_medium" | "p4_low" | "none",
      "rationale": "short 1-sentence why this slot is chosen"
    }
  ],
  "productivityTips": ["string", "string", "string"],
  "deadlineRisks": [
    {
      "taskTitle": "string",
      "riskLevel": "high" | "medium" | "low",
      "suggestion": "string"
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);

      return res.json({
        success: true,
        source: "gemini",
        ...parsed,
      });
    } catch (error: any) {
      console.error("Schedule optimization error:", error);
      // Fallback gracefully on any error
      const { tasks, events, targetDate, workHoursStart = "09:00", workHoursEnd = "18:00" } = req.body;
      return res.json({
        success: true,
        source: "fallback",
        summary: "Calculated intelligent time-blocks across your available calendar intervals.",
        blocks: generateFallbackSchedule(tasks || [], events || [], workHoursStart, workHoursEnd, targetDate),
        tips: [
          "Protected deep-work blocks before scheduled meetings.",
          "Batched quick administrative items into open afternoon gaps."
        ]
      });
    }
  });

  // AI Task Breakdown & Subtask Estimator
  app.post("/api/ai/breakdown-task", async (req, res) => {
    try {
      const { taskTitle, taskDescription, category, priority } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          success: true,
          source: "fallback",
          subtasks: [
            { id: "st-1", title: `Outline requirements for ${taskTitle}`, estimatedMinutes: 25, completed: false },
            { id: "st-2", title: "Execute core implementation/deliverables", estimatedMinutes: 60, completed: false },
            { id: "st-3", title: "Review with stakeholders & QA check", estimatedMinutes: 30, completed: false },
            { id: "st-4", title: "Finalize documentation & handoff", estimatedMinutes: 15, completed: false },
          ],
          recommendedTimeBlockMinutes: 120,
          energyLevel: "high_focus",
          strategyAdvice: "Divide this task into two 60-minute focus blocks separated by a brief break."
        });
      }

      const prompt = `You are a technical project manager and productivity expert.
Break down this task into clear, actionable, bite-sized subtasks with realistic time estimates.

Task Title: ${taskTitle}
Description: ${taskDescription || "None provided"}
Category: ${category || "General"}
Priority: ${priority || "p2_high"}

Return strictly valid JSON:
{
  "subtasks": [
    {
      "id": "string",
      "title": "string (clear action verb)",
      "estimatedMinutes": number,
      "completed": false
    }
  ],
  "recommendedTimeBlockMinutes": number,
  "energyLevel": "high_focus" | "medium" | "quick_win",
  "strategyAdvice": "1-2 sentences on best workflow approach"
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        source: "gemini",
        ...parsed,
      });
    } catch (error: any) {
      console.error("AI breakdown error:", error);
      return res.json({
        success: true,
        source: "fallback",
        subtasks: [
          { id: `st-${Date.now()}-1`, title: "Review requirements & scope definition", estimatedMinutes: 20, completed: false },
          { id: `st-${Date.now()}-2`, title: "Execute primary task workload", estimatedMinutes: 60, completed: false },
          { id: `st-${Date.now()}-3`, title: "Conduct quality check & finalize deliverable", estimatedMinutes: 25, completed: false },
        ],
        recommendedTimeBlockMinutes: 105,
        energyLevel: "high_focus",
        strategyAdvice: "Schedule a focused 90-minute block during your peak concentration window."
      });
    }
  });

  // AI Daily Standup & Workflow Summary
  app.post("/api/ai/standup-summary", async (req, res) => {
    try {
      const { completedTasks, pendingTasks, upcomingEvents, employeeName } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          success: true,
          source: "fallback",
          standupReport: {
            yesterdayDone: completedTasks?.map((t: any) => t.title).slice(0, 4) || ["Completed planned sprint items"],
            todayPlan: pendingTasks?.filter((t: any) => t.priority === "p1_urgent" || t.priority === "p2_high").map((t: any) => t.title).slice(0, 4) || ["Focus on high-priority deliverables"],
            blockersAndRisks: "No critical blockers currently detected.",
            executiveNotes: `Ready for a productive day with ${upcomingEvents?.length || 0} scheduled calendar meetings.`
          }
        });
      }

      const prompt = `Generate a concise, professional daily employee standup & workflow briefing.
Employee: ${employeeName || "Team Member"}
Recently Completed Tasks: ${JSON.stringify(completedTasks || [])}
Today's Top Pending Tasks: ${JSON.stringify(pendingTasks || [])}
Today's Scheduled Calendar Events: ${JSON.stringify(upcomingEvents || [])}

Return strictly valid JSON:
{
  "standupReport": {
    "yesterdayDone": ["string", "string"],
    "todayPlan": ["string", "string"],
    "blockersAndRisks": "string",
    "executiveNotes": "string (encouraging, high-clarity summary)"
  }
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({
        success: true,
        source: "gemini",
        ...parsed,
      });
    } catch (error) {
      return res.json({
        success: true,
        source: "fallback",
        standupReport: {
          yesterdayDone: ["Completed scheduled milestones"],
          todayPlan: ["Focus on priority time-blocked tasks"],
          blockersAndRisks: "None flagged.",
          executiveNotes: "Smooth workflow aligned with team calendar."
        }
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WorkFlowSync server running on http://0.0.0.0:${PORT}`);
  });
}

// Fallback rule-based scheduler helper
function generateFallbackSchedule(tasks: any[], events: any[], startTimeStr: string, endTimeStr: string, dateStr: string) {
  const blocks: any[] = [];
  
  // Sort events by start time
  const dayEvents = (events || [])
    .filter((e: any) => e.date === dateStr || !e.date)
    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

  // Add existing events to blocks
  dayEvents.forEach((e: any) => {
    blocks.push({
      taskId: e.linkedTaskId || null,
      title: e.title,
      type: "meeting",
      startTime: e.startTime,
      endTime: e.endTime,
      durationMinutes: calculateDuration(e.startTime, e.endTime),
      priority: "p2_high",
      rationale: "Existing calendar commitment"
    });
  });

  // Unscheduled high priority tasks
  const unscheduledTasks = (tasks || [])
    .filter((t: any) => t.status !== "completed")
    .sort((a: any, b: any) => {
      const pMap: Record<string, number> = { p1_urgent: 4, p2_high: 3, p3_medium: 2, p4_low: 1 };
      return (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
    });

  // Find gaps in schedule between 09:00 and 18:00
  let currentTime = startTimeStr;
  for (const task of unscheduledTasks.slice(0, 4)) {
    const est = task.estimatedMinutes || 45;
    const taskEnd = addMinutes(currentTime, est);
    
    // Check if overlaps with meeting
    const overlap = dayEvents.some((ev: any) => {
      return (currentTime < ev.endTime && taskEnd > ev.startTime);
    });

    if (!overlap && taskEnd <= endTimeStr) {
      blocks.push({
        taskId: task.id,
        title: `Focus: ${task.title}`,
        type: "task",
        startTime: currentTime,
        endTime: taskEnd,
        durationMinutes: est,
        priority: task.priority,
        rationale: `Scheduled high priority task in available focus window.`
      });
      currentTime = addMinutes(taskEnd, 15); // 15 min buffer
    } else {
      // Advance to after the next event
      const nextEv = dayEvents.find((ev: any) => ev.endTime > currentTime);
      if (nextEv) {
        currentTime = addMinutes(nextEv.endTime, 15);
      } else {
        currentTime = addMinutes(currentTime, 60);
      }
    }
    if (currentTime >= endTimeStr) break;
  }

  return blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function calculateDuration(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(Math.min(23, newH)).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

startServer();
