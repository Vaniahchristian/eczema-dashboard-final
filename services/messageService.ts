import axios from 'axios';



export interface Message {
    id: string
    conversationId: string
    patientId: string
    doctorId: string
    fromDoctor: boolean
    content: string
    type: 'text' | 'image' | 'file' | 'voice' | 'ai-suggestion'
    status: 'sent' | 'delivered' | 'read'
    senderName: string
    senderRole: string
    senderImage?: string
    timestamp: string
    attachments?: { url: string; type: string; name: string; size: number }[]
    reaction?: string
}

export interface Conversation {
    id: string
    participantId: string
    participantName: string
    participantRole: string
    participantImage?: string
    unreadCount: number
    status: string
    lastMessage?: {
        id: string
        content: string
        timestamp: string
        status: string
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class MessageService {
    async getConversations(): Promise<Conversation[]> {
        const response = await fetch(`${API_URL}/messages/conversations`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await fetch(`${API_URL}/messages/conversations/${conversationId}/messages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async sendMessage(
        conversationId: string,
        content: string,
        type: Message['type'] = 'text',
        attachments?: Message['attachments']
    ): Promise<Message> {
        const response = await fetch(`${API_URL}/messages/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, type, attachments })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async createConversation(participantId: string): Promise<{ id: string }> {
        const response = await fetch(`${API_URL}/messages/conversations`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ participantId })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data; // Returns { id: string }
    }

    async updateMessageStatus(messageId: string, status: Message['status']): Promise<void> {
        const response = await fetch(`${API_URL}/messages/${messageId}/status`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
    }

    async addReaction(messageId: string, reaction: string): Promise<void> {
        const response = await fetch(`${API_URL}/messages/${messageId}/reaction`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reaction })
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
    }

    formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

export const messageService = new MessageService();