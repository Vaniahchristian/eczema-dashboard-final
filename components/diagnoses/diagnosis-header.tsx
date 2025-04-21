"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Clock, AlertTriangle, FileText, Calendar, Download, Share2 } from "lucide-react";
import { diagnosisApi } from "@/services/api/diagnosis";
import { PreDiagnosisSurvey, PreDiagnosisData } from "./pre-diagnosis-survey";
import { PostDiagnosisSurvey, PostDiagnosisData } from "./post-diagnosis-survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DiagnosisHeaderProps {
  onNewDiagnosis?: (diagnosisId: string) => void;
}

export default function DiagnosisHeader({ onNewDiagnosis }: DiagnosisHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, lastDate: '', progress: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreSurvey, setShowPreSurvey] = useState(false);
  const [preDiagnosisData, setPreDiagnosisData] = useState<PreDiagnosisData | null>(null);
  const [showPostSurvey, setShowPostSurvey] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError('Please log in to view diagnosis stats');
      return;
    }
    diagnosisApi.getAllDiagnoses().then((response) => {
      const diagnoses = response.data;
      setStats({
        total: diagnoses.length,
        lastDate: diagnoses[0]?.createdAt ? new Date(diagnoses[0].createdAt).toLocaleDateString() : '',
        progress: diagnoses.length ? Math.round(diagnoses.reduce((sum, d) => sum + (d.confidenceScore * 100), 0) / diagnoses.length) : 0,
      });
    }).catch((err) => setError(err.message));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setPreDiagnosisData(null);
  };

  const handlePreDiagnosisComplete = async (data: PreDiagnosisData) => {
    setPreDiagnosisData(data);
    setShowPreSurvey(false);
    await analyzeImage(data);
  };

  const handlePostDiagnosisComplete = async (data: PostDiagnosisData) => {
    try {
      await diagnosisApi.submitFeedback(diagnosisId!, {
        ...data,
        preDiagnosisData: preDiagnosisData!
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
    setShowPostSurvey(false);
    setDiagnosisId(null);
    setPreDiagnosisData(null);
    setFile(null);
    setPreview(null);
  };

  const analyzeImage = async (preData: PreDiagnosisData) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const response = await diagnosisApi.uploadImage(file, preData);
      if (response.success) {
        setDiagnosisId(response.data.diagnosisId);
        setShowPostSurvey(true);
        onNewDiagnosis?.(response.data.diagnosisId);
      } else {
        throw new Error(response.message || 'Failed to analyze image');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze image');
    } finally {
      setUploading(false);
    }
  };

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
            Upload a photo of your skin condition for instant AI analysis
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <label
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${uploading ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" :
              "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/40 cursor-pointer"
              }`}
          >
            {uploading ? <><Clock className="h-4 w-4 animate-spin" />Processing...</> :
              <><Camera className="h-4 w-4" />Take Photo</>}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <label
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${uploading ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" :
              "bg-white text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
              }`}
          >
            {uploading ? <><Clock className="h-4 w-4 animate-spin" />Processing...</> :
              <><Upload className="h-4 w-4" />Upload Image</>}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* Image Preview and Continue Button */}
      {preview && (
        <div className="max-w-md mx-auto mt-6 space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Eczema upload preview"
              className="mx-auto rounded-xl shadow-md max-w-xs h-48 object-contain"
            />
            <button
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md"
              onClick={removeFile}
              disabled={uploading}
            >
              <span className="sr-only">Remove</span>X
            </button>
          </div>
          <button
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center"
            onClick={() => setShowPreSurvey(true)}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Continue to Pre-Diagnosis Questions"
            )}
          </button>
        </div>
      )}

      <Dialog open={showPreSurvey} onOpenChange={setShowPreSurvey}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Before Your Diagnosis</DialogTitle>
          </DialogHeader>
          <PreDiagnosisSurvey
            onComplete={handlePreDiagnosisComplete}
            onSkip={async () => {
              setShowPreSurvey(false);
              await analyzeImage({} as PreDiagnosisData);
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
                setDiagnosisId(null);
                setPreDiagnosisData(null);
                setFile(null);
                setPreview(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
              View your complete eczema diagnosis history and track your progress.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Diagnoses</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Last Diagnosis</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.lastDate || 'N/A'}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">Avg. Confidence</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.progress}%</div>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}