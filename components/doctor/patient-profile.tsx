"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Edit,
  Clock,
  Activity,
  Pill,
  Clipboard,
  BarChart,
  Camera,
  History,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Sample patient data
const patientData = {
  id: "P-1002",
  name: "Michael Chen",
  age: 45,
  gender: "Male",
  email: "michael.chen@example.com",
  phone: "(555) 123-4567",
  address: "123 Main St, Anytown, CA 94321",
  condition: "Severe Eczema",
  lastVisit: "2023-05-28",
  nextVisit: "2023-06-18",
  status: "Active",
  severity: "Severe",
  compliance: "Moderate",
  alerts: 2,
  doctor: "Dr. Johnson",
  insuranceProvider: "HealthPlus Insurance",
  insuranceNumber: "HP-987654321",
  emergencyContact: "Lisa Chen (Wife) - (555) 987-6543",
  allergies: ["Peanuts", "Penicillin", "Dust mites"],
  medications: [
    { name: "Hydrocortisone 2.5%", dosage: "Apply twice daily", status: "Active" },
    { name: "Tacrolimus Ointment", dosage: "Apply once daily", status: "Active" },
    { name: "Antihistamine", dosage: "10mg daily", status: "Active" },
    { name: "Prednisone", dosage: "5mg daily", status: "Discontinued" },
  ],
  treatmentPlan: {
    startDate: "2023-04-15",
    endDate: "2023-07-15",
    goals: [
      { description: "Reduce inflammation", progress: 65 },
      { description: "Minimize itching", progress: 40 },
      { description: "Improve sleep quality", progress: 80 },
    ],
    notes:
      "Patient showing improvement but still experiencing flare-ups. Consider adjusting medication if no further improvement in 2 weeks.",
  },
  appointments: [
    {
      date: "2023-05-28",
      type: "Follow-up",
      notes: "Patient reported increased itching at night. Adjusted medication.",
    },
    { date: "2023-05-01", type: "Regular Check-up", notes: "Condition stable. Continued current treatment plan." },
    {
      date: "2023-04-15",
      type: "Initial Consultation",
      notes: "Diagnosed with severe eczema. Started treatment plan.",
    },
  ],
  upcomingAppointments: [{ date: "2023-06-18", time: "10:30 AM", type: "Follow-up", status: "Confirmed" }],
  images: [
    { date: "2023-05-28", url: "/placeholder.svg?height=150&width=150", area: "Left arm" },
    { date: "2023-05-01", url: "/placeholder.svg?height=150&width=150", area: "Left arm" },
    { date: "2023-04-15", url: "/placeholder.svg?height=150&width=150", area: "Left arm" },
  ],
  metrics: {
    itchSeverity: [4, 5, 3, 4, 2, 3, 2],
    sleepQuality: [3, 2, 4, 4, 5, 4, 5],
    flareUps: [2, 1, 1, 0, 1, 0, 0],
  },
}

interface PatientProfileProps {
  patientId: string
}

