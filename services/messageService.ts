import axios from 'axios';

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file' | 'voice' | 'ai-suggestion';
    attachments?: Array<{
        url: string;
        type: string;
        name: string;
        size: number;
    }>;
    reaction?: string;
    isAiSuggestion?: boolean;
    senderName?: string;
    senderImage?: string;
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantImage?: string;
    participantRole: string;
    lastMessage?: {
        content: string;
        timestamp: string;
        senderId: string;
        status: string;
    };
    unreadCount: number;
    isOnline: boolean;
}

class MessageService {
    private baseUrl = process.env.NEXT_PUBLIC_API_URL;

    async getConversations(): Promise<Conversation[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/messages/conversations`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/api/messages/conversations/${conversationId}/messages`,
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    async sendMessage(conversationId: string, content: string, type: Message['type'] = 'text', attachments?: Message['attachments']): Promise<Message> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/api/messages/conversations/${conversationId}/messages`,
                { content, type, attachments },
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async createConversation(participantId: string): Promise<{ id: string }> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/api/messages/conversations`,
                { participantId },
                { withCredentials: true }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    async updateMessageStatus(messageId: string, status: Message['status']): Promise<void> {
        try {
            await axios.put(
                `${this.baseUrl}/api/messages/messages/${messageId}/status`,
                { status },
                { withCredentials: true }
            );
        } catch (error) {
            console.error('Error updating message status:', error);
            throw error;
        }
    }

    async addReaction(messageId: string, reaction: string): Promise<void> {
        try {
            await axios.post(
                `${this.baseUrl}/api/messages/messages/${messageId}/reactions`,
                { reaction },
                { withCredentials: true }
            );
        } catch (error) {
            console.error('Error adding reaction:', error);
            throw error;
        }
    }

    // Helper method to format message preview
    formatMessagePreview(content: string, type: Message['type']): string {
        if (type === 'text') return content.length > 50 ? `${content.slice(0, 47)}...` : content;
        if (type === 'image') return '📷 Image';
        if (type === 'file') return '📎 File';
        if (type === 'voice') return '🎤 Voice Message';
        return 'New message';
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
