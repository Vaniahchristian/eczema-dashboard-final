import axios, { AxiosError } from 'axios';

export interface Message {
    id: string;
    content: string;
    timestamp: string;
    patientId: string;
    doctorId: string;
    fromDoctor: boolean;
    senderName: string;
    senderImage?: string; // Matches image_url from MySQL
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file' | 'voice' | 'ai-suggestion'; // Added ai-suggestion
    attachments?: Array<{
        url: string;
        type: string;
        name: string;
        size: number;
    }>;
    reaction?: 'thumbs_up' | 'thumbs_down';
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantImage?: string;
    participantRole: string; // Matches 'role' from MySQL
    unreadCount: number;
    lastMessage?: {
        id: string;
        content: string;
        timestamp: string;
        senderId: string;
        status: 'sent' | 'delivered' | 'read'; // Consistent with Message.status
        type: 'text' | 'image' | 'file' | 'voice' | 'ai-suggestion';
        attachments?: Array<{
            url: string;
            type: string;
            name: string;
            size: number;
        }>;
    };
    updatedAt: string; // Matches backend schema
}

class MessageService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    private getHeaders() {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        return { Authorization: `Bearer ${token}` };
    }

    async getConversations(): Promise<Conversation[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/messages/conversations`, {
                headers: this.getHeaders(),
            });
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ success: boolean; message: string }>;
            console.error('Error fetching conversations:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to fetch conversations');
        }
    }

    async getMessages(conversationId: string, page: number = 1, limit: number = 20): Promise<Message[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
                { headers: this.getHeaders() }
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ success: boolean; message: string }>;
            console.error('Error fetching messages:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to fetch messages');
        }
    }

    async sendMessage(
        conversationId: string,
        content: string,
        type: Message['type'] = 'text',
        attachments?: Message['attachments']
    ): Promise<Message> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages/conversations/${conversationId}/messages`,
                { content, type, attachments },
                { headers: this.getHeaders() }
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ success: boolean; message: string }>;
            console.error('Error sending message:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to send message');
        }
    }

    async createConversation(participantId: string): Promise<{ id: string }> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages/conversations`,
                { participantId },
                { headers: this.getHeaders() }
            );
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ success: boolean; message: string }>;
            console.error('Error creating conversation:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to create conversation');
        }
    }

    async updateMessageStatus(messageId: string, status: Message['status']): Promise<void> {
        try {
            await axios.put(
                `${this.baseUrl}/messages/${messageId}/status`,
                { status },
                { headers: this.getHeaders() }
            );
        } catch (error) {
            const err = error as AxiosError<{ success: boolean; message: string }>;
            console.error('Error updating message status:', err.response?.data || err.message);
            throw new Error(err.response?.data?.message || 'Failed to update message status');
        }
    }

    formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }
}

export const messageService = new MessageService();