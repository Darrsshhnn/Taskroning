import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task } from '../types';
import { INITIAL_TASKS } from '../data/initialData';

/**
 * Subscribes to real-time task updates for a specific user.
 * If the user is brand new (0 tasks), seeds initial starter tasks.
 */
export function subscribeToUserTasks(
  userId: string, 
  callback: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): () => void {
  const tasksCol = collection(db, 'users', userId, 'tasks');
  const q = query(tasksCol);

  return onSnapshot(q, async (snapshot) => {
    if (snapshot.empty) {
      // First time user: initialize with default template tasks scoped to this user
      const initialBatchPromises = INITIAL_TASKS.map((t, idx) => {
        const taskId = `task_${Date.now()}_${idx}`;
        const taskData: Task = {
          ...t,
          id: taskId,
        };
        return setDoc(doc(db, 'users', userId, 'tasks', taskId), {
          ...taskData,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      try {
        await Promise.all(initialBatchPromises);
      } catch (seedErr) {
        console.warn('Initial tasks seed notice:', seedErr);
      }
      return;
    }

    const tasksList: Task[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      tasksList.push({
        id: docSnap.id,
        title: data.title || 'Untitled Task',
        description: data.description || '',
        priority: data.priority || 'p3_medium',
        status: data.status || 'backlog',
        category: data.category || 'General',
        dueDate: data.dueDate || new Date().toISOString().split('T')[0],
        dueTime: data.dueTime,
        estimatedMinutes: data.estimatedMinutes || 30,
        progress: data.progress ?? (data.status === 'completed' ? 100 : 0),
        timeBlock: data.timeBlock,
        subtasks: data.subtasks || [],
        tags: data.tags || [],
        energyLevel: data.energyLevel || 'medium_focus',
        createdAt: data.createdAt || new Date().toISOString(),
        completedAt: data.completedAt,
        isStarred: data.isStarred || false,
        isDraft: data.isDraft || false,
      });
    });

    // Sort by creation or due date
    tasksList.sort((a, b) => {
      const dateA = a.dueDate || '';
      const dateB = b.dueDate || '';
      return dateA.localeCompare(dateB);
    });

    callback(tasksList);
  }, (err) => {
    console.error('Firestore tasks subscription error:', err);
    if (onError) onError(err);
  });
}

/**
 * Creates or updates a task in Firestore under users/{userId}/tasks/{taskId}.
 */
export async function saveUserTask(userId: string, task: Task): Promise<void> {
  const taskId = task.id && task.id.trim() !== '' ? task.id : `task_${Date.now()}`;
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  
  const payload = {
    ...task,
    id: taskId,
    userId,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(taskRef, payload, { merge: true });
}

/**
 * Deletes a task from Firestore under users/{userId}/tasks/{taskId}.
 */
export async function deleteUserTask(userId: string, taskId: string): Promise<void> {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskRef);
}

/**
 * Toggles task completed status and persists immediately to Firestore.
 */
export async function toggleUserTaskCompletion(
  userId: string, 
  task: Task
): Promise<void> {
  const isCurrentlyCompleted = task.status === 'completed';
  const newStatus = isCurrentlyCompleted ? 'in_progress' : 'completed';
  const newProgress = isCurrentlyCompleted ? 0 : 100;
  const completedAt = isCurrentlyCompleted ? undefined : new Date().toISOString();

  const taskRef = doc(db, 'users', userId, 'tasks', task.id);
  await updateDoc(taskRef, {
    status: newStatus,
    progress: newProgress,
    completedAt: completedAt || null,
    updatedAt: new Date().toISOString(),
  });
}
