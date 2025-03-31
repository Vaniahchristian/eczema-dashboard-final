"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, User, Image, MessageSquare, Calendar, Clock, ArrowRight } from "lucide-react"

export default function RealTimeActivity() {
  const [activities, setActivities] = useState<
    {
      id: string
      type: "login" | "upload" | "message" | "appointment" | "diagnosis"
      user: string
      action: string
      time: string
    }[]
  >([])

  const [stats, setStats] = useState({
    activeUsers: 0,
    uploadsPerMinute: 0,
    messagesPerMinute: 0,
    appointmentsPerHour: 0,
  })

  // Simulate real-time data updates
  useEffect(() => {
    // Initial data
    setActivities([
      {
        id: "act-001",
        type: "login",
        user: "Sarah J.",
        action: "logged in",
        time: "Just now",
      },
      {
        id: "act-002",
        type: "upload",
        user: "Michael T.",
        action: "uploaded a new image",
        time: "1 min ago",
      },
      {
        id: "act-003",
        type: "message",
        user: "Emily R.",
        action: "sent a message to Dr. Chen",
        time: "2 mins ago",
      },
      {
        id: "act-004",
        type: "appointment",
        user: "David K.",
        action: "scheduled an appointment",
        time: "5 mins ago",
      },
      {
        id: "act-005",
        type: "diagnosis",
        user: "Jennifer L.",
        action: "received a new diagnosis",
        time: "8 mins ago",
      },
    ])

    setStats({
      activeUsers: 248,
      uploadsPerMinute: 12,
      messagesPerMinute: 37,
      appointmentsPerHour: 8,
    })

    // Update stats randomly every 5 seconds
    const statsInterval = setInterval(() => {
      setStats((prev) => ({
        activeUsers: Math.max(200, Math.min(300, prev.activeUsers + Math.floor(Math.random() * 11) - 5)),
        uploadsPerMinute: Math.max(5, Math.min(20, prev.uploadsPerMinute + Math.floor(Math.random() * 5) - 2)),
        messagesPerMinute: Math.max(20, Math.min(50, prev.messagesPerMinute + Math.floor(Math.random() * 7) - 3)),
        appointmentsPerHour: Math.max(3, Math.min(15, prev.appointmentsPerHour + Math.floor(Math.random() * 3) - 1)),
      }))
    }, 5000)

    // Add new activity every 10 seconds
    const activityInterval = setInterval(() => {
      const activityTypes: ("login" | "upload" | "message" | "appointment" | "diagnosis")[] = [
        "login",
        "upload",
        "message",
        "appointment",
        "diagnosis",
      ]
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const randomUser = `${["John", "Jane", "Alex", "Maria", "Robert", "Lisa"][Math.floor(Math.random() * 6)]} ${["S", "T", "M", "R", "K", "L"][Math.floor(Math.random() * 6)]}.`

      let action = ""
      switch (randomType) {
        case "login":
          action = "logged in"
          break
        case "upload":
          action = "uploaded a new image"
          break
        case "message":
          action = `sent a message to Dr. ${["Chen", "Johnson", "Williams", "Smith"][Math.floor(Math.random() * 4)]}`
          break
        case "appointment":
          action = "scheduled an appointment"
          break
        case "diagnosis":
          action = "received a new diagnosis"
          break
      }

      const newActivity = {
        id: `act-${Date.now()}`,
        type: randomType,
        user: randomUser,
        action,
        time: "Just now",
      }

      // Update time labels
      const updatedActivities = activities.map((activity) => {
        if (activity.time === "Just now") {
          return { ...activity, time: "1 min ago" }
        } else if (activity.time === "1 min ago") {
          return { ...activity, time: "2 mins ago" }
        } else if (activity.time === "2 mins ago") {
          return { ...activity, time: "5 mins ago" }
        } else if (activity.time === "5 mins ago") {
          return { ...activity, time: "8 mins ago" }
        } else {
          return { ...activity, time: "10+ mins ago" }
        }
      })

      // Add new activity and limit to 5
      setActivities([newActivity, ...updatedActivities].slice(0, 5))
    }, 10000)

    return () => {
      clearInterval(statsInterval)
      clearInterval(activityInterval)
    }
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <User className="h-4 w-4 text-sky-500" />
      case "upload":
        return <Image className="h-4 w-4 text-emerald-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-violet-500" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-amber-500" />
      case "diagnosis":
        return <Clock className="h-4 w-4 text-red-500" />
      default:
        return <User className="h-4 w-4 text-sky-500" />
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Zap className="mr-2 h-5 w-5" />
          Real-Time Activity
        </h2>
        <p className="text-sm text-white/80 mt-1">Live system activity and user interactions</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Users</h3>
              <User className="h-5 w-5 text-sky-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.activeUsers}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Right now</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploads</h3>
              <Image className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.uploadsPerMinute}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per minute</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Messages</h3>
              <MessageSquare className="h-5 w-5 text-violet-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.messagesPerMinute}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per minute</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Appointments</h3>
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stats.appointmentsPerHour}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per hour</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Latest Activity</h3>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 flex items-center"
              >
                <div className="bg-white dark:bg-slate-700 p-2 rounded-full mr-3">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {activity.user} {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-medium text-amber-700 dark:text-amber-400">System Status</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
              <span className="text-amber-700 dark:text-amber-400">All systems operational with 99.98% uptime</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
              <span className="text-amber-700 dark:text-amber-400">
                Image processing queue: 3 items (processing time: ~2s)
              </span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
              <span className="text-amber-700 dark:text-amber-400">Next scheduled maintenance: Sunday, 2AM EST</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

