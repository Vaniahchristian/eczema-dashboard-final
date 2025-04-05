"use client"

import { useState, useEffect, useRef } from "react"
import {
  Send, Paperclip, Image as ImageIcon, File, Clock,
  CheckCheck, Search, Plus, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
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
  lastMessage?: {
    id: string
    content: string
    timestamp: string
    status: string
  }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
        setTimeout(scrollToBottom, 100) // Scroll after messages load
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

  // Update message status to read when viewing
  useEffect(() => {
    const updateMessageStatus = async () => {
      if (!activeConversationId || !messages.length) return

      const unreadMessages = messages.filter(
        msg => msg.fromDoctor && msg.status !== 'read'
      )

      for (const msg of unreadMessages) {
        try {
          await fetch(`${API_URL}/messages/${msg.id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status: 'read' })
          })
        } catch (error) {
          console.error('Error updating message status:', error)
        }
      }

      if (unreadMessages.length > 0) {
        setMessages(prev =>
          prev.map(msg =>
            unreadMessages.some(u => u.id === msg.id)
              ? { ...msg, status: 'read' }
              : msg
          )
        )
        fetchConversations() // Update unread counts
      }
    }

    updateMessageStatus()
  }, [activeConversationId, messages])

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
          fromDoctor: false,
          patientId: user?.id,
          doctorId: activeConversation.participantId
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessageText("")
        setMessages(prev => [...prev, data.data])
        fetchConversations() // Refresh conversations to update last message
        setTimeout(scrollToBottom, 100)
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
    (searchQuery === "" || conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-[300px] border-r">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                  activeConversationId === conversation.id
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
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
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conversation.participantName}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-indigo-500 text-white rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
      <div className="flex-1">
        <Card className="h-full flex flex-col rounded-none border-0 shadow-none">
          {activeConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
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
                    <CardTitle>{activeConversation.participantName}</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {activeConversation.participantRole}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          !message.fromDoctor ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar>
                          <AvatarImage src={message.senderImage} />
                          <AvatarFallback>
                            {message.senderName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`max-w-[70%] ${
                            !message.fromDoctor
                              ? "bg-indigo-500 text-white"
                              : "bg-slate-100 dark:bg-slate-800"
                          } rounded-lg p-3`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end mt-1 text-xs ${
                              !message.fromDoctor
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
                            {!message.fromDoctor && message.status === 'read' && (
                              <CheckCheck className="h-3 w-3 ml-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
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
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Image
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <File className="h-4 w-4 mr-2" />
                          Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                Select a conversation from the list to start messaging with your doctor
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
