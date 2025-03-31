"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ConversationsList from "@/components/messages/conversations-list"
import MessageThread from "@/components/messages/message-thread"
import DoctorProfile from "@/components/messages/doctor-profile"
import EmptyState from "@/components/messages/empty-state"
import { useIsMobile } from "@/hooks/use-mobile"

export type MessageStatus = "sent" | "delivered" | "read"
export type MessageType = "text" | "image" | "file" | "voice" | "ai-suggestion"

export type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  status: MessageStatus
  type: MessageType
  attachments?: {
    url: string
    type: string
    name: string
    size?: number
  }[]
  reaction?: string
  isAiSuggestion?: boolean
}

export type Conversation = {
  id: string
  participantId: string
  participantName: string
  participantImage: string
  participantRole: string
  lastMessage: {
    content: string
    timestamp: string
    senderId: string
    status: MessageStatus
  }
  unreadCount: number
  isOnline: boolean
  lastActive?: string
}

export default function MessagesPage() {
  const isMobile = useIsMobile()
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(!isMobile)
  const [searchQuery, setSearchQuery] = useState("")
  const currentUserId = "user-001" // This would come from auth context in a real app

  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: "conv-001",
      participantId: "doc-001",
      participantName: "Dr. Emily Chen",
      participantImage: "/placeholder.svg?height=200&width=200",
      participantRole: "Dermatologist",
      lastMessage: {
        content: "Your latest test results look good. The treatment is working well.",
        timestamp: "2023-06-08T14:30:00",
        senderId: "doc-001",
        status: "read",
      },
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "conv-002",
      participantId: "doc-002",
      participantName: "Dr. Michael Johnson",
      participantImage: "/placeholder.svg?height=200&width=200",
      participantRole: "Allergist",
      lastMessage: {
        content: "Please send me photos of any new reactions you notice.",
        timestamp: "2023-06-07T10:15:00",
        senderId: "doc-002",
        status: "read",
      },
      unreadCount: 0,
      isOnline: false,
      lastActive: "2 hours ago",
    },
    {
      id: "conv-003",
      participantId: "nurse-001",
      participantName: "Nurse Jessica Taylor",
      participantImage: "/placeholder.svg?height=200&width=200",
      participantRole: "Dermatology Nurse",
      lastMessage: {
        content: "I've scheduled your prescription refill. You can pick it up tomorrow.",
        timestamp: "2023-06-05T16:45:00",
        senderId: "nurse-001",
        status: "read",
      },
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "conv-004",
      participantId: "support-001",
      participantName: "Patient Support",
      participantImage: "/placeholder.svg?height=200&width=200",
      participantRole: "Support Team",
      lastMessage: {
        content: "Is there anything else you need help with regarding your treatment plan?",
        timestamp: "2023-06-02T09:20:00",
        senderId: "support-001",
        status: "delivered",
      },
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "conv-005",
      participantId: "doc-003",
      participantName: "Dr. Sarah Williams",
      participantImage: "/placeholder.svg?height=200&width=200",
      participantRole: "Dermatologist",
      lastMessage: {
        content: "I've reviewed your case. Let's discuss treatment options in our next appointment.",
        timestamp: "2023-05-28T11:05:00",
        senderId: "doc-003",
        status: "read",
      },
      unreadCount: 0,
      isOnline: false,
      lastActive: "1 day ago",
    },
  ]

  // Sample messages data
  const messagesData: Record<string, Message[]> = {
    "conv-001": [
      {
        id: "msg-001",
        senderId: "user-001",
        receiverId: "doc-001",
        content: "Hello Dr. Chen, I've been experiencing increased itching on my arms since yesterday.",
        timestamp: "2023-06-08T10:30:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-002",
        senderId: "doc-001",
        receiverId: "user-001",
        content:
          "Hi Sarah, I'm sorry to hear that. Have you changed any products recently or been exposed to any new environments?",
        timestamp: "2023-06-08T10:35:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-003",
        senderId: "user-001",
        receiverId: "doc-001",
        content: "I started using a new laundry detergent last week. Could that be causing it?",
        timestamp: "2023-06-08T10:38:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-004",
        senderId: "doc-001",
        receiverId: "user-001",
        content: "Yes, that could definitely be a trigger. Can you send me a photo of the affected area?",
        timestamp: "2023-06-08T10:42:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-005",
        senderId: "user-001",
        receiverId: "doc-001",
        content: "Here's a photo of my arm from this morning.",
        timestamp: "2023-06-08T10:45:00",
        status: "read",
        type: "image",
        attachments: [
          {
            url: "/placeholder.svg?height=300&width=400",
            type: "image/jpeg",
            name: "arm_rash.jpg",
            size: 1240000,
          },
        ],
      },
      {
        id: "msg-006",
        senderId: "doc-001",
        receiverId: "user-001",
        content:
          "Thank you for sharing. This does look like a reaction to the detergent. I recommend switching back to your previous brand and applying the hydrocortisone cream I prescribed twice daily.",
        timestamp: "2023-06-08T11:00:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-007",
        senderId: "user-001",
        receiverId: "doc-001",
        content: "I'll do that right away. Should I take an antihistamine as well?",
        timestamp: "2023-06-08T11:05:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-008",
        senderId: "doc-001",
        receiverId: "user-001",
        content:
          "Yes, taking an over-the-counter antihistamine like Zyrtec or Claritin would help with the itching. Take it once daily until the symptoms subside.",
        timestamp: "2023-06-08T11:10:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-009",
        senderId: "user-001",
        receiverId: "doc-001",
        content: "Thank you, Dr. Chen. I'll follow your advice and let you know if there's any improvement.",
        timestamp: "2023-06-08T11:15:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-010",
        senderId: "doc-001",
        receiverId: "user-001",
        content: "Your latest test results look good. The treatment is working well.",
        timestamp: "2023-06-08T14:30:00",
        status: "read",
        type: "text",
      },
    ],
    "conv-002": [
      {
        id: "msg-101",
        senderId: "doc-002",
        receiverId: "user-001",
        content:
          "Hello Sarah, I've reviewed your allergy test results. You show sensitivity to certain fragrances and preservatives commonly found in skincare products.",
        timestamp: "2023-06-07T09:30:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-102",
        senderId: "user-001",
        receiverId: "doc-002",
        content: "That's helpful to know. Do you have any recommendations for hypoallergenic products I should use?",
        timestamp: "2023-06-07T09:45:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-103",
        senderId: "doc-002",
        receiverId: "user-001",
        content:
          "I'm attaching a list of recommended products that are free from the allergens you're sensitive to. These should be safer for your skin.",
        timestamp: "2023-06-07T10:00:00",
        status: "read",
        type: "file",
        attachments: [
          {
            url: "#",
            type: "application/pdf",
            name: "recommended_products.pdf",
            size: 2450000,
          },
        ],
      },
      {
        id: "msg-104",
        senderId: "user-001",
        receiverId: "doc-002",
        content: "Thank you for the list. I'll start using these products. Should I avoid any specific foods as well?",
        timestamp: "2023-06-07T10:05:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-105",
        senderId: "doc-002",
        receiverId: "user-001",
        content:
          "Your food allergy tests were negative, so there's no need to avoid any specific foods at this time. However, keep a food diary if you notice any skin reactions after eating certain foods.",
        timestamp: "2023-06-07T10:10:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-106",
        senderId: "doc-002",
        receiverId: "user-001",
        content: "Please send me photos of any new reactions you notice.",
        timestamp: "2023-06-07T10:15:00",
        status: "read",
        type: "text",
      },
    ],
    "conv-003": [
      {
        id: "msg-201",
        senderId: "nurse-001",
        receiverId: "user-001",
        content:
          "Hi Sarah, this is Nurse Jessica. Dr. Chen asked me to follow up on your treatment progress. How are you feeling today?",
        timestamp: "2023-06-05T15:30:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-202",
        senderId: "user-001",
        receiverId: "nurse-001",
        content:
          "Hi Jessica, I'm feeling much better. The itching has decreased significantly since I started the new medication.",
        timestamp: "2023-06-05T15:40:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-203",
        senderId: "nurse-001",
        receiverId: "user-001",
        content: "That's great to hear! Are you experiencing any side effects from the medication?",
        timestamp: "2023-06-05T15:45:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-204",
        senderId: "user-001",
        receiverId: "nurse-001",
        content: "No side effects so far. But I'm running low on my prescription. Can I get a refill?",
        timestamp: "2023-06-05T15:50:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-205",
        senderId: "nurse-001",
        receiverId: "user-001",
        content: "I'll take care of that for you. Which pharmacy do you prefer for pickup?",
        timestamp: "2023-06-05T16:00:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-206",
        senderId: "user-001",
        receiverId: "nurse-001",
        content: "The CVS on Main Street, please. Thank you!",
        timestamp: "2023-06-05T16:10:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-207",
        senderId: "nurse-001",
        receiverId: "user-001",
        content: "I've scheduled your prescription refill. You can pick it up tomorrow.",
        timestamp: "2023-06-05T16:45:00",
        status: "read",
        type: "text",
      },
    ],
    "conv-004": [
      {
        id: "msg-301",
        senderId: "support-001",
        receiverId: "user-001",
        content:
          "Hello Sarah, this is the Patient Support team. We're reaching out to see how you're doing with your eczema management plan.",
        timestamp: "2023-06-02T09:00:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-302",
        senderId: "user-001",
        receiverId: "support-001",
        content:
          "Hi, I'm doing well with the management plan, but I have a question about insurance coverage for my medications.",
        timestamp: "2023-06-02T09:05:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-303",
        senderId: "support-001",
        receiverId: "user-001",
        content: "I'd be happy to help with that. What specific medications are you inquiring about?",
        timestamp: "2023-06-02T09:10:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-304",
        senderId: "user-001",
        receiverId: "support-001",
        content:
          "The tacrolimus ointment. It's quite expensive, and I'm wondering if there are any patient assistance programs available.",
        timestamp: "2023-06-02T09:15:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-305",
        senderId: "support-001",
        receiverId: "user-001",
        content:
          "Yes, there are several programs that can help. I'm sending you information about the manufacturer's patient assistance program and a discount card you can use at the pharmacy.",
        timestamp: "2023-06-02T09:18:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-306",
        senderId: "support-001",
        receiverId: "user-001",
        content: "Is there anything else you need help with regarding your treatment plan?",
        timestamp: "2023-06-02T09:20:00",
        status: "delivered",
        type: "text",
      },
      {
        id: "msg-307",
        senderId: "support-001",
        receiverId: "user-001",
        content:
          "We also have some educational resources about eczema management that you might find helpful. Would you like me to share those with you?",
        timestamp: "2023-06-02T09:25:00",
        status: "delivered",
        type: "text",
      },
    ],
    "conv-005": [
      {
        id: "msg-401",
        senderId: "doc-003",
        receiverId: "user-001",
        content:
          "Hello Sarah, I'm Dr. Williams. Dr. Chen has asked me to consult on your case as I specialize in severe eczema cases.",
        timestamp: "2023-05-28T10:30:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-402",
        senderId: "user-001",
        receiverId: "doc-003",
        content:
          "Hello Dr. Williams, thank you for taking a look at my case. I've been struggling with flare-ups despite following the treatment plan.",
        timestamp: "2023-05-28T10:40:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-403",
        senderId: "doc-003",
        receiverId: "user-001",
        content:
          "I understand how frustrating that can be. I've reviewed your medical history and previous treatments. I think we might need to consider some alternative approaches.",
        timestamp: "2023-05-28T10:50:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-404",
        senderId: "user-001",
        receiverId: "doc-003",
        content: "I'm open to trying new treatments. What do you suggest?",
        timestamp: "2023-05-28T10:55:00",
        status: "read",
        type: "text",
      },
      {
        id: "msg-405",
        senderId: "doc-003",
        receiverId: "user-001",
        content: "I've reviewed your case. Let's discuss treatment options in our next appointment.",
        timestamp: "2023-05-28T11:05:00",
        status: "read",
        type: "text",
      },
    ],
  }

  // Set first conversation as active by default if none is selected
  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0].id)
    }
  }, [activeConversation, conversations])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participantRole.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get the active conversation data
  const currentConversation = conversations.find((conv) => conv.id === activeConversation)
  const messages = activeConversation ? messagesData[activeConversation] || [] : []

  // Handle mobile view - show either conversations list or message thread
  const handleConversationSelect = (convId: string) => {
    setActiveConversation(convId)
    if (isMobile) {
      setShowProfile(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex overflow-hidden"
        >
          {/* Conversations List - Hidden on mobile when viewing a conversation */}
          <div
            className={`${
              isMobile && activeConversation ? "hidden" : "w-full md:w-80 lg:w-96"
            } border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex flex-col`}
          >
            <ConversationsList
              conversations={filteredConversations}
              activeConversationId={activeConversation}
              onSelectConversation={handleConversationSelect}
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
            />
          </div>

          {/* Message Thread - Hidden on mobile when viewing conversations list */}
          <div
            className={`${
              isMobile && !activeConversation ? "hidden" : "flex-1"
            } flex flex-col bg-slate-50 dark:bg-slate-800`}
          >
            {activeConversation && currentConversation ? (
              <MessageThread
                conversation={currentConversation}
                messages={messages}
                currentUserId={currentUserId}
                onBack={() => isMobile && setActiveConversation(null)}
                onToggleProfile={() => setShowProfile(!showProfile)}
                isMobile={isMobile}
              />
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Doctor Profile - Hidden on mobile or when toggled off */}
          {!isMobile && showProfile && activeConversation && currentConversation && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 hidden lg:block">
              <DoctorProfile
                participant={{
                  id: currentConversation.participantId,
                  name: currentConversation.participantName,
                  image: currentConversation.participantImage,
                  role: currentConversation.participantRole,
                  isOnline: currentConversation.isOnline,
                  lastActive: currentConversation.lastActive,
                }}
                onClose={() => setShowProfile(false)}
              />
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

