"use client"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SupportHeader from "@/components/support/support-header"
import SupportChannels from "@/components/support/support-channels"
import SupportAssistant from "@/components/support/support-assistant"
import KnowledgeBase from "@/components/support/knowledge-base"
import SupportTicket from "@/components/support/support-ticket"
import CommunitySupport from "@/components/support/community-support"
import SupportStatus from "@/components/support/support-status"
import FeedbackSection from "@/components/support/feedback-section"

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-2xl mx-auto"
        >
          <SupportHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              <SupportAssistant />
              <SupportChannels />
              <SupportTicket />
              <FeedbackSection />
            </div>

            <div className="space-y-8">
              <KnowledgeBase />
              <CommunitySupport />
              <SupportStatus />
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

