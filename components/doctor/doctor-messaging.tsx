"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/lib/auth"
import { messageService, Message, Conversation } from "@/services/messageService"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft, Search, Send, Paperclip, Image, File, Mic, MoreVertical,
  MessageSquare, Plus, Phone, Video, Info, Clock, CheckCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function DoctorMessaging() {
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
    const interval = setInterval(fetchConversations, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      const interval = setInterval(() => fetchMessages(selectedConversation.id), 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        'text' // Only content, type, and optional attachments are needed
      )
      setMessages((prev) => [...prev, message])
      setNewMessage("")
      await fetchConversations() // Refresh conversations to update lastMessage and unreadCount
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

  const filteredConversations = conversations.filter(
    (conv) => (activeTab === 'active' ? conv.updatedAt : !conv.updatedAt) // Adjust based on backend's isActive
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <Input
            placeholder="Search conversations..."
            value={""}
            onChange={(e) => { }}
            className="mb-4"
          />
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'archived')}>
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
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
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <Card className="h-full flex flex-col rounded-none border-t-0 border-r-0 border-b-0">
              <CardHeader className="border-b px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href="/messages" className="lg:hidden">
                      <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
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
                      <CardTitle className="text-base">{selectedConversation.participantName}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedConversation.participantRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.fromDoctor ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                          className={`flex items-end gap-2 ${message.fromDoctor ? "flex-row-reverse" : "flex-row"
                            }`}
                        >
                          {message.fromDoctor ? (
                            <Avatar>
                              <AvatarImage src={user?.profileImage} /> {/* Adjust to match your user object */}
                              <AvatarFallback>
                                {user?.firstName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar>
                              <AvatarImage src={message.senderImage} />
                              <AvatarFallback>
                                {message.senderName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.fromDoctor
                                ? "bg-indigo-500 text-white"
                                : "bg-slate-100 dark:bg-slate-800"
                              }`}
                          >
                            <p>{message.content}</p>
                            <div
                              className={`flex items-center justify-end mt-1 text-xs ${message.fromDoctor
                                  ? "text-indigo-200"
                                  : "text-slate-500 dark:text-slate-400"
                                }`}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{messageService.formatTimestamp(message.timestamp)}</span>
                              {message.fromDoctor && message.status === 'read' && (
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
              </CardContent>
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !newMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  All messages are encrypted and comply with HIPAA regulations
                </p>
              </div>
            </Card>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}