"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../lib/auth";
import { io as socketIOClient, type Socket as IOSocket } from "socket.io-client";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  createConversation,
} from "../../services/chatService";
import { doctorService } from "../../services/doctorService";
import DashboardLayout from "@/components/layout/dashboard-layout";

// Extensive logging helper
function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log('[MessagesPage]', ...args);
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

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

  const handleSend = async () => {
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

  return (
    <DashboardLayout>
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-slate-900">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
          <button
            className="ml-2 px-3 py-1 rounded bg-sky-500 text-white hover:bg-sky-600"
            onClick={() => setShowNewChat(true)}
          >
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="p-4 text-gray-500">Loading conversations...</div>}
          {error && <div className="p-4 text-red-500">{error}</div>}
          <div className="space-y-1 p-2">
            {conversations.map((conv, idx) => (
              <button
                key={conv.id || idx}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-3 rounded-lg transition-colors ${
                  conv.id === selectedConversation
                    ? 'bg-sky-50 dark:bg-sky-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {conv.participantImage ? (
                    <img
                      src={conv.participantImage}
                      alt={conv.participantName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                      <span className="text-sky-600 dark:text-sky-400 font-medium">
                        {conv.participantName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conv.participantName}
                      </p>
                      {conv.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.content || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              {conversations.find(c => c.id === selectedConversation)?.participantName && (
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {conversations.find(c => c.id === selectedConversation)?.participantName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    ({conversations.find(c => c.id === selectedConversation)?.participantRole})
                  </span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[75%]">
                    {msg.senderId !== user?.id && (
                      <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-sky-600 dark:text-sky-400 text-sm font-medium">
                          {msg.senderName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`relative px-4 py-2 rounded-2xl ${
                        msg.senderId === user?.id
                          ? 'bg-emerald-500 text-white ml-2'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-2'
                      } ${
                        msg.senderId === user?.id
                          ? 'rounded-tr-none'
                          : 'rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <div
                        className={`text-[11px] mt-1 ${
                          msg.senderId === user?.id
                            ? 'text-emerald-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      {/* Message tail */}
                      <div
                        className={`absolute top-0 w-2 h-4 ${
                          msg.senderId === user?.id
                            ? 'right-0 bg-emerald-500'
                            : 'left-0 bg-white dark:bg-gray-800'
                        }`}
                        style={{
                          [msg.senderId === user?.id ? 'right' : 'left']: '-8px',
                          clipPath: msg.senderId === user?.id
                            ? 'polygon(100% 0, 0 0, 100% 100%)'
                            : 'polygon(0 0, 100% 0, 0 100%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !messageInput.trim()}
                  className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
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
