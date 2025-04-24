"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../lib/auth";
import { io as socketIOClient, type Socket as IOSocket } from "socket.io-client";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationAsRead,
  setTypingStatus,
} from "../../../services/chatService";
import PatientInfoCard from "../../../components/patient/PatientInfoCard";
import DoctorDashboard from "@/components/doctor/doctor-dashboard";
import DoctorLayout from "@/components/layout/doctor-layout";
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function DoctorMessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const socketRef = useRef<IOSocket | null>(null);

  // Helper to get patient info from conversation object
  const getPatientName = (conv: any) =>
    conv.participantRole === 'patient' ? conv.participantName : conv.patientName;
  const getPatientImage = (conv: any) =>
    conv.participantRole === 'patient' ? conv.participantImage : conv.patientImage;

  // Helper for tick status (for all messages)
  function getMessageTickStatus(msg: any, conversation: any) {
    const participantIds = (conversation?.participants || []).map((p: any) => p.userId);
    const readByIds = (msg.readBy || []).map((r: any) => r.userId);
    if (participantIds.length === 0) return 'unread';
    if (participantIds.every((id: string) => readByIds.includes(id))) {
      return 'read'; // double blue
    }
    return 'unread'; // double grey
  }

  // --- Typing Status State ---
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Connect to socket and register user
  useEffect(() => {
    if (!user) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = socketIOClient(SOCKET_URL, {
      path: "/socket.io",
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('register', user.id);
    });
    socket.on('disconnect', () => {});
    return () => { socket.disconnect(); };
  }, [user]);

  // Fetch conversations on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchConversations()
      .then((data) => setConversations(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;
    setLoading(true);
    fetchMessages(selectedConversation)
      .then((data) => setMessages(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedConversation]);

  // Mark as Read when opening conversation
  useEffect(() => {
    if (!selectedConversation) return;
    console.log('[Doctor] Mark conversation as read:', selectedConversation);
    markConversationAsRead(selectedConversation);
  }, [selectedConversation]);

  // Send message
  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    setLoading(true);
    try {
      const msg = await sendMessage(selectedConversation, messageInput);
      setMessages((prev) => [...prev, msg]);
      setMessageInput("");
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? { ...conv, lastMessage: msg }
            : conv
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send typing status to backend
  const sendTypingStatus = (isTyping: boolean) => {
    if (!selectedConversation) return;
    console.log(`[Doctor] Set typing status for ${selectedConversation}:`, isTyping);
    setTypingStatus(selectedConversation, isTyping);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    console.log('[Doctor] User is typing in conversation:', selectedConversation);
    sendTypingStatus(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      console.log('[Doctor] User stopped typing in conversation:', selectedConversation);
      sendTypingStatus(false);
    }, 1500);
  };

  // Listen for WebSocket events
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    const handleTyping = ({ conversationId, userId, isTyping }: any) => {
      if (conversationId !== selectedConversation) return;
      console.log(`[Doctor] Typing event from user ${userId} in conversation ${conversationId}:`, isTyping);
      setTypingUsers(prev => ({ ...prev, [userId]: isTyping }));
    };

    socket.on('conversation:typing', handleTyping);
    return () => {
      socket.off('conversation:typing', handleTyping);
    };
  }, [selectedConversation, socketRef.current]);

  // Filter conversations by patient name (use correct field)
  const filteredConversations = conversations.filter((conv) =>
    getPatientName(conv)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-slate-900">
        {/* Conversations List */}
        <ScrollArea className="flex-none w-80 border-r border-gray-200 dark:border-gray-800">
          <div className="p-4">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            {filteredConversations.map((conv) => (
              <Card
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`mb-2 cursor-pointer transition-all ${
                  selectedConversation === conv.id
                    ? "border-emerald-500 shadow-md"
                    : "hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                      {getPatientName(conv).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{getPatientName(conv)}</h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {(() => {
                              const dateString = conv.lastMessage.timestamp || conv.lastMessage.createdAt;
                              const date = dateString ? new Date(dateString) : null;
                              return date && !isNaN(date.getTime())
                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '';
                            })()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Patient Info Header */}
              <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                    {getPatientName(filteredConversations.find(c => c.id === selectedConversation))?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{getPatientName(filteredConversations.find(c => c.id === selectedConversation))}</h2>
                    <p className="text-sm text-emerald-600">Patient</p>
                  </div>
                </div>
                <PatientInfoCard patient={filteredConversations.find(c => c.id === selectedConversation)} />
              </div>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {Object.entries(typingUsers).map(([uid, isTyping]) =>
                  isTyping && uid !== user.id ? (
                    <div key={uid} className="text-xs text-gray-500 italic mb-2">
                      User {uid} is typing...
                    </div>
                  ) : null
                )}
                {messages.map((msg, idx) => {
                  const isOwn = msg.senderId === user.id;
                  const tickStatus = getMessageTickStatus(msg, filteredConversations.find(c => c.id === selectedConversation));
                  return (
                    <div key={idx} className={`mb-4 flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isOwn && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                          {msg.senderName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-2 max-w-md ${
                        isOwn 
                          ? 'bg-emerald-500 text-white ml-2 shadow-lg' 
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-2 shadow-md'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                        <div className="flex items-center justify-end mt-1 text-xs opacity-70">
                          {(() => {
                            const dateString = msg.timestamp || msg.createdAt;
                            const date = dateString ? new Date(dateString) : null;
                            return date && !isNaN(date.getTime())
                              ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : '';
                          })()}
                          {tickStatus === 'unread' && <FaCheckDouble className="text-gray-400 ml-1" />}
                          {tickStatus === 'read' && <FaCheckDouble className="text-blue-500 ml-1" />}
                        </div>
                      </div>
                      {isOwn && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                          {msg.senderName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </ScrollArea>
              {/* Typing pad */}
              <form
                className="flex items-center p-4 border-t border-gray-200 dark:border-gray-800"
                onSubmit={e => { e.preventDefault(); handleSend(); }}
              >
                <Input
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a patient conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
