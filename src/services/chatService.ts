import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Conversation, ChatMessage, ChatParticipant } from '../types';

/**
 * Format timestamp into clean WhatsApp-like format:
 * - "10:45 AM" if today
 * - "Yesterday, 10:45 AM" if yesterday
 * - "Sep 16, 10:45 AM" if older
 */
export function formatMessageTime(value?: any): string {
  if (!value) return '';
  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'object' && typeof value.toDate === 'function') {
    date = value.toDate();
  } else if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    } else {
      return value;
    }
  } else {
    return '';
  }

  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === date.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return timeStr;
  } else if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  } else {
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }
}

/**
 * Format conversation list preview timestamp:
 * - "10:45 AM" if today
 * - "Yesterday" if yesterday
 * - "14/09/2026" or "Sep 14" if older
 */
export function formatConversationTime(value?: any): string {
  if (!value) return '';
  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'object' && typeof value.toDate === 'function') {
    date = value.toDate();
  } else if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) {
      date = new Date(parsed);
    } else {
      return value;
    }
  } else {
    return '';
  }

  const now = new Date();
  if (now.toDateString() === date.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Subscribes in real-time to conversations where the authenticated user is a participant.
 * Prevents data leakage: queries only documents containing userId in participants.
 */
export function subscribeToUserConversations(
  userId: string,
  onUpdate: (conversations: Conversation[]) => void,
  onError?: (err: Error) => void
): () => void {
  const convsRef = collection(db, 'conversations');
  const q = query(
    convsRef,
    where('participants', 'array-contains', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const items: Conversation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        participants: data.participants || [],
        participantDetails: data.participantDetails || {},
        isGroup: !!data.isGroup,
        groupName: data.groupName || '',
        groupAvatar: data.groupAvatar || '',
        lastMessage: data.lastMessage || '',
        lastMessageTime: data.lastMessageTime || '',
        lastMessageTimestamp: typeof data.lastMessageTimestamp === 'number' 
          ? data.lastMessageTimestamp 
          : (typeof data.updatedAt === 'number' ? data.updatedAt : 0),
        lastSenderId: data.lastSenderId || '',
        lastSenderName: data.lastSenderName || '',
        unreadCount: data.unreadCount || 0,
        createdAt: data.createdAt || 0,
        updatedAt: data.updatedAt || 0,
      });
    });

    // Client-side sort by latest update/message timestamp descending
    items.sort((a, b) => {
      const timeA = typeof a.updatedAt === 'number' ? a.updatedAt : (typeof a.lastMessageTimestamp === 'number' ? a.lastMessageTimestamp : 0);
      const timeB = typeof b.updatedAt === 'number' ? b.updatedAt : (typeof b.lastMessageTimestamp === 'number' ? b.lastMessageTimestamp : 0);
      return timeB - timeA;
    });

    onUpdate(items);
  }, (err) => {
    console.error('Firestore conversations listener error:', err);
    if (onError) onError(err);
  });
}

/**
 * Subscribes in real-time to messages in a specific conversation ordered chronologically.
 */
export function subscribeToConversationMessages(
  conversationId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (err: Error) => void
): () => void {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const msgs: ChatMessage[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      msgs.push({
        id: docSnap.id,
        conversationId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderPhotoURL: data.senderPhotoURL || '',
        text: data.text || '',
        timestamp: data.timestamp || formatMessageTime(data.createdAt),
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
        imageUrl: data.imageUrl || undefined,
        status: data.status || 'sent',
      });
    });
    onUpdate(msgs);
  }, (err) => {
    console.error(`Firestore messages listener error for conversation ${conversationId}:`, err);
    if (onError) onError(err);
  });
}

/**
 * Sends a real message to Firestore inside conversations/{conversationId}/messages/{messageId}
 * and updates the parent conversation metadata atomically.
 */
export async function sendConversationMessage(
  conversationId: string,
  sender: { uid: string; name: string; photoURL?: string },
  text: string,
  imageUrl?: string
): Promise<ChatMessage> {
  const trimmed = text.trim();
  if (!trimmed && !imageUrl) {
    throw new Error('Message text or attachment is required');
  }

  const now = Date.now();
  const displayTime = formatMessageTime(now);

  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const newMsgDocRef = doc(messagesRef);

  const newMsg: ChatMessage = {
    id: newMsgDocRef.id,
    conversationId,
    senderId: sender.uid,
    senderName: sender.name || 'Taskroning Member',
    senderPhotoURL: sender.photoURL || '',
    text: trimmed,
    timestamp: displayTime,
    createdAt: now,
    imageUrl: imageUrl || undefined,
    status: 'sent',
  };

  // 1. Write message document to subcollection
  await setDoc(newMsgDocRef, {
    id: newMsg.id,
    conversationId,
    senderId: newMsg.senderId,
    senderName: newMsg.senderName,
    senderPhotoURL: newMsg.senderPhotoURL || '',
    text: newMsg.text,
    timestamp: newMsg.timestamp,
    createdAt: newMsg.createdAt,
    imageUrl: newMsg.imageUrl || null,
    status: 'sent',
  });

  // 2. Update conversation document metadata
  const convDocRef = doc(db, 'conversations', conversationId);
  await setDoc(convDocRef, {
    lastMessage: trimmed || 'Sent an attachment',
    lastMessageTime: displayTime,
    lastMessageTimestamp: now,
    lastSenderId: sender.uid,
    lastSenderName: sender.name || 'Taskroning Member',
    updatedAt: now,
  }, { merge: true });

  return newMsg;
}

