"use client"

import { useState } from "react"
import { Search, Plus, Filter, Calendar, FileText, Pill, CheckCircle, AlertCircle, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for treatment plans
const MOCK_TREATMENT_PLANS = [
  {
    id: "tp-001",
    patientName: "Emma Johnson",
    patientId: "P-1234",
    patientImage: "/placeholder.svg?height=40&width=40",
    condition: "Atopic Dermatitis (Moderate)",
    status: "active",
    lastUpdated: "2023-03-15",
    nextAppointment: "2023-04-02",
    medications: [
      { name: "Tacrolimus Ointment", dosage: "0.1%, apply twice daily", duration: "4 weeks" },
      { name: "Hydrocortisone Cream", dosage: "1%, apply as needed for flares", duration: "As needed" },
    ],
    notes: "Patient showing good response to current treatment. Continue monitoring for flare triggers.",
  },
  {
    id: "tp-002",
    patientName: "Michael Chen",
    patientId: "P-2345",
    patientImage: "/placeholder.svg?height=40&width=40",
    condition: "Severe Eczema with Secondary Infection",
    status: "urgent",
    lastUpdated: "2023-03-18",
    nextAppointment: "2023-03-25",
    medications: [
      { name: "Clobetasol Propionate", dosage: "0.05%, apply twice daily", duration: "2 weeks" },
      { name: "Cephalexin", dosage: "500mg, 4 times daily", duration: "10 days" },
    ],
    notes: "Secondary infection present. Prescribed antibiotics and scheduled follow-up in 1 week.",
  },
  {
    id: "tp-003",
    patientName: "Sophia Martinez",
    patientId: "P-3456",
    patientImage: "/placeholder.svg?height=40&width=40",
    condition: "Mild Eczema",
    status: "completed",
    lastUpdated: "2023-02-28",
    nextAppointment: "2023-05-15",
    medications: [
      { name: "Hydrocortisone Cream", dosage: "1%, apply as needed", duration: "As needed" },
      { name: "Moisturizing Cream", dosage: "Apply liberally after bathing", duration: "Ongoing" },
    ],
    notes: "Treatment completed successfully. Scheduled 3-month follow-up for monitoring.",
  },
  {
    id: "tp-004",
    patientName: "David Wilson",
    patientId: "P-4567",
    patientImage: "/placeholder.svg?height=40&width=40",
    condition: "Moderate Eczema with Allergic Component",
    status: "active",
    lastUpdated: "2023-03-10",
    nextAppointment: "2023-04-10",
    medications: [
      { name: "Mometasone Furoate", dosage: "0.1%, apply once daily", duration: "3 weeks" },
      { name: "Cetirizine", dosage: "10mg, once daily", duration: "30 days" },
    ],
    notes: "Added antihistamine to address allergic component. Recommended allergy testing.",
  },
  {
    id: "tp-005",
    patientName: "Olivia Brown",
    patientId: "P-5678",
    patientImage: "/placeholder.svg?height=40&width=40",
    condition: "Nummular Eczema",
    status: "pending",
    lastUpdated: "2023-03-20",
    nextAppointment: "2023-03-27",
    medications: [],
    notes: "Initial assessment completed. Awaiting lab results before finalizing treatment plan.",
  },
]

// Mock data for diagnoses
const MOCK_DIAGNOSES = [
  { id: "d1", name: "Atopic Dermatitis" },
  { id: "d2", name: "Contact Dermatitis" },
  { id: "d3", name: "Nummular Eczema" },
  { id: "d4", name: "Dyshidrotic Eczema" },
  { id: "d5", name: "Seborrheic Dermatitis" },
  { id: "d6", name: "Stasis Dermatitis" },
  { id: "d7", name: "Neurodermatitis" },
]

// Mock data for medications
const MOCK_MEDICATIONS = [
  { id: "m1", name: "Hydrocortisone Cream", type: "Topical Corticosteroid", strength: ["0.5%", "1%", "2.5%"] },
  { id: "m2", name: "Clobetasol Propionate", type: "Topical Corticosteroid", strength: ["0.05%"] },
  { id: "m3", name: "Tacrolimus Ointment", type: "Calcineurin Inhibitor", strength: ["0.03%", "0.1%"] },
  { id: "m4", name: "Pimecrolimus Cream", type: "Calcineurin Inhibitor", strength: ["1%"] },
  { id: "m5", name: "Cetirizine", type: "Antihistamine", strength: ["5mg", "10mg"] },
  { id: "m6", name: "Cephalexin", type: "Antibiotic", strength: ["250mg", "500mg"] },
  { id: "m7", name: "Prednisone", type: "Oral Corticosteroid", strength: ["5mg", "10mg", "20mg"] },
]

export default function TreatmentPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Filter treatment plans based on search term and active tab
  const filteredPlans = MOCK_TREATMENT_PLANS.filter((plan) => {
    const matchesSearch =
      plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.condition.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && plan.status === activeTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
            Active
          </Badge>
        )
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
            Urgent
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
            Completed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "urgent":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Treatment Plans</h1>
          <p className="text-muted-foreground">Create and manage patient treatment plans</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Treatment Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Treatment Plan</DialogTitle>
                <DialogDescription>Create a comprehensive treatment plan for your patient.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger id="patient">
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_TREATMENT_PLANS.map((plan) => (
                          <SelectItem key={plan.patientId} value={plan.patientId}>
                            {plan.patientName} ({plan.patientId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                    <Select>
                      <SelectTrigger id="diagnosis">
                        <SelectValue placeholder="Select diagnosis" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_DIAGNOSES.map((diagnosis) => (
                          <SelectItem key={diagnosis.id} value={diagnosis.id}>
                            {diagnosis.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Medications</Label>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="medication">Medication</Label>
                            <Select>
                              <SelectTrigger id="medication">
                                <SelectValue placeholder="Select medication" />
                              </SelectTrigger>
                              <SelectContent>
                                {MOCK_MEDICATIONS.map((med) => (
                                  <SelectItem key={med.id} value={med.id}>
                                    {med.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="strength">Strength</Label>
                            <Select>
                              <SelectTrigger id="strength">
                                <SelectValue placeholder="Select strength" />
                              </SelectTrigger>
                              <SelectContent>
                                {MOCK_MEDICATIONS[0].strength.map((str) => (
                                  <SelectItem key={str} value={str}>
                                    {str}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration</Label>
                            <Select>
                              <SelectTrigger id="duration">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1week">1 Week</SelectItem>
                                <SelectItem value="2weeks">2 Weeks</SelectItem>
                                <SelectItem value="4weeks">4 Weeks</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="asneeded">As Needed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea id="instructions" placeholder="Enter detailed instructions for this medication" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Another Medication
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up Appointment</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input id="followUp" type="date" className="w-full" />
                    <Select>
                      <SelectTrigger id="followUpTime">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9am">9:00 AM</SelectItem>
                        <SelectItem value="10am">10:00 AM</SelectItem>
                        <SelectItem value="11am">11:00 AM</SelectItem>
                        <SelectItem value="1pm">1:00 PM</SelectItem>
                        <SelectItem value="2pm">2:00 PM</SelectItem>
                        <SelectItem value="3pm">3:00 PM</SelectItem>
                        <SelectItem value="4pm">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Treatment Notes</Label>
                  <Textarea id="notes" placeholder="Enter detailed notes about this treatment plan" rows={4} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Create Treatment Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, ID, or condition..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={plan.patientImage} alt={plan.patientName} />
                          <AvatarFallback>
                            {plan.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{plan.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{plan.patientId}</p>
                        </div>
                      </div>
                      <div>{getStatusBadge(plan.status)}</div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium">Condition</h4>
                      <p>{plan.condition}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-sm">{plan.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Next Appointment</p>
                          <p className="text-sm">{plan.nextAppointment}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Pill className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Medications</p>
                          <p className="text-sm">{plan.medications.length} prescribed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between md:justify-center items-center p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
                    <Dialog
                      open={isViewDialogOpen && selectedPlan?.id === plan.id}
                      onOpenChange={(open) => {
                        if (!open) setSelectedPlan(null)
                        setIsViewDialogOpen(open)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mb-0 md:mb-2" onClick={() => setSelectedPlan(plan)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center">
                            {getStatusIcon(plan.status)}
                            <DialogTitle className="ml-2">Treatment Plan Details</DialogTitle>
                          </div>
                          <DialogDescription>
                            Treatment plan for {plan.patientName} ({plan.patientId})
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                          <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <Avatar className="h-16 w-16 mr-4">
                              <AvatarImage src={plan.patientImage} alt={plan.patientName} />
                              <AvatarFallback>
                                {plan.patientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{plan.patientName}</h3>
                              <p className="text-muted-foreground">{plan.patientId}</p>
                              <div className="mt-2">{getStatusBadge(plan.status)}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-2">Diagnosis</h4>
                            <p>{plan.condition}</p>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-2">Medications</h4>
                            {plan.medications.length > 0 ? (
                              <div className="space-y-4">
                                {plan.medications.map((med, index) => (
                                  <Card key={index}>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5 className="font-medium">{med.name}</h5>
                                          <p className="text-sm text-muted-foreground">{med.dosage}</p>
                                        </div>
                                        <Badge>{med.duration}</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No medications prescribed yet.</p>
                            )}
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-2">Follow-up Appointment</h4>
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                              <p>{plan.nextAppointment}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-2">Treatment Notes</h4>
                            <p>{plan.notes}</p>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-2">Timeline</h4>
                            <div className="space-y-4">
                              <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                  <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                                </div>
                                <div>
                                  <p className="font-medium">Treatment Plan Created</p>
                                  <p className="text-sm text-muted-foreground">{plan.lastUpdated}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                </div>
                                <div>
                                  <p className="font-medium">Next Follow-up Scheduled</p>
                                  <p className="text-sm text-muted-foreground">{plan.nextAppointment}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" className="flex-1">
                            Edit Plan
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Print Plan
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                            onClick={() => setIsViewDialogOpen(false)}
                          >
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" className="w-full">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <FileText className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No treatment plans found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? `No results found for "${searchTerm}". Try a different search term.`
                : "Create your first treatment plan to get started."}
            </p>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Treatment Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

