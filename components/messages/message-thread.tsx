"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Send,
    Paperclip,
    Image as ImageIcon,
    File,
    Smile,
    MoreVertical,
    Phone,
    Video,
    CheckCircle,
    Clock,
    Download,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth"
import { messageService, type Message, type Conversation } from "@/services/messageService"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface MessageThreadProps {
    conversation: Conversation
    messages: Message[]
    onSendMessage: (content: string, type?: Message['type'], attachments?: Message['attachments']) => Promise<void>
    onReaction: (messageId: string, reaction: string) => Promise<void>
    onTypingStatus?: (isTyping: boolean) => void
}

export function MessageThread({
    conversation,
    messages,
    onSendMessage,
    onReaction,
    onTypingStatus
}: MessageThreadProps) {
    const { user } = useAuth()
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout>()
    const { toast } = useToast()

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return
        try {
            await onSendMessage(newMessage, 'text')
            setNewMessage("")
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send message",
                variant: "destructive"
            })
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append('file', file)
            const token = localStorage.getItem('token')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
            if (!response.ok) throw new Error('File upload failed')
            const { url } = await response.json()

            const type = file.type.startsWith('image/') ? 'image' : 'file'
            const attachment = {
                url,
                type: file.type,
                name: file.name,
                size: file.size,
            }
            await onSendMessage('', type, [attachment])
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload file",
                variant: "destructive"
            })
        }
    }

    const handleReaction = async (messageId: string, reaction: string) => {
        try {
            await onReaction(messageId, reaction)
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add reaction",
                variant: "destructive"
            })
        }
    }

    // Handle typing status
    useEffect(() => {
        if (newMessage && onTypingStatus) {
            onTypingStatus(true)
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => {
                onTypingStatus(false)
            }, 3000)
        }
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [newMessage, onTypingStatus])

    if (!user) return null

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={conversation.participantImage} />
                        <AvatarFallback>{conversation.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{conversation.participantName}</h3>
                        <p className="text-sm text-muted-foreground">{conversation.participantRole}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" disabled>
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => {
                        const isUser = message.senderId === user?.id
                        const showAvatar = !isUser || message.type === 'ai-suggestion'
                        
                        return (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex items-start space-x-2 mb-4",
                                    isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
                                )}
                            >
                                {showAvatar && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={message.senderImage} />
                                        <AvatarFallback>
                                            {message.senderName?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "flex flex-col",
                                    isUser ? "items-end" : "items-start"
                                )}>
                                    {showAvatar && (
                                        <span className="text-sm font-medium mb-1">
                                            {message.senderName}
                                        </span>
                                    )}
                                    <div className="flex items-end gap-2">
                                        <div className={cn(
                                            "rounded-lg p-3 max-w-[70%]",
                                            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                                        )}>
                                            {message.type === 'text' && (
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            )}
                                            {(message.type === 'image' || message.type === 'file') && message.attachments?.map((attachment, index) => (
                                                <div key={index} className="flex flex-col gap-2">
                                                    {attachment.type.startsWith('image/') ? (
                                                        <img
                                                            src={attachment.url}
                                                            alt={attachment.name}
                                                            className="max-w-xs rounded"
                                                        />
                                                    ) : (
                                                        <a
                                                            href={attachment.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm hover:underline"
                                                        >
                                                            <File className="h-4 w-4" />
                                                            <span>{attachment.name}</span>
                                                            <span className="text-xs opacity-70">
                                                                ({Math.round(attachment.size / 1024)}KB)
                                                            </span>
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                            <span className="text-xs opacity-70">
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {isUser && (
                                                message.status === 'read' ? (
                                                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                                ) : (
                                                    <Clock className="h-3 w-3 opacity-70" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {message.reactions?.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {message.reactions.map((reaction, index) => (
                                                <span key={index} className="text-xl">
                                                    {reaction.type === 'thumbs_up' ? '👍' : '👎'}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {!message.reactions?.some(r => r.userId === user?.id) && !isUser && (
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleReaction(message.id, 'thumbs_up')}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleReaction(message.id, 'thumbs_down')}
                                        >
                                            <ThumbsDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" disabled>
                        <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileSelect}
                    />
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}