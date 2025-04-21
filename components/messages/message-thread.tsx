"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCheck, File, ThumbsUp, Heart, Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Message } from "@/services/messageService"
import { type User } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { messageService } from "@/services/messageService"

interface MessageThreadProps {
  messages: Message[]
  currentUser: User | null
  onReaction: (messageId: string, type: string) => void
  typingUsers: { [key: string]: boolean }
  participants: Array<{
    userId: string
    name: string
    imageUrl?: string
  }>
}

export function MessageThread({
  messages,
  currentUser,
  onReaction,
  typingUsers,
  participants
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(date))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const renderReactions = (message: Message) => {
    const reactionCounts = message.reactions?.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return Object.entries(reactionCounts).map(([type, count]) => (
      <Button
        key={type}
        variant="ghost"
        size="sm"
        className={cn(
          "flex items-center gap-1 px-2 py-1 text-xs rounded-full",
          message.reactions?.some(r => r.userId === currentUser?.id && r.type === type)
            ? "bg-primary/10"
            : "hover:bg-primary/5"
        )}
        onClick={() => onReaction(message.id, type)}
      >
        {type === '👍' && <ThumbsUp className="h-3 w-3" />}
        {type === '❤️' && <Heart className="h-3 w-3" />}
        {type === '😊' && <Smile className="h-3 w-3" />}
        <span>{count}</span>
      </Button>
    ))
  }

  const getSenderDetails = (senderId: string) => {
    const participant = participants.find(p => p.userId === senderId)
    return {
      name: participant?.name || 'Unknown User',
      imageUrl: participant?.imageUrl
    }
  }

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser?.id
          const { name, imageUrl } = getSenderDetails(message.senderId)
          const showSender = index === 0 || messages[index - 1].senderId !== message.senderId

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                isCurrentUser ? "flex-row-reverse" : "flex-row"
              )}
            >
              {showSender && (
                <Avatar className="h-8 w-8">
                  {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "flex flex-col gap-1",
                  isCurrentUser ? "items-end" : "items-start"
                )}
              >
                {showSender && (
                  <span className="text-sm text-muted-foreground">{name}</span>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  {message.type === 'text' && <p>{message.content}</p>}
                  {message.type === 'image' && message.attachments?.[0] && (
                    <img
                      src={message.attachments[0].url}
                      alt="Attachment"
                      className="max-w-sm rounded"
                    />
                  )}
                  {message.type === 'file' && message.attachments?.[0] && (
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <a
                        href={message.attachments[0].url}
                        download={message.attachments[0].name}
                        className="text-sm hover:underline"
                      >
                        {message.attachments[0].name}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs opacity-70">
                        {formatTimestamp(message.createdAt)}
                      </span>
                    </div>
                    {isCurrentUser && message.readBy?.length > 0 && (
                      <CheckCheck className="h-3 w-3" />
                    )}
                  </div>
                </div>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {renderReactions(message)}
                  </div>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                    <DropdownMenuItem onClick={() => onReaction(message.id, "👍")}>
                      <ThumbsUp className="h-4 w-4 mr-2" /> Like
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReaction(message.id, "❤️")}>
                      <Heart className="h-4 w-4 mr-2" /> Love
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReaction(message.id, "😊")}>
                      <Smile className="h-4 w-4 mr-2" /> Smile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
        {Object.entries(typingUsers).map(([userId, isTyping]) => {
          if (!isTyping) return null
          const { name } = getSenderDetails(userId)
          return (
            <div key={userId} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              {name} is typing...
            </div>
          )
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  )
}