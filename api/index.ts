import { OAuth2Client } from "google-auth-library";
import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  // CORS handling
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = req.url || "";

  // Health check
  if (url.includes("/api/health") || url === "/api") {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  }

  // Verify Google Token endpoint
  if (url.includes("/api/auth/verify-google-token")) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { credential, accessToken } = req.body || {};

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
        id: payload.sub,
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
      console.error("Vercel token verification error:", error);
      return res.status(401).json({
        error: error.message || "Failed to verify Google identity credential with Google Identity Services.",
      });
    }
  }

  // Other endpoints fallback
  return res.status(404).json({ error: "Not found" });
}
