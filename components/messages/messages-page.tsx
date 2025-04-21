"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { DoctorList } from "./doctor-list"
import { DoctorProfile } from "./doctor-profile"
import { ChatWindow } from "./chat-window"
import { useAuth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { socketService } from "@/services/socket-service"

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderRole: 'patient' | 'doctor'
  content: string
  type: 'text' | 'image' | 'file'
  attachments?: {
    url: string
    name: string
    type: string
    size: number
  }[]
  status: 'sent' | 'delivered' | 'read'
  readBy: {
    userId: string
    timestamp: Date
  }[]
  reactions: {
    userId: string
    type: string
    timestamp: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

interface Conversation {
  id: string
  participants: {
    userId: string
    role: 'patient' | 'doctor'
  }[]
  lastMessage?: Message
  status: 'active' | 'archived'
  unreadCounts: Map<string, number>
  updatedAt: Date
}

export default function MessagesPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showDoctorList, setShowDoctorList] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  // Connect to WebSocket
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const socket = socketService.connect(token)
    setSocket(socket)

    return () => {
      socketService.disconnect()
    }
  }, [])

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        console.log("MessagesPage - Fetching conversations")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch conversations')
        
        const data = await response.json()
        console.log("MessagesPage - Conversations fetched:", data)
        setConversations(data)
      } catch (error) {
        console.error("MessagesPage - Error fetching conversations:", error)
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive"
        })
      }
    }

    fetchConversations()
  }, [toast])

  // Load doctors for patients
  useEffect(() => {
    if (!showDoctorList || doctors.length > 0 || user?.role !== 'patient') return

    console.log("MessagesPage - Fetching doctors")
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch doctors')
        
        const data = await response.json()
        const doctorsArray = Array.isArray(data) ? data : data.doctors || []
        
        const mappedDoctors = doctorsArray.map((doctor: any) => ({
          id: doctor.id,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          email: doctor.email,
          doctor_profile: {
            specialty: doctor.specialty,
            bio: doctor.bio || '',
            rating: doctor.rating || 0,
            experienceYears: doctor.experience_years || 0,
            clinicName: doctor.clinic_name || '',
            clinicAddress: doctor.clinic_address || '',
            consultationFee: doctor.consultation_fee || 0
          },
          image: `/placeholder.svg?height=40&width=40`,
          role: 'doctor' as const
        }))
        
        setDoctors(mappedDoctors)
      } catch (error) {
        console.error("MessagesPage - Error fetching doctors:", error)
        toast({
          title: "Error",
          description: "Failed to load doctors list",
          variant: "destructive"
        })
      }
    }

    fetchDoctors()
  }, [showDoctorList, doctors.length, user?.role, toast])

  // Handle WebSocket events
  useEffect(() => {
    if (!socket || !selectedConversation) return

    // Join conversation room
    socketService.joinRoom(selectedConversation.id)

    // Listen for new messages
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message])
      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === message.conversationId 
          ? { ...conv, lastMessage: message }
          : conv
      ))
    })

    // Listen for typing status
    socket.on('typing', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping)
      }
    })

    // Listen for read receipts
    socket.on('messageRead', (data: { messageIds: string[]; userId: string }) => {
      if (data.userId !== user?.id) {
        setMessages(prev => prev.map(msg => 
          data.messageIds.includes(msg.id)
            ? {
                ...msg,
                readBy: [...msg.readBy, { userId: data.userId, timestamp: new Date() }]
              }
            : msg
        ))
      }
    })

    // Listen for reactions
    socket.on('messageReaction', (data: { 
      messageId: string
      userId: string
      type: string 
    }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId
          ? {
              ...msg,
              reactions: [...msg.reactions, {
                userId: data.userId,
                type: data.type,
                timestamp: new Date()
              }]
            }
          : msg
      ))
    })

    return () => {
      socket.off('message')
      socket.off('typing')
      socket.off('messageRead')
      socket.off('messageReaction')
      socketService.leaveRoom(selectedConversation.id)
    }
  }, [socket, selectedConversation, user?.id])

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${selectedConversation.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        if (!response.ok) throw new Error('Failed to fetch messages')
        
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error("MessagesPage - Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        })
      }
    }

    fetchMessages()
  }, [selectedConversation, toast])

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!socket || !selectedConversation) return

    try {
      // Handle file uploads first if any
      const uploadedAttachments = []
      if (attachments?.length) {
        for (const file of attachments) {
          const formData = new FormData()
          formData.append('file', file)
          
          const uploadResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/messages/upload`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: formData
            }
          )
          if (!uploadResponse.ok) throw new Error('Failed to upload file')
          
          const { url, type } = await uploadResponse.json()
          uploadedAttachments.push({
            url,
            name: file.name,
            type: file.type,
            size: file.size
          })
        }
      }

      // Send message with attachments
      socketService.sendMessage({
        conversationId: selectedConversation.id,
        content,
        type: attachments?.length ? 'file' : 'text',
        attachments: uploadedAttachments
      })
    } catch (error) {
      console.error("MessagesPage - Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    }
  }

  const handleStartChat = async (doctor: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctor.id
        })
      })
      if (!response.ok) throw new Error('Failed to create conversation')
      
      const conversation = await response.json()
      setConversations(prev => [conversation, ...prev])
      setSelectedConversation(conversation)
      setShowDoctorList(false)
      setSelectedDoctor(null)

      // Join the conversation room
      socketService.joinRoom(conversation.id)
    } catch (error) {
      console.error("MessagesPage - Error creating conversation:", error)
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      })
    }
  }

  const handleTyping = (isTyping: boolean) => {
    if (socket && selectedConversation) {
      socketService.sendTyping({
        conversationId: selectedConversation.id,
        isTyping
      })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Conversations or Doctor List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          {user?.role === 'patient' && (
            <button
              onClick={() => setShowDoctorList(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Start Chat
            </button>
          )}
        </div>
        
        {showDoctorList && user?.role === 'patient' ? (
          <DoctorList
            doctors={doctors}
            selectedId={selectedDoctor?.id}
            onSelect={setSelectedDoctor}
            onSearch={(query) => {
              // Filter doctors locally
              const filtered = doctors.filter(doctor => 
                doctor.first_name.toLowerCase().includes(query.toLowerCase()) ||
                doctor.last_name.toLowerCase().includes(query.toLowerCase()) ||
                doctor.doctor_profile.specialty.toLowerCase().includes(query.toLowerCase())
              )
              setDoctors(filtered)
            }}
          />
        ) : (
          <div className="flex-1 overflow-auto">
            {conversations.map(conversation => {
              const otherParticipant = conversation.participants.find(
                p => p.userId !== user?.id
              )
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 hover:bg-accent transition-colors",
                    selectedConversation?.id === conversation.id && "bg-accent"
                  )}
                >
                  <Avatar className="h-10 w-10">
                    {otherParticipant?.image && (
                      <AvatarImage 
                        src={otherParticipant.image}
                        alt={otherParticipant.name}
                      />
                    )}
                    <AvatarFallback>
                      {otherParticipant?.name.split(' ')
                        .map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="font-medium truncate">
                        {user?.role === 'patient' ? 'Dr. ' : ''}
                        {otherParticipant?.name}
                      </span>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {conversation.unreadCounts.get(user?.id) > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {conversation.unreadCounts.get(user?.id)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        {selectedConversation ? (
          <ChatWindow
            currentUser={{
              id: user?.id!,
              role: user?.role as 'patient' | 'doctor'
            }}
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            isTyping={isTyping}
          />
        ) : selectedDoctor ? (
          <div className="flex-1 p-4">
            <DoctorProfile
              doctor={selectedDoctor}
              onStartChat={handleStartChat}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-medium text-lg">Welcome to Messages</h3>
              <p className="text-muted-foreground">
                {user?.role === 'patient'
                  ? "Select a doctor to start a conversation"
                  : "Select a conversation to start chatting"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
