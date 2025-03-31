"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  Image,
  File,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Info,
  Clock,
  CheckCheck,
  User,
  Plus,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample conversations data
const conversations = [
  {
    id: "conv-1",
    patient: {
      id: "P-1002",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      content: "Thank you for the information, doctor. I'll follow the new treatment plan.",
      timestamp: "10:32 AM",
      isRead: true,
      sender: "patient",
    },
    unread: 0,
    status: "active",
  },
  {
    id: "conv-2",
    patient: {
      id: "P-1001",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      content: "I've been experiencing increased itching since yesterday. Should I adjust my medication?",
      timestamp: "Yesterday",
      isRead: false,
      sender: "patient",
    },
    unread: 1,
    status: "active",
  },
  {
    id: "conv-3",
    patient: {
      id: "P-1003",
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      content: "Your prescription has been sent to your pharmacy. Let me know if you have any questions.",
      timestamp: "Yesterday",
      isRead: true,
      sender: "doctor",
    },
    unread: 0,
    status: "active",
  },
  {
    id: "conv-4",
    patient: {
      id: "P-1004",
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      content: "I'll send you the photos of the affected area tomorrow morning.",
      timestamp: "Monday",
      isRead: true,
      sender: "patient",
    },
    unread: 0,
    status: "active",
  },
  {
    id: "conv-5",
    patient: {
      id: "P-1005",
      name: "Jennifer Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      content: "Please schedule a follow-up appointment for next week.",
      timestamp: "06/05/2023",
      isRead: true,
      sender: "doctor",
    },
    unread: 0,
    status: "active",
  },
  {
    id: "conv-6",
    patient: {
      id: "P-1008",
      name: "Thomas Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      content: "I've reviewed your lab results. Everything looks good.",
      timestamp: "05/28/2023",
      isRead: true,
      sender: "doctor",
    },
    unread: 0,
    status: "archived",
  },
]

// Sample messages for a conversation
const sampleMessages = [
  {
    id: "msg-1",
    content: "Good morning Dr. Johnson. I've been experiencing increased itching on my arms since yesterday.",
    timestamp: "10:15 AM",
    sender: "patient",
    isRead: true,
  },
  {
    id: "msg-2",
    content: "Hello Michael. I'm sorry to hear that. Have you been exposed to any new potential triggers recently?",
    timestamp: "10:18 AM",
    sender: "doctor",
    isRead: true,
  },
  {
    id: "msg-3",
    content: "Not that I'm aware of. I've been following the treatment plan strictly.",
    timestamp: "10:20 AM",
    sender: "patient",
    isRead: true,
  },
  {
    id: "msg-4",
    content: "I see. Have you been applying the hydrocortisone cream as prescribed?",
    timestamp: "10:22 AM",
    sender: "doctor",
    isRead: true,
  },
  {
    id: "msg-5",
    content: "Yes, twice daily as instructed. Should I increase the frequency?",
    timestamp: "10:25 AM",
    sender: "patient",
    isRead: true,
  },
  {
    id: "msg-6",
    content:
      "Let's adjust your treatment plan slightly. Please apply the cream three times daily for the next three days and monitor if there's any improvement. Also, try to keep the affected areas moisturized.",
    timestamp: "10:28 AM",
    sender: "doctor",
    isRead: true,
  },
  {
    id: "msg-7",
    content: "Thank you for the information, doctor. I'll follow the new treatment plan.",
    timestamp: "10:32 AM",
    sender: "patient",
    isRead: true,
  },
]

export default function DoctorMessaging() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter conversations based on search term and active tab
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.patient.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && conversation.unread > 0
    if (activeTab === "archived") return matchesSearch && conversation.status === "archived"

    return matchesSearch
  })

  const handleSendMessage = () => {
    if (messageText.trim() === "") return

    // In a real app, you would send the message to the backend
    // and update the conversation with the new message
    console.log("Sending message:", messageText)

    // Clear the input field
    setMessageText("")
  }

  return (
    <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/doctor">
          <Button variant="outline" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Secure Messaging</h1>
        <p className="text-slate-600 dark:text-slate-400">Communicate securely with your patients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <Tabs defaultValue="all" className="px-4 mt-2" onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                <Badge variant="destructive" className="ml-1">
                  {conversations.reduce((count, conv) => count + conv.unread, 0)}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <CardContent className="flex-1 overflow-y-auto pt-4">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <User className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="font-medium mb-1">No conversations found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm
                    ? "Try a different search term"
                    : activeTab === "unread"
                      ? "No unread messages"
                      : activeTab === "archived"
                        ? "No archived conversations"
                        : "Start a new conversation"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeConversation.id === conversation.id
                        ? "bg-indigo-50 dark:bg-indigo-900/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={conversation.patient.avatar} alt={conversation.patient.name} />
                        <AvatarFallback>
                          {conversation.patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium truncate">{conversation.patient.name}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                            {conversation.lastMessage.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {conversation.lastMessage.sender === "doctor" && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                              <span className="mr-1">You:</span>
                              {conversation.lastMessage.isRead && <CheckCheck className="h-3 w-3 text-indigo-500" />}
                            </span>
                          )}
                          <p
                            className={`text-sm truncate ${
                              conversation.unread > 0
                                ? "font-medium text-slate-900 dark:text-slate-100"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeConversation.patient.avatar} alt={activeConversation.patient.name} />
                      <AvatarFallback>
                        {activeConversation.patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeConversation.patient.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Patient ID: {activeConversation.patient.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
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
                        <DropdownMenuLabel>Conversation</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Patient Profile</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                        <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                      Today
                    </span>
                  </div>

                  {sampleMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "patient" && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={activeConversation.patient.avatar} alt={activeConversation.patient.name} />
                          <AvatarFallback>
                            {activeConversation.patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] ${message.sender === "doctor" ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800"} rounded-lg p-3`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center justify-end mt-1 text-xs ${message.sender === "doctor" ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{message.timestamp}</span>
                          {message.sender === "doctor" && message.isRead && <CheckCheck className="h-3 w-3 ml-1" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

