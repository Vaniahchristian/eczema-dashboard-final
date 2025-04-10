"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, User, Clock, AlertTriangle, Pill, FileText, ImageIcon } from "lucide-react";
import { diagnosisApi, type Diagnosis } from "@/services/api/diagnosis";

interface DiagnosisDetailProps {
  diagnosisId: string;
}

export default function DiagnosisDetail({ diagnosisId }: DiagnosisDetailProps) {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError('Please log in to view diagnosis');
      setLoading(false);
      return;
    }
    const fetchDiagnosis = async () => {
      try {
        const response = await diagnosisApi.getDiagnosis(diagnosisId);
        setDiagnosis(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch diagnosis');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosis();
  }, [diagnosisId]);

  const getSeverityColor = (severity: string) => {
    const normalizedSeverity = severity.toLowerCase();
    switch (normalizedSeverity) {
      case "mild": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "severe": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error || !diagnosis) return (
    <div className="flex items-center justify-center h-64 text-red-500">
      {error || 'Diagnosis not found'}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Diagnosis Result: {diagnosis.isEczema === 'Eczema' ? 'Eczema' : 'Not Eczema'}
          </h2>
          <div className="flex items-center mt-2">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
            <span className="text-sm text-slate-500 dark:text-slate-400 mr-3">
              {new Date(diagnosis.createdAt).toLocaleDateString()}
            </span>
            {diagnosis.doctorReview && (
              <>
                <User className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Reviewed by Doctor</span>
              </>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.severity)}`}>
            {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <MapPin className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Affected Area</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {diagnosis.bodyPart}
              {diagnosis.bodyPartConfidence && (
                <span className="text-sm text-slate-500 ml-2">
                  (Confidence: {Math.round(diagnosis.bodyPartConfidence * 100)}%)
                </span>
              )}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Diagnosis Confidence</h3>
            </div>
            <div className="flex items-center">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${diagnosis.isEczema === 'Eczema' ? 'bg-sky-500' : 'bg-gray-500'}`}
                  style={{ width: `${Math.round(diagnosis.confidence * 100)}%` }}
                />
              </div>
              <span className="ml-3 text-sm text-slate-700 dark:text-slate-300">
                {Math.round(diagnosis.confidence * 100)}%
              </span>
            </div>
          </div>

          {diagnosis.doctorReview && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-sky-500 mr-2" />
                <h3 className="font-medium">Doctor's Review</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{diagnosis.doctorReview.review}</p>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Status</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 capitalize">{diagnosis.status.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <ImageIcon className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Image</h3>
            </div>
            <div className="mt-2">
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img
                  src={diagnosis.imageUrl}
                  alt="Skin condition"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center mb-2">
              <Pill className="h-4 w-4 text-sky-500 mr-2" />
              <h3 className="font-medium">Recommendations</h3>
            </div>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm space-y-2">
              {Array.isArray(diagnosis.recommendations) && diagnosis.recommendations.length > 0
                ? diagnosis.recommendations.map((rec, index) => (
                    <li key={index} className="leading-relaxed">{rec}</li>
                  ))
                : <li>No recommendations available</li>
              }
            </ul>
          </div>

          {diagnosis.doctorReview?.treatmentPlan && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <h3 className="font-medium">Treatment Plan</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm">{diagnosis.doctorReview.treatmentPlan}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {diagnosis.needsDoctorReview && diagnosis.status !== 'reviewed' && (
          <div className="px-4 py-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl">
            Pending Doctor Review
          </div>
        )}
        <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700">
          Print Report
        </button>
      </div>
    </div>
  );
}