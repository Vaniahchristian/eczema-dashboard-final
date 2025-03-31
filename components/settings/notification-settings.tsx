"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Phone, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function NotificationSettings() {
  const [emailVerified, setEmailVerified] = useState(true)
  const [phoneVerified, setPhoneVerified] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Notification Settings</h2>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Pause All
        </Button>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
          <TabsTrigger value="preferences">Notification Types</TabsTrigger>
        </TabsList>

        {/* Notification Channels Tab */}
        <TabsContent value="channels" className="pt-6">
          <div className="space-y-8">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-sky-500" />
                <h3 className="text-lg font-semibold">Email Notifications</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">sarah.johnson@example.com</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {emailVerified ? (
                      <span className="text-green-500 flex items-center">Verified</span>
                    ) : (
                      <span className="text-amber-500">Not verified</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="email-notifications" defaultChecked />
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-teal-500" />
                <h3 className="text-lg font-semibold">Push Notifications</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mobile App</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Notifications on your mobile device</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Web Browser</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Notifications in your web browser</p>
                </div>
                <Switch id="browser-notifications" />
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-emerald-500" />
                <h3 className="text-lg font-semibold">SMS Notifications</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {phoneVerified ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-amber-500">Not verified - Verify now</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sms-notifications" disabled={!phoneVerified} />
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>

              {!phoneVerified && (
                <div className="flex items-center space-x-2 mt-2">
                  <Input placeholder="Enter verification code" className="max-w-xs" />
                  <Button size="sm">Verify</Button>
                </div>
              )}
            </div>

            {/* In-App Notifications */}
            <div className="space-y-4">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-semibold">In-App Notifications</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notification Center</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Notifications within the application</p>
                </div>
                <Switch id="in-app-notifications" defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notification Preferences Tab */}
        <TabsContent value="preferences" className="pt-6">
          <div className="space-y-8">
            {/* Health Reminders */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Reminders</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Medication Reminders</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reminders to take your medication</p>
                </div>
                <RadioGroup defaultValue="all" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="medication-all" />
                    <Label htmlFor="medication-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="medication-important" />
                    <Label htmlFor="medication-important">Important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="medication-none" />
                    <Label htmlFor="medication-none">None</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Treatment Reminders</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reminders for treatments and routines</p>
                </div>
                <RadioGroup defaultValue="all" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="treatment-all" />
                    <Label htmlFor="treatment-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="treatment-important" />
                    <Label htmlFor="treatment-important">Important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="treatment-none" />
                    <Label htmlFor="treatment-none">None</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Health Logging Reminders</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reminders to log your health data</p>
                </div>
                <RadioGroup defaultValue="important" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="logging-all" />
                    <Label htmlFor="logging-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="logging-important" />
                    <Label htmlFor="logging-important">Important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="logging-none" />
                    <Label htmlFor="logging-none">None</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Appointments & Messages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Appointments & Messages</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Notifications about upcoming appointments
                  </p>
                </div>
                <RadioGroup defaultValue="all" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="appointment-all" />
                    <Label htmlFor="appointment-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="appointment-important" />
                    <Label htmlFor="appointment-important">Important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="appointment-none" />
                    <Label htmlFor="appointment-none">None</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Message Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Notifications about new messages</p>
                </div>
                <RadioGroup defaultValue="all" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="message-all" />
                    <Label htmlFor="message-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="important" id="message-important" />
                    <Label htmlFor="message-important">Important</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="message-none" />
                    <Label htmlFor="message-none">None</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* System & Updates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System & Updates</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Important system updates and alerts</p>
                </div>
                <Switch id="system-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Feature Updates</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">New features and improvements</p>
                </div>
                <Switch id="feature-updates" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Promotions, newsletters, and offers</p>
                </div>
                <Switch id="marketing" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

