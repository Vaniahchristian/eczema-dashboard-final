import { Socket, Manager } from 'socket.io-client';
import io from 'socket.io-client';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;  // MySQL user ID
    senderRole: 'patient' | 'doctor';
    senderName: string;
    senderImage?: string;
    content: string;
    type: 'text' | 'image' | 'file' | 'voice' | 'ai-suggestion';
    status: 'sent' | 'delivered' | 'read';
    attachments?: {
        url: string;
        name: string;
        type: string;
        size: number;
    }[];
    readBy: {
        userId: string;
        timestamp: string;
    }[];
    reactions?: {
        userId: string;
        type: string;
        timestamp: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    id: string;
    participantId: string;  // The other participant's MySQL user ID
    participantName: string;
    participantRole: 'patient' | 'doctor';
    participantImage?: string;
    unreadCount: number;
    status: 'active' | 'archived';
    lastMessage?: {
        id: string;
        content: string;
        type: Message['type'];
        createdAt: string;
    };
    updatedAt: string;
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
        if (typeof window === 'undefined') {
            console.log('Socket initialization skipped: Not in browser environment');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Socket initialization skipped: No auth token found');
            return;
        }

        console.log('Initializing socket connection to:', this.apiUrl);

        this.socket = io(this.apiUrl, {
            auth: { token },
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
            forceNew: true
        });

        if (this.socket) {
            this.socket.on('connect', () => {
                console.log('Socket connected successfully', {
                    id: this.socket?.id,
                    transport: (this.socket as any)?.io?.engine?.transport?.name
                });
            });

            this.socket.on('connect_error', (error: Error) => {
                console.error('Socket connection error:', {
                    message: error.message,
                    type: error.name,
                    transport: (this.socket as any)?.io?.engine?.transport?.name
                });
                
                // Try to reconnect with websocket transport only
                if ((this.socket as any)?.io?.engine?.transport?.name === 'polling') {
                    console.log('Retrying connection with WebSocket transport only');
                    (this.socket as any).io.opts.transports = ['websocket'];
                }
            });

            this.socket.on('disconnect', (reason: string) => {
                console.log('Socket disconnected:', { reason });
            });

            this.socket.on('reconnect', (attemptNumber: number) => {
                console.log('Socket reconnected after attempts:', attemptNumber);
            });

            this.socket.on('reconnect_attempt', (attemptNumber: number) => {
                console.log('Socket reconnection attempt:', attemptNumber);
            });

            this.socket.on('message:new', (message: Message) => {
                console.log('New message received:', {
                    id: message.id,
                    conversationId: message.conversationId
                });
                this.messageCallbacks.forEach(callback => callback(message));
            });

            this.socket.on('user:typing', (data: { userId: string; isTyping: boolean }) => {
                console.log('Typing status update:', data);
                this.typingCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('message:status', (data: { messageId: string; status: Message['status'] }) => {
                console.log('Message status update:', data);
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
        console.log('Joining conversation:', conversationId);
        this.socket?.emit('join:conversation', conversationId);
    }

    leaveConversation(conversationId: string) {
        console.log('Leaving conversation:', conversationId);
        this.socket?.emit('leave:conversation', conversationId);
    }

    emitTyping(conversationId: string, isTyping: boolean) {
        console.log('Emitting typing status:', { conversationId, isTyping });
        this.socket?.emit('user:typing', { conversationId, isTyping });
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