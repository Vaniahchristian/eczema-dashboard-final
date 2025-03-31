"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"

interface UploadSectionProps {
  setIsLoading: (loading: boolean) => void
}

export default function UploadSection({ setIsLoading }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }

  const analyzeImage = () => {
    if (!file) return

    setAnalyzing(true)
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setAnalyzing(false)
      setIsLoading(false)
      // Here you would handle the response from your ML model
      alert("Analysis complete! Your image has been processed.")
    }, 2000)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-none shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 h-full">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6">
        <h2 className="text-xl font-semibold flex items-center">
          <ImageIcon className="mr-2 h-5 w-5" />
          Upload Skin Image
        </h2>
      </div>
      <div className="p-6">
        {!preview ? (
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center ${
              dragActive ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "border-slate-300 dark:border-slate-700"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleChange} />
            <Upload className="mx-auto h-12 w-12 text-sky-400" />
            <p className="mt-4 text-sm font-medium">Drag and drop your eczema image here</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Supports JPG, PNG, HEIC up to 10MB</p>
            <button
              className="mt-6 py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Select File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Eczema upload preview"
                className="w-full h-auto rounded-xl shadow-md"
              />
              <button
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center"
              onClick={analyzeImage}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Your image will be analyzed by our AI to provide a diagnosis and treatment recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

