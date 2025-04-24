"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../lib/auth";
import { io as socketIOClient, type Socket as IOSocket } from "socket.io-client";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  createConversation,
  markConversationAsRead,
  setTypingStatus,
} from "../../services/chatService";
import { doctorService } from "../../services/doctorService";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { FaCheckDouble } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

// Extensive logging helper
function log(...args: any[]) {
  console.log('[MessagesPage]', ...args);
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// Avatar fallback component (aligned with DoctorMessagesPage design)
function Avatar({ src, alt, name }: { src?: string | null; alt?: string; name?: string }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
      {initials}
    </div>
  );
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorResults, setDoctorResults] = useState<any[]>([]);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const socketRef = useRef<IOSocket | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Socket connection logic (unchanged)
  useEffect(() => {
    if (!user) return;
    log("Connecting to socket...");
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = socketIOClient(SOCKET_URL, {
      path: "/socket.io",
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      log('Socket connected', socket.id);
      socket.emit('register', user.id);
    });
    socket.on('disconnect', () => log('Socket disconnected'));
    return () => {
      socket.disconnect();
      log('Socket cleanup');
    };
  }, [user]);

  // Fetch conversations (unchanged)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchConversations()
      .then(setConversations)
      .catch((err) => {
        log('Error fetching conversations:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch messages (unchanged)
  useEffect(() => {
    if (!selectedConversation) return;
    setLoading(true);
    fetchMessages(selectedConversation)
      .then(setMessages)
      .catch((err) => {
        log('Error fetching messages:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedConversation]);

  // Doctor search (unchanged)
  useEffect(() => {
    if (!showNewChat || doctorSearch.length === 0) {
      setDoctorResults([]);
      return;
    }
    setDoctorLoading(true);
    doctorService.getDoctors(doctorSearch)
      .then(setDoctorResults)
      .catch(() => setDoctorResults([]))
      .finally(() => setDoctorLoading(false));
  }, [doctorSearch, showNewChat]);

  useEffect(() => {
    if (showNewChat && !doctorSearch) {
      setDoctorLoading(true);
      doctorService.getDoctors().then(res => {
        setDoctorResults(res);
        setDoctorLoading(false);
      }).catch(() => setDoctorLoading(false));
    }
  }, [showNewChat]);

  // Mark as read (unchanged)
  useEffect(() => {
    if (!selectedConversation) return;
    console.log('[Patient] Mark conversation as read:', selectedConversation);
    markConversationAsRead(selectedConversation);
  }, [selectedConversation]);

  // Typing status (unchanged)
  const sendTypingStatus = (isTyping: boolean) => {
    if (!selectedConversation) return;
    console.log(`[Patient] Set typing status for ${selectedConversation}:`, isTyping);
    setTypingStatus(selectedConversation, isTyping);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    console.log('[Patient] User is typing in conversation:', selectedConversation);
    sendTypingStatus(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      console.log('[Patient] User stopped typing in conversation:', selectedConversation);
      sendTypingStatus(false);
    }, 1500);
  };

  // Send message (unchanged)
  const handleSend = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
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
      log('Message sent:', msg);
    } catch (err: any) {
      log('Error sending message:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Socket message listener (unchanged)
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
    const handleNewMessage = (msg: any) => {
      log('Received message:new', msg);
      if (msg.conversationId === selectedConversation) {
        setMessages((prev) => [...prev, msg]);
      }
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === msg.conversationId
            ? { ...conv, lastMessage: msg }
            : conv
        )
      );
    };
    socket.on('message:new', handleNewMessage);
    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [selectedConversation]);

  // Typing listener (unchanged)
  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
    const handleTyping = ({ conversationId, userId, isTyping }: any) => {
      if (conversationId !== selectedConversation) return;
      console.log(`[Patient] Typing event from user ${userId} in conversation ${conversationId}:`, isTyping);
      setTypingUsers(prev => ({ ...prev, [userId]: isTyping }));
    };
    socket.on('conversation:typing', handleTyping);
    return () => {
      socket.off('conversation:typing', handleTyping);
    };
  }, [selectedConversation, socketRef.current]);

  const handleStartChat = async (doctor: any) => {
    setShowNewChat(false);
    setLoading(true);
    try {
      const conversation = await createConversation(doctor.id);
      const enriched = {
        ...conversation,
        participantName: doctor.name,
        participantImage: doctor.imageUrl,
      };
      setConversations((prev) => [enriched, ...prev.filter(c => c.id !== conversation.id)]);
      setSelectedConversation(conversation.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tick status helper (unchanged)
  function getMessageTickStatus(msg: any, conversation: any) {
    const participantIds = (conversation?.participants || []).map((p: any) => p.userId);
    const readByIds = (msg.readBy || []).map((r: any) => r.userId);
    if (participantIds.length === 0) return 'unread';
    if (participantIds.every((id: string) => readByIds.includes(id))) {
      return 'read';
    }
    return 'unread';
  }

  const selectedConversationObj = conversations.find(conv => conv.id === selectedConversation);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-slate-900">
        {/* Conversations List */}
        <ScrollArea className="flex-none w-80 border-r border-gray-200 dark:border-gray-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Chats</h2>
              <Button
                onClick={() => setShowNewChat(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
              >
                New Chat
              </Button>
            </div>
            {conversations.map(conv => (
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
                    <Avatar src={conv.participantImage} name={conv.participantName} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conv.participantName}</h3>
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
                      {conv.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {conv.unreadCount}
                        </span>
                      )}
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
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedConversationObj?.participantImage} name={selectedConversationObj?.participantName} />
                  <div>
                    <h2 className="font-semibold text-lg">{selectedConversationObj?.participantName}</h2>
                    <p className="text-sm text-emerald-600">{selectedConversationObj?.isOnline ? 'Online' : ''}</p>
                  </div>
                </div>
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
                  const tickStatus = getMessageTickStatus(msg, selectedConversationObj);
                  return (
                    <div key={idx} className={`mb-4 flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isOwn && <Avatar src={msg.senderImage} name={msg.senderName} />}
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
                      {isOwn && <Avatar src={msg.senderImage} name={msg.senderName} />}
                    </div>
                  );
                })}
              </ScrollArea>
              {/* Input */}
              <form
                className="flex items-center p-4 border-t border-gray-200 dark:border-gray-800"
                onSubmit={handleSend}
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
              Select a conversation to start messaging
            </div>
          )}
        </div>

        {/* New Chat Modal */}
        {showNewChat && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <Card className="bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
              <CardContent className="p-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Start New Chat</h3>
                  <Button
                    onClick={() => setShowNewChat(false)}
                    className="text-gray-500 hover:text-gray-900 bg-transparent hover:bg-transparent p-0"
                  >
                    ✕
                  </Button>
                </div>
                <Input
                  type="text"
                  value={doctorSearch}
                  onChange={e => setDoctorSearch(e.target.value)}
                  placeholder="Search doctors by name or email"
                  className="mb-4"
                />
                {doctorLoading ? (
                  <div className="text-gray-500">Searching...</div>
                ) : (
                  <ScrollArea className="max-h-60">
                    {doctorResults.map(doc => (
                      <div key={doc.id} className="py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                        <span>{doc.name} <span className="text-xs text-gray-400">({doc.email})</span></span>
                        <Button
                          onClick={() => handleStartChat(doc)}
                          className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                        >
                          Start Chat
                        </Button>
                      </div>
                    ))}
                    {doctorResults.length === 0 && doctorSearch && (
                      <div className="text-gray-500 py-2">No doctors found.</div>
                    )}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}