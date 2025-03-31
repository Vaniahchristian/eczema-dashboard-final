"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import type { Diagnosis } from "./diagnoses-page"

interface DiagnosesTimelineProps {
  diagnoses: Diagnosis[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function DiagnosesTimeline({ diagnoses, selectedId, onSelect }: DiagnosesTimelineProps) {
  // Sort diagnoses by date (newest first)
  const sortedDiagnoses = [...diagnoses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Mild":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "Moderate":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "Severe":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mild":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "Moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      case "Severe":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
        <h2 className="text-xl font-semibold">Diagnosis Timeline</h2>
        <p className="text-sm text-white/80 mt-1">Select a diagnosis to view details</p>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {sortedDiagnoses.map((diagnosis, index) => (
            <motion.div
              key={diagnosis.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedId === diagnosis.id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-300 dark:border-indigo-700"
                  : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              }`}
              onClick={() => onSelect(diagnosis.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getSeverityIcon(diagnosis.severity)}
                  <span className="ml-2 font-medium">{diagnosis.condition}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{diagnosis.date}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(diagnosis.severity)}`}
                >
                  {diagnosis.severity}
                </span>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  {diagnosis.location}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Treatment Progress</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${diagnosis.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">{diagnosis.progress}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

