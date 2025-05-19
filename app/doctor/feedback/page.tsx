"use client"
import { motion } from "framer-motion"
import DoctorLayout from "@/components/layout/doctor-layout"
import SupportHeader from "@/components/support/support-header"

export default function DoctorFeedback() {
  return (
    <DoctorLayout>
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-3xl">
            <SupportHeader />
          </div>

          <div className="w-full max-w-3xl mt-8">
            <div className="dark:bg-slate-800 rounded-lg overflow-hidden">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdAxTrxFJD1wkqcgbEUXTJbai1Nv2jfQn2Jnl8gDMM9QPccWw/viewform?embedded=true"
                className="w-full min-h-[800px] md:min-h-[1000px] lg:min-h-[1200px]"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Eczema Diagnosis and Advisory System Feedback Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </DoctorLayout>
  )
}
