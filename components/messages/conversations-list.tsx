"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare } from "lucide-react"
import { type Conversation } from "@/services/messageService"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { messageService } from "@/services/messageService"
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
    const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({})
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

    const handleCreateConversation = async () => {
        try {
            const participantId = prompt("Enter participant ID (e.g., UUID from users table):")
            if (!participantId) return
            const { id } = await messageService.createConversation(participantId)
            await fetchConversations()
            const newConversation = conversations.find(conv => conv.id === id)
            if (newConversation) {
                onSelectConversation(newConversation)
                toast({ title: "Success", description: "Conversation created" })
            } else {
                // If not immediately available, fetch explicitly
                const updatedConversations = await messageService.getConversations()
                const fetchedNewConversation = updatedConversations.find(conv => conv.id === id)
                if (fetchedNewConversation) {
                    onSelectConversation(fetchedNewConversation)
                    toast({ title: "Success", description: "Conversation created" })
                }
            }
        } catch (error) {
            console.error("Error creating conversation:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create conversation",
                variant: "destructive"
            })
        }
    }

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        // onSearch(value)
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
                <AnimatePresence initial={false}>
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation) => (
                            <motion.div
                                key={conversation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full flex items-start gap-3 p-3 h-auto",
                                        conversation.id === activeConversationId && "bg-muted"
                                    )}
                                    onClick={() => onSelectConversation(conversation)}
                                >
                                    <Avatar className="flex-shrink-0">
                                        <AvatarImage src={conversation.participantImage} />
                                        <AvatarFallback>
                                            {conversation.participantName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium">
                                                {conversation.participantName}
                                            </span>
                                            {conversation.lastMessage && (
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate">
                                            {typingUsers[conversation.participantId] ? (
                                                <span className="text-primary">typing...</span>
                                            ) : conversation.lastMessage ? (
                                                conversation.lastMessage.content
                                            ) : (
                                                "No messages yet"
                                            )}
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <div className="mt-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                                                {conversation.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mb-2" />
                            <p>No conversations found</p>
                        </div>
                    )}
                </AnimatePresence>
            </ScrollArea>
        </div>
    )
}