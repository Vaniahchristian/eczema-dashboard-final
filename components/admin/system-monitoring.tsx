"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/services/adminService"
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
  Users,
  Wifi
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SystemData {
  totalUsers: number
  systemUptime: number
  activeSessions: number
  errorRate: number
  recentActivity: Array<{
    id: string
    timestamp: string
    level: string
    source: string
    message: string
    count: number
  }>
  alerts: Array<{
    type: string
    level: string
    message: string
  }>
  diagnosesCount: number
}

// Convert uptime seconds to human readable format
const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}

export default function SystemMonitoring() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [systemData, setSystemData] = useState<SystemData>({
    totalUsers: 0,
    systemUptime: 0,
    activeSessions: 0,
    errorRate: 0,
    recentActivity: [],
    alerts: [],
    diagnosesCount: 0
  })

  const fetchSystemData = async () => {
    try {
      setLoading(true)
      const [totalUsers, systemUptime, activeSessions, errorRate, recentActivity, alerts, diagnosesCount] = await Promise.all([
        adminService.getTotalUsers(),
        adminService.getSystemUptime(),
        adminService.getActiveSessions(),
        adminService.getErrorRate(),
        adminService.getRecentActivity(),
        adminService.getAlerts(),
        adminService.getDiagnosesCount()
      ])

      setSystemData({
        totalUsers: totalUsers.totalUsers || 0,
        systemUptime: systemUptime.systemUptime || 0,
        activeSessions: activeSessions.activeSessions || 0,
        errorRate: errorRate.errorRate || 0,
        recentActivity: recentActivity.activities || [],
        alerts: alerts.alerts || [],
        diagnosesCount: diagnosesCount.count || 0
      })
    } catch (error) {
      console.error('Error fetching system data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemData()

    const interval = setInterval(() => {
      fetchSystemData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return <Badge className="bg-green-500">Operational</Badge>
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>
      case "error":
        return <Badge className="bg-red-500">Error</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
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
          <Button 
            size="sm" 
            onClick={() => {
              setLoading(true)
              fetchSystemData()
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active user base
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(systemData.systemUptime)}</div>
            <p className="text-xs text-muted-foreground">
              Since last restart
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              In last 15 minutes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemData.errorRate}</div>
            <p className="text-xs text-muted-foreground">
              Errors in last 24h
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
                  errorRate: {
                    label: "Error Rate",
                    color: "hsl(var(--chart-1))",
                  },
                  activeSessions: {
                    label: "Active Sessions",
                    color: "hsl(var(--chart-2))",
                  },
                  diagnosesCount: {
                    label: "Total Diagnoses",
                    color: "hsl(var(--chart-3))",
                  }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { time: formatUptime(systemData.systemUptime), 
                      errorRate: systemData.errorRate,
                      activeSessions: systemData.activeSessions,
                      diagnosesCount: systemData.diagnosesCount
                    }
                  ]}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="errorRate" stroke="var(--color-errorRate)" strokeWidth={2} />
                    <Line type="monotone" dataKey="activeSessions" stroke="var(--color-activeSessions)" strokeWidth={2} />
                    <Line type="monotone" dataKey="diagnosesCount" stroke="var(--color-diagnosesCount)" strokeWidth={2} />
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
            {/* Add server cards here */}
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
                    {systemData.recentActivity.map((activity, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4">{activity.date}</td>
                        <td className="px-6 py-4">{getLogLevelBadge(activity.level)}</td>
                        <td className="px-6 py-4">{activity.source}</td>
                        <td className="px-6 py-4">{activity.message}</td>
                        <td className="px-6 py-4">{activity.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-gray-500">Showing {systemData.recentActivity.length} log entries</div>
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
                {systemData.alerts.length === 0 ? (
                  <div className="flex items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-300">All Systems Operational</div>
                      <div className="text-sm text-green-700 dark:text-green-400">
                        No incidents reported in the last 24 hours
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {systemData.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-4 rounded-lg border ${alert.level === 'warning' ? 'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-900/30' : alert.level === 'danger' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'}`}
                      >
                        <AlertTriangle className={`h-5 w-5 mr-3 ${alert.level === 'warning' ? 'text-yellow-500' : alert.level === 'danger' ? 'text-red-500' : 'text-blue-500'}`} />
                        <div>
                          <div className={`font-medium ${alert.level === 'warning' ? 'text-yellow-800 dark:text-yellow-300' : alert.level === 'danger' ? 'text-red-800 dark:text-red-300' : 'text-blue-800 dark:text-blue-300'}`}>
                            {alert.type}
                          </div>
                          <div className={`text-sm ${alert.level === 'warning' ? 'text-yellow-700 dark:text-yellow-400' : alert.level === 'danger' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                            {alert.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Service</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">API Server</td>
                        <td className="px-6 py-4">{getStatusBadge('operational')}</td>
                        <td className="px-6 py-4">Uptime: {formatUptime(systemData.systemUptime)}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">User Service</td>
                        <td className="px-6 py-4">{getStatusBadge('operational')}</td>
                        <td className="px-6 py-4">{systemData.totalUsers} registered users</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">Diagnosis Service</td>
                        <td className="px-6 py-4">{getStatusBadge('operational')}</td>
                        <td className="px-6 py-4">{systemData.diagnosesCount} diagnoses recorded</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

