"use client"

import { motion } from "framer-motion"
import { FileText, Calendar, Download, Share2 } from "lucide-react"

export default function DiagnosesHeader() {
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
            Eczema Diagnoses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Track your eczema condition and treatment progress over time
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Filter by Date</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <Download className="h-4 w-4 mr-2" />
            <span>Export</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-900/20 dark:to-teal-900/20 p-6 rounded-2xl shadow-sm"
      >
        <div className="flex items-start md:items-center">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm mr-4">
            <FileText className="h-6 w-6 text-teal-500" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Your Diagnosis History</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View your complete eczema diagnosis history, track your progress, and see how your condition has changed
              over time.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Diagnoses</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Last Diagnosis</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">May 15, 2023</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Overall Progress</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">80%</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

