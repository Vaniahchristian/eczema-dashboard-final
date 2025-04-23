"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../lib/auth";
import { io as socketIOClient, type Socket as IOSocket } from "socket.io-client";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
} from "../../../services/chatService";
import PatientInfoCard from "../../../components/patient/PatientInfoCard";
import DoctorDashboard from "@/components/doctor/doctor-dashboard";
import DoctorLayout from "@/components/layout/doctor-layout";

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

  // Filter conversations by patient name (use correct field)
  const filteredConversations = conversations.filter((conv) =>
    getPatientName(conv)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DoctorLayout>
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
        </div>
        <div className="p-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <div className="p-4 text-gray-500">Loading conversations...</div>}
          {error && <div className="p-4 text-red-500">{error}</div>}
          <div className="space-y-1 p-2">
            {filteredConversations.map((conv, idx) => (
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
                  {getPatientImage(conv) ? (
                    <img
                      src={getPatientImage(conv)}
                      alt={getPatientName(conv)}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                      <span className="text-sky-600 dark:text-sky-400 font-medium">
                        {getPatientName(conv)?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getPatientName(conv)} <span className="text-xs text-gray-400">(patient)</span>
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
            {/* Patient Info Card (optional, can be enhanced) */}
            <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center">
              <PatientInfoCard patient={filteredConversations.find(c => c.id === selectedConversation)} />
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.senderId === user.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'}`}>
                    {msg.content}
                    <div className="text-xs text-right mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Typing pad */}
            <form
              className="flex items-center p-4 border-t border-gray-200 dark:border-gray-800"
              onSubmit={e => { e.preventDefault(); handleSend(); }}
            >
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded border focus:outline-none focus:ring"
              />
              <button type="submit" className="ml-2 px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600">
                Send
              </button>
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
