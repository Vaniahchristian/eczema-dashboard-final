"use client"

import { useEffect, useRef, useState } from "react"
import { Message, messageService } from "@/services/messageService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Paperclip, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface MessageThreadProps {
    conversation: {
        id: string
        participants: Array<{
            userId: string
            role: 'patient' | 'doctor'
            name: string
            imageUrl?: string
        }>
    }
    messages: Message[]
    user: {
        id: string
        role: 'patient' | 'doctor'
    }
}

export function MessageThread({
    conversation,
    messages: initialMessages,
    user
}: MessageThreadProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState("")
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const otherParticipant = conversation.participants.find(p => p.userId !== user.id)

    useEffect(() => {
        if (conversation.id) {
            messageService.joinConversation(conversation.id)
            
            const unsubMessage = messageService.onNewMessage((message) => {
                if (message.conversationId === conversation.id) {
                    setMessages((prev: Message[]) => [...prev, message])
                }
            })

            const unsubTyping = messageService.onTypingStatus(({ userId, isTyping }) => {
                if (userId !== user.id) {
                    setIsOtherUserTyping(isTyping)
                }
            })

            const unsubRead = messageService.onMessageRead(({ messageId, userId }) => {
                if (userId !== user.id) {
                    setMessages((prev: Message[]) => 
                        prev.map((msg: Message) => 
                            msg.id === messageId 
                                ? {
                                    ...msg,
                                    readBy: [...(msg.readBy || []), { userId, readAt: new Date() }]
                                }
                                : msg
                        )
                    )
                }
            })

            return () => {
                messageService.leaveConversation(conversation.id)
                unsubMessage()
                unsubTyping()
                unsubRead()
            }
        }
    }, [conversation.id, user.id])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleFileUpload = async (files: FileList) => {
        if (!files.length) return
        
        try {
            setIsUploading(true)
            const file = files[0]
            const type = file.type.startsWith('image/') ? 'image' : 'file'
            
            await messageService.sendMessage(
                conversation.id,
                type === 'image' ? 'Sent an image' : `Sent a file: ${file.name}`,
                type,
                [file]
            )
        } catch (error) {
            console.error('File upload error:', error)
            toast({
                title: "Error",
                description: "Failed to upload file. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return
        
        try {
            await messageService.sendMessage(conversation.id, newMessage, 'text')
            setNewMessage("")
        } catch (error) {
            console.error('Send message error:', error)
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleTyping = (isTyping: boolean) => {
        messageService.setTypingStatus(conversation.id, isTyping)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!user || !otherParticipant) return null

    return (
        <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={otherParticipant.imageUrl} />
                    <AvatarFallback>
                        {otherParticipant.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold">Dr. {otherParticipant.name}</h3>
                    {isOtherUserTyping && (
                        <p className="text-sm text-muted-foreground">Typing...</p>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => {
                        const isOwnMessage = message.senderId === user.id
                        const messageUser = conversation.participants.find(
                            p => p.userId === message.senderId
                        )

                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-3",
                                    isOwnMessage ? "justify-end" : "justify-start"
                                )}
                            >
                                {!isOwnMessage && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={messageUser?.imageUrl} />
                                        <AvatarFallback>
                                            {messageUser?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={cn(
                                        "rounded-lg p-3 max-w-[70%]",
                                        isOwnMessage
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    {message.type === 'text' ? (
                                        <p className="text-sm">{message.content}</p>
                                    ) : message.type === 'image' ? (
                                        <img
                                            src={message.attachments?.[0]?.url}
                                            alt="Sent image"
                                            className="max-w-full rounded"
                                        />
                                    ) : (
                                        <a
                                            href={message.attachments?.[0]?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm underline"
                                        >
                                            {message.attachments?.[0]?.name}
                                        </a>
                                    )}
                                    <span className="text-xs opacity-70 mt-1 block">
                                        {format(new Date(message.createdAt), 'HH:mm')}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="border-t p-4">
                <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                    }}
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <Input
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)
                            handleTyping(e.target.value.length > 0)
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={isUploading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="shrink-0"
                        disabled={!newMessage.trim() || isUploading}
                    >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}