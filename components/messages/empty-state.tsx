"use client"

import { motion } from "framer-motion"
import { MessageSquare, Users, ImageIcon, FileText, Mic } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center"
      >
        <div className="bg-gradient-to-r from-sky-500 to-teal-500 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your Messages</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Communicate directly with your healthcare providers. Select a conversation to start messaging.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <Users className="h-6 w-6 text-sky-500 mb-2" />
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">Healthcare Team</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Message your doctors, nurses, and support staff
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <FileText className="h-6 w-6 text-teal-500 mb-2" />
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">Medical Records</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Share and receive medical documents securely</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <ImageIcon className="h-6 w-6 text-indigo-500 mb-2" />
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">Image Sharing</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Send photos of your condition for remote assessment
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <Mic className="h-6 w-6 text-purple-500 mb-2" />
            <h3 className="font-medium text-slate-900 dark:text-white mb-1">Voice Messages</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Send voice notes when typing isn't convenient</p>
          </div>
        </div>

        <button className="py-2 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm hover:shadow-md transition-all">
          Start New Conversation
        </button>
      </motion.div>
    </div>
  )
}

