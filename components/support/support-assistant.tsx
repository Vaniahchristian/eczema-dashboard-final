"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, User, Send, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

// Predefined responses for the AI assistant
const aiResponses: Record<string, string> = {
  default: "I'm here to help with your eczema management questions. Could you provide more details about your concern?",
  greeting: "Hello! I'm your EczemaAI support assistant. How can I help you today with your eczema management?",
  treatment:
    "For treatment questions, I recommend checking our treatment tracker in the app. You can also schedule a consultation with a dermatologist through our appointments page.",
  flare:
    "I'm sorry to hear about your flare-up. Please upload images through our diagnosis tool for a quick assessment. In the meantime, avoid triggers and keep the area moisturized.",
  appointment:
    "You can schedule an appointment through the Appointments tab. Would you like me to guide you through the process?",
  side_effects:
    "If you're experiencing side effects, please contact your healthcare provider immediately. You can use our urgent care feature to connect with a doctor quickly.",
  account:
    "For account-related issues, please go to Settings > Account. If you're having trouble accessing your account, I can help reset your password.",
  technical:
    "I'll help you resolve this technical issue. Could you tell me what device and browser you're using? Also, have you tried refreshing the page or clearing your cache?",
}

// Quick suggestion topics
const quickSuggestions = [
  { id: "flare", label: "Flare-up help", query: "I'm having a flare-up" },
  { id: "treatment", label: "Treatment questions", query: "Questions about my treatment" },
  { id: "appointment", label: "Schedule appointment", query: "How do I schedule an appointment?" },
  { id: "technical", label: "Technical issue", query: "I'm having a technical problem" },
]

export default function SupportAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: aiResponses.greeting,
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("hello") || lowerQuery.includes("hi") || lowerQuery.includes("hey")) {
      return aiResponses.greeting
    } else if (lowerQuery.includes("treatment") || lowerQuery.includes("medication") || lowerQuery.includes("cream")) {
      return aiResponses.treatment
    } else if (lowerQuery.includes("flare") || lowerQuery.includes("worse") || lowerQuery.includes("itchy")) {
      return aiResponses.flare
    } else if (lowerQuery.includes("appointment") || lowerQuery.includes("doctor") || lowerQuery.includes("schedule")) {
      return aiResponses.appointment
    } else if (lowerQuery.includes("side effect") || lowerQuery.includes("reaction")) {
      return aiResponses.side_effects
    } else if (lowerQuery.includes("account") || lowerQuery.includes("login") || lowerQuery.includes("password")) {
      return aiResponses.account
    } else if (lowerQuery.includes("bug") || lowerQuery.includes("error") || lowerQuery.includes("not working")) {
      return aiResponses.technical
    } else {
      return aiResponses.default
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(input),
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickSuggestion = (query: string) => {
    setInput(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const resetConversation = () => {
    setMessages([
      {
        id: "welcome-reset",
        content: aiResponses.greeting,
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">EczemaAI Support Assistant</h2>
            <p className="text-sm text-muted-foreground">Powered by advanced AI to help with your questions</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetConversation}>
          <RefreshCw className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-muted/30 rounded-lg p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-primary ml-2" : "bg-secondary mr-2"}`}
                >
                  {message.sender === "user" ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  )}
                </div>

                <Card className={`${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex mb-4 justify-start"
            >
              <div className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center mr-2">
                  <Bot className="h-4 w-4 text-secondary-foreground" />
                </div>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Quick Questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion) => (
            <Badge
              key={suggestion.id}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => handleQuickSuggestion(suggestion.query)}
            >
              {suggestion.label}
            </Badge>
          ))}
        </div>
      </div>

      <Separator className="mb-4" />

      <div className="flex items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          className="flex-1 mr-2"
        />
        <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