export default function PatientProfile({ patientId }: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, you would fetch the patient data based on the ID
  // For this example, we'll just use the sample data
  const patient = patientData

  return (
    <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/doctor/patients">
          <Button variant="outline" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patients
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Patient Profile</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage patient information and treatment</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={patient.name} />
                <AvatarFallback className="text-2xl">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <div className="flex items-center mt-1">
                <Badge
                  variant={
                    patient.severity === "Severe"
                      ? "destructive"
                      : patient.severity === "Moderate"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {patient.severity} Eczema
                </Badge>
                {patient.alerts > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {patient.alerts} Alerts
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Patient ID: {patient.id}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Basic Information</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">Age:</div>
                  <div className="text-sm font-medium">{patient.age}</div>
                  <div className="text-sm">Gender:</div>
                  <div className="text-sm font-medium">{patient.gender}</div>
                  <div className="text-sm">Status:</div>
                  <div className="text-sm font-medium">
                    <Badge variant={patient.status === "Active" ? "default" : "outline"}>{patient.status}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Contact Information</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="text-sm">
                    Email: <span className="font-medium">{patient.email}</span>
                  </div>
                  <div className="text-sm">
                    Phone: <span className="font-medium">{patient.phone}</span>
                  </div>
                  <div className="text-sm">
                    Address: <span className="font-medium">{patient.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Medical Information</h3>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <div className="text-sm">
                    Primary Doctor: <span className="font-medium">{patient.doctor}</span>
                  </div>
                  <div className="text-sm">
                    Insurance: <span className="font-medium">{patient.insuranceProvider}</span>
                  </div>
                  <div className="text-sm">
                    Policy #: <span className="font-medium">{patient.insuranceNumber}</span>
                  </div>
                  <div className="text-sm">
                    Emergency Contact: <span className="font-medium">{patient.emergencyContact}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Allergies</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Patient Overview</CardTitle>
            <CardDescription>Quick summary of patient's condition and treatment</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="treatment">Treatment Plan</TabsTrigger>
                <TabsTrigger value="history">Medical History</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Current Medications</h3>
                    <div className="space-y-3">
                      {patient.medications
                        .filter((med) => med.status === "Active")
                        .map((medication, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-medium">{medication.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{medication.dosage}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Upcoming Appointments</h3>
                    {patient.upcomingAppointments.length > 0 ? (
                      <div className="space-y-3">
                        {patient.upcomingAppointments.map((appointment, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mr-2 mt-0.5">
                              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.type}</p>
                              <Badge
                                variant={appointment.status === "Confirmed" ? "default" : "outline"}
                                className="mt-1"
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">No upcoming appointments</p>
                    )}

                    <Button variant="outline" className="mt-4 w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Treatment Goals</h3>
                  <div className="space-y-4">
                    {patient.treatmentPlan.goals.map((goal, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{goal.description}</span>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-4 relative">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-indigo-100 dark:bg-indigo-900"></div>
                      </div>
                      <div>
                        <p className="font-medium">Updated symptom log</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Reported increased itching at night
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">2 days ago</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-4 relative">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-indigo-100 dark:bg-indigo-900"></div>
                      </div>
                      <div>
                        <p className="font-medium">Medication adherence</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Missed evening application of hydrocortisone
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">3 days ago</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Appointment completed</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Follow-up appointment with Dr. Johnson
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="treatment" className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Current Treatment Plan</h3>
                    <Badge>Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-sm">Start Date:</div>
                    <div className="text-sm font-medium">
                      {new Date(patient.treatmentPlan.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">End Date:</div>
                    <div className="text-sm font-medium">
                      {new Date(patient.treatmentPlan.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm mb-4">{patient.treatmentPlan.notes}</p>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Update Treatment Plan
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Medications</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 gap-4 p-4 font-medium border-b">
                      <div>Medication</div>
                      <div>Dosage</div>
                      <div>Status</div>
                    </div>
                    {patient.medications.map((medication, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-4 border-b last:border-0">
                        <div>{medication.name}</div>
                        <div>{medication.dosage}</div>
                        <div>
                          <Badge variant={medication.status === "Active" ? "default" : "outline"}>
                            {medication.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Medication
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Treatment Goals</h3>
                  <div className="space-y-4">
                    {patient.treatmentPlan.goals.map((goal, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{goal.description}</span>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Appointment History</h3>
                  <div className="space-y-4">
                    {patient.appointments.map((appointment, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 relative">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          {index < patient.appointments.length - 1 && (
                            <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-indigo-100 dark:bg-indigo-900"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.type}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1">{appointment.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Medication History</h3>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                      <div>Medication</div>
                      <div>Dosage</div>
                      <div>Status</div>
                      <div>Period</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 border-b">
                      <div>Prednisone</div>
                      <div>5mg daily</div>
                      <div>
                        <Badge variant="outline">Discontinued</Badge>
                      </div>
                      <div>Mar 15, 2023 - Apr 15, 2023</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 p-4 border-b">
                      <div>Clobetasol</div>
                      <div>Apply twice daily</div>
                      <div>
                        <Badge variant="outline">Discontinued</Badge>
                      </div>
                      <div>Feb 1, 2023 - Mar 15, 2023</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Condition Images</h3>
                  <Button size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Upload New Image
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {patient.images.map((image, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`${image.area} on ${new Date(image.date).toLocaleDateString()}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardFooter className="p-3">
                        <div className="w-full">
                          <p className="font-medium">{image.area}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(image.date).toLocaleDateString()}
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <Button variant="outline">View All Images</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Patient-reported symptoms and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-slate-500 dark:text-slate-400">
                <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Health metrics visualization would appear here</p>
                <p className="text-sm mt-2">Showing data for the last 7 days</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <History className="mr-2 h-4 w-4" />
              View Historical Data
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes & Observations</CardTitle>
            <CardDescription>Clinical notes and observations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Follow-up Appointment</h4>
                  <span className="text-sm text-slate-500 dark:text-slate-400">May 28, 2023</span>
                </div>
                <p className="text-sm">
                  Patient reported increased itching at night, particularly on arms and neck. Skin appears inflamed with
                  visible scratching marks. Adjusted medication to include higher strength hydrocortisone for nighttime
                  application.
                </p>
                <div className="flex items-center mt-4 text-sm text-slate-500 dark:text-slate-400">
                  <Clipboard className="h-4 w-4 mr-1" />
                  <span>Dr. Johnson</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Regular Check-up</h4>
                  <span className="text-sm text-slate-500 dark:text-slate-400">May 1, 2023</span>
                </div>
                <p className="text-sm">
                  Condition appears stable. Patient reports good compliance with medication regimen. Some improvement
                  noted in affected areas. Continuing current treatment plan with follow-up in 4 weeks.
                </p>
                <div className="flex items-center mt-4 text-sm text-slate-500 dark:text-slate-400">
                  <Clipboard className="h-4 w-4 mr-1" />
                  <span>Dr. Johnson</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Note
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

