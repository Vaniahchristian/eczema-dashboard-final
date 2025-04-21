"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: Date
  attachments?: {
    type: 'image' | 'file'
    url: string
    name: string
  }[]
  readBy: {
    userId: string
  }[]
  reactions: {
    type: string
  }[]
  status: 'sent' | 'delivered' | 'read'
  createdAt: Date
}

interface Participant {
  id: string
  name: string
  role: 'patient' | 'doctor'
  imageUrl?: string
}

interface ChatWindowProps {
  currentUser: {
    id: string
    role: 'patient' | 'doctor'
  }
  conversation: {
    id: string
    participants: Participant[]
    lastMessage?: Message
  }
  messages: Message[]
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>
  onTyping: (isTyping: boolean) => void
  isTyping?: boolean
  socket: any
}

export function ChatWindow({
  currentUser,
  conversation,
  messages,
  onSendMessage,
  onTyping,
  isTyping,
  socket
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(
    p => p.id !== currentUser.id
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket || !conversation || !messages.length) return

    const unreadMessages = messages.filter(msg => 
      msg.senderId !== currentUser.id && 
      !msg.readBy.some(r => r.userId === currentUser.id)
    )

    if (unreadMessages.length > 0) {
      socket.emit('markAsRead', {
        conversationId: conversation.id,
        messageIds: unreadMessages.map(m => m.id)
      })
    }
  }, [socket, conversation, messages, currentUser.id])

  const handleSend = async () => {
    if (!messageInput.trim() && attachments.length === 0) return

    try {
      await onSendMessage(messageInput, attachments)
      setMessageInput("")
      setAttachments([])
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTyping = () => {
    onTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false)
    }, 2000)
  }

  const handleAttachment = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const handleReaction = async (messageId: string, type: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${messageId}/reactions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type })
        }
      )
      if (!response.ok) throw new Error('Failed to add reaction')
    } catch (error) {
      console.error('Failed to add reaction:', error)
    }
  }

  const getMessageStatus = (message: Message) => {
    if (message.senderId === currentUser.id) {
      if (message.readBy.length > 0) return 'Read'
      if (message.status === 'delivered') return 'Delivered'
      return 'Sent'
    }
    return null
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {otherParticipant?.imageUrl && (
            <AvatarImage src={otherParticipant.imageUrl} alt={otherParticipant.name} />
          )}
          <AvatarFallback>
            {otherParticipant?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">
            {currentUser.role === 'patient' ? 'Dr. ' : ''}{otherParticipant?.name}
          </h3>
          {isTyping && (
            <p className="text-sm text-muted-foreground">Typing...</p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser.id
            const showAvatar = index === 0 || 
              messages[index - 1].senderId !== message.senderId
            const status = getMessageStatus(message)

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  isCurrentUser && "flex-row-reverse"
                )}
              >
                {showAvatar && (
                  <Avatar className="h-8 w-8 shrink-0">
                    {otherParticipant?.imageUrl && !isCurrentUser && (
                      <AvatarImage 
                        src={otherParticipant.imageUrl} 
                        alt={otherParticipant.name} 
                      />
                    )}
                    <AvatarFallback>
                      {isCurrentUser ? 'ME' : 
                        otherParticipant?.name.split(' ')
                          .map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "group flex flex-col gap-1",
                    isCurrentUser && "items-end"
                  )}
                >
                  <Card
                    className={cn(
                      "px-3 py-2 max-w-[70%] relative group",
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    {message.attachments?.map((attachment, i) => (
                      <div key={i} className="mt-2">
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            className="max-w-full rounded"
                          />
                        ) : (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline"
                          >
                            {attachment.name}
                          </a>
                        )}
                      </div>
                    ))}
                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className={cn(
                        "absolute -bottom-3 flex -space-x-1 items-center px-2 py-1 rounded-full text-xs",
                        isCurrentUser ? "-left-2" : "-right-2",
                        isCurrentUser ? "bg-primary-foreground text-primary" : "bg-background text-foreground"
                      )}>
                        {Array.from(new Set(message.reactions.map(r => r.type))).map((type, i) => (
                          <span key={i} className="w-4 h-4 flex items-center justify-center">
                            {type}
                          </span>
                        ))}
                        <span className="ml-1">
                          {message.reactions.length}
                        </span>
                      </div>
                    )}
                    {/* Reaction Menu */}
                    <div className={cn(
                      "absolute top-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity",
                      isCurrentUser ? "left-0 transform -translate-x-full" : "right-0 transform translate-x-full"
                    )}>
                      <Card className="p-1 flex gap-1">
                        {['👍', '❤️', '😊', '😮', '😢', '👏'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="w-6 h-6 rounded hover:bg-accent flex items-center justify-center text-sm"
                          >
                            {emoji}
                          </button>
                        ))}
                      </Card>
                    </div>
                  </Card>
                  <div className={cn(
                    "flex items-center gap-2 text-xs text-muted-foreground px-2",
                    "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}>
                    <span>{formatTime(message.createdAt)}</span>
                    {status && <span>{status}</span>}
                  </div>
                </div>
              </div>
            )
          })}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                {otherParticipant?.imageUrl && (
                  <AvatarImage 
                    src={otherParticipant.imageUrl} 
                    alt={otherParticipant.name} 
                  />
                )}
                <AvatarFallback>
                  {otherParticipant?.name.split(' ')
                    .map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Card className="px-3 py-2 bg-muted">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-2 border-t">
          <div className="flex gap-2 overflow-x-auto">
            {attachments.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                ) : (
                  <div className="h-20 w-20 flex items-center justify-center bg-muted rounded">
                    <span className="text-xs text-center break-words px-2">
                      {file.name}
                    </span>
                  </div>
                )}
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleAttachment}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value)
              handleTyping()
            }}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!messageInput.trim() && attachments.length === 0}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>
    </div>
  )
}
