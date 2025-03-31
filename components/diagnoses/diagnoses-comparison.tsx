"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import type { Diagnosis } from "./diagnoses-page"

interface DiagnosesComparisonProps {
  diagnoses: Diagnosis[]
}

export default function DiagnosesComparison({ diagnoses }: DiagnosesComparisonProps) {
  const [firstDiagnosisId, setFirstDiagnosisId] = useState<string>(diagnoses[0]?.id || "")
  const [secondDiagnosisId, setSecondDiagnosisId] = useState<string>(diagnoses[1]?.id || "")

  const firstDiagnosis = diagnoses.find((d) => d.id === firstDiagnosisId)
  const secondDiagnosis = diagnoses.find((d) => d.id === secondDiagnosisId)

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

  const getProgressChange = () => {
    if (!firstDiagnosis || !secondDiagnosis) return 0
    return secondDiagnosis.progress - firstDiagnosis.progress
  }

  const progressChange = getProgressChange()

  if (!firstDiagnosis || !secondDiagnosis) {
    return <div className="text-center py-8 text-slate-500 dark:text-slate-400">Not enough diagnoses to compare</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Compare Diagnoses</h2>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <select
            value={firstDiagnosisId}
            onChange={(e) => setFirstDiagnosisId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          >
            {diagnoses.map((d) => (
              <option key={d.id} value={d.id}>
                {d.date} - {d.condition}
              </option>
            ))}
          </select>
          <select
            value={secondDiagnosisId}
            onChange={(e) => setSecondDiagnosisId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          >
            {diagnoses.map((d) => (
              <option key={d.id} value={d.id}>
                {d.date} - {d.condition}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{firstDiagnosis.date}</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(firstDiagnosis.severity)}`}
            >
              {firstDiagnosis.severity}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Condition</div>
              <div className="font-medium">{firstDiagnosis.condition}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Location</div>
              <div className="font-medium">{firstDiagnosis.location}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Symptoms</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {firstDiagnosis.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Progress</div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-2.5 rounded-full"
                  style={{ width: `${firstDiagnosis.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs mt-1">{firstDiagnosis.progress}%</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{secondDiagnosis.date}</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(secondDiagnosis.severity)}`}
            >
              {secondDiagnosis.severity}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Condition</div>
              <div className="font-medium">{secondDiagnosis.condition}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Location</div>
              <div className="font-medium">{secondDiagnosis.location}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Symptoms</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {secondDiagnosis.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Progress</div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-1">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-2.5 rounded-full"
                  style={{ width: `${secondDiagnosis.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs mt-1">{secondDiagnosis.progress}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="font-medium mb-4">Changes & Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Severity Change</div>
            <div className="flex items-center mt-2">
              {getSeverityIcon(firstDiagnosis.severity)}
              <ArrowRight className="mx-2 h-4 w-4 text-slate-400" />
              {getSeverityIcon(secondDiagnosis.severity)}
            </div>
            <div className="mt-1 text-sm">
              {firstDiagnosis.severity === secondDiagnosis.severity ? (
                <span className="text-slate-600 dark:text-slate-300">No change in severity</span>
              ) : (
                <span
                  className={
                    secondDiagnosis.severity === "Mild"
                      ? "text-emerald-500"
                      : secondDiagnosis.severity === "Moderate" && firstDiagnosis.severity === "Severe"
                        ? "text-amber-500"
                        : "text-red-500"
                  }
                >
                  {secondDiagnosis.severity === "Mild"
                    ? "Improved"
                    : secondDiagnosis.severity === "Moderate" && firstDiagnosis.severity === "Severe"
                      ? "Slightly improved"
                      : "Worsened"}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Symptom Changes</div>
            <div className="mt-2 text-sm">
              {secondDiagnosis.symptoms.length < firstDiagnosis.symptoms.length ? (
                <span className="text-emerald-500">Fewer symptoms reported</span>
              ) : secondDiagnosis.symptoms.length > firstDiagnosis.symptoms.length ? (
                <span className="text-red-500">More symptoms reported</span>
              ) : (
                <span className="text-slate-600 dark:text-slate-300">Same number of symptoms</span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {secondDiagnosis.symptoms.filter((s) => !firstDiagnosis.symptoms.includes(s)).length > 0 && (
                <div>
                  <span className="font-medium">New symptoms: </span>
                  {secondDiagnosis.symptoms.filter((s) => !firstDiagnosis.symptoms.includes(s)).join(", ")}
                </div>
              )}
              {firstDiagnosis.symptoms.filter((s) => !secondDiagnosis.symptoms.includes(s)).length > 0 && (
                <div className="mt-1">
                  <span className="font-medium">Resolved symptoms: </span>
                  {firstDiagnosis.symptoms.filter((s) => !secondDiagnosis.symptoms.includes(s)).join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Progress Change</div>
            <div className="mt-2 text-2xl font-bold flex items-center">
              {progressChange > 0 ? (
                <>
                  <span className="text-emerald-500">+{progressChange}%</span>
                </>
              ) : progressChange < 0 ? (
                <>
                  <span className="text-red-500">{progressChange}%</span>
                </>
              ) : (
                <span className="text-slate-600 dark:text-slate-300">No change</span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {progressChange > 15
                ? "Significant improvement"
                : progressChange > 0
                  ? "Slight improvement"
                  : progressChange < -15
                    ? "Significant regression"
                    : progressChange < 0
                      ? "Slight regression"
                      : "Stable condition"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

