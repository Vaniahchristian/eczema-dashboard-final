"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Clock, AlertTriangle, FileText, Calendar, Download, Share2 } from "lucide-react";
import { diagnosisApi } from "@/services/api/diagnosis";

interface DiagnosisHeaderProps {
  onNewDiagnosis?: (diagnosisId: string) => void;
}

export default function DiagnosisHeader({ onNewDiagnosis }: DiagnosisHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, lastDate: '', progress: 0 });

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      if (!file.type.startsWith('image/')) throw new Error('Please upload an image file');
      if (file.size > 5 * 1024 * 1024) throw new Error('Image size should be less than 5MB');

      const response = await diagnosisApi.uploadImage(file);
      if (!response.success) throw new Error(response.message || 'Failed to process image');

      onNewDiagnosis?.(response.data.diagnosisId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      event.target.value = '';
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
              onChange={handleImageUpload}
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
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
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