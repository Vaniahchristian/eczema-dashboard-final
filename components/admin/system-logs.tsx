"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Download, Filter, Info, RefreshCw, Search, X } from "lucide-react"

// Sample data
const logEntries = [
  {
    id: 1,
    timestamp: "2023-08-15 14:32:45",
    level: "ERROR",
    source: "Authentication Service",
    message: "Failed login attempt for user admin@eczemaai.com from IP 192.168.1.1",
    details: "Multiple failed attempts detected. Account temporarily locked.",
  },
  {
    id: 2,
    timestamp: "2023-08-15 14:30:12",
    level: "INFO",
    source: "User Service",
    message: "User profile updated for dr.johnson@eczemaai.com",
    details: "Fields changed: phone_number, address",
  },
  {
    id: 3,
    timestamp: "2023-08-15 14:15:33",
    level: "WARNING",
    source: "Database Service",
    message: "High database load detected",
    details: "CPU usage at 85%, memory usage at 78%. Consider scaling resources.",
  },
  {
    id: 4,
    timestamp: "2023-08-15 14:10:05",
    level: "INFO",
    source: "Appointment Service",
    message: "New appointment created for patient ID 12345",
    details: "Appointment scheduled with Dr. Johnson on 2023-08-20 10:00 AM",
  },
  {
    id: 5,
    timestamp: "2023-08-15 14:05:22",
    level: "ERROR",
    source: "Storage Service",
    message: "Failed to upload medical image",
    details: "File size exceeds limit. File: patient_scan_12345.jpg, Size: 25MB, Limit: 20MB",
  },
  {
    id: 6,
    timestamp: "2023-08-15 14:01:18",
    level: "INFO",
    source: "Notification Service",
    message: "Email notification sent to patient123@gmail.com",
    details: "Notification type: Appointment Reminder, Status: Delivered",
  },
  {
    id: 7,
    timestamp: "2023-08-15 13:55:40",
    level: "WARNING",
    source: "API Gateway",
    message: "Rate limit approaching for client ID 5678",
    details: "Current rate: 95 requests/minute, Limit: 100 requests/minute",
  },
  {
    id: 8,
    timestamp: "2023-08-15 13:50:12",
    level: "INFO",
    source: "Authentication Service",
    message: "New user registered: patient456@gmail.com",
    details: "Registration source: Mobile App, Device: iPhone 13",
  },
  {
    id: 9,
    timestamp: "2023-08-15 13:45:33",
    level: "ERROR",
    source: "Payment Service",
    message: "Payment processing failed for transaction ID TX987654",
    details: "Error: Card declined. Customer notified via email.",
  },
  {
    id: 10,
    timestamp: "2023-08-15 13:40:05",
    level: "INFO",
    source: "Diagnosis Service",
    message: "New diagnosis created for patient ID 54321",
    details: "Diagnosis: Mild Eczema, Severity: 2/5, Treatment plan created",
  },
]

export default function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("All")
  const [sourceFilter, setSourceFilter] = useState("All")
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = levelFilter === "All" || log.level === levelFilter
    const matchesSource = sourceFilter === "All" || log.source === sourceFilter

    return matchesSearch && matchesLevel && matchesSource
  })

  const sources = Array.from(new Set(logEntries.map((log) => log.source)))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-gray-700">
            <RefreshCw className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export Logs</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
                <span className="text-sm">Level: {levelFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown would go here */}
            </div>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
                <span className="text-sm">Source: {sourceFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown would go here */}
            </div>

            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.level === "ERROR"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : log.level === "WARNING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{log.source}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="max-w-md truncate">{log.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      onClick={() => setSelectedLog(log)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{filteredLogs.length}</span> of{" "}
            <span className="font-medium">{logEntries.length}</span> logs
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm">2</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm">3</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Log Details</h2>
              <button onClick={() => setSelectedLog(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
                  <p>{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedLog.level === "ERROR"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : selectedLog.level === "WARNING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                  <p>{selectedLog.source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Log ID</p>
                  <p>{selectedLog.id}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Message</p>
                <p className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">{selectedLog.message}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Details</p>
                <p className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg whitespace-pre-wrap">{selectedLog.details}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                  onClick={() => setSelectedLog(null)}
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Download</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">System Status</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">API Service</h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Operational
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Response time: 45ms</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Database</h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Operational
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Query time: 32ms</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Storage Service</h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Degraded
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">High latency detected</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Authentication</h3>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Operational
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Auth time: 120ms</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium">System Maintenance</h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Scheduled maintenance on August 20, 2023 from 2:00 AM to 4:00 AM UTC. Some services may be unavailable
              during this time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

