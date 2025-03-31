"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  Database,
  Download,
  HardDrive,
  RefreshCw,
  Shield,
  Wifi,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample performance data for charts
const performanceData = [
  { time: "00:00", cpu: 28, memory: 42, network: 15, response: 120 },
  { time: "01:00", cpu: 25, memory: 40, network: 12, response: 118 },
  { time: "02:00", cpu: 22, memory: 38, network: 10, response: 115 },
  { time: "03:00", cpu: 20, memory: 38, network: 8, response: 110 },
  { time: "04:00", cpu: 22, memory: 40, network: 10, response: 112 },
  { time: "05:00", cpu: 25, memory: 42, network: 12, response: 118 },
  { time: "06:00", cpu: 30, memory: 45, network: 18, response: 125 },
  { time: "07:00", cpu: 35, memory: 48, network: 25, response: 130 },
  { time: "08:00", cpu: 45, memory: 52, network: 35, response: 140 },
  { time: "09:00", cpu: 55, memory: 58, network: 45, response: 150 },
  { time: "10:00", cpu: 60, memory: 62, network: 50, response: 155 },
  { time: "11:00", cpu: 58, memory: 60, network: 48, response: 152 },
  { time: "12:00", cpu: 55, memory: 58, network: 45, response: 148 },
  { time: "13:00", cpu: 52, memory: 55, network: 42, response: 145 },
  { time: "14:00", cpu: 50, memory: 52, network: 40, response: 142 },
  { time: "15:00", cpu: 48, memory: 50, network: 38, response: 140 },
  { time: "16:00", cpu: 45, memory: 48, network: 35, response: 138 },
  { time: "17:00", cpu: 42, memory: 45, network: 32, response: 135 },
  { time: "18:00", cpu: 38, memory: 42, network: 28, response: 130 },
  { time: "19:00", cpu: 35, memory: 40, network: 25, response: 128 },
  { time: "20:00", cpu: 32, memory: 38, network: 22, response: 125 },
  { time: "21:00", cpu: 30, memory: 35, network: 20, response: 122 },
  { time: "22:00", cpu: 28, memory: 32, network: 18, response: 120 },
  { time: "23:00", cpu: 25, memory: 30, network: 15, response: 118 },
]

// Sample server data
const servers = [
  {
    id: "s1",
    name: "Web Server 1",
    status: "operational",
    uptime: "99.98%",
    location: "US East",
    cpu: 42,
    memory: 58,
    disk: 65,
    lastRestart: "15 days ago",
  },
  {
    id: "s2",
    name: "Web Server 2",
    status: "operational",
    uptime: "99.95%",
    location: "US East",
    cpu: 38,
    memory: 52,
    disk: 60,
    lastRestart: "10 days ago",
  },
  {
    id: "s3",
    name: "Database Server",
    status: "operational",
    uptime: "99.99%",
    location: "US East",
    cpu: 45,
    memory: 72,
    disk: 78,
    lastRestart: "30 days ago",
  },
  {
    id: "s4",
    name: "Cache Server",
    status: "operational",
    uptime: "99.97%",
    location: "US East",
    cpu: 25,
    memory: 48,
    disk: 35,
    lastRestart: "25 days ago",
  },
  {
    id: "s5",
    name: "Backup Server",
    status: "operational",
    uptime: "99.95%",
    location: "US West",
    cpu: 15,
    memory: 30,
    disk: 82,
    lastRestart: "45 days ago",
  },
]

// Sample error logs
const errorLogs = [
  {
    id: "e1",
    timestamp: "2023-11-15 14:32:45",
    level: "error",
    source: "Web Server 1",
    message: "Connection timeout when connecting to database",
    count: 3,
  },
  {
    id: "e2",
    timestamp: "2023-11-15 13:45:12",
    level: "warning",
    source: "Authentication Service",
    message: "Multiple failed login attempts detected",
    count: 12,
  },
  {
    id: "e3",
    timestamp: "2023-11-15 12:18:33",
    level: "error",
    source: "API Gateway",
    message: "Rate limit exceeded for endpoint /api/users",
    count: 8,
  },
  {
    id: "e4",
    timestamp: "2023-11-15 10:05:22",
    level: "info",
    source: "Database Server",
    message: "Automatic backup completed successfully",
    count: 1,
  },
  {
    id: "e5",
    timestamp: "2023-11-15 09:12:18",
    level: "warning",
    source: "File Storage Service",
    message: "Disk space usage above 80% threshold",
    count: 1,
  },
  {
    id: "e6",
    timestamp: "2023-11-15 08:45:30",
    level: "error",
    source: "Payment Processing",
    message: "Failed to connect to payment gateway",
    count: 5,
  },
  {
    id: "e7",
    timestamp: "2023-11-15 07:30:15",
    level: "info",
    source: "User Service",
    message: "User profile batch update completed",
    count: 1,
  },
]

