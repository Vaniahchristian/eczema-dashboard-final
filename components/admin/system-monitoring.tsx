"use client"

import React, { useState, useEffect, useCallback } from "react"
import { adminService } from "@/services/adminService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, AlertTriangle, CheckCircle, Clock, Cpu, Database, FileText, MemoryStick, RefreshCw, Server, Users } from 'lucide-react'

interface DatabaseHistory {
  timestamp: string;
  queries: number;
  threads: number;
}

interface MongoHistory extends Omit<DatabaseHistory, 'queries' | 'threads'> {
  objects: number;
  dataSize: number;
}

interface MySQLStats {
  threads_connected: number;
  max_used_connections: number;
  queries: number;
  table_count: number;
  history: DatabaseHistory[];
}

interface MongoDBStats {
  collections: number;
  objects: number;
  avgObjSize: number;
  dataSize: number;
  storageSize: number;
  indexes: number;
  totalIndexSize: number;
  history: MongoHistory[];
}

interface DatabaseStats {
  mysql: MySQLStats;
  mongodb: MongoDBStats;
}

interface RecentActivity {
  type: string;
  date: string;
  details: string;
  level: string;
}

interface Alert {
  type: string;
  level: string;
  message: string;
  timestamp: string;
}

interface SystemLog {
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

interface SystemData {
  totalUsers: number;
  systemUptime: number;
  activeSessions: number;
  errorRate: number;
  recentActivity: RecentActivity[];
  alerts: Alert[];
  diagnosesCount: number;
  cpuLoad: {
    usage: number;
    cores: number;
  };
  memoryUsage: {
    heapTotal: number;
    heapUsed: number;
    rss: number;
    external: number;
  };
  databaseStats: DatabaseStats;
  apiResponseTimes: {
    overall: {
      averageResponseTime: number;
      totalRequests: number;
    };
    endpointStats: Record<string, {
      count: number;
      totalTime: number;
      avgTime: number;
    }>;
  };
  logs: SystemLog[];
}

// Convert uptime seconds to human readable format
const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}

