"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Database,
  Download,
  FileText,
  HardDrive,
  History,
  MoreHorizontal,
  RefreshCw,
  Save,
  Shield,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Sample backup data
const backups = [
  {
    id: "b1",
    name: "Full System Backup",
    date: "Nov 15, 2023",
    time: "02:00 AM",
    size: "4.2GB",
    type: "Full",
    status: "completed",
    retention: "30 days",
  },
  {
    id: "b2",
    name: "Database Backup",
    date: "Nov 14, 2023",
    time: "02:00 AM",
    size: "2.1GB",
    type: "Incremental",
    status: "completed",
    retention: "30 days",
  },
  {
    id: "b3",
    name: "User Data Backup",
    date: "Nov 13, 2023",
    time: "02:00 AM",
    size: "1.8GB",
    type: "Incremental",
    status: "completed",
    retention: "30 days",
  },
  {
    id: "b4",
    name: "Content Backup",
    date: "Nov 12, 2023",
    time: "02:00 AM",
    size: "0.9GB",
    type: "Incremental",
    status: "completed",
    retention: "30 days",
  },
  {
    id: "b5",
    name: "Full System Backup",
    date: "Nov 8, 2023",
    time: "02:00 AM",
    size: "4.0GB",
    type: "Full",
    status: "completed",
    retention: "30 days",
  },
]

// Sample export history
const exports = [
  {
    id: "e1",
    name: "User Data Export",
    date: "Nov 14, 2023",
    time: "10:15 AM",
    size: "250MB",
    format: "CSV",
    status: "completed",
    requestedBy: "Admin User",
  },
  {
    id: "e2",
    name: "Analytics Data Export",
    date: "Nov 10, 2023",
    time: "03:45 PM",
    size: "180MB",
    format: "JSON",
    status: "completed",
    requestedBy: "Admin User",
  },
  {
    id: "e3",
    name: "Content Export",
    date: "Nov 5, 2023",
    time: "09:30 AM",
    size: "320MB",
    format: "XML",
    status: "completed",
    requestedBy: "Admin User",
  },
]

