import axios from 'axios';

export interface Message {
    id: string;
    content: string;
    timestamp: string;
    patientId: string;
    doctorId: string;
    fromDoctor: boolean;
    senderName: string;
    senderRole: string;
    senderImage?: string;
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file' | 'voice';
    attachments?: Array<{
        url: string;
        type: string;
        name: string;
        size: number;
    }>;
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantImage?: string;
    participantRole: string;
    status: 'active' | 'archived';
    unreadCount: number;
    lastMessage?: {
        id: string;
        content: string;
        timestamp: string;
        status: string;
    };
}

class MessageService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    async getConversations(): Promise<Conversation[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${this.baseUrl}/messages/conversations`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${this.baseUrl}/messages/conversations/${conversationId}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    async sendMessage(
        conversationId: string,
        content: string,
        type: Message['type'] = 'text',
        fromDoctor: boolean,
        patientId: string,
        doctorId: string,
        attachments?: Message['attachments']
    ): Promise<Message> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${this.baseUrl}/messages/conversations/${conversationId}/messages`,
                {
                    content,
                    type,
                    fromDoctor,
                    patientId,
                    doctorId,
                    attachments
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async createConversation(participantId: string): Promise<{ id: string }> {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${this.baseUrl}/messages/conversations`,
                { participantId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    async updateMessageStatus(messageId: string, status: Message['status']): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${this.baseUrl}/messages/${messageId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (error) {
            console.error('Error updating message status:', error);
            throw error;
        }
    }

    // Helper method to format timestamp
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
