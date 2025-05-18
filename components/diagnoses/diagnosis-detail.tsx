"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, User, Clock, AlertTriangle, Pill, FileText, ImageIcon, Maximize2, Download } from "lucide-react";
import { diagnosisApi, type Diagnosis, type DiagnosisFeedback } from "@/services/api/diagnosis";
import Image from "next/image";

interface DiagnosisDetailProps {
  diagnosisId: string;
}

export default function DiagnosisDetail({ diagnosisId }: DiagnosisDetailProps) {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [feedback, setFeedback] = useState<DiagnosisFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
        // Fetch feedback (pre/post diagnosis)
        const feedbackRes = await diagnosisApi.getFeedback(diagnosisId);
        setFeedback(feedbackRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch diagnosis');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnosis();
  }, [diagnosisId]);

  // Dashboard pattern: default to emerald, handle null/undefined
  const getSeverityColor = (severity: string | null | undefined): string => {
    if (!severity) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    switch (severity.toLowerCase()) {
      case "mild": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "severe": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "unknown": return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  const handleRequestDoctorReview = async () => {
    if (!diagnosis) return;
    try {
      // Correct endpoint: submit feedback to request doctor review, NOT claimDiagnosis
      await diagnosisApi.submitFeedback(diagnosis._id, { needsDoctorReview: true });
      setDiagnosis({ ...diagnosis, needsDoctorReview: true });
      alert("Doctor review requested! A doctor will review your case soon.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to request doctor review");
    }
  };

  const handleImageDownload = async () => {
    if (!diagnosis?.imageUrl) return;
    try {
      const response = await fetch(diagnosis.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnosis-${diagnosis._id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error || !diagnosis) return (
    <div className="flex items-center justify-center h-64 text-red-500">
      {error || 'Diagnosis not found'}
    </div>
  );

  return (
    <>
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
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(diagnosis.mlResults?.severity || diagnosis.severity || null)}`}>
              {(diagnosis.mlResults?.severity || diagnosis.severity) || 'Unknown'}
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
                {diagnosis.bodyPart || diagnosis.mlResults?.bodyPart || 'Unknown'}
                {(diagnosis.bodyPartConfidence || diagnosis.mlResults?.bodyPartConfidence) && (
                  <span className="text-sm text-slate-500 ml-2">
                    (Confidence: {Math.round((diagnosis.bodyPartConfidence || diagnosis.mlResults?.bodyPartConfidence) * 100)}%)
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <ImageIcon className="h-4 w-4 text-sky-500 mr-2" />
                  <h3 className="font-medium">Image</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="View full size"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleImageDownload}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="relative rounded-lg overflow-hidden aspect-video bg-slate-200 dark:bg-slate-700">
                  <Image
                    src={diagnosis.imageUrl}
                    alt={`Skin condition - ${diagnosis.bodyPart}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/placeholder-image.jpg';
                    }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-sky-500 mr-2" />
                <h3 className="font-medium">Patient Background (Pre-Diagnosis Survey)</h3>
              </div>
              <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-1">
                <li><span className="font-medium">Eczema History:</span> {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.eczemaHistory}</li>
                <li><span className="font-medium">Last Flare-up:</span> {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.lastFlareup}</li>
                <li><span className="font-medium">Flare-up Triggers:</span> {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.flareupTriggers?.length > 0 ? (feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.flareupTriggers.join(', ') : 'None'}</li>
                <li><span className="font-medium">Current Symptoms:</span> {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.currentSymptoms}</li>
                <li><span className="font-medium">Previous Treatments:</span> {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.previousTreatments}</li>
                <li><span className="font-medium">Severity:</span> {(feedback?.preDiagnosisSurvey || diagnosis?.preDiagnosisSurvey)?.severity}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey) && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-2">
                <FileText className="h-4 w-4 text-sky-500 mr-2" />
                <h3 className="font-medium">Patient Feedback (Post-Diagnosis Survey)</h3>
              </div>
              <ul className="text-slate-700 dark:text-slate-300 text-sm space-y-1">
                <li><span className="font-medium">Diagnosis Accuracy:</span> {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.diagnosisAccuracy} / 5</li>
                <li><span className="font-medium">Helpfulness:</span> {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.diagnosisHelpfulness} / 5</li>
                <li><span className="font-medium">Treatment Clarity:</span> {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.treatmentClarity} / 5</li>
                <li><span className="font-medium">User Confidence:</span> {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.userConfidence} / 5</li>
                <li><span className="font-medium">Would Recommend:</span> {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.wouldRecommend ? 'Yes' : 'No'}</li>
                {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.feedback && (
                  <li><span className="font-medium">Additional Feedback:</span> {(feedback?.postDiagnosisSurvey || diagnosis?.postDiagnosisSurvey)?.feedback}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          {/* Show the request button if doctor review not yet requested and not reviewed */}
          {!diagnosis.needsDoctorReview && diagnosis.status !== 'reviewed' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 transition-shadow"
              onClick={handleRequestDoctorReview}
            >
              Not sure? Request Doctor Review
            </button>
          )}
          {/* Show pending message if requested but not yet reviewed */}
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

      {/* Full-size image modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative w-[90vw] h-[90vh] bg-white dark:bg-slate-900 rounded-xl p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full relative rounded-lg overflow-hidden">
              <Image
                src={diagnosis.imageUrl}
                alt={`Skin condition - ${diagnosis.bodyPart}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
                quality={100}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}