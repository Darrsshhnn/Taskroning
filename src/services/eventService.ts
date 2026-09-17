import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CalendarEvent } from '../types';
import { getInitialCalendarEvents } from '../data/initialData';

/**
 * Subscribes to real-time calendar events for a specific user.
 * Persists directly under users/{userId} in the calendarEvents field.
 */
export function subscribeToUserEvents(
  userId: string,
  callback: (events: CalendarEvent[]) => void,
  onError?: (error: Error) => void
): () => void {
  const userDocRef = doc(db, 'users', userId);
  let hasSeeded = false;

  return onSnapshot(userDocRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback(getInitialCalendarEvents());
      return;
    }

    const data = snapshot.data();
    if (Array.isArray(data?.calendarEvents) && data.calendarEvents.length > 0) {
      callback(data.calendarEvents as CalendarEvent[]);
    } else if (!hasSeeded) {
      hasSeeded = true;
      const initialEvents = getInitialCalendarEvents();
      try {
        await setDoc(userDocRef, { calendarEvents: initialEvents }, { merge: true });
      } catch (err) {
        console.warn('Initial calendar events seed notice:', err);
      }
      callback(initialEvents);
    } else {
      callback(getInitialCalendarEvents());
    }
  }, (err) => {
    console.error('Firestore events subscription error:', err);
    if (onError) onError(err);
  });
}

/**
 * Saves or updates a calendar event for a user in Firestore.
 */
export async function saveUserEvent(
  userId: string,
  event: CalendarEvent
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);

  try {
    const docSnap = await getDoc(userDocRef);
    const existingEvents: CalendarEvent[] = (docSnap.exists() && Array.isArray(docSnap.data().calendarEvents))
      ? docSnap.data().calendarEvents
      : getInitialCalendarEvents();

    const eventIndex = existingEvents.findIndex(e => e.id === event.id);
    let updatedEvents: CalendarEvent[];

    if (eventIndex >= 0) {
      updatedEvents = [...existingEvents];
      updatedEvents[eventIndex] = event;
    } else {
      updatedEvents = [event, ...existingEvents];
    }

    await setDoc(userDocRef, { calendarEvents: updatedEvents }, { merge: true });
  } catch (err) {
    console.error('Failed to save calendar event in Firestore:', err);
    throw err;
  }
}

/**
 * Deletes a calendar event for a user in Firestore.
 */
export async function deleteUserEvent(
  userId: string,
  eventId: string
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);

  try {
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) return;

    const existingEvents: CalendarEvent[] = Array.isArray(docSnap.data().calendarEvents)
      ? docSnap.data().calendarEvents
      : [];

    const updatedEvents = existingEvents.filter(e => e.id !== eventId);
    await setDoc(userDocRef, { calendarEvents: updatedEvents }, { merge: true });
  } catch (err) {
    console.error('Failed to delete calendar event in Firestore:', err);
    throw err;
  }
}
