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
      <div className="p-6 md:p-8 mx-auto max-w-screen-2xl w-full">  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto"
        >
          <SupportHeader />

          <div className=" md:grid md:grid-cols-3 gap-8 mt-8 justify-center">
            <div className="md:col-span-2 space-y-8">
              <div className="mx-auto w-full max-w-2xl"><SupportAssistant /></div>
              <div className="mx-auto w-full max-w-2xl"><SupportTicket /></div>
              <div className="mx-auto w-full max-w-2xl">
  <iframe
    src="https://docs.google.com/forms/d/e/1FAIpQLSdAxTrxFJD1wkqcgbEUXTJbai1Nv2jfQn2Jnl8gDMM9QPccWw/viewform?embedded=true"
    width="100%"
    height="1663"
    frameBorder="0"
    marginHeight={0}
    marginWidth={0}
    title="Eczema Diagnosis and Advisory System Support Form"
  >
    Loading…
  </iframe>
</div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

