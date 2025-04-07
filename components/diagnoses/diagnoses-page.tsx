"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DiagnosisHeader from "@/components/diagnoses/diagnosis-header";
import DiagnosisTimeline from "@/components/diagnoses/diagnosis-timeline";
import DiagnosisDetail from "@/components/diagnoses/diagnosis-detail";
import { diagnosisApi, type Diagnosis } from "@/services/api/diagnosis";

export default function DiagnosesPage() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnoses = async () => {
    try {
      const response = await diagnosisApi.getAllDiagnoses();
      const diagnosesData = response.data;
      setDiagnoses(diagnosesData);
      if (selectedDiagnosisId === undefined && diagnosesData.length > 0) {
        setSelectedDiagnosisId(diagnosesData[0]._id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch diagnoses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError('Please log in to view diagnoses');
      setLoading(false);
      return;
    }
    fetchDiagnoses();
  }, []);

  const handleNewDiagnosis = (diagnosisId: string) => {
    setSelectedDiagnosisId(diagnosisId);
    fetchDiagnoses();
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-2xl mx-auto"
        >
          <DiagnosisHeader onNewDiagnosis={handleNewDiagnosis} />

          {error ? (
            <div className="mt-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl">
              {error}
            </div>
          ) : loading ? (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl p-8 animate-pulse">
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-8 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4 w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <DiagnosisTimeline
                  diagnoses={diagnoses}
                  selectedDiagnosisId={selectedDiagnosisId}
                  onSelectDiagnosis={setSelectedDiagnosisId}
                />
              </motion.div>

              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {selectedDiagnosisId && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                      <div className="flex space-x-1 p-4">
                        <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">
                          Diagnosis Details
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <DiagnosisDetail diagnosisId={selectedDiagnosisId} />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}