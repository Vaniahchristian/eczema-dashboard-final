"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, CheckCircle, Clock, Filter } from "lucide-react"
import type { Conversation } from "./messages-page"

interface ConversationsListProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  onSearch: (query: string) => void
  searchQuery: string
}

export default function ConversationsList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSearch,
  searchQuery,
}: ConversationsListProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "doctors" | "support">("all")

  // Apply filters
  const filteredConversations = conversations.filter((conv) => {
    if (filter === "unread") return conv.unreadCount > 0
    if (filter === "doctors")
      return conv.participantRole.includes("Dermatologist") || conv.participantRole.includes("Allergist")
    if (filter === "support") return conv.participantRole.includes("Support") || conv.participantRole.includes("Nurse")
    return true
  })

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      // Yesterday
      return "Yesterday"
    } else if (diffInDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
          Messages
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Communicate with your healthcare team</p>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              filter === "all"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              filter === "unread"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("doctors")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              filter === "doctors"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setFilter("support")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              filter === "support"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Support
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap">
            <Filter className="h-3 w-3 inline-block mr-1" />
            More Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? "bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start">
                  <div className="relative">
                    <img
                      src={conversation.participantImage || "/placeholder.svg"}
                      alt={conversation.participantName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    {conversation.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3
                        className={`font-medium truncate ${
                          conversation.unreadCount > 0
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {conversation.participantName}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 whitespace-nowrap">
                        {formatTimestamp(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{conversation.participantRole}</p>
                    <div className="mt-1 flex items-center">
                      {conversation.lastMessage.senderId === "user-001" ? (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center mr-1">You:</span>
                      ) : null}
                      <p
                        className={`text-sm truncate ${
                          conversation.unreadCount > 0
                            ? "font-medium text-slate-900 dark:text-white"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-sky-500 text-white text-xs font-medium">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center ml-14">
                  {conversation.lastMessage.status === "read" ? (
                    <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 text-slate-400 mr-1" />
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {conversation.lastMessage.status === "read" ? "Read" : "Delivered"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="bg-slate-100 dark:bg-slate-800 h-16 w-16 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-4 font-medium text-slate-700 dark:text-slate-300">No conversations found</h3>
            <p className="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Try adjusting your filters or start a new conversation"}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </button>
      </div>
    </>
  )
}

