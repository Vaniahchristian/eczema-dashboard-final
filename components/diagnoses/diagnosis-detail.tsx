"use client"
import { MapPin, Calendar, User, Clock, AlertTriangle, Pill, FileText, ImageIcon } from "lucide-react"
import type { Diagnosis } from "./diagnoses-page"

interface DiagnosisDetailProps {
  diagnosis: Diagnosis
}

export default function DiagnosisDetail({ diagnosis }: DiagnosisDetailProps) {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{diagnosis.condition}</h2>
          <div className="flex items-center mt-2">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
            <span className="text-sm text-slate-500 dark:text-slate-400 mr-3">{diagnosis.date}</span>
            <User className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{diagnosis.doctor}</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}
          >
            {diagnosis.severity}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Affected Areas</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{diagnosis.location}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Symptoms</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {diagnosis.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Clinical Notes</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm">{diagnosis.notes}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Follow-up Appointment</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{diagnosis.followUp}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <ImageIcon className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Images</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {diagnosis.images.map((image, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden aspect-video">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Eczema condition ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Pill className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Treatment Plan</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm">{diagnosis.treatment}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <h3 className="font-medium">Treatment Progress</h3>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">Progress</span>
                <span className="font-medium">{diagnosis.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-2.5 rounded-full"
                  style={{ width: `${diagnosis.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {diagnosis.progress < 30 && "Treatment just started. Continue following the prescribed plan."}
              {diagnosis.progress >= 30 &&
                diagnosis.progress < 70 &&
                "Treatment is progressing well. Keep following the prescribed plan."}
              {diagnosis.progress >= 70 && "Treatment is almost complete. Continue maintenance as prescribed."}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
          Print Report
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          Request Follow-up
        </button>
      </div>
    </div>
  )
}

