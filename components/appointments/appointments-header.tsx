"use client"

import { motion } from "framer-motion"
import { Calendar, List, Plus, Filter } from "lucide-react"

interface AppointmentsHeaderProps {
  activeView: "calendar" | "list"
  setActiveView: (view: "calendar" | "list") => void
  onSchedule: () => void
}

export default function AppointmentsHeader({ activeView, setActiveView, onSchedule }: AppointmentsHeaderProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Schedule and manage your doctor appointments</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <div className="flex bg-white dark:bg-slate-800 rounded-xl shadow-sm p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveView("calendar")}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeView === "calendar"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveView("list")}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeView === "list"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              <span>List</span>
            </button>
          </div>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </button>
          <button
            onClick={onSchedule}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>New Appointment</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-900/20 dark:to-teal-900/20 p-6 rounded-2xl shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Upcoming Appointments</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Next Appointment</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">June 10, 2023</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Past Appointments</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

