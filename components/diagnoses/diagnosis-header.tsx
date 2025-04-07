"use client"

import { useState } from "react"
import { Camera, Upload, Clock, AlertTriangle } from "lucide-react"
import { diagnosisApi } from "@/services/api/diagnosis"

interface DiagnosisHeaderProps {
  onNewDiagnosis?: (diagnosisId: string) => void
}

export default function DiagnosisHeader({ onNewDiagnosis }: DiagnosisHeaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)
    setUploading(true)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file')
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB')
      }

      const response = await diagnosisApi.uploadImage(file)
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to process image')
      }
      
      onNewDiagnosis?.(response.data.diagnosisId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Diagnoses</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Upload a photo of your skin condition for instant AI analysis
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              uploading
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/40 cursor-pointer"
            }`}
          >
            {uploading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Take Photo
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <label
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              uploading
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                : "bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
            }`}
          >
            {uploading ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Image
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
