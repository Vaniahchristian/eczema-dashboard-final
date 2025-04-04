"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SummarySection from "@/components/dashboard/summary-section"
import UploadSection from "@/components/dashboard/upload-section"
import AnalyticsSection from "@/components/dashboard/analytics-section"
import AppointmentWidget from "@/components/dashboard/appointment-widget"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If no user after a short delay, redirect to login
    const timer = setTimeout(() => {
      if (!user) {
        router.replace("/login")
      }
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [user, router])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return null // This will be handled by the useEffect redirect
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-6 rounded-2xl shadow-sm mb-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
              Welcome back, {user.firstName || "User"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Here's an overview of your eczema management journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SummarySection />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <UploadSection setIsLoading={setIsLoading} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <AnalyticsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <AppointmentWidget />
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
