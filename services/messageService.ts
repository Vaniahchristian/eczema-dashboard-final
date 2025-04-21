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

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log(' Initializing WebSocket connection to:', apiUrl);

        this.socket = connect(apiUrl, {
            path: '/socket.io',
            auth: { 
                token: this.token 
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay
        });

        this.socket.on('connect', () => {
            console.log(' Socket connected:', {
                id: this.socket?.id,
                transport: this.socket?.connect.name
            });
            this.reconnectAttempts = 0;
        });

        this.socket.on('connect_error', (error: Error) => {
            console.error(' Socket connection error:', {
                message: error.message,
                description: (error as any).description,
                type: (error as any).type,
                token: this.token ? '***' : 'missing'
            });
            this.handleSocketError(error);
        });

        this.socket.on('disconnect', (reason: string) => {
            console.log(' Socket disconnected:', {
                reason,
                id: this.socket?.id,
                willReconnect: this.reconnectAttempts < this.maxReconnectAttempts
            });
            // Create an Error object from the disconnect reason
            this.handleSocketError(new Error(`Socket disconnected: ${reason}`));
        });

        // Message events
        this.socket.on('message:new', (message: Message) => {
            console.log(' New message received:', {
                messageId: message.id,
                conversationId: message.conversationId,
                type: message.type
            });
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.socket.on('message:reaction', (data: { messageId: string, reactions: any[] }) => {
            console.log(' Message reaction:', data);
            // Handle reactions if needed
        });

        // Typing events
        this.socket.on('user:typing', (data: { userId: string; isTyping: boolean }) => {
            console.log(' User typing status:', data);
            this.typingCallbacks.forEach(callback => callback(data));
        });

        // Read receipt events
        this.socket.on('message:read', (data: { messageId: string; userId: string }) => {
            console.log(' Message read:', data);
            this.readCallbacks.forEach(callback => callback(data));
        });

        // Error events
        this.socket.on('error', (error: any) => {
            console.error(' Socket error:', error);
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
            console.log(' Joining conversation:', conversationId);
            this.socket.emit('join:conversation', conversationId);
        } else {
            console.warn(' Cannot join conversation - socket not connected');
        }
    }

    leaveConversation(conversationId: string) {
        if (this.socket?.connected) {
            console.log(' Leaving conversation:', conversationId);
            this.socket.emit('leave:conversation', conversationId);
        }
    }

    async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', attachments?: File[]) {
        if (!this.socket?.connected) {
            console.error(' Cannot send message - socket not connected');
            throw new Error('Socket not connected');
        }

        console.log(' Sending message:', {
            conversationId,
            type,
            hasAttachments: !!attachments?.length
        });

        const formData = new FormData();
        formData.append('conversationId', conversationId);
        formData.append('content', content);
        formData.append('type', type);
        
        if (attachments?.length) {
            attachments.forEach(file => {
                formData.append('attachments', file);
            });
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/${conversationId}/messages`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log(' Message sent successfully:', {
                messageId: response.data.id,
                conversationId
            });

            return response.data;
        } catch (error: any) {
            console.error(' Error sending message:', {
                error: error.message,
                conversationId
            });
            throw error;
        }
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

    async createConversation(doctorId: string): Promise<Conversation> {
        try {
            console.log(' Creating new conversation with doctor:', doctorId);
            
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`,
                { doctorId },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const conversation = response.data;

            // Join the conversation room for real-time updates
            if (this.socket?.connected) {
                this.socket.emit('join:conversation', conversation.id);
            }

            console.log(' Conversation created successfully:', {
                conversationId: conversation.id,
                participants: conversation.participants
            });

            return conversation;
        } catch (error: any) {
            console.error(' Error creating conversation:', {
                error: error.message,
                doctorId
            });
            throw new Error(error.response?.data?.error || 'Failed to create conversation');
        }
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/${conversationId}/messages`,
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

    async reactToMessage(messageId: string, type: string) {
        if (!this.socket?.connected) {
            console.error(' Cannot react to message - socket not connected');
            throw new Error('Socket not connected');
        }

        console.log(' Reacting to message:', {
            messageId,
            type
        });

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${messageId}/reaction`,
                { type },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }
            );

            // Emit socket event for real-time updates
            this.socket.emit('message:react', { messageId, type });

            console.log(' Reaction sent successfully:', {
                messageId,
                type,
                response: response.data
            });

            return response.data;
        } catch (error: any) {
            console.error(' Error reacting to message:', {
                error: error.message,
                messageId,
                type
            });
            throw error;
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