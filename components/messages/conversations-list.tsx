"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Conversation } from "@/services/messageService"
import { cn } from "@/lib/utils"

interface ConversationsListProps {
    conversations: Conversation[]
    selectedId?: string
    onSelect: (conversation: Conversation) => void
}

export function ConversationsList({
    conversations,
    selectedId,
    onSelect
}: ConversationsListProps) {
    return (
        <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-2 p-2">
                {conversations.map((conversation) => (
                    <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full flex items-start gap-3 p-3 h-auto relative",
                                selectedId === conversation.id && "bg-muted"
                            )}
                            onClick={() => onSelect(conversation)}
                        >
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src={conversation.participantImage} />
                                <AvatarFallback>
                                    {conversation.participantName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left space-y-1 overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium leading-none">
                                        {conversation.participantName}
                                    </p>
                                    {conversation.lastMessage && (
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conversation.lastMessage?.content || "No messages yet"}
                                    </p>
                                    {conversation.unreadCount > 0 && (
                                        <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Button>
                    </motion.div>
                ))}
            </div>
        </ScrollArea>
    )
}