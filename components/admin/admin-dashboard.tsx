"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Database,
  Server,
  Shield,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today")

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">System overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">System Settings</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-green-500 flex items-center">
              +12% <ArrowUpRight className="h-3 w-3 ml-1" />
              <span className="text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Live count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.02%</div>
            <p className="text-xs text-green-500 flex items-center">
              -0.01% <ArrowUpRight className="h-3 w-3 ml-1 rotate-180" />
              <span className="text-gray-500 dark:text-gray-400 ml-1">from yesterday</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by role and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Patients</span>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">2,128</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: "86%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Doctors</span>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">328</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: "13%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admins</span>
                    <div className="flex items-center">
                      <span className="font-bold mr-2">12</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full" style={{ width: "1%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span>Active</span>
                      <span className="font-bold">1,845</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Inactive</span>
                      <span className="font-bold">611</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/admin/users">View User Management</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current status and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <span className="font-bold">124ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Load</span>
                    <span className="font-bold">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Memory Usage</span>
                    <span className="font-bold">3.2GB / 8GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CPU Utilization</span>
                    <span className="font-bold">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Storage</span>
                    <span className="font-bold">1.8TB / 4TB</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/admin/monitoring">View System Monitoring</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Recent security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <div className="font-medium">Security Scan Completed</div>
                      <div className="text-sm text-gray-500">No vulnerabilities detected • 2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <div className="font-medium">Firewall Rules Updated</div>
                      <div className="text-sm text-gray-500">12 rules modified • 1 day ago</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <div>
                      <div className="font-medium">Failed Login Attempts</div>
                      <div className="text-sm text-gray-500">IP: 192.168.1.45 • 2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <div className="font-medium">Database Backup Completed</div>
                      <div className="text-sm text-gray-500">Size: 4.2GB • 3 days ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/admin/security">View Security Center</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">System Update Deployed</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Version 2.{8 - i}.0 - Performance improvements and bug fixes
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {i} {i === 1 ? "day" : "days"} ago • Admin: System
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Warnings and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800 dark:text-yellow-300">Scheduled Maintenance</div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        System will be unavailable for maintenance on Sunday, March 28th from 2:00 AM to 4:00 AM UTC.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-800 dark:text-red-300">High CPU Usage Detected</div>
                      <div className="text-sm text-red-700 dark:text-red-400 mt-1">
                        Server 2 is experiencing unusually high CPU usage (92%). This may affect system performance.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-300">
                        Database Optimization Complete
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Database optimization has been completed successfully. Query performance improved by 24%.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

