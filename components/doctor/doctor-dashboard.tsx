"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { appointmentService, Appointment } from '@/services/appointmentService';
import { diagnosisApi, Diagnosis } from '@/services/api/diagnosis';
import { useAuth } from "@/lib/auth"

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDiagnoses, setPendingDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoadingDiagnoses, setIsLoadingDiagnoses] = useState(true);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [updatedSeverity, setUpdatedSeverity] = useState<string>("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [monthlyAppointments, setMonthlyAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await appointmentService.getDoctorAppointments(user?.id, {
          startDate: today,
          endDate: today
        });
        // Ensure we're setting an array of appointments
        setTodayAppointments(Array.isArray(response) ? response : response.data || []);
      } catch (error) {
        console.error('Error fetching today\'s appointments:', error);
        setTodayAppointments([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  useEffect(() => {
    const fetchPendingDiagnoses = async () => {
      setIsLoadingDiagnoses(true);
      try {
        const response = await diagnosisApi.getDoctorReviewRequests();
        setPendingDiagnoses(response.data);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        setPendingDiagnoses([]);
      } finally {
        setIsLoadingDiagnoses(false);
      }
    };
    fetchPendingDiagnoses();
  }, []);

  useEffect(() => {
    const fetchMonthlyAppointments = async () => {
      if (!user?.id) return;
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      try {
        const response = await appointmentService.getDoctorAppointments(user.id, {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        });
        setMonthlyAppointments(Array.isArray(response) ? response : response.data || []);
      } catch (error) {
        setMonthlyAppointments([]);
      }
    };
    fetchMonthlyAppointments();
  }, [user?.id]);

  const handleOpenReviewDialog = (diag: Diagnosis) => {
    setSelectedDiagnosis(diag);
    setReviewText("");
    setUpdatedSeverity(diag.severity || "");
    setTreatmentPlan("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmitReview = async () => {
    if (!selectedDiagnosis) return;
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await diagnosisApi.addDoctorReview(selectedDiagnosis._id, {
        review: reviewText,
        updatedSeverity: updatedSeverity as any,
        treatmentPlan,
      });
      setSuccessMessage("Review submitted successfully.");
      setTimeout(() => {
        setSelectedDiagnosis(null);
        setSuccessMessage("");
        // Refresh the list
        (async () => {
          const response = await diagnosisApi.getDoctorReviewRequests();
          setPendingDiagnoses(response.data);
        })();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/login">
              <Button variant="outline" size="sm" className="mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Doctor Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, Dr. Johnson</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                4
              </span>
            </Button>
            <Button>Schedule Appointment</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reviews">Previous Reviews</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Doctor Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingDiagnoses.length}</div>
                  <p className="text-xs text-muted-foreground">Diagnoses waiting for your review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Urgent alerts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">56</div>
                  <p className="text-xs text-muted-foreground">Total reviews completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
                  <Users className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Based on feedback</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    {`You have ${monthlyAppointments.length} appointments scheduled for this month`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-0">
                  {monthlyAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : "Patient"}
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-muted-foreground">
                            {appointment.appointment_date ? new Date(appointment.appointment_date.replace(' ', 'T')).toLocaleString() : "No date"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {appointment.reason}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Appointments
                  </Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Patient Alerts</CardTitle>
                  <CardDescription>Patients requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-0">
                  {[
                    { patient: "Robert Smith", issue: "Severe flare-up reported", priority: "High" },
                    { patient: "Jennifer Lee", issue: "Medication side effects", priority: "Medium" },
                    { patient: "Thomas Wilson", issue: "Missed follow-up", priority: "Low" },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            alert.priority === "High"
                              ? "bg-red-100 dark:bg-red-900"
                              : alert.priority === "Medium"
                                ? "bg-amber-100 dark:bg-amber-900"
                                : "bg-green-100 dark:bg-green-900"
                          }`}
                        >
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              alert.priority === "High"
                                ? "text-red-600 dark:text-red-300"
                                : alert.priority === "Medium"
                                  ? "text-amber-600 dark:text-amber-300"
                                  : "text-green-600 dark:text-green-300"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{alert.patient}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{alert.issue}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          alert.priority === "High"
                            ? "destructive"
                            : alert.priority === "Medium"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Success Rate</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">78%</div>
                    </div>
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="stroke-slate-200 dark:stroke-slate-700"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        strokeWidth="10"
                      />
                      <circle
                        className="stroke-indigo-500"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset="55.264"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">+5% from previous month</span>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Satisfaction</CardTitle>
                  <CardDescription>Based on feedback</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold">92%</div>
                    </div>
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="stroke-slate-200 dark:stroke-slate-700"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        strokeWidth="10"
                      />
                      <circle
                        className="stroke-indigo-500"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset="20.096"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Excellent</span>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Treatment Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Manage your schedule for {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center">No appointments scheduled for today</p>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{appointment.patient ? `${appointment.patient.first_name} ${appointment.patient.last_name}` : "Patient"}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.appointment_date ? new Date(appointment.appointment_date.replace(' ', 'T')).toLocaleString() : "No date"}
                        </div>
                        <div className="text-sm text-muted-foreground">Mode: {appointment.mode}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Doctor Reviews</CardTitle>
              <CardDescription>Diagnoses that need your review</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDiagnoses ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : pendingDiagnoses.length === 0 ? (
                <p className="text-muted-foreground text-center">No diagnoses currently waiting for review</p>
              ) : (
                <div className="space-y-4">
                  {pendingDiagnoses.map((diag) => (
                    <Dialog key={diag._id} open={selectedDiagnosis?._id === diag._id} onOpenChange={(open) => { if (!open) setSelectedDiagnosis(null); }}>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">Patient ID: {diag.patientId}</div>
                          <div className="text-sm text-muted-foreground">Severity: {diag.severity} | Confidence: {diag.confidenceScore}</div>
                          <div className="text-sm text-muted-foreground">Status: {diag.status}</div>
                          <div className="text-sm text-muted-foreground">Created: {new Date(diag.createdAt).toLocaleString()}</div>
                        </div>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => handleOpenReviewDialog(diag)}>
                            Review
                          </Button>
                        </DialogTrigger>
                      </div>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit Doctor Review</DialogTitle>
                          <DialogDescription>
                            Add your review and update the severity or treatment plan for this diagnosis.
                          </DialogDescription>
                        </DialogHeader>
                        {selectedDiagnosis && selectedDiagnosis._id === diag._id && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Severity</label>
                              <select
                                className="w-full border rounded px-2 py-1"
                                value={updatedSeverity}
                                onChange={e => setUpdatedSeverity(e.target.value)}
                              >
                                <option value="">Select severity</option>
                                <option value="mild">mild</option>
                                <option value="moderate">moderate</option>
                                <option value="severe">severe</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Review</label>
                              <textarea
                                className="w-full border rounded px-2 py-1"
                                rows={3}
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                placeholder="Enter your review here..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Treatment Plan</label>
                              <textarea
                                className="w-full border rounded px-2 py-1"
                                rows={2}
                                value={treatmentPlan}
                                onChange={e => setTreatmentPlan(e.target.value)}
                                placeholder="Enter treatment plan..."
                              />
                            </div>
                            {successMessage && <div className="text-green-600 text-sm">{successMessage}</div>}
                            {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            onClick={handleSubmitReview}
                            disabled={isSubmitting || !updatedSeverity || !reviewText || !treatmentPlan}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Alerts content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}
