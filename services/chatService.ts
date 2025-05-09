import { getAuthHeaders } from '../lib/auth';

const API_URL =  'https://eczema-backend.onrender.com/api/messages';

// Extensive logging helper
function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[ChatService]', ...args);
}

export async function fetchConversations() {
  log('Fetching conversations...');
  const res = await fetch(`${API_URL}/conversations`, {
    ...getAuthHeaders(),
    credentials: 'include',
  });
  log('Conversations response:', res.status);
  if (!res.ok) {
    log('Error fetching conversations:', res.statusText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  log('Fetched conversations:', data);
  return data.data;
}

export async function fetchMessages(conversationId: string) {
  log('Fetching messages for conversation', conversationId);
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    ...getAuthHeaders(),
    credentials: 'include',
  });
  log('Messages response:', res.status);
  if (!res.ok) {
    log('Error fetching messages:', res.statusText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  log('Fetched messages:', data);
  return data.data;
}

export async function sendMessage(conversationId: string, content: string) {
  log('Sending message to conversation', conversationId, 'content:', content);
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
    credentials: 'include',
  });
  log('Send message response:', res.status);
  if (!res.ok) {
    log('Error sending message:', res.statusText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  log('Sent message:', data);
  return data.data;
}

export async function createConversation(participantId: string) {
  log('Creating new conversation with participant', participantId);
  const res = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ participantId }),
    credentials: 'include',
  });
  log('Create conversation response:', res.status);
  if (!res.ok) {
    log('Error creating conversation:', res.statusText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  log('Created conversation:', data);
  return data.data;
}

export async function markConversationAsRead(conversationId: string) {
  log('Marking conversation as read', conversationId);
  const res = await fetch(`${API_URL}/conversations/${conversationId}/read`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  log('Mark as read response:', res.status);
  if (!res.ok) {
    log('Error marking as read:', res.statusText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  log('Marked as read:', data);
  return data;
}

export async function setTypingStatus(conversationId: string, isTyping: boolean) {
  log('Setting typing status for conversation', conversationId, 'isTyping:', isTyping);
  const res = await fetch(`${API_URL}/conversations/${conversationId}/typing`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isTyping }),
    credentials: 'include',
  });
  log('Set typing status response:', res.status);
  if (!res.ok) {
    log('Error setting typing status:', res.statusText);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  log('Set typing status:', data);
  return data;
}
