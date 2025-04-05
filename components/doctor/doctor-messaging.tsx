"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft, Search, Send, Paperclip, Image, File, Mic, MoreVertical,
  Phone, Video, Info, Clock, CheckCheck, User, Plus, MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Message {
  id: string
  content: string
  timestamp: string
  patientId: string
  doctorId: string
  fromDoctor: boolean
  senderName: string
  senderRole: string
  senderImage?: string
  status: string
  type: string
  attachments?: any[]
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  participantImage?: string
  unreadCount: number
  status: 'active' | 'archived'
  lastMessage?: {
    id: string
    content: string
    timestamp: string
    status: string
  }
}

export default function DoctorMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setConversations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      })
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  // Fetch messages when conversation is selected
  const fetchMessages = async () => {
    if (!activeConversationId) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/messages/conversations/${activeConversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setMessages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      })
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    const conversation = conversations.find(c => c.id === activeConversationId)
    setActiveConversation(conversation || null)
  }, [activeConversationId])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversationId || !activeConversation) return

    try {
      const response = await fetch(`${API_URL}/messages/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: messageText,
          type: 'text',
          fromDoctor: true,
          patientId: activeConversation.participantId,
          doctorId: user?.id
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessageText("")
        setMessages(prev => [...prev, data.data])
        fetchConversations() // Refresh conversations to update last message
      } else {
        throw new Error(data.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    }
  }

  const filteredConversations = conversations.filter(conv => 
    (activeTab === "active" ? conv.status !== "archived" : conv.status === "archived") &&
    (searchQuery === "" || conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-[300px] border-r">
        <div className="p-4 border-b">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">
                Active
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-auto h-[calc(100vh-10rem)]">
          {loading && !conversations.length ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading conversations...</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${
                  activeConversationId === conversation.id ? "bg-slate-100 dark:bg-slate-800" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.participantImage} />
                    <AvatarFallback>
                      {conversation.participantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{conversation.participantName}</h4>
                      {conversation.lastMessage && (
                        <span className="text-xs text-slate-500">
                          {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={conversation.unreadCount > 0 ? "default" : "secondary"}>
                        {conversation.participantRole}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge>{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-1">
        <Card className="h-full flex flex-col rounded-none border-t-0 border-r-0 border-b-0">
          {activeConversation ? (
            <>
              <CardHeader className="border-b px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link href="/messages" className="lg:hidden">
                      <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Avatar>
                      <AvatarImage src={activeConversation.participantImage} />
                      <AvatarFallback>
                        {activeConversation.participantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{activeConversation.participantName}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {activeConversation.participantRole}
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
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading messages...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.fromDoctor ? "flex-row-reverse" : ""
                        }`}
                      >
                        {message.fromDoctor ? (
                          <Avatar>
                            <AvatarImage src={user?.profileImage} />
                            <AvatarFallback>
                              {user?.firstName
                                .split(" ")
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
                          className={`max-w-[70%] ${
                            message.fromDoctor
                              ? "bg-indigo-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800"
                          } rounded-lg p-3`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end mt-1 text-xs ${
                              message.fromDoctor
                                ? "text-indigo-200"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.fromDoctor && message.status === 'read' && (
                              <CheckCheck className="h-3 w-3 ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[50px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Image className="h-4 w-4 mr-2" />
                          Image
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <File className="h-4 w-4 mr-2" />
                          Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={messageText.trim() === ""}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  All messages are encrypted and comply with HIPAA regulations
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No conversation selected</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Select a conversation from the list or start a new one
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
