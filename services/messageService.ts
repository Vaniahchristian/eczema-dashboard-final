import type { Socket } from 'socket.io-client';
import { connect } from 'socket.io-client';
import axios from 'axios';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderRole: 'patient' | 'doctor';
    senderName: string;
    content: string;
    type: 'text' | 'image' | 'file';
    attachments?: Array<{
        url: string;
        type: string;
        name: string;
        size: number;
    }>;
    readBy: Array<{
        userId: string;
        readAt: Date;
    }>;
    reactions: Array<{
        userId: string;
        type: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Conversation {
    id: string;
    participants: Array<{
        userId: string;
        role: 'patient' | 'doctor';
        name: string;
        imageUrl?: string;
    }>;
    lastMessage?: {
        content: string;
        senderId: string;
        createdAt: Date;
        type: 'text' | 'image' | 'file';
    };
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

class MessageService {
    private socket: typeof Socket | null = null;
    private token: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 2000;
    private messageCallbacks: Set<(message: Message) => void> = new Set();
    private typingCallbacks: Set<(data: { userId: string; isTyping: boolean }) => void> = new Set();
    private readCallbacks: Set<(data: { messageId: string; userId: string }) => void> = new Set();

    constructor() {
        this.initializeSocket = this.initializeSocket.bind(this);
        this.handleSocketError = this.handleSocketError.bind(this);
    }

    setToken(token: string) {
        this.token = token;
        if (this.socket) {
            this.socket.disconnect();
        }
        this.initializeSocket();
    }

    private initializeSocket() {
        if (!this.token) return;

        this.socket = connect(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
            path: '/socket.io',
            auth: { token: this.token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.reconnectAttempts = 0;
        });

        this.socket.on('connect_error', this.handleSocketError);
        this.socket.on('disconnect', () => console.log('Socket disconnected'));

        this.socket.on('message:new', (message: Message) => {
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.socket.on('user:typing', (data: { userId: string; isTyping: boolean }) => {
            this.typingCallbacks.forEach(callback => callback(data));
        });

        this.socket.on('message:read', (data: { messageId: string; userId: string }) => {
            this.readCallbacks.forEach(callback => callback(data));
        });
    }

    private handleSocketError(error: Error) {
        console.error('Socket connection error:', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.initializeSocket(), this.reconnectDelay);
        }
    }

    joinConversation(conversationId: string) {
        if (this.socket?.connected) {
            this.socket.emit('join:conversation', conversationId);
        }
    }

    leaveConversation(conversationId: string) {
        if (this.socket?.connected) {
            this.socket.emit('leave:conversation', conversationId);
        }
    }

    async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', attachments?: File[]) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        const formData = new FormData();
        formData.append('conversationId', conversationId);
        formData.append('content', content);
        formData.append('type', type);
        
        if (attachments?.length) {
            attachments.forEach(file => {
                formData.append('attachments', file);
            });
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    }

    async getConversations(): Promise<Conversation[]> {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`,
            {
                headers: { 'Authorization': `Bearer ${this.token}` }
            }
        );
        return response.data;
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${conversationId}`,
            {
                headers: { 'Authorization': `Bearer ${this.token}` }
            }
        );
        return response.data;
    }

    async markMessageAsRead(messageId: string) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }

        this.socket.emit('message:read', { messageId });
    }

    setTypingStatus(conversationId: string, isTyping: boolean) {
        if (this.socket?.connected) {
            this.socket.emit('user:typing', { conversationId, isTyping });
        }
    }

    onNewMessage(callback: (message: Message) => void) {
        this.messageCallbacks.add(callback);
        return () => this.messageCallbacks.delete(callback);
    }

    onTypingStatus(callback: (data: { userId: string; isTyping: boolean }) => void) {
        this.typingCallbacks.add(callback);
        return () => this.typingCallbacks.delete(callback);
    }

    onMessageRead(callback: (data: { messageId: string; userId: string }) => void) {
        this.readCallbacks.add(callback);
        return () => this.readCallbacks.delete(callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const messageService = new MessageService();