"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Send,
  Paperclip,
  Mic,
  ImageIcon,
  File,
  Smile,
  MoreVertical,
  UserPlus,
  Phone,
  Video,
  CheckCircle,
  Clock,
  Download,
  Bot,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react"
import type { Conversation, Message } from "./messages-page"

interface MessageThreadProps {
  conversation: Conversation
  messages: Message[]
  currentUserId: string
  onBack: () => void
  onToggleProfile: () => void
  isMobile: boolean
}

export default function MessageThread({
  conversation,
  messages,
  currentUserId,
  onBack,
  onToggleProfile,
  isMobile,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Generate AI suggestions based on conversation context
  useEffect(() => {
    if (messages.length > 0) {
      // In a real app, this would call an AI service
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.senderId !== currentUserId) {
        if (lastMessage.content.includes("photo")) {
          setAiSuggestions([
            "Here's a photo of the affected area",
            "I'll send you an image shortly",
            "Would you like me to take a new photo or send an existing one?",
          ])
        } else if (lastMessage.content.includes("symptoms")) {
          setAiSuggestions([
            "I've been experiencing itching and redness",
            "The symptoms started about 2 days ago",
            "The affected area feels warm to the touch",
          ])
        } else if (lastMessage.content.includes("medication") || lastMessage.content.includes("treatment")) {
          setAiSuggestions([
            "I've been applying the cream twice daily as prescribed",
            "The medication seems to be helping",
            "I'm experiencing some side effects from the medication",
          ])
        } else {
          setAiSuggestions([
            "Thank you for the information",
            "I'll follow your advice",
            "When should I schedule a follow-up appointment?",
          ])
        }
        setShowAiSuggestions(true)
      }
    }
  }, [messages, currentUserId])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // In a real app, this would send the message to an API
    console.log("Sending message:", newMessage)

    // Clear input
    setNewMessage("")
    setShowAiSuggestions(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = () => {
    imageInputRef.current?.click()
  }

  const handleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop recording
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  let currentDate = ""

  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp).toDateString()
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groupedMessages.push({
        date: message.timestamp,
        messages: [message],
      })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message)
    }
  })

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onBack}
              className="mr-2 p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center cursor-pointer" onClick={onToggleProfile}>
            <div className="relative">
              <img
                src={conversation.participantImage || "/placeholder.svg"}
                alt={conversation.participantName}
                className="h-10 w-10 rounded-full object-cover"
              />
              {conversation.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-slate-900 dark:text-white">{conversation.participantName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                {conversation.isOnline ? (
                  <span className="flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1"></span>
                    Online
                  </span>
                ) : (
                  <span>{conversation.lastActive ? `Last active ${conversation.lastActive}` : "Offline"}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <UserPlus className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="flex justify-center">
              <span className="px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                {formatMessageDate(group.date)}
              </span>
            </div>
            {group.messages.map((message, messageIndex) => (
              <div key={message.id}>
                {/* AI Suggestion */}
                {message.isAiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 max-w-md">
                      <div className="flex items-center mb-2">
                        <Bot className="h-4 w-4 text-sky-500 mr-1" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">AI Suggestion</span>
                        <button className="ml-auto p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{message.content}</p>
                      <div className="mt-2 flex justify-between">
                        <button className="text-xs text-sky-600 dark:text-sky-400 hover:underline">
                          Use this response
                        </button>
                        <div className="flex space-x-2">
                          <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Regular Message */}
                {!message.isAiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: messageIndex * 0.05 }}
                    className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col max-w-[75%]">
                      {/* Message Content */}
                      <div
                        className={`rounded-2xl p-4 shadow-sm ${
                          message.senderId === currentUserId
                            ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        }`}
                      >
                        {/* Text Message */}
                        {message.type === "text" && <p className="text-sm whitespace-pre-wrap">{message.content}</p>}

                        {/* Image Message */}
                        {message.type === "image" && message.attachments && (
                          <div className="space-y-2">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="rounded-lg overflow-hidden">
                              <img
                                src={message.attachments[0].url || "/placeholder.svg"}
                                alt="Attachment"
                                className="w-full h-auto max-h-60 object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* File Message */}
                        {message.type === "file" && message.attachments && (
                          <div className="space-y-2">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div
                              className={`rounded-lg p-3 flex items-center ${
                                message.senderId === currentUserId ? "bg-sky-400/20" : "bg-slate-100 dark:bg-slate-600"
                              }`}
                            >
                              <File className="h-8 w-8 mr-3 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{message.attachments[0].name}</p>
                                <p className="text-xs opacity-80">
                                  {message.attachments[0].size &&
                                    `${(message.attachments[0].size / 1024 / 1024).toFixed(2)} MB`}
                                </p>
                              </div>
                              <button
                                className={`p-2 rounded-full ${
                                  message.senderId === currentUserId
                                    ? "hover:bg-sky-400/20 text-white"
                                    : "hover:bg-slate-200 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200"
                                }`}
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Voice Message */}
                        {message.type === "voice" && (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <button
                                className={`p-2 rounded-full ${
                                  message.senderId === currentUserId
                                    ? "bg-white/20 hover:bg-white/30"
                                    : "bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500"
                                }`}
                              >
                                <Mic className="h-4 w-4" />
                              </button>
                              <div className="mx-2 flex-1">
                                <div
                                  className={`h-2 rounded-full ${
                                    message.senderId === currentUserId
                                      ? "bg-white/30"
                                      : "bg-slate-200 dark:bg-slate-500"
                                  }`}
                                >
                                  <div
                                    className={`h-full w-1/2 rounded-full ${
                                      message.senderId === currentUserId ? "bg-white" : "bg-sky-500"
                                    }`}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-xs">0:32</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Info */}
                      <div
                        className={`flex items-center mt-1 text-xs ${
                          message.senderId === currentUserId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatMessageTime(message.timestamp)}
                        </span>
                        {message.senderId === currentUserId && (
                          <span className="ml-2 flex items-center text-slate-500 dark:text-slate-400">
                            {message.status === "read" ? (
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>

                      {/* Reaction */}
                      {message.reaction && (
                        <div
                          className={`flex ${message.senderId === currentUserId ? "justify-start" : "justify-end"} mt-1`}
                        >
                          <div className="bg-white dark:bg-slate-700 rounded-full px-2 py-1 shadow-sm">
                            <span className="text-sm">{message.reaction}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      {showAiSuggestions && (
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-2">
            <Bot className="h-4 w-4 text-sky-500 mr-1" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Suggested responses</span>
            <button
              onClick={() => setShowAiSuggestions(false)}
              className="ml-auto p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewMessage(suggestion)
                  setShowAiSuggestions(false)
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
        {isRecording ? (
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-3"></div>
              <span className="text-slate-700 dark:text-slate-300">
                Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsRecording(false)}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <button onClick={handleSendMessage} className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleFileUpload}
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                onClick={handleImageUpload}
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              {newMessage.trim() === "" ? (
                <button
                  onClick={handleRecording}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <Mic className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  className="p-3 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:shadow-md transition-shadow"
                >
                  <Send className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" />
        <input type="file" ref={imageInputRef} className="hidden" accept="image/*" />
      </div>
    </>
  )
}

