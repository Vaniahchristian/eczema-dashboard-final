"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Plus, CheckCircle, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth"
import { messageService, type Conversation } from "@/services/messageService"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface ConversationsListProps {
    activeConversationId: string | null
    onSelectConversation: (conversation: Conversation) => void
}

export function ConversationsList({
    activeConversationId,
    onSelectConversation,
}: ConversationsListProps) {
    const { user } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState<"all" | "unread" | "doctors" | "patients">("all")
    const { toast } = useToast()

    useEffect(() => {
        fetchConversations()
        const interval = setInterval(fetchConversations, 10000) // Poll every 10s
        return () => clearInterval(interval)
    }, [])

    const fetchConversations = async () => {
        try {
            setLoading(true)
            const data = await messageService.getConversations()
            setConversations(data)
        } catch (error) {
            console.error("Error fetching conversations:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load conversations",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    // Apply filters and search
    const filteredConversations = conversations.filter((conv) => {
        const matchesSearch =
            conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (conv.lastMessage?.content || "").toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false

        if (filter === "unread") return conv.unreadCount > 0
        if (filter === "doctors") return conv.participantRole === "doctor"
        if (filter === "patients") return conv.participantRole === "patient"
        return true
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8" // Padding-left to accommodate icon
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Messages</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="doctors">Doctors</SelectItem>
                        <SelectItem value="patients">Patients</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                        <p>No conversations found</p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => (
                        <motion.div
                            key={conversation.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => onSelectConversation(conversation)}
                            className={cn(
                                "p-4 flex items-start space-x-3 cursor-pointer hover:bg-muted/50 transition-colors",
                                conversation.id === activeConversationId && "bg-muted",
                                conversation.unreadCount > 0 && "bg-primary/5"
                            )}
                        >
                            <Avatar>
                                <AvatarImage src={conversation.participantImage} />
                                <AvatarFallback>{conversation.participantName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium truncate">{conversation.participantName}</h3>
                                    <span className="text-xs text-muted-foreground">
                                        {conversation.lastMessage && messageService.formatTimestamp(conversation.lastMessage.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {conversation.lastMessage?.content || "No messages yet"}
                                </p>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-muted-foreground">{conversation.participantRole}</span>
                                    {conversation.unreadCount > 0 && (
                                        <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                    {conversation.lastMessage?.status === "read" ? (
                                        <CheckCircle className="h-3 w-3 text-primary ml-auto" />
                                    ) : (
                                        <Clock className="h-3 w-3 text-muted-foreground ml-auto" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}