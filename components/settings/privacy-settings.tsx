"use client"

import { useState } from "react"
import { AlertCircle, Info, Shield, ShieldAlert, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacySettings() {
  const [securityScore, setSecurityScore] = useState(78)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Privacy & Security</h2>
        <Button variant="outline" size="sm">
          <Shield className="h-4 w-4 mr-2" />
          Security Checkup
        </Button>
      </div>

      {/* Security Score */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Security Score</CardTitle>
          <CardDescription>Your account security status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Your Score</span>
              <span className="font-bold text-lg">{securityScore}/100</span>
            </div>
            <Progress value={securityScore} className="h-2" />
            <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Improve your security</p>
                <p className="text-sm">Enable two-factor authentication to increase your security score.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-teal-500" />
          Privacy Controls
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Sharing</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow us to use your data to improve our services
              </p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Research Participation</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Contribute your anonymized data to eczema research
              </p>
            </div>
            <Switch id="research" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Discovery</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow other users to find you by email or username
              </p>
            </div>
            <Select defaultValue="contacts">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="contacts">Contacts Only</SelectItem>
                <SelectItem value="nobody">Nobody</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activity Status</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show when you're active on the platform</p>
            </div>
            <Switch id="activity-status" />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Security Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-sky-500" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Login Notifications</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch id="login-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Trusted Devices</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage devices that can access your account</p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Data Protection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-indigo-500" />
          Data Protection
        </h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How is my data protected?</AccordionTrigger>
            <AccordionContent>
              Your data is encrypted both in transit and at rest. We use industry-standard security measures to protect
              your personal information and health data. Our platform is HIPAA compliant and we regularly undergo
              security audits.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Who has access to my health data?</AccordionTrigger>
            <AccordionContent>
              Only you and the healthcare providers you explicitly grant access to can see your health data. Our staff
              cannot access your personal health information unless you request support that requires data access.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How can I request my data be deleted?</AccordionTrigger>
            <AccordionContent>
              You can request complete deletion of your data at any time from the Account Settings page. Please note
              that this action is irreversible and will permanently remove all your information from our systems.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

