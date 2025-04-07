"use client"

import { useState } from "react"
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  ChevronRight,
  ImageIcon
} from "lucide-react"
import type { Diagnosis } from "@/services/api/diagnosis"

interface DiagnosisTimelineProps {
  diagnoses: Diagnosis[]
  onSelectDiagnosis?: (diagnosisId: string) => void
  selectedDiagnosisId?: string
}

export default function DiagnosisTimeline({ 
  diagnoses, 
  onSelectDiagnosis,
  selectedDiagnosisId 
}: DiagnosisTimelineProps) {
  // Sort diagnoses by date (newest first)
  const sortedDiagnoses = [...diagnoses].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const getStatusIcon = (diagnosis: Diagnosis) => {
    switch (diagnosis.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case "pending_review":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "reviewed":
        return <User className="h-5 w-5 text-sky-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = (diagnosis: Diagnosis) => {
    switch (diagnosis.status) {
      case "completed":
        return "Analysis Complete"
      case "pending_review":
        return "Pending Doctor Review"
      case "reviewed":
        return "Doctor Reviewed"
      default:
        return "Unknown Status"
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(d)
  }

  return (
    <div className="space-y-4">
      {sortedDiagnoses.map((diagnosis) => (
        <button
          key={diagnosis._id}
          onClick={() => onSelectDiagnosis?.(diagnosis._id)}
          className={`w-full text-left transition-colors ${
            selectedDiagnosisId === diagnosis._id
              ? "bg-sky-50 dark:bg-sky-900/20"
              : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
          } rounded-xl p-4 shadow-sm border ${
            selectedDiagnosisId === diagnosis._id
              ? "border-sky-200 dark:border-sky-800"
              : "border-slate-200 dark:border-slate-700"
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${diagnosis.imageUrl}`}
                alt="Skin condition"
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                {getStatusIcon(diagnosis)}
                <span
                  className={
                    diagnosis.status === "completed"
                      ? "text-emerald-700 dark:text-emerald-400"
                      : diagnosis.status === "pending_review"
                        ? "text-amber-700 dark:text-amber-400"
                        : diagnosis.status === "reviewed"
                          ? "text-sky-700 dark:text-sky-400"
                          : "text-red-700 dark:text-red-400"
                  }
                >
                  {getStatusText(diagnosis)}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  diagnosis.severity === "Mild"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : diagnosis.severity === "Moderate"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {diagnosis.severity}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {diagnosis.bodyPart}
                </span>
              </div>

              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {formatDate(diagnosis.createdAt)}
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-slate-400" />
          </div>

          {diagnosis.doctorReview && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <User className="h-4 w-4 text-sky-500" />
                <span>Doctor's Review:</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {new Date(diagnosis.doctorReview.reviewedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </button>
      ))}

      {sortedDiagnoses.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center justify-center text-center">
            <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">No diagnoses yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Upload a photo to get your first AI-powered skin analysis
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
