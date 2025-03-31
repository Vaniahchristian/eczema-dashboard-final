"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  UserPlus,
  FileText,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample patient data
const patients = [
  {
    id: "P-1001",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    condition: "Moderate Eczema",
    lastVisit: "2023-06-01",
    nextVisit: "2023-07-15",
    status: "Active",
    severity: "Moderate",
    compliance: "Good",
    alerts: 0,
  },
  {
    id: "P-1002",
    name: "Michael Chen",
    age: 45,
    gender: "Male",
    condition: "Severe Eczema",
    lastVisit: "2023-05-28",
    nextVisit: "2023-06-18",
    status: "Active",
    severity: "Severe",
    compliance: "Moderate",
    alerts: 2,
  },
  {
    id: "P-1003",
    name: "Emily Rodriguez",
    age: 28,
    gender: "Female",
    condition: "Mild Eczema",
    lastVisit: "2023-06-05",
    nextVisit: "2023-08-05",
    status: "Active",
    severity: "Mild",
    compliance: "Excellent",
    alerts: 0,
  },
  {
    id: "P-1004",
    name: "David Kim",
    age: 52,
    gender: "Male",
    condition: "Moderate Eczema",
    lastVisit: "2023-05-15",
    nextVisit: "2023-06-20",
    status: "Active",
    severity: "Moderate",
    compliance: "Poor",
    alerts: 1,
  },
  {
    id: "P-1005",
    name: "Jennifer Lee",
    age: 37,
    gender: "Female",
    condition: "Severe Eczema",
    lastVisit: "2023-06-08",
    nextVisit: "2023-06-22",
    status: "Active",
    severity: "Severe",
    compliance: "Good",
    alerts: 1,
  },
  {
    id: "P-1006",
    name: "Robert Smith",
    age: 41,
    gender: "Male",
    condition: "Moderate Eczema",
    lastVisit: "2023-05-20",
    nextVisit: "2023-07-01",
    status: "Inactive",
    severity: "Moderate",
    compliance: "Moderate",
    alerts: 0,
  },
  {
    id: "P-1007",
    name: "Maria Garcia",
    age: 29,
    gender: "Female",
    condition: "Mild Eczema",
    lastVisit: "2023-06-10",
    nextVisit: "2023-09-10",
    status: "Active",
    severity: "Mild",
    compliance: "Excellent",
    alerts: 0,
  },
  {
    id: "P-1008",
    name: "Thomas Wilson",
    age: 48,
    gender: "Male",
    condition: "Severe Eczema",
    lastVisit: "2023-05-05",
    nextVisit: "2023-06-15",
    status: "Active",
    severity: "Severe",
    compliance: "Poor",
    alerts: 3,
  },
]

export default function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter patients based on search term and active tab
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && patient.status === "Active"
    if (activeTab === "severe") return matchesSearch && patient.severity === "Severe"
    if (activeTab === "alerts") return matchesSearch && patient.alerts > 0

    return matchesSearch
  })

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (!sortConfig) return 0

    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (name: string) => {
    if (!sortConfig || sortConfig.key !== name) {
      return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  return (
    <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/doctor">
            <Button variant="outline" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Patient Management</h1>
          <p className="text-slate-600 dark:text-slate-400">View and manage your patients</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>Manage your patients and their treatment plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Patient
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Patient List
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Batch Appointments
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Patients</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="severe">Severe Cases</TabsTrigger>
              <TabsTrigger value="alerts">
                Alerts
                <Badge variant="destructive" className="ml-2">
                  7
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <button className="flex items-center" onClick={() => requestSort("id")}>
                      ID {getSortIcon("id")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("name")}>
                      Name {getSortIcon("name")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("age")}>
                      Age {getSortIcon("age")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("condition")}>
                      Condition {getSortIcon("condition")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("severity")}>
                      Severity {getSortIcon("severity")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("lastVisit")}>
                      Last Visit {getSortIcon("lastVisit")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("nextVisit")}>
                      Next Visit {getSortIcon("nextVisit")}
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No patients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {patient.name}
                          {patient.alerts > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {patient.alerts}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.condition}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            patient.severity === "Severe"
                              ? "destructive"
                              : patient.severity === "Moderate"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {patient.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(patient.nextVisit).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "Active" ? "default" : "outline"}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Add Alert
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {sortedPatients.length} of {patients.length} patients
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

