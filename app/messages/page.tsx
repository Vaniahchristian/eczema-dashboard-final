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

// Extensive logging helper
function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[MessagesPage]', ...args);
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

// Avatar fallback component
function Avatar({ src, alt, name }: { src?: string | null; alt?: string; name?: string }) {
  if (src) {
    return <img src={src} alt={alt || name || ''} className="w-10 h-10 rounded-full object-cover bg-gray-200" />;
  }
  // Fallback: initials
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg font-bold">
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

  // --- Typing Status State ---
  const [typingUsers, setTypingUsers] = useState<{ [userId: string]: boolean }>({});
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Connect to socket and register user
  useEffect(() => {
    if (!user) return;
    log("Connecting to socket...");
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = socketIOClient(SOCKET_URL, {
      path: "/socket.io",
      auth: { token },
      // @ts-ignore: withCredentials is not in the types but is supported by socket.io
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

  // Fetch conversations on mount
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

  // Fetch messages when conversation changes
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

  // Doctor search effect
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

  // When opening the New Chat modal, fetch all doctors if not searching
  useEffect(() => {
    if (showNewChat && !doctorSearch) {
      setDoctorLoading(true);
      doctorService.getDoctors().then(res => {
        setDoctorResults(res);
        setDoctorLoading(false);
      }).catch(() => setDoctorLoading(false));
    }
    // eslint-disable-next-line
  }, [showNewChat]);

  // --- Mark as Read when opening conversation ---
  useEffect(() => {
    if (!selectedConversation) return;
    console.log('[Patient] Mark conversation as read:', selectedConversation);
    markConversationAsRead(selectedConversation);
  }, [selectedConversation]);

  // --- Typing Status: send to backend ---
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

  // --- Send message handler ---
  const handleSend = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); // Prevent page reload on form submit
    if (!messageInput.trim() || !selectedConversation) return;
    setLoading(true);
    try {
      const msg = await sendMessage(selectedConversation, messageInput);
      setMessages((prev) => [...prev, msg]);
      setMessageInput("");
      // Update lastMessage for the conversation in the sidebar
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

  // Update lastMessage when receiving a new message via socket
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

  // --- Listen for WebSocket events ---
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
      // Enrich the conversation object for sidebar display
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

  const selectedConversationObj = conversations.find(conv => conv.id === selectedConversation);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-slate-900">
        {/* Sidebar (Conversation List) */}
        <aside className="w-80 bg-white border-r flex flex-col">
          <div className="flex items-center justify-between p-4 font-bold text-lg border-b">
            <span>Chats</span>
            <button
              className="ml-2 px-3 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-medium shadow"
              onClick={() => setShowNewChat(true)}
            >
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div key={conv.id} className={`flex items-center px-4 py-3 cursor-pointer transition hover:bg-gray-50 ${conv.id === selectedConversation ? 'bg-emerald-50' : ''}`}
                onClick={() => setSelectedConversation(conv.id)}>
                <Avatar src={conv.participantImage} name={conv.participantName} />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{conv.participantName}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{conv.lastMessage?.content || ''}</div>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{conv.unreadCount}</span>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b bg-white">
            <Avatar src={selectedConversationObj?.participantImage} name={selectedConversationObj?.participantName} />
            <div className="ml-4">
              <div className="font-bold text-lg text-gray-900 dark:text-white">{selectedConversationObj?.participantName}</div>
              <div className="text-xs text-emerald-500">{selectedConversationObj?.isOnline ? 'Online' : ''}</div>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {/* Date separator (group messages by date) */}
            {messages.length > 0 && (
              <div className="flex justify-center text-xs text-gray-400 my-2">
                {(() => {
                  const firstMsg = messages[0];
                  const dateString = firstMsg.timestamp || firstMsg.createdAt;
                  const date = dateString ? new Date(dateString) : null;
                  return date && !isNaN(date.getTime())
                    ? date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
                    : '';
                })()}
              </div>
            )}
            {messages.map((msg, idx) => {
              const tickStatus = getMessageTickStatus(msg, conversations.find(c => c.id === selectedConversation));
              const isOwn = msg.senderId === user.id;
              return (
                <div key={idx} className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  {!isOwn && <Avatar src={msg.senderImage} name={msg.senderName} />}
                  <div className={`rounded-2xl px-4 py-2 max-w-md shadow ${isOwn ? 'bg-emerald-500 text-white ml-2' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-2'}`}>
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
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                <span className="text-2xl">No messages yet</span>
              </div>
            )}
          </div>
          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t flex items-center gap-2">
            <input
              className="flex-1 rounded-full border px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              placeholder="Type a message..."
              value={messageInput}
              onChange={handleInputChange}
              onFocus={() => console.log('input focus')}
              onBlur={() => console.log('input blur')}
            />
            <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-emerald-600 transition">Send</button>
          </form>
        </section>
        {showNewChat && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Start New Chat</h3>
                <button onClick={() => setShowNewChat(false)} className="text-gray-500 hover:text-gray-900">✕</button>
              </div>
              <input
                type="text"
                value={doctorSearch}
                onChange={e => setDoctorSearch(e.target.value)}
                placeholder="Search doctors by name or email"
                className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring"
              />
              {doctorLoading ? (
                <div className="text-gray-500">Searching...</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {doctorResults.map(doc => (
                    <li key={doc.id} className="py-2 flex items-center justify-between">
                      <span>{doc.name} <span className="text-xs text-gray-400">({doc.email})</span></span>
                      <button
                        className="ml-2 px-3 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                        onClick={() => handleStartChat(doc)}
                      >
                        Start Chat
                      </button>
                    </li>
                  ))}
                  {doctorResults.length === 0 && doctorSearch && (
                    <li className="text-gray-500 py-2">No doctors found.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

    </DashboardLayout>
  );
}