export default function SystemMonitoring() {
  const [timeRange, setTimeRange] = useState("24h")
  const [refreshInterval, setRefreshInterval] = useState("30s")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Operational</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>
      case "outage":
        return <Badge className="bg-red-500">Outage</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>
      default:
        return <Badge>{level}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">System Monitoring</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor system performance and health</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={refreshInterval} onValueChange={setRefreshInterval}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Refresh Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">No Refresh</SelectItem>
              <SelectItem value="10s">10 Seconds</SelectItem>
              <SelectItem value="30s">30 Seconds</SelectItem>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">All Systems Operational</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Last incident: 15 days ago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124ms</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowDown className="h-3 w-3 mr-1" />
              -5ms from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.02%</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowDown className="h-3 w-3 mr-1" />
              -0.01% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Wifi className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-red-500 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" />
              +28 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Resource utilization over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  cpu: {
                    label: "CPU Usage (%)",
                    color: "hsl(var(--chart-1))",
                  },
                  memory: {
                    label: "Memory Usage (%)",
                    color: "hsl(var(--chart-2))",
                  },
                  network: {
                    label: "Network Traffic (Mbps)",
                    color: "hsl(var(--chart-3))",
                  },
                  response: {
                    label: "Response Time (ms)",
                    color: "hsl(var(--chart-4))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="cpu" stroke="var(--color-cpu)" strokeWidth={2} />
                    <Line type="monotone" dataKey="memory" stroke="var(--color-memory)" strokeWidth={2} />
                    <Line type="monotone" dataKey="network" stroke="var(--color-network)" strokeWidth={2} />
                    <Line type="monotone" dataKey="response" stroke="var(--color-response)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>Current system resource utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm font-medium">3.2GB / 8GB (40%)</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Disk Usage</span>
                      <span className="text-sm font-medium">1.8TB / 4TB (45%)</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network Bandwidth</span>
                      <span className="text-sm font-medium">450Mbps / 1Gbps (45%)</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium">Database Query Time</span>
                    <span className="text-sm font-medium">45ms</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium">API Response Time</span>
                    <span className="text-sm font-medium">124ms</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium">Page Load Time</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium">Cache Hit Ratio</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium">Error Rate</span>
                    <span className="text-sm font-medium">0.02%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Concurrent Users</span>
                    <span className="text-sm font-medium">342</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <Card key={server.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{server.name}</CardTitle>
                    {getStatusBadge(server.status)}
                  </div>
                  <CardDescription>
                    {server.location} • {server.uptime} Uptime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>CPU</span>
                        <span>{server.cpu}%</span>
                      </div>
                      <Progress value={server.cpu} className="h-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Memory</span>
                        <span>{server.memory}%</span>
                      </div>
                      <Progress value={server.memory} className="h-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Disk</span>
                        <span>{server.disk}%</span>
                      </div>
                      <Progress value={server.disk} className="h-1" />
                    </div>
                    <div className="pt-2 text-xs text-gray-500">Last restart: {server.lastRestart}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Restart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Error Logs</CardTitle>
                  <CardDescription>System errors and warnings</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
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
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Level
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4">{log.timestamp}</td>
                        <td className="px-6 py-4">{getLogLevelBadge(log.level)}</td>
                        <td className="px-6 py-4">{log.source}</td>
                        <td className="px-6 py-4">{log.message}</td>
                        <td className="px-6 py-4">{log.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-gray-500">Showing {errorLogs.length} log entries</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="px-4">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Database Backups</CardTitle>
                  <CardDescription>Backup history and management</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button size="sm">
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-300">Last Backup Successful</div>
                    <div className="text-sm text-green-700 dark:text-green-400">
                      Completed on November 15, 2023 at 02:00 AM • Size: 4.2GB
                    </div>
                  </div>
                </div>

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Time
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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr
                          key={i}
                          className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-4">Nov {15 - i}, 2023</td>
                          <td className="px-6 py-4">02:00 AM</td>
                          <td className="px-6 py-4">{4.2 - (i * 0.1).toFixed(1)}GB</td>
                          <td className="px-6 py-4">{i % 3 === 0 ? "Full" : "Incremental"}</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-500">Successful</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4" />
                                <span className="sr-only">Restore</span>
                              </Button>
                            </div>
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
                <Shield className="h-4 w-4 mr-2" />
                Backup Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

