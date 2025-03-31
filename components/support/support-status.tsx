"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock } from "lucide-react"

export default function SupportStatus() {
  // In a real app, these would be fetched from an API
  const statusItems = [
    {
      name: "Support Team",
      status: "operational",
      message: "Available 24/7",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      name: "Live Chat",
      status: "operational",
      message: "Average wait time: 2 minutes",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      name: "Email Support",
      status: "operational",
      message: "Response within 4 hours",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
    {
      name: "Phone Support",
      status: "degraded",
      message: "Higher than normal wait times",
      icon: <Clock className="h-4 w-4 text-amber-500" />,
    },
    {
      name: "Community Forum",
      status: "operational",
      message: "Fully operational",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12"
    >
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium mb-4">Support System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 rounded-lg bg-card">
              <div className="mb-2">{item.icon}</div>
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

