"use client"

import { ArrowUpRight, Calendar, Clock, Droplet, Thermometer, AlertCircle, CheckCircle, XCircle, ImageIcon, Stethoscope, Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { diagnosisApi, type Diagnosis } from "@/services/api/diagnosis"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function getSeverityIcon(severity: string | undefined | null) {
  if (!severity) return <CheckCircle className="h-5 w-5 text-emerald-500" />;
  switch (severity.toLowerCase()) {
    case "mild": return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    case "moderate": return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case "severe": return <XCircle className="h-5 w-5 text-red-500" />;
    default: return <CheckCircle className="h-5 w-5 text-emerald-500" />;
  }
}

function getSeverityColor(severity: string | undefined | null) {
  if (!severity) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  switch (severity.toLowerCase()) {
    case "mild": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "severe": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  }
}

function formatDate(date: string | undefined) {
  if (!date) return 'N/A';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Unset Date';
    return format(parsedDate, 'PPP');
  } catch (error) {
    return 'Unset Date';
  }
}

function formatTime(date: string | undefined) {
  if (!date) return 'Unset Time';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Unset Time';
    return format(parsedDate, 'p');
  } catch (error) {
    return 'Unset Time';
  }
}

export default function SummarySection() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    console.log('Fetching diagnoses...');
    diagnosisApi.getAllDiagnoses()
      .then(res => {
        console.log('Received diagnoses response:', res);
        if (!res.data) {
          console.error('No data in response');
          setError('No data received from server');
          setLoading(false);
          return;
        }
        const sortedDiagnoses = res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log('Sorted diagnoses:', sortedDiagnoses);
        setDiagnoses(sortedDiagnoses);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching diagnoses:', err);
        setError(err.message || 'Failed to load diagnosis');
        setLoading(false);
      });
  }, []);

  const latest = diagnoses[0];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Your Eczema Summary</CardTitle>
            <CardDescription>Overview of your latest diagnosis and progress</CardDescription>
          </div>
          {latest && (
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              New Diagnosis
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">Loading your diagnosis summary...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : latest ? (
          <Tabs defaultValue="latest" className="space-y-6">
            <TabsList>
              <TabsTrigger value="latest">Latest Diagnosis</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="space-y-6">
              {/* Latest Diagnosis Card */}
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl p-6 shadow space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(latest.severity)}
                    <Badge variant="outline" className={cn("font-semibold", getSeverityColor(latest.isEczema === 'Eczema' ? latest.severity : undefined))}>
                      {latest.isEczema === 'Eczema' ? latest.severity : 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDate(latest.createdAt)}
                    <ClockIcon className="h-4 w-4 ml-2" />
                    {formatTime(latest.createdAt)}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {latest.imageUrl ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                          <Image src={latest.imageUrl} alt="Diagnosis" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <ImageIcon className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <div>
                          <div className="text-sm font-medium text-slate-500">Diagnosis</div>
                          <div className="text-lg font-semibold">{latest.isEczema}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-500">Location</div>
                          <div className="text-lg font-semibold">{latest.bodyPart}</div>
                        </div>
                        <Badge variant={latest.status === 'NEEDS_REVIEW' ? 'destructive' : 'secondary'}>
                          {latest.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">ML Confidence</span>
                        <span className="text-sm font-medium">{Math.round((latest.confidenceScore ?? latest.confidence ?? 0) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((latest.confidenceScore ?? latest.confidence ?? 0) * 100)} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {latest.recommendations && latest.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-2">Recommendations</h4>
                        <ScrollArea className="h-[120px] rounded-md border p-4">
                          <ul className="space-y-2">
                            {latest.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </div>
                    )}

                    {latest.doctorReview && (
                      <div className="rounded-lg border bg-card p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-sky-500" />
                          <h4 className="font-medium">Doctor's Review</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{latest.doctorReview.review}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <ClockIcon className="h-3 w-3" />
                          Reviewed {formatDate(latest.doctorReview.reviewedAt)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                <div className="grid gap-4">
                  {diagnoses.map((diagnosis, index) => (
                    <div key={diagnosis._id} 
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      {/* Severity indicator */}
                      {console.log('Diagnosis severity:', diagnosis.severity)}
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        !diagnosis.severity || diagnosis.severity === 'unknown' ? "bg-gray-500" :
                        diagnosis.severity.toLowerCase() === 'mild' ? "bg-emerald-500" :
                        diagnosis.severity.toLowerCase() === 'moderate' ? "bg-amber-500" :
                        "bg-red-500"
                      )} />
                      <div className="text-sm text-slate-600">
  {diagnosis.isEczema === 'Eczema' ?
    (!diagnosis.severity || diagnosis.severity === 'unknown' ? 'Severity: Unknown' : `Severity: ${diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}`)
    : 'Severity: Unknown'}
</div>
                      <div className="min-w-[120px]">
                        <div className="text-sm font-medium">{formatDate(diagnosis.createdAt)}</div>
                        <div className="text-xs text-slate-500">{formatTime(diagnosis.createdAt)}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{diagnosis.isEczema}</span>
                          <Badge variant="outline" className={cn("text-xs", getSeverityColor(diagnosis.isEczema === 'Eczema' ? diagnosis.severity : undefined))}>
  {diagnosis.isEczema === 'Eczema' ? diagnosis.severity : 'Unknown'}
</Badge>
                        </div>
                        <div className="text-sm text-slate-500">{diagnosis.bodyPart}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{Math.round((diagnosis.confidenceScore ?? diagnosis.confidence ?? 0) * 100)}% confidence</div>
                        <Badge variant={diagnosis.status === 'NEEDS_REVIEW' ? 'destructive' : 'secondary'} className="text-xs">
                          {diagnosis.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Severity Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(
  diagnoses.reduce((acc, d) => {
    const key = d.isEczema === 'Eczema' ? (d.severity || 'Unknown') : 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([severity, count]) => (
  <div key={severity} className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{severity}</span>
      <span className="text-sm text-slate-500">{count} diagnoses</span>
    </div>
    <Progress 
      value={(count / diagnoses.length) * 100} 
      className={cn(
        "h-2",
        severity.toLowerCase() === 'mild' ? "bg-emerald-100" :
        severity.toLowerCase() === 'moderate' ? "bg-amber-100" :
        severity.toLowerCase() === 'severe' ? "bg-red-100" :
        "bg-gray-200"
      )}
    />
  </div>
))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Body Parts Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(
                      diagnoses.reduce((acc, d) => {
                        acc[d.bodyPart] = (acc[d.bodyPart] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([part, count]) => (
                      <div key={part} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{part}</span>
                          <span className="text-sm text-slate-500">{count} times</span>
                        </div>
                        <Progress value={(count / diagnoses.length) * 100} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">No diagnosis records found.</div>
        )}
      </CardContent>
    </Card>
  )
}
