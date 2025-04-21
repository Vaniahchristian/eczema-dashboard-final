import { ArrowUpRight, Calendar, Clock, Droplet, Thermometer, AlertCircle, CheckCircle, XCircle, ImageIcon } from "lucide-react"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";
import { diagnosisApi, type Diagnosis } from "@/services/api/diagnosis";
import Image from "next/image";

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "Mild": return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case "Moderate": return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case "Severe": return <XCircle className="h-5 w-5 text-red-500" />;
    default: return <CheckCircle className="h-5 w-5 text-emerald-500" />;
  }
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "Mild": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "Severe": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SummarySection() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    diagnosisApi.getAllDiagnoses()
      .then(res => {
        setDiagnoses(res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load diagnosis');
        setLoading(false);
      });
  }, []);

  const latest = diagnoses[0];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Your Eczema Summary</CardTitle>
        <CardDescription>Overview of your latest diagnosis and progress</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">Loading your diagnosis summary...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : latest ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagnosis Card */}
            <div className="flex flex-col gap-4 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl p-6 shadow">
              <div className="flex items-center gap-3">
                {getSeverityIcon(latest.severity)}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(latest.severity)}`}>{latest.severity}</span>
                <span className="ml-auto text-xs text-slate-500">{formatDate(latest.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                {latest.imageUrl ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                    <Image src={latest.imageUrl} alt="Diagnosis" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-sky-700 dark:text-sky-300">{latest.isEczema}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">{latest.status.replace('_', ' ')}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Body part: {latest.bodyPart}</div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Diagnosis Confidence</span>
                  <span className="text-sm font-medium">{Math.round((latest.confidenceScore ?? latest.confidence ?? 0) * 100)}%</span>
                </div>
                <Progress value={Math.round((latest.confidenceScore ?? latest.confidence ?? 0) * 100)} className="h-2" />
              </div>
              {latest.recommendations && latest.recommendations.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recommendations</div>
                  <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-200">
                    {latest.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {latest.doctorReview && (
                <div className="mt-2 p-2 bg-sky-50 dark:bg-sky-900/20 rounded">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Doctor Review</div>
                  <div className="text-sm text-slate-700 dark:text-slate-200">{latest.doctorReview.review}</div>
                  <div className="text-xs mt-1 text-slate-400">Reviewed at: {formatDate(latest.doctorReview.reviewedAt)}</div>
                </div>
              )}
            </div>
            {/* Mini History */}
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Recent Diagnoses</div>
              <ul className="space-y-2">
                {diagnoses.slice(0, 3).map((d, idx) => (
                  <li key={d._id} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 shadow-sm">
                    {getSeverityIcon(d.severity)}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSeverityColor(d.severity)}`}>{d.severity}</span>
                    <span className="text-xs text-slate-500">{formatDate(d.createdAt)}</span>
                    <span className="ml-auto text-xs font-medium text-sky-600 dark:text-sky-300">{d.isEczema}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">No diagnosis records found.</div>
        )}
      </CardContent>
    </Card>
  )
}