const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps): JSX.Element => {
  const colors: Record<string, string> = {
    operational: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    online: 'bg-green-500 text-white',
    offline: 'bg-red-500 text-white',
    info: 'bg-blue-100 text-blue-800',
    debug: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || colors.info}`}>
      {status}
    </span>
  );
};

interface SystemMonitoringProps {}

export default function SystemMonitoring({}: SystemMonitoringProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshInterval] = useState<number>(30000); // 30 seconds
  
  const [systemData, setSystemData] = useState<SystemData>({
    totalUsers: 0,
    systemUptime: 0,
    activeSessions: 0,
    errorRate: 0,
    recentActivity: [],
    alerts: [],
    diagnosesCount: 0,
    cpuLoad: { usage: 0, cores: 1 },
    memoryUsage: {
      heapTotal: 0,
      heapUsed: 0,
      rss: 0,
      external: 0
    },
    databaseStats: {
      mysql: {
        threads_connected: 0,
        max_used_connections: 0,
        queries: 0,
        table_count: 0,
        history: []
      },
      mongodb: {
        collections: 0,
        objects: 0,
        avgObjSize: 0,
        dataSize: 0,
        storageSize: 0,
        indexes: 0,
        totalIndexSize: 0,
        history: []
      }
    },
    apiResponseTimes: {
      overall: { averageResponseTime: 0, totalRequests: 0 },
      endpointStats: {}
    },
    logs: []
  }));

  const parseLogLine = (line: string): SystemData['logs'][0] | null => {
    try {
      const match = line.match(/\[(.*?)\]\s*\[(.*?)\]\s*\[(.*?)\]\s*(.*)$/);
      if (!match) return null;

      const [_, timestamp, level, source, message] = match;
      return {
        timestamp,
        level,
        message,
        source
      };
    } catch (error) {
      console.error('Error parsing log line:', error);
      return null;
    }
  };

  const fetchSystemData = useCallback(async () => {
    interface SystemMetrics {
      totalUsers: number;
      systemUptime: number;
      activeSessions: number;
      errorRate: number;
      recentActivity: any[];
      alerts: any[];
      diagnosesCount: number;
      cpuLoad: { usage: number; cores: number };
      memoryUsage: {
        heapTotal: number;
        heapUsed: number;
        rss: number;
        external: number;
      };
      databaseStats: {
        mysql: {
          threads_connected: number;
          max_used_connections: number;
          queries: number;
          table_count: number;
          history: any[];
        };
        mongodb: {
          collections: number;
          objects: number;
          avgObjSize: number;
          dataSize: number;
          storageSize: number;
          indexes: number;
          totalIndexSize: number;
          history: any[];
        };
      };
      apiResponseTimes: {
        overall: { averageResponseTime: number; totalRequests: number };
        endpointStats: Record<string, any>;
      };
    }
    try {
      setLoading(true);
      const [
        totalUsersResponse,
        uptimeResponse,
        sessionsResponse,
        errorRateResponse,
        activityResponse,
        alertsResponse,
        diagnosesResponse,
        logsResponse
      ] = await Promise.all([
        adminService.getTotalUsers(),
        adminService.getSystemUptime(),
        adminService.getActiveSessions(),
        adminService.getErrorRate(),
        adminService.getRecentActivity(),
        adminService.getAlerts(),
        adminService.getDiagnosesCount(),
        adminService.getSystemLogs()
      ]);
      
      const data = {
        totalUsers: totalUsersResponse?.data?.count || 0,
        systemUptime: uptimeResponse?.data?.uptime || 0,
        activeSessions: sessionsResponse?.data?.count || 0,
        errorRate: errorRateResponse?.data?.rate || 0,
        recentActivity: activityResponse?.data?.activities || [],
        alerts: alertsResponse?.data?.alerts || [],
        diagnosesCount: diagnosesResponse?.data?.count || 0,
        cpuLoad: { usage: 0, cores: 1 },
        memoryUsage: {
          heapTotal: 0,
          heapUsed: 0,
          rss: 0,
          external: 0
        },
        databaseStats: {
          mysql: {
            threads_connected: 0,
            max_used_connections: 0,
            queries: 0,
            table_count: 0,
            history: []
          },
          mongodb: {
            collections: 0,
            objects: 0,
            avgObjSize: 0,
            dataSize: 0,
            storageSize: 0,
            indexes: 0,
            totalIndexSize: 0,
            history: []
          }
        },
        apiResponseTimes: {
          overall: { averageResponseTime: 0, totalRequests: 0 },
          endpointStats: {}
        },
        logs: Array.isArray(logsResponse?.data?.logs) ? logsResponse.data.logs : []
      };
      
      setSystemData(prevData => ({ ...prevData, ...data }));
    } catch (error) {
      console.error("Error fetching system data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSystemData();
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };

    void fetchData();
    const interval = setInterval(() => void fetchData(), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchSystemData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSystemData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="api">API Performance</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemData.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemData.activeSessions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemData.errorRate}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(systemData.systemUptime / 3600)}h {Math.floor((systemData.systemUptime % 3600) / 60)}m
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage</CardTitle>
                <CardDescription>
                  Current CPU load across {systemData.cpuLoad.cores} cores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Usage</div>
                    <div className="text-sm">{systemData.cpuLoad.usage}%</div>
                  </div>
                  <Progress value={systemData.cpuLoad.usage} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>
                  Server memory allocation and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Heap Used</div>
                    <div className="text-sm">{Math.round(systemData.memoryUsage.heapUsed / 1024 / 1024)}MB</div>
                  </div>
                  <Progress value={(systemData.memoryUsage.heapUsed / systemData.memoryUsage.heapTotal) * 100} />
                  <div className="text-xs text-muted-foreground">
                    Total Heap: {Math.round(systemData.memoryUsage.heapTotal / 1024 / 1024)}MB
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>MySQL Stats</CardTitle>
                <CardDescription>Current MySQL server statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Active Connections</div>
                    <div className="text-sm">{systemData.databaseStats.mysql.threads_connected}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Total Queries</div>
                    <div className="text-sm">{systemData.databaseStats.mysql.queries}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Tables</div>
                    <div className="text-sm">{systemData.databaseStats.mysql.table_count}</div>
                  </div>
                  {systemData.databaseStats.mysql.history && systemData.databaseStats.mysql.history.length > 0 && (
                    <div className="h-[200px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={systemData.databaseStats.mysql.history}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                          <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="queries" stroke="#82ca9d" name="Queries/min" />
                          <Line yAxisId="right" type="monotone" dataKey="threads" stroke="#8884d8" name="Active Threads" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MongoDB Stats</CardTitle>
                <CardDescription>Current MongoDB server statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Collections</div>
                    <div className="text-sm">{systemData.databaseStats.mongodb.collections}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Total Objects</div>
                    <div className="text-sm">{systemData.databaseStats.mongodb.objects}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Data Size</div>
                    <div className="text-sm">{Math.round(systemData.databaseStats.mongodb.dataSize / 1024 / 1024)}MB</div>
                  </div>
                  {systemData.databaseStats.mongodb.history && systemData.databaseStats.mongodb.history.length > 0 && (
                    <div className="h-[200px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={systemData.databaseStats.mongodb.history}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                          <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="objects" stroke="#82ca9d" name="Total Objects" />
                          <Line yAxisId="right" type="monotone" dataKey="dataSize" stroke="#8884d8" name="Data Size (MB)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
                <CardDescription>
                  Average response times and request counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Average Response Time</div>
                    <div className="text-sm">{systemData.apiResponseTimes.overall.averageResponseTime}ms</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Total Requests</div>
                    <div className="text-sm">{systemData.apiResponseTimes.overall.totalRequests}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endpoint Performance</CardTitle>
                <CardDescription>Response times by endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(systemData.apiResponseTimes.endpointStats).map(([endpoint, stats]) => (
                    <div key={endpoint} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{endpoint}</div>
                        <div className="text-sm">{stats.avgTime}ms</div>
                      </div>
                      <Progress value={(stats.avgTime / (stats.avgTime * 2)) * 100} />
                      <div className="text-xs text-muted-foreground">
                        {stats.count} requests
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Logs
              </CardTitle>
              <CardDescription>Recent system activity and error logs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {systemData.logs && systemData.logs.length > 0 ? systemData.logs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex flex-col space-y-1 rounded-lg p-2 ${log.level === 'error' ? 'bg-red-100 dark:bg-red-900/20' : 
                        log.level === 'warn' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
                        'bg-gray-100 dark:bg-gray-800'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{log.source}</span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                    </div>
                  )) : (
                    <div className="text-center text-muted-foreground py-8">
                      No logs available
                    </div>
                  )}
                </div>
              </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
}


    }, 30000)
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
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Database Query Time</p>
                    <p className="text-2xl font-bold">{systemData.queryTime}ms</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatUptime(systemData.systemUptime)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">API Response Time</p>
                    <p className="text-2xl font-bold">{systemData.responseTime}ms</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Page Load Time</p>
                    <p className="text-2xl font-bold">{systemData.pageLoadTime}s</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Cache Hit Ratio</p>
                    <p className="text-2xl font-bold">{systemData.cacheHitRatio}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Concurrent Users</p>
                    <p className="text-2xl font-bold">{systemData.concurrentUsers}</p>
                  </div>
                </div>
              </div>
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
                      <span className="text-sm font-medium">{systemData.cpuUsage}%</span>
                    </div>
                    <Progress value={systemData.cpuUsage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm font-medium">
                        {(systemData.memoryUsage.used / 1024).toFixed(1)}GB / 
                        {(systemData.memoryUsage.total / 1024).toFixed(1)}GB 
                        ({systemData.memoryUsage.percentage}%)
                      </span>
                    </div>
                    <Progress value={systemData.memoryUsage.percentage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Disk Usage</span>
                      <span className="text-sm font-medium">
                        {(systemData.diskUsage.used / 1024).toFixed(1)}TB / 
                        {(systemData.diskUsage.total / 1024).toFixed(1)}TB 
                        ({systemData.diskUsage.percentage}%)
                      </span>
                    </div>
                    <Progress value={systemData.diskUsage.percentage} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network Bandwidth</span>
                      <span className="text-sm font-medium">
                        {systemData.networkUsage.bandwidth}Mbps / 
                        {systemData.networkUsage.maxBandwidth}Mbps 
                        ({systemData.networkUsage.percentage}%)
                      </span>
                    </div>
                    <Progress value={systemData.networkUsage.percentage} className="h-2" />
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
                        <td className="px-6 py-4"><StatusBadge status="operational" /></td>
                        <td className="px-6 py-4">Uptime: {formatUptime(systemData.systemUptime)}</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">User Service</td>
                        <td className="px-6 py-4"><StatusBadge status="operational" /></td>
                        <td className="px-6 py-4">{systemData.totalUsers} registered users</td>
                      </tr>
                      <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">Diagnosis Service</td>
                        <td className="px-6 py-4"><StatusBadge status="operational" /></td>
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

