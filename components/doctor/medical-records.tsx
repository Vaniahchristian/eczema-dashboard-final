"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  FileText,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  User,
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

// Sample medical records data
const records = [
  {
    id: "REC-1001",
    patientId: "P-1002",
    patientName: "Michael Chen",
    type: "Diagnosis Report",
    date: "2023-05-28",
    doctor: "Dr. Johnson",
    status: "Final",
    tags: ["Eczema", "Severe"],
  },
  {
    id: "REC-1002",
    patientId: "P-1002",
    patientName: "Michael Chen",
    type: "Treatment Plan",
    date: "2023-05-28",
    doctor: "Dr. Johnson",
    status: "Final",
    tags: ["Eczema", "Medication"],
  },
  {
    id: "REC-1003",
    patientId: "P-1001",
    patientName: "Sarah Johnson",
    type: "Lab Results",
    date: "2023-06-01",
    doctor: "Dr. Johnson",
    status: "Final",
    tags: ["Blood Test", "Allergy"],
  },
  {
    id: "REC-1004",
    patientId: "P-1003",
    patientName: "Emily Rodriguez",
    type: "Consultation Notes",
    date: "2023-06-05",
    doctor: "Dr. Johnson",
    status: "Draft",
    tags: ["Eczema", "Mild"],
  },
  {
    id: "REC-1005",
    patientId: "P-1004",
    patientName: "David Kim",
    type: "Prescription",
    date: "2023-05-15",
    doctor: "Dr. Johnson",
    status: "Final",
    tags: ["Medication", "Refill"],
  },
  {
    id: "REC-1006",
    patientId: "P-1005",
    patientName: "Jennifer Lee",
    type: "Referral",
    date: "2023-06-08",
    doctor: "Dr. Johnson",
    status: "Pending",
    tags: ["Dermatology", "Specialist"],
  },
  {
    id: "REC-1007",
    patientId: "P-1002",
    patientName: "Michael Chen",
    type: "Follow-up Notes",
    date: "2023-04-28",
    doctor: "Dr. Johnson",
    status: "Final",
    tags: ["Eczema", "Progress"],
  },
  {
    id: "REC-1008",
    patientId: "P-1008",
    patientName: "Thomas Wilson",
    type: "Diagnosis Report",
    date: "2023-05-05",
    doctor: "Dr. Johnson",
    status: "Final",
    tags: ["Eczema", "Severe"],
  },
]

export default function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  // Filter records based on search term and active tab
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "final") return matchesSearch && record.status === "Final"
    if (activeTab === "draft") return matchesSearch && record.status === "Draft"
    if (activeTab === "pending") return matchesSearch && record.status === "Pending"

    return matchesSearch
  })

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
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
          <h1 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">Medical Records</h1>
          <p className="text-slate-600 dark:text-slate-400">View and manage patient medical records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Record
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Records Management</CardTitle>
          <CardDescription>Access and manage patient medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Search records..."
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
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="final">Final</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <button className="flex items-center" onClick={() => requestSort("id")}>
                      ID
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("patientName")}>
                      Patient
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("type")}>
                      Type
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center" onClick={() => requestSort("date")}>
                      Date
                    </button>
                  </TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{record.patientName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{record.patientId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.doctor}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "Final" ? "default" : record.status === "Draft" ? "outline" : "secondary"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {record.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
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
                              <Eye className="mr-2 h-4 w-4" />
                              View Record
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Record
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
            Showing {sortedRecords.length} of {records.length} records
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest record updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Treatment Plan Created</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">For Michael Chen</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <Pencil className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Lab Results Updated</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">For Sarah Johnson</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Consultation Notes Viewed</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">For Emily Rodriguez</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Records requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Finalize Consultation Notes</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">For Emily Rodriguez</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Due today</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Review Referral Request</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">For Jennifer Lee</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Due tomorrow</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Update Treatment Plan</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">For Thomas Wilson</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Due in 3 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common record tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create New Record
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Patient Lookup
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

