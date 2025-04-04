"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send,
    Paperclip,
    ImageIcon,
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
import { Tooltip } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth"
import { type Message, type Conversation } from "@/services/messageService"
import { cn } from "@/lib/utils"

interface MessageThreadProps {
    conversation: Conversation
    messages: Message[]
    onSendMessage: (content: string, type?: Message['type'], attachments?: Message['attachments']) => void
    onReaction: (messageId: string, reaction: string) => void
}

export function MessageThread({
    conversation,
    messages,
    onSendMessage,
    onReaction,
}: MessageThreadProps) {
    const auth = useAuth()
    const user = auth?.user
    const [newMessage, setNewMessage] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isAttaching, setIsAttaching] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSendMessage = () => {
        if (!newMessage.trim()) return
        onSendMessage(newMessage)
        setNewMessage("")
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

        const type = file.type.startsWith('image/') ? 'image' : 'file'
        const attachment = {
            url: URL.createObjectURL(file),
            type: file.type,
            name: file.name,
            size: file.size
        }

        onSendMessage('', type, [attachment])
        setIsAttaching(false)
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

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
                    <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message, index) => {
                        const isUser = message.senderId === user.id
                        const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId

                        return (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex items-start space-x-2",
                                    isUser && "flex-row-reverse space-x-reverse"
                                )}
                            >
                                {showAvatar && !isUser && (
                                    <Avatar className="mt-0.5">
                                        <AvatarImage src={message.senderImage} />
                                        <AvatarFallback>{message.senderName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "flex flex-col space-y-2 max-w-[70%]",
                                    isUser && "items-end"
                                )}>
                                    {showAvatar && !isUser && (
                                        <span className="text-sm font-medium">{message.senderName}</span>
                                    )}
                                    <div className={cn(
                                        "rounded-lg p-3",
                                        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}>
                                        {message.type === 'text' && (
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        )}
                                        {message.type === 'image' && message.attachments?.[0] && (
                                            <img
                                                src={message.attachments[0].url}
                                                alt="Attachment"
                                                className="max-w-sm rounded"
                                            />
                                        )}
                                        {message.type === 'file' && message.attachments?.[0] && (
                                            <div className="flex items-center space-x-2">
                                                <File className="h-4 w-4" />
                                                <span className="text-sm">{message.attachments[0].name}</span>
                                                <Button variant="ghost" size="icon">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        <div className="mt-1 flex items-center space-x-2">
                                            <span className="text-xs opacity-70">
                                                {formatTimestamp(message.timestamp)}
                                            </span>
                                            {isUser && (
                                                message.status === 'read' ? (
                                                    <CheckCircle className="h-3 w-3 text-primary" />
                                                ) : (
                                                    <Clock className="h-3 w-3" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {message.reaction && (
                                        <span className="text-xl">
                                            {message.reaction === 'thumbs_up' ? '👍' : '👎'}
                                        </span>
                                    )}
                                </div>
                                {!message.reaction && !isUser && (
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onReaction(message.id, 'thumbs_up')}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => onReaction(message.id, 'thumbs_down')}
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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setIsAttaching(true)
                            fileInputRef.current?.click()
                        }}
                    >
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setIsAttaching(true)
                            fileInputRef.current?.click()
                        }}
                    >
                        <ImageIcon className="h-4 w-4" />
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