export default function DataManagement() {
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showBackupDialog, setShowBackupDialog] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-500">Scheduled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">Data Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage system data, backups, and exports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowBackupDialog(true)}>
            <Save className="h-4 w-4 mr-2" />
            Backup Now
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Overview</CardTitle>
          <CardDescription>System storage utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Storage</span>
                <span className="text-sm font-medium">4TB</span>
              </div>
              <Progress value={45} className="h-2" />
              <div className="text-xs text-gray-500">1.8TB used (45%)</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Data</span>
                <span className="text-sm font-medium">800GB</span>
              </div>
              <Progress value={40} className="h-2" />
              <div className="text-xs text-gray-500">20% of total storage</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Media Storage</span>
                <span className="text-sm font-medium">600GB</span>
              </div>
              <Progress value={30} className="h-2" />
              <div className="text-xs text-gray-500">15% of total storage</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backups</span>
                <span className="text-sm font-medium">400GB</span>
              </div>
              <Progress value={20} className="h-2" />
              <div className="text-xs text-gray-500">10% of total storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="exports">Data Exports</TabsTrigger>
          <TabsTrigger value="imports">Data Imports</TabsTrigger>
          <TabsTrigger value="cleanup">Data Cleanup</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Backup History</CardTitle>
                  <CardDescription>System and data backups</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-300">Backup System Healthy</div>
                    <div className="text-sm text-green-700 dark:text-green-400">
                      Last backup completed successfully on November 15, 2023 at 02:00 AM
                    </div>
                  </div>
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Retention
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {backups.map((backup) => (
                        <tr
                          key={backup.id}
                          className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-4 font-medium">{backup.name}</td>
                          <td className="px-6 py-4">
                            {backup.date} {backup.time}
                          </td>
                          <td className="px-6 py-4">{backup.size}</td>
                          <td className="px-6 py-4">{backup.type}</td>
                          <td className="px-6 py-4">{getStatusBadge(backup.status)}</td>
                          <td className="px-6 py-4">{backup.retention}</td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History className="h-4 w-4 mr-2" />
                                  Restore
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Verify
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t p-4">
              <div className="text-sm text-gray-500">Backup Schedule: Daily at 02:00 AM • Retention: 30 days</div>
              <Button variant="outline" size="sm">
                <HardDrive className="h-4 w-4 mr-2" />
                Backup Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Export History</CardTitle>
                  <CardDescription>Data export records</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setShowExportDialog(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    New Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Format
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Requested By
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exports.map((export_) => (
                      <tr
                        key={export_.id}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 font-medium">{export_.name}</td>
                        <td className="px-6 py-4">
                          {export_.date} {export_.time}
                        </td>
                        <td className="px-6 py-4">{export_.size}</td>
                        <td className="px-6 py-4">{export_.format}</td>
                        <td className="px-6 py-4">{getStatusBadge(export_.status)}</td>
                        <td className="px-6 py-4">{export_.requestedBy}</td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Import</CardTitle>
              <CardDescription>Import data into the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                <FileText className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-300">Import Guidelines</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    Supported formats: CSV, JSON, XML • Maximum file size: 500MB
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
                  <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                  <Button onClick={() => setShowImportDialog(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </div>

              <div className="flex items-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-300">Important Note</div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">
                    Importing data will merge with existing records. Consider creating a backup before proceeding.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Cleanup</CardTitle>
              <CardDescription>Manage and clean up system data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <div className="font-medium text-red-800 dark:text-red-300">Warning</div>
                  <div className="text-sm text-red-700 dark:text-red-400">
                    Data cleanup operations are irreversible. Please ensure you have a recent backup before proceeding.
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Temporary Files</h3>
                      <p className="text-sm text-gray-500">Clear temporary and cache files</p>
                    </div>
                    <Badge className="bg-blue-500">250MB</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Clear Temporary Files
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Log Files</h3>
                      <p className="text-sm text-gray-500">Clear old system logs</p>
                    </div>
                    <Badge className="bg-blue-500">180MB</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Clear Log Files
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Old Backups</h3>
                      <p className="text-sm text-gray-500">Remove backups older than retention period</p>
                    </div>
                    <Badge className="bg-blue-500">1.2GB</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Clear Old Backups
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Deleted User Data</h3>
                      <p className="text-sm text-gray-500">Permanently remove data from deleted users</p>
                    </div>
                    <Badge className="bg-blue-500">320MB</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Clear Deleted User Data
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Database Optimization</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Optimize Database Tables</h4>
                      <p className="text-sm text-gray-500">Reorganize and optimize database tables</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Database className="h-4 w-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rebuild Indexes</h4>
                      <p className="text-sm text-gray-500">Rebuild database indexes for better performance</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Database className="h-4 w-4 mr-2" />
                      Rebuild
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>Import data into the system from external files.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="import-type" className="text-right text-sm font-medium">
                Data Type
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">User Data</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="settings">System Settings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="import-format" className="text-right text-sm font-medium">
                Format
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="import-file" className="text-right text-sm font-medium">
                File
              </label>
              <Input id="import-file" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="import-options" className="text-right text-sm font-medium">
                Options
              </label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="overwrite" className="rounded border-gray-300" />
                  <label htmlFor="overwrite">Overwrite existing data</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="validate" className="rounded border-gray-300" checked />
                  <label htmlFor="validate">Validate before import</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>Export system data to external files.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="export-name" className="text-right text-sm font-medium">
                Export Name
              </label>
              <Input id="export-name" placeholder="Enter export name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="export-type" className="text-right text-sm font-medium">
                Data Type
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">User Data</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="system">System Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="export-format" className="text-right text-sm font-medium">
                Format
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="export-options" className="text-right text-sm font-medium">
                Options
              </label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-metadata" className="rounded border-gray-300" checked />
                  <label htmlFor="include-metadata">Include metadata</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="compress" className="rounded border-gray-300" checked />
                  <label htmlFor="compress">Compress export file</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Backup</DialogTitle>
            <DialogDescription>Create a new system backup.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="backup-name" className="text-right text-sm font-medium">
                Backup Name
              </label>
              <Input id="backup-name" placeholder="Enter backup name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="backup-type" className="text-right text-sm font-medium">
                Backup Type
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select backup type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Backup</SelectItem>
                  <SelectItem value="incremental">Incremental Backup</SelectItem>
                  <SelectItem value="differential">Differential Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="backup-scope" className="text-right text-sm font-medium">
                Scope
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="user-data">User Data Only</SelectItem>
                  <SelectItem value="content">Content Only</SelectItem>
                  <SelectItem value="settings">Settings Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="backup-retention" className="text-right text-sm font-medium">
                Retention
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="365d">1 Year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

