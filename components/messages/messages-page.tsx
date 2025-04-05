"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/lib/auth"
import { messageService, Message, Conversation } from "@/services/messageService"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send, Paperclip, Image as ImageIcon, File, Clock, CheckCheck, Search, Plus, MessageSquare
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const { toast } = useToast()

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000) // Poll every 5s
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedConversation && messages.length > 0 && user) {
      const updateUnreadMessages = async () => {
        try {
          const unreadMessages = messages.filter(
            (msg) => !msg.fromDoctor && msg.status !== 'read' && user.role === 'doctor'
          )
          for (const msg of unreadMessages) {
            await messageService.updateMessageStatus(msg.id, 'read')
          }
          if (unreadMessages.length > 0) {
            setMessages((prev) =>
              prev.map((msg) =>
                unreadMessages.some((u) => u.id === msg.id) ? { ...msg, status: 'read' } : msg
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
        'text' // Backend derives fromDoctor, patientId, doctorId
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Adjust filtering since backend uses updatedAt, not status
  const filteredConversations = conversations.filter(
    (conv) => (activeTab === 'active' ? !!conv.updatedAt : !conv.updatedAt)
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Messages</CardTitle>
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={""}
              onChange={(e) => { }}
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
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === conversation.id ? "bg-gray-100" : ""
                  }`}
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
                    <p className="text-sm text-gray-500">
                      {conversation.lastMessage?.content}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
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
                    className={`flex ${message.fromDoctor === (user?.role === 'doctor') ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`flex items-end gap-2 ${message.fromDoctor === (user?.role === 'doctor') ? "flex-row-reverse" : "flex-row"
                        }`}
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
                        className={`max-w-[70%] rounded-lg p-3 ${message.fromDoctor === (user?.role === 'doctor')
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                          }`}
                      >
                        <p>{message.content}</p>
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
                    <DropdownMenuItem>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Image
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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