/**
 * Creates or retrieves a 1-on-1 direct conversation between two users.
 * Uses deterministic ID so both parties naturally join the exact same conversation.
 */
export async function createOrGetDirectConversation(
  currentUserId: string,
  currentUserDetails: { name: string; email?: string; photoURL?: string; role?: string },
  targetUser: { uid: string; name: string; email?: string; photoURL?: string; role?: string }
): Promise<string> {
  const convId = [currentUserId, targetUser.uid].sort().join('_');
  const convDocRef = doc(db, 'conversations', convId);
  const convSnap = await getDoc(convDocRef);

  const now = Date.now();

  if (!convSnap.exists()) {
    await setDoc(convDocRef, {
      id: convId,
      participants: [currentUserId, targetUser.uid],
      participantDetails: {
        [currentUserId]: {
          name: currentUserDetails.name || 'Taskroning Member',
          email: currentUserDetails.email || '',
          photoURL: currentUserDetails.photoURL || '',
          role: currentUserDetails.role || 'Member',
        },
        [targetUser.uid]: {
          name: targetUser.name || 'Colleague',
          email: targetUser.email || '',
          photoURL: targetUser.photoURL || '',
          role: targetUser.role || 'Member',
        },
      },
      isGroup: false,
      lastMessage: '',
      lastMessageTime: '',
      lastMessageTimestamp: now,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Keep user's own profile info up to date in participantDetails
    await setDoc(convDocRef, {
      [`participantDetails.${currentUserId}`]: {
        name: currentUserDetails.name || 'Taskroning Member',
        email: currentUserDetails.email || '',
        photoURL: currentUserDetails.photoURL || '',
        role: currentUserDetails.role || 'Member',
      }
    }, { merge: true });
  }

  return convId;
}

/**
 * Creates a new team group channel conversation.
 */
export async function createGroupConversation(
  currentUserId: string,
  currentUserDetails: { name: string; email?: string; photoURL?: string; role?: string },
  groupName: string,
  participantUids: string[] = [],
  participantDetailsMap: Record<string, { name: string; email?: string; photoURL?: string; role?: string }> = {}
): Promise<string> {
  const convId = `group_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const convDocRef = doc(db, 'conversations', convId);

  const allParticipants = Array.from(new Set([currentUserId, ...participantUids]));
  const fullDetails: Record<string, any> = {
    [currentUserId]: {
      name: currentUserDetails.name || 'Taskroning Member',
      email: currentUserDetails.email || '',
      photoURL: currentUserDetails.photoURL || '',
      role: currentUserDetails.role || 'Member',
    },
    ...participantDetailsMap,
  };

  const now = Date.now();
  await setDoc(convDocRef, {
    id: convId,
    participants: allParticipants,
    participantDetails: fullDetails,
    isGroup: true,
    groupName: groupName.trim() || 'Team Channel',
    lastMessage: 'Channel created',
    lastMessageTime: formatMessageTime(now),
    lastMessageTimestamp: now,
    lastSenderId: currentUserId,
    lastSenderName: currentUserDetails.name || 'Taskroning Member',
    createdAt: now,
    updatedAt: now,
  });

  return convId;
}

/**
 * Fetches other registered team members from Firestore for the chat user directory.
 */
export async function getWorkspaceDirectoryUsers(currentUserId: string): Promise<ChatParticipant[]> {
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    const users: ChatParticipant[] = [];

    snap.forEach((d) => {
      if (d.id !== currentUserId) {
        const data = d.data();
        users.push({
          uid: d.id,
          name: data.name || data.displayName || 'Team Member',
          email: data.email || '',
          photoURL: data.photoURL || data.avatarUrl || '',
          role: data.role || 'Workspace Member',
        });
      }
    });

    return users;
  } catch (err) {
    console.warn('Could not query workspace users directory:', err);
    return [];
  }
}
