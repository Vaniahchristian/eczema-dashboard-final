"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Check, ExternalLink, Globe, Link2, Plus, RefreshCw, Smartphone, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const connectedApps = [
  {
    id: 1,
    name: "Apple Health",
    icon: "/placeholder.svg?height=40&width=40",
    status: "Connected",
    lastSync: "2 hours ago",
    permissions: ["Read health data", "Write health data"],
  },
  {
    id: 2,
    name: "Google Fit",
    icon: "/placeholder.svg?height=40&width=40",
    status: "Connected",
    lastSync: "1 day ago",
    permissions: ["Read activity data", "Read sleep data"],
  },
]

const availableApps = [
  {
    id: 3,
    name: "Fitbit",
    icon: "/placeholder.svg?height=40&width=40",
    description: "Track activity, sleep, and more",
  },
  {
    id: 4,
    name: "Samsung Health",
    icon: "/placeholder.svg?height=40&width=40",
    description: "Connect with Samsung Health data",
  },
  {
    id: 5,
    name: "Withings",
    icon: "/placeholder.svg?height=40&width=40",
    description: "Sync with Withings devices",
  },
  {
    id: 6,
    name: "Garmin Connect",
    icon: "/placeholder.svg?height=40&width=40",
    description: "Connect with Garmin wearables",
  },
]

const healthcareProviders = [
  {
    id: 1,
    name: "Dr. Smith Dermatology",
    status: "Connected",
    lastSync: "3 days ago",
  },
]

export default function IntegrationSettings() {
  const [syncingApp, setSyncingApp] = useState<number | null>(null)

  const handleSync = (id: number) => {
    setSyncingApp(id)
    // Simulate sync process
    setTimeout(() => {
      setSyncingApp(null)
    }, 2000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Integrations</h2>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          Discover Apps
        </Button>
      </div>

      {/* Connected Apps */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Smartphone className="h-5 w-5 mr-2 text-sky-500" />
          Connected Apps
        </h3>

        <div className="space-y-4">
          {connectedApps.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                      <Image
                        src={app.icon || "/placeholder.svg"}
                        alt={app.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      <CardDescription>
                        {app.status} • Last sync: {app.lastSync}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSync(app.id)}
                      disabled={syncingApp === app.id}
                    >
                      {syncingApp === app.id ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync
                        </>
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-500">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Disconnect {app.name}?</DialogTitle>
                          <DialogDescription>
                            This will disconnect your {app.name} account. You can reconnect it at any time.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive">Disconnect</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium mb-1">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {app.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" size="sm" className="px-0">
                  Manage Permissions
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Apps */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableApps.map((app) => (
            <div
              key={app.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-sky-200 dark:hover:border-sky-800 transition-colors"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                  <Image
                    src={app.icon || "/placeholder.svg"}
                    alt={app.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{app.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{app.description}</p>
                </div>
              </div>
              <Button size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Healthcare Providers */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Link2 className="h-5 w-5 mr-2 text-teal-500" />
          Healthcare Providers
        </h3>

        <div className="space-y-4">
          {healthcareProviders.map((provider) => (
            <Card key={provider.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription>
                      {provider.status} • Last sync: {provider.lastSync}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Records
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-500">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium mb-1">Shared Data:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Eczema Photos
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Treatment History
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Symptom Logs
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" size="sm" className="px-0">
                  Manage Connection
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
            <div className="mb-4">
              <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mx-auto">
                <Plus className="h-6 w-6 text-sky-500" />
              </div>
            </div>
            <h4 className="font-medium mb-2">Connect Healthcare Provider</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Securely share your health data with your healthcare providers
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* API Access */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ExternalLink className="h-5 w-5 mr-2 text-emerald-500" />
          API Access
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Developer API Access</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Enable API access for developers</p>
            </div>
            <Switch id="api-access" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Generate API Key</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Create a new API key for integration</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Generate Key
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">API Documentation</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">View documentation for our API</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              View Docs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

