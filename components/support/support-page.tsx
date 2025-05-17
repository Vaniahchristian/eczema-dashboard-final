"use client"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SupportHeader from "@/components/support/support-header"


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

          <div className="max-w-4xl mx-auto mt-8 w-full">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdAxTrxFJD1wkqcgbEUXTJbai1Nv2jfQn2Jnl8gDMM9QPccWw/viewform?embedded=true"
                className="w-full min-h-[800px] md:min-h-[1000px] lg:min-h-[1200px]"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Eczema Diagnosis and Advisory System Support Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

