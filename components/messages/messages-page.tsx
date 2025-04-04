"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { messageService, type Conversation, type Message } from '@/services/messageService';
import { useAuth } from '@/lib/auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageThread } from './message-thread';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export function MessagesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Add filtered conversations computation
    const filteredConversations = conversations.filter(conversation =>
        conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const loadConversations = async () => {
        try {
            const data = await messageService.getConversations();
            setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading conversations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load conversations',
                variant: 'destructive'
            });
            setLoading(false);
        }
    };

    const loadMessages = async (conversationId: string) => {
        try {
            const data = await messageService.getMessages(conversationId);
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages:', error);
            toast({
                title: 'Error',
                description: 'Failed to load messages',
                variant: 'destructive'
            });
        }
    };

    const handleSendMessage = async (content: string, type: Message['type'] = 'text', attachments?: Message['attachments']) => {
        if (!selectedConversation || !content.trim()) return;

        try {
            const message = await messageService.sendMessage(
                selectedConversation.id,
                content,
                type,
                attachments
            );
            setMessages(prev => [...prev, message]);

            // Update conversation list
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === selectedConversation.id
                        ? {
                            ...conv,
                            lastMessage: {
                                content: messageService.formatMessagePreview(content, type),
                                timestamp: new Date().toISOString(),
                                senderId: user?.id || '',
                                status: 'sent'
                            }
                        }
                        : conv
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: 'Error',
                description: 'Failed to send message',
                variant: 'destructive'
            });
        }
    };

    const handleReaction = async (messageId: string, reaction: string) => {
        try {
            await messageService.addReaction(messageId, reaction);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId ? { ...msg, reaction } : msg
                )
            );
        } catch (error) {
            console.error('Error adding reaction:', error);
            toast({
                title: 'Error',
                description: 'Failed to add reaction',
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
                {/* Conversations List */}
                <Card className="col-span-4 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Messages</h2>
                        <Button size="icon" variant="ghost">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="h-[calc(100vh-16rem)]">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 mb-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                                        selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                                    }`}
                                    onClick={() => setSelectedConversation(conversation)}
                                >
                                    <Avatar>
                                        <AvatarImage src={conversation.participantImage} />
                                        <AvatarFallback>
                                            {conversation.participantName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold truncate">
                                                {conversation.participantName}
                                            </h3>
                                            {conversation.lastMessage && (
                                                <span className="text-xs text-muted-foreground">
                                                    {messageService.formatTimestamp(conversation.lastMessage.timestamp)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conversation.lastMessage?.content || 'No messages yet'}
                                            </p>
                                            {conversation.unreadCount > 0 && (
                                                <Badge variant="secondary" className="ml-2">
                                                    {conversation.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </Card>

                {/* Message Thread */}
                <Card className="col-span-8 p-4">
                    {selectedConversation ? (
                        <MessageThread
                            conversation={selectedConversation}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onReaction={handleReaction}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a conversation to start messaging
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
