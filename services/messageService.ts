import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

export interface Message {
    id: string;
    conversationId: string;
    patientId: string;
    doctorId: string;
    fromDoctor: boolean;
    content: string;
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

class MessageService {
    private socket: typeof Socket | null = null;
    private messageCallbacks: ((message: Message) => void)[] = [];
    private typingCallbacks: ((data: { userId: string; isTyping: boolean }) => void)[] = [];
    private statusCallbacks: ((data: { messageId: string; status: Message['status'] }) => void)[] = [];
    private apiUrl: string;

    constructor() {
        this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';
        this.initializeSocket();
    }

    private initializeSocket() {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) return;

        this.socket = io(this.apiUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        if (this.socket) {
            this.socket.on('connect', () => {
                console.log('Socket connected successfully');
            });

            this.socket.on('connect_error', (error: Error) => {
                console.error('Socket connection error:', error);
            });

            this.socket.on('message:new', (message: Message) => {
                this.messageCallbacks.forEach(callback => callback(message));
            });

            this.socket.on('user:typing', (data: { userId: string; isTyping: boolean }) => {
                this.typingCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('message:status', (data: { messageId: string; status: Message['status'] }) => {
                this.statusCallbacks.forEach(callback => callback(data));
            });
        }
    }

    onNewMessage(callback: (message: Message) => void) {
        this.messageCallbacks.push(callback);
        return () => {
            this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
        };
    }

    onTypingStatus(callback: (data: { userId: string; isTyping: boolean }) => void) {
        this.typingCallbacks.push(callback);
        return () => {
            this.typingCallbacks = this.typingCallbacks.filter(cb => cb !== callback);
        };
    }

    onMessageStatus(callback: (data: { messageId: string; status: Message['status'] }) => void) {
        this.statusCallbacks.push(callback);
        return () => {
            this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
        };
    }

    joinConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit('join:conversation', conversationId);
        }
    }

    leaveConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit('leave:conversation', conversationId);
        }
    }

    emitTyping(conversationId: string, isTyping: boolean) {
        if (this.socket) {
            this.socket.emit('user:typing', { conversationId, isTyping });
        }
    }

    async getConversations(): Promise<Conversation[]> {
        const response = await fetch(`${this.apiUrl}/messages/conversations`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await fetch(`${this.apiUrl}/messages/conversations/${conversationId}/messages`, {
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
        const response = await fetch(`${this.apiUrl}/messages/conversations/${conversationId}/messages`, {
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

    async createConversation(doctorId: string): Promise<Conversation> {
        const response = await fetch(`${this.apiUrl}/messages/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ doctorId })
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async updateMessageStatus(messageId: string, status: Message['status']): Promise<void> {
        const response = await fetch(`${this.apiUrl}/messages/${messageId}/status`, {
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
        const response = await fetch(`${this.apiUrl}/messages/${messageId}/reaction`, {
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

    async uploadFile(file: File): Promise<{ url: string; type: string; name: string; size: number }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.apiUrl}/messages/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async deleteMessage(conversationId: string, messageId: string): Promise<void> {
        const response = await fetch(
            `${this.apiUrl}/messages/conversations/${conversationId}/messages/${messageId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
    }

    async archiveConversation(conversationId: string): Promise<void> {
        const response = await fetch(`${this.apiUrl}/messages/conversations/${conversationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
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