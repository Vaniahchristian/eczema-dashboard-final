"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type Conversation } from "@/services/messageService"
import { type User } from "@/lib/auth"
import { messageService } from "@/services/messageService"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ConversationsListProps {
  conversations: Conversation[]
  selectedId?: string
  currentUser: User | null
  onSelect: (conversation: Conversation) => void
  onSearch: (query: string) => void
}

export function ConversationsList({
  conversations,
  selectedId,
  currentUser,
  onSelect,
  onSearch
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.userId !== currentUser?.id)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(messageDate)
    } else if (diffInHours < 168) { // Within a week
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short'
      }).format(messageDate)
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(messageDate)
    }
  }

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return "No messages yet"
    
    const sender = conversation.lastMessage.senderId === currentUser?.id ? "You" : 
      getOtherParticipant(conversation)?.name || "Unknown"

    let content = conversation.lastMessage.content
    if (conversation.lastMessage.type === 'image') {
      content = '📷 Sent an image'
    } else if (conversation.lastMessage.type === 'file') {
      content = '📎 Sent a file'
    }

    return `${sender}: ${content}`
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {conversations.map((conversation) => {
            const otherParticipant = getOtherParticipant(conversation)
            if (!otherParticipant) return null

            return (
              <Button
                key={conversation.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start p-3 h-auto",
                  selectedId === conversation.id && "bg-muted"
                )}
                onClick={() => onSelect(conversation)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Avatar className="h-10 w-10 shrink-0">
                    {otherParticipant.imageUrl && (
                      <AvatarImage src={otherParticipant.imageUrl} alt={otherParticipant.name} />
                    )}
                    <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {otherParticipant.name}
                      </span>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatLastMessageTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate">
                        {getLastMessagePreview(conversation)}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="shrink-0 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}