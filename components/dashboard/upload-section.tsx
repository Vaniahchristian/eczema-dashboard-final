'use client';

import type React from "react";
import { useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { diagnosisApi } from "@/services/api/diagnosis";
import { useRouter } from "next/navigation";
import { PreDiagnosisSurvey, PreDiagnosisData } from "./pre-diagnosis-survey";
import { PostDiagnosisSurvey, PostDiagnosisData } from "./post-diagnosis-survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UploadSection() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showPreSurvey, setShowPreSurvey] = useState(false);
  const [preDiagnosisData, setPreDiagnosisData] = useState<PreDiagnosisData | null>(null);
  const [showPostSurvey, setShowPostSurvey] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handlePreDiagnosisComplete = async (data: PreDiagnosisData) => {
    setPreDiagnosisData(data);
    setShowPreSurvey(false);
    await analyzeImage();
  };

  const handlePostDiagnosisComplete = async (data: PostDiagnosisData) => {
    try {
      await diagnosisApi.submitFeedback(diagnosisId!, {
        ...data,
        preDiagnosisData: preDiagnosisData!,
      });
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
    setShowPostSurvey(false);
    //router.push(`/diagnoses/${diagnosisId}`);
  };

  const analyzeImage = async () => {
    if (!file) return;

    setAnalyzing(true);
    try {
      const response = await diagnosisApi.uploadImage(file, preDiagnosisData || undefined);
      if (response.success) {
        setDiagnosisId(response.data.diagnosisId);
        setShowPostSurvey(true);
      } else {
        throw new Error(response.message || 'Failed to analyze image');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="mb-4 p-4 rounded bg-green-100 text-green-800 flex items-center justify-between">
          <span>Feedback submitted successfully!</span>
          <button
            className="ml-4 px-2 py-1 bg-green-200 rounded hover:bg-green-300"
            onClick={() => setShowSuccessMessage(false)}
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-none shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 h-full">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6">
          <h2 className="text-xl font-semibold flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            Upload Skin Image
          </h2>
        </div>
        <div className="p-6">
          {analyzing ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
            </div>
          ) : !preview ? (
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center ${dragActive ? "border-sky-500 bg-sky-50 dark:bg-sky-900/20" : "border-slate-300 dark:border-slate-700"
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
                onClick={() => setShowPreSurvey(true)}
                disabled={analyzing}
              >
                Continue to Pre-Diagnosis Questions
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Your image will be analyzed by our AI to provide a diagnosis and treatment recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showPreSurvey} onOpenChange={setShowPreSurvey}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Before Your Diagnosis</DialogTitle>
          </DialogHeader>
          <PreDiagnosisSurvey
            onComplete={handlePreDiagnosisComplete}
            onSkip={() => {
              setShowPreSurvey(false);
              analyzeImage();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPostSurvey} onOpenChange={setShowPostSurvey}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Diagnosis Feedback</DialogTitle>
          </DialogHeader>
          {diagnosisId && (
            <PostDiagnosisSurvey
              diagnosisId={diagnosisId}
              onComplete={handlePostDiagnosisComplete}
              onSkip={() => {
                setShowPostSurvey(false);
                router.push(`/diagnoses/${diagnosisId}`);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
