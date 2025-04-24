'use client';

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, ImageIcon } from "lucide-react";
import type { Diagnosis } from "@/services/api/diagnosis";
import Image from "next/image";

interface DiagnosesTimelineProps {
  diagnoses: Diagnosis[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function DiagnosesTimeline({ diagnoses, selectedId, onSelect }: DiagnosesTimelineProps) {
  // Sort diagnoses by createdAt (newest first)
  const sortedDiagnoses = [...diagnoses].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Mild": return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "Moderate": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "Severe": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mild": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Severe": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate progress based on confidenceScore (assuming 0-1 range, converted to percentage)
  const calculateProgress = (confidenceScore: number) => Math.round(confidenceScore * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
        <h2 className="text-xl font-semibold">Diagnosis Timeline</h2>
        <p className="text-sm text-white/80 mt-1">Select a diagnosis to view details</p>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {sortedDiagnoses.map((diagnosis, index) => {
            // Debug: Log imageUrl to check if it's present
            console.log(`Diagnosis ${diagnosis._id} imageUrl:`, diagnosis.imageUrl);

            return (
              <motion.div
                key={diagnosis._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedId === diagnosis._id
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-300 dark:border-indigo-700"
                  : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                onClick={() => onSelect(diagnosis._id)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0 w-32 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {diagnosis.imageUrl ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <Image
                          src={diagnosis.imageUrl}
                          alt={`Skin condition - ${diagnosis.bodyPart}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {getSeverityIcon(diagnosis.severity)}
                        <span className="ml-2 font-medium">
                          {diagnosis.isEczema}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(diagnosis.createdAt)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(diagnosis.severity)}`}
                      >
                        {diagnosis.severity}
                      </span>
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        {diagnosis.bodyPart}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Analysis Confidence</div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${calculateProgress(diagnosis.confidenceScore)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right mt-1 text-slate-500 dark:text-slate-400">
                        {calculateProgress(diagnosis.confidenceScore)}%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {sortedDiagnoses.length === 0 && (
            <div className="p-8 text-center">
              <ImageIcon className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">No diagnoses yet</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Upload a photo to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}