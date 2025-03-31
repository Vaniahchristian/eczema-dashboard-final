"use client"

import { useState } from "react"
import { AlertTriangle, Code, Download, FileJson, RotateCcw, Settings, Terminal, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdvancedSettings() {
  const [resetInProgress, setResetInProgress] = useState(false)

  const handleReset = () => {
    setResetInProgress(true)
    // Simulate reset process
    setTimeout(() => {
      setResetInProgress(false)
    }, 3000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Advanced Settings</h2>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          System Status
        </Button>
      </div>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          These settings are intended for advanced users. Incorrect configuration may affect system performance.
        </AlertDescription>
      </Alert>

      {/* Developer Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2 text-sky-500" />
          Developer Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Debug Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Enable detailed logging for troubleshooting</p>
            </div>
            <Switch id="debug-mode" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Developer Console</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Access advanced developer tools</p>
            </div>
            <Switch id="developer-console" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Performance Metrics</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show performance data in the UI</p>
            </div>
            <Switch id="performance-metrics" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-endpoint">Custom API Endpoint</Label>
            <div className="flex space-x-2">
              <Input id="custom-endpoint" placeholder="https://api.example.com" className="flex-1" />
              <Button variant="outline">Save</Button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Only change if instructed by support</p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Data Management */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileJson className="h-5 w-5 mr-2 text-teal-500" />
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Download className="h-5 w-5 mr-2 text-sky-500" />
                <h4 className="font-medium">Export Data</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Export all your data in JSON format</p>
              <Button variant="outline" size="sm">
                Export JSON
              </Button>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Upload className="h-5 w-5 mr-2 text-emerald-500" />
                <h4 className="font-medium">Import Data</h4>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Import data from a JSON file</p>
              <Button variant="outline" size="sm">
                Import JSON
              </Button>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Advanced Data Operations</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="custom-query">Custom Database Query</Label>
                    <Textarea
                      id="custom-query"
                      placeholder="Enter SQL query..."
                      className="font-mono text-sm"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" disabled>
                        <Terminal className="h-4 w-4 mr-2" />
                        Execute Query
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Compression</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Compress stored data to save space</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Optimize Storage
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <Separator className="my-8" />

      {/* System Maintenance */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <RotateCcw className="h-5 w-5 mr-2 text-rose-500" />
          System Maintenance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear Cache</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Clear application cache data</p>
            </div>
            <Button variant="outline" size="sm">
              Clear Cache
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rebuild Indexes</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Optimize database performance</p>
            </div>
            <Button variant="outline" size="sm">
              Rebuild
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5 cursor-pointer">
                <div>
                  <p className="font-medium text-destructive">Reset Application</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Reset the application to default settings
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Reset
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                  Reset Application
                </DialogTitle>
                <DialogDescription>
                  This will reset all settings to their default values. Your data will not be deleted, but all
                  customizations will be lost.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Please type <strong>RESET</strong> to confirm.
                </p>
                <Input placeholder="Type RESET to confirm" />
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleReset} disabled={resetInProgress}>
                  {resetInProgress ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Resetting...
                    </>
                  ) : (
                    "Reset Application"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

