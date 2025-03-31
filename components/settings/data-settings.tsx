"use client"

import React from "react"

import { useState } from "react"
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Database, HardDrive, RotateCcw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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

export default function DataSettings() {
  const [storageUsed, setStorageUsed] = useState(68)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [restoreInProgress, setRestoreInProgress] = useState(false)

  const handleBackup = () => {
    setBackupInProgress(true)
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false)
    }, 3000)
  }

  const handleRestore = () => {
    setRestoreInProgress(true)
    // Simulate restore process
    setTimeout(() => {
      setRestoreInProgress(false)
    }, 3000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Data Management</h2>
        <Button variant="outline" size="sm">
          <Database className="h-4 w-4 mr-2" />
          Data Report
        </Button>
      </div>

      {/* Storage Usage */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-sky-500" />
            Storage Usage
          </CardTitle>
          <CardDescription>Manage your data storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Used Storage</span>
              <span className="font-bold">{storageUsed}%</span>
            </div>
            <Progress value={storageUsed} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg">
                <div className="font-medium">Photos</div>
                <div className="text-slate-500 dark:text-slate-400">1.2 GB</div>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                <div className="font-medium">Health Data</div>
                <div className="text-slate-500 dark:text-slate-400">0.8 GB</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                <div className="font-medium">Other</div>
                <div className="text-slate-500 dark:text-slate-400">0.3 GB</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="ml-auto">
            Manage Storage
          </Button>
        </CardFooter>
      </Card>

      {/* Backup & Restore */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <RotateCcw className="h-5 w-5 mr-2 text-teal-500" />
          Backup & Restore
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Backup Data</CardTitle>
              <CardDescription>Create a backup of all your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Last backup: 3 days ago</p>
              <div className="flex items-center space-x-2">
                <Switch id="auto-backup" defaultChecked />
                <Label htmlFor="auto-backup">Automatic weekly backups</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBackup} disabled={backupInProgress} className="w-full">
                {backupInProgress ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Backing up...
                  </>
                ) : (
                  <>
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    Backup Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Restore Data</CardTitle>
              <CardDescription>Restore from a previous backup</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Available backups: 5</p>
              <div className="text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span>March 18, 2025</span>
                  <span className="text-sky-500">Current</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>March 11, 2025</span>
                  <span>2.1 GB</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span>March 4, 2025</span>
                  <span>2.0 GB</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleRestore} disabled={restoreInProgress} className="w-full">
                {restoreInProgress ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Restoring...
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine className="h-4 w-4 mr-2" />
                    Restore
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Data Privacy */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-emerald-500" />
          Data Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Anonymization</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Anonymize personal data in analytics</p>
            </div>
            <Switch id="anonymize" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Research Contribution</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow anonymized data to be used for research
              </p>
            </div>
            <Switch id="research" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Retention</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Keep data for 24 months</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Data Deletion */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-destructive">
          <Trash2 className="h-5 w-5 mr-2" />
          Data Deletion
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <p className="font-medium">Delete All Data</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Permanently delete all your data from our servers
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete All Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                    Delete All Data
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Please type <strong>DELETE</strong> to confirm.
                  </p>
                  <Input className="mt-2" placeholder="Type DELETE to confirm" />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Delete All Data</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center justify-between p-4 border border-amber-200 dark:border-amber-900/50 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <div>
              <p className="font-medium">Export & Delete</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Download all your data and delete it from our servers
              </p>
            </div>
            <Button variant="outline" size="sm">
              Export & Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// This component is used in the Data Settings component
const Label = ({ htmlFor, children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  )
}

// This component is used in the Data Settings component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

// Helper function for class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

