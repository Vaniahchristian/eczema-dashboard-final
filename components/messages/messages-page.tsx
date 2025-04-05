"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/lib/auth"
import { messageService, type Message, type Conversation } from "@/services/messageService"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  File,
  Clock,
  CheckCheck,
  Search,
  Plus,
  MessageSquare
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Fetch conversations periodically
  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000) // Poll every 5s
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  // Scroll to the bottom when messages update
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update unread messages to "read" when viewed
  useEffect(() => {
    if (selectedConversation && messages.length > 0 && user) {
      const updateUnreadMessages = async () => {
        try {
          const unreadMessages = messages.filter(
            (msg) =>
              msg.fromDoctor !== (user.role === 'doctor') &&
              msg.status !== 'read'
          )
          for (const msg of unreadMessages) {
            await messageService.updateMessageStatus(msg.id, 'read')
          }
          if (unreadMessages.length > 0) {
            setMessages((prev) =>
              prev.map((msg) =>
                unreadMessages.some((u) => u.id === msg.id)
                  ? { ...msg, status: 'read' }
                  : msg
              )
            )
            await fetchConversations() // Update unreadCount
          }
        } catch (error) {
          console.error('Error updating message status:', error)
          toast({
            title: "Error",
            description: "Failed to update message status",
            variant: "destructive"
          })
        }
      }
      updateUnreadMessages()
    }
  }, [selectedConversation, messages, user])

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

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true)
      const data = await messageService.getMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load messages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConversation || !newMessage.trim() || !user) return

    try {
      setLoading(true)
      const message = await messageService.sendMessage(
        selectedConversation.id,
        newMessage,
        'text'
      )
      setMessages((prev) => [...prev, message])
      setNewMessage("")
      await fetchConversations() // Update lastMessage and unreadCount
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedConversation) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!response.ok) throw new Error('File upload failed')
      const { url } = await response.json()

      const type = file.type.startsWith('image/') ? 'image' : 'file'
      const attachment = { url, type: file.type, name: file.name, size: file.size }
      const message = await messageService.sendMessage(selectedConversation.id, '', type, [attachment])
      setMessages((prev) => [...prev, message])
      await fetchConversations()
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
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
        setSelectedConversation(newConversation)
        toast({ title: "Success", description: "Conversation created" })
      } else {
        const updatedConversations = await messageService.getConversations()
        const fetchedNewConversation = updatedConversations.find(conv => conv.id === id)
        if (fetchedNewConversation) {
          setSelectedConversation(fetchedNewConversation)
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Filter conversations based on tab and search
  const filteredConversations = conversations.filter((conv) => {
    const matchesTab = activeTab === 'active' ? conv.status === 'active' : conv.status !== 'active'
    const matchesSearch =
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.content || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Messages</CardTitle>
            <Button variant="ghost" size="icon" className="text-slate-500" onClick={handleCreateConversation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'archived')}>
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {loading && filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">No conversations found</div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === conversation.id ? "bg-gray-100" : ""}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={conversation.participantImage} />
                      <AvatarFallback>
                        {conversation.participantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{conversation.participantName}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.participantImage} />
                  <AvatarFallback>
                    {selectedConversation.participantName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedConversation.participantName}</h2>
                  <p className="text-sm text-gray-500">{selectedConversation.participantRole}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.fromDoctor === (user?.role === 'doctor') ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-end gap-2 ${message.fromDoctor === (user?.role === 'doctor') ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar>
                        <AvatarImage src={message.fromDoctor === (user?.role === 'doctor') ? user?.profileImage : message.senderImage} />
                        <AvatarFallback>
                          {(message.fromDoctor === (user?.role === 'doctor') ? user?.firstName : message.senderName)
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${message.fromDoctor === (user?.role === 'doctor') ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
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
                        <div className="flex items-center justify-end mt-1 text-xs opacity-70">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{messageService.formatTimestamp(message.timestamp)}</span>
                          {message.fromDoctor === (user?.role === 'doctor') && message.status === 'read' && (
                            <CheckCheck className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" disabled={loading}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                />
                <Button type="submit" disabled={loading || !newMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <MessageSquare className="h-8 w-8 mr-2" />
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}