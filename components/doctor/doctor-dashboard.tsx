"use client"

import React, { useState, useEffect, useRef } from "react"
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
  User,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { appointmentService, Appointment } from '@/services/appointmentService';
import { diagnosisApi, Diagnosis } from '@/services/api/diagnosis';
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast";
import { io as socketIOClient, type Socket as IOSocket } from "socket.io-client";
import { fetchConversations } from "@/services/chatService";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { toast } = useToast();
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationBadge, setNotificationBadge] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reviewedDiagnosesCount, setReviewedDiagnosesCount] = useState<number>(0);
  const socketRef = useRef<IOSocket | null>(null);

  useEffect(() => {
    console.log('[DoctorDashboard] Mounting. User:', user);
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

  useEffect(() => {
    if (!user) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = socketIOClient(SOCKET_URL, {
      path: "/socket.io",
      auth: { token },
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('[DoctorDashboard] Connected to socket server');
      socket.emit('register', user.id);
    });
    socket.on('disconnect', () => {
      console.log('[DoctorDashboard] Disconnected from socket server');
    });
    // Listen for new message notifications
    socket.on('message:new', ({ conversationId, message, unreadCount }) => {
      console.log('[DoctorDashboard] Received message:new event:', { conversationId, message, unreadCount });
      setNotificationBadge(prev => prev + 1);
      setNotifications(prev => {
        // Prefer senderDisplayName, fallback to senderName, then senderId
        const displayName = message?.senderDisplayName || message?.senderName || message?.senderId || 'Unknown';
        const newNotifs = [
          {
            type: 'message',
            senderName: displayName,
            content: message?.content || '',
            timestamp: message?.createdAt || new Date().toISOString(),
          },
          ...prev
        ];
        console.log('[DoctorDashboard] Updated notifications:', newNotifs);
        return newNotifs;
      });
    });
    // Optionally listen for review:requested or other events here
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    // Fetch conversations and sum unread counts
    async function fetchUnread() {
      try {
        const data = await fetchConversations();
        const unread = data.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);
        setNotificationBadge(unread);

        // Populate notifications with unread messages (if desired)
        const unreadNotifs = data
          .filter((conv: any) => conv.unreadCount && conv.lastMessage)
          .map((conv: any) => ({
            type: 'message',
            senderName:
              (conv.lastMessage.senderId === conv.participantId && conv.participantName) ||
              conv.lastMessage.senderDisplayName ||
              conv.lastMessage.senderName ||
              conv.lastMessage.senderId ||
              'Unknown',
            content: conv.lastMessage.content || '',
            timestamp: conv.lastMessage.createdAt || new Date().toISOString(),
          }));
        setNotifications(unreadNotifs);

        console.log('[DoctorDashboard] Initial unread notifications:', unreadNotifs);
      } catch (err) {
        console.error('[DoctorDashboard] Failed to fetch conversations:', err);
      }
    }
    if (user) fetchUnread();
  }, [user]);

  useEffect(() => {
    const fetchReviewedDiagnoses = async () => {
      try {
        const response = await diagnosisApi.getReviewedDiagnosesByDoctor();
        setReviewedDiagnosesCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch (error) {
        setReviewedDiagnosesCount(0);
      }
    };
    if (user?.id) fetchReviewedDiagnoses();
  }, [user]);

  useEffect(() => {
    console.log('[DoctorDashboard] notificationBadge changed:', notificationBadge);
  }, [notificationBadge]);

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
            <div className="relative">
              <Button variant="outline" className="relative" onClick={() => setDropdownOpen((open) => !open)}>
                <Bell className="w-6 h-6" />
                {notificationBadge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {notificationBadge}
                  </span>
                )}
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 font-semibold">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 && (
                      <div className="p-4 text-gray-500 text-sm">No new notifications</div>
                    )}
                    {notifications.length > 0 && notifications.slice(0, 10).map((notif, idx) => (
                      <div key={idx} className="p-4 border-b last:border-0">
                        {notif.type === 'message' ? (
                          <div>
                            <span className="font-medium">New message</span> from <span className="font-semibold">{notif.senderName || 'Unknown'}</span>:<br />
                            <span className="text-gray-700 dark:text-gray-300">{notif.content}</span>
                          </div>
                        ) : notif.type === 'review' ? (
                          <div>
                            <span className="font-medium">Review requested</span> for <span className="font-semibold">{notif.patientName || 'Unknown'}</span>
                          </div>
                        ) : (
                          <div>{notif.content || 'Notification'}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">{notif.timestamp ? new Date(notif.timestamp).toLocaleString() : ''}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center text-xs text-indigo-600 hover:underline cursor-pointer" onClick={() => setDropdownOpen(false)}>
                    Close
                  </div>
                </div>
              )}
            </div>
            {/* <Button>Schedule Appointment</Button> */}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reviews">Pending Reviews</TabsTrigger>
            <TabsTrigger value="completed-reviews">Completed Reviews</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reviewedDiagnosesCount}</div>
                  <p className="text-xs text-muted-foreground">Total reviews completed</p>
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
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Manage your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : monthlyAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-center">No appointments scheduled</p>
                ) : (
                  <div className="space-y-4">
                    {monthlyAppointments.map((appointment) => (
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
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pending Doctor Reviews</CardTitle>
                <CardDescription>Diagnoses that require your review and action.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDiagnoses ? (
                  <div className="text-center py-8 text-muted-foreground">Loading pending diagnoses...</div>
                ) : pendingDiagnoses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <AlertTriangle className="w-8 h-8 mb-2 text-amber-500" />
                    No pending diagnoses found. You're all caught up!
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {pendingDiagnoses.map((diag) => {
                      const patient = diag.patient;
                      return (
                        <Card key={diag._id} className="shadow-md border border-muted">
                          <CardContent className="py-4">
                            <div className="flex items-center gap-4 mb-2">
                              <User className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-semibold">{patient ? `${patient.firstName} ${patient.lastName}` : diag.patientId}</div>
                                <div className="text-xs text-muted-foreground">{patient?.email}</div>
                                <div className="text-xs text-muted-foreground">{patient?.gender} | {patient?.dateOfBirth && new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="mb-2 flex flex-wrap gap-2">
                              <Badge variant="outline">{diag.mlResults?.prediction}</Badge>
                              <Badge color={diag.mlResults?.severity === "severe" ? "destructive" : diag.mlResults?.severity === "moderate" ? "warning" : "success"}>
                                {diag.mlResults?.severity}
                              </Badge>
                            </div>
                            <div className="text-sm mb-2">
                              <b>Confidence:</b> {diag.mlResults?.confidence}
                            </div>
                            <div className="text-sm mb-2">
                              <b>Affected Areas:</b> {diag.mlResults?.affectedAreas?.join(", ")}
                            </div>
                            <div className="text-sm mb-2">
                              <b>Status:</b> {diag.status}
                            </div>
                            <div className="text-sm mb-2">
                              <b>Diagnosis ID:</b> {diag.diagnosisId}
                            </div>
                            <div className="text-sm mb-2">
                              <b>Created At:</b> {diag.createdAt && new Date(diag.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <a href={diag.imageUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center">
                                <Eye className="w-4 h-4 mr-1" /> View Image
                              </a>
                            </div>
                            {/* Pre-Diagnosis Survey (if exists) */}
                            {diag.preDiagnosisSurvey && (
                              <div className="mb-2 p-2 bg-slate-50 rounded border border-slate-200">
                                <div className="font-semibold mb-1 text-sm text-indigo-700">Pre-Diagnosis Survey</div>
                                {Object.entries(diag.preDiagnosisSurvey).map(([key, value]) => (
                                  <div key={key} className="text-xs text-muted-foreground">
                                    <b>{key}:</b> {Array.isArray(value) ? value.join(", ") : String(value)}
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Post-Diagnosis Survey (if exists) */}
                            {diag.postDiagnosisSurvey && (
                              <div className="mb-2 p-2 bg-slate-50 rounded border border-slate-200">
                                <div className="font-semibold mb-1 text-sm text-indigo-700">Post-Diagnosis Survey</div>
                                {Object.entries(diag.postDiagnosisSurvey).map(([key, value]) => (
                                  <div key={key} className="text-xs text-muted-foreground">
                                    <b>{key}:</b> {Array.isArray(value) ? value.join(", ") : String(value)}
                                  </div>
                                ))}
                              </div>
                            )}
                            <Button size="sm" onClick={() => handleOpenReviewDialog(diag)}>
                              Review Diagnosis
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            {selectedDiagnosis && (
              <Dialog open={true} onOpenChange={(open) => { if (!open) setSelectedDiagnosis(null); }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Doctor Review</DialogTitle>
                    <DialogDescription>
                      Add your review and update the severity or treatment plan for this diagnosis.
                    </DialogDescription>
                  </DialogHeader>
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
