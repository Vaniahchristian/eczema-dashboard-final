"use client"

import { useState } from "react"
import {
  User,
  Calendar,
  Bell,
  Shield,
  Monitor,
  Languages,
  Save,
  Upload,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function DoctorSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=128&width=128")
  const [saveStatus, setSaveStatus] = useState<null | "saving" | "success" | "error">(null)

  const handleSave = () => {
    setSaveStatus("saving")
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success")
      setTimeout(() => setSaveStatus(null), 2000)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveStatus === "success" ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : saveStatus === "error" ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Error!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 flex-shrink-0">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("availability")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === "availability"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Availability
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === "appearance"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Appearance
              </button>
              <button
                onClick={() => setActiveTab("language")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeTab === "language"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Languages className="h-4 w-4 mr-2" />
                Language
              </button>
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information visible to patients and colleagues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileImage} alt="Profile" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Sarah" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Johnson" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input id="title" defaultValue="Dermatologist, MD" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Select defaultValue="dermatology">
                        <SelectTrigger id="specialization">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                          <SelectItem value="pediatric-dermatology">Pediatric Dermatology</SelectItem>
                          <SelectItem value="cosmetic-dermatology">Cosmetic Dermatology</SelectItem>
                          <SelectItem value="surgical-dermatology">Surgical Dermatology</SelectItem>
                          <SelectItem value="immunodermatology">Immunodermatology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      defaultValue="Board-certified dermatologist with over 10 years of experience specializing in eczema and other inflammatory skin conditions. Passionate about providing personalized care and the latest evidence-based treatments."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex">
                        <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                        <Input id="email" type="email" defaultValue="dr.johnson@eczemaai.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <Phone className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                        <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Office Address</Label>
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input id="address" defaultValue="123 Medical Center Dr, Suite 456, Boston, MA 02115" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Credentials & Experience</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Briefcase className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Work Experience</h4>
                        <div className="space-y-2 mt-2">
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <h5 className="font-medium">Boston Medical Center</h5>
                              <Badge variant="outline">Current</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Senior Dermatologist</p>
                            <p className="text-sm text-muted-foreground">2018 - Present</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-medium">Massachusetts General Hospital</h5>
                            <p className="text-sm text-muted-foreground">Dermatology Specialist</p>
                            <p className="text-sm text-muted-foreground">2012 - 2018</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <GraduationCap className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Education</h4>
                        <div className="space-y-2 mt-2">
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-medium">Harvard Medical School</h5>
                            <p className="text-sm text-muted-foreground">Dermatology Residency</p>
                            <p className="text-sm text-muted-foreground">2009 - 2012</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-medium">Johns Hopkins University</h5>
                            <p className="text-sm text-muted-foreground">Doctor of Medicine (MD)</p>
                            <p className="text-sm text-muted-foreground">2005 - 2009</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Award className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Certifications & Awards</h4>
                        <div className="space-y-2 mt-2">
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-medium">Board Certification in Dermatology</h5>
                            <p className="text-sm text-muted-foreground">American Board of Dermatology</p>
                            <p className="text-sm text-muted-foreground">2012 - Present</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                            <h5 className="font-medium">Excellence in Patient Care Award</h5>
                            <p className="text-sm text-muted-foreground">Boston Medical Association</p>
                            <p className="text-sm text-muted-foreground">2020</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSave}>
                  Save Profile
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "availability" && (
            <Card>
              <CardHeader>
                <CardTitle>Availability Settings</CardTitle>
                <CardDescription>Configure your working hours and appointment availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Working Hours</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Monday</Label>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <Select defaultValue="9am">
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8am">8:00 AM</SelectItem>
                            <SelectItem value="9am">9:00 AM</SelectItem>
                            <SelectItem value="10am">10:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="5pm">
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4pm">4:00 PM</SelectItem>
                            <SelectItem value="5pm">5:00 PM</SelectItem>
                            <SelectItem value="6pm">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Tuesday</Label>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <Select defaultValue="9am">
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8am">8:00 AM</SelectItem>
                            <SelectItem value="9am">9:00 AM</SelectItem>
                            <SelectItem value="10am">10:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="5pm">
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4pm">4:00 PM</SelectItem>
                            <SelectItem value="5pm">5:00 PM</SelectItem>
                            <SelectItem value="6pm">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Wednesday</Label>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <Select defaultValue="9am">
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8am">8:00 AM</SelectItem>
                            <SelectItem value="9am">9:00 AM</SelectItem>
                            <SelectItem value="10am">10:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="5pm">
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4pm">4:00 PM</SelectItem>
                            <SelectItem value="5pm">5:00 PM</SelectItem>
                            <SelectItem value="6pm">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Thursday</Label>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <Select defaultValue="9am">
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8am">8:00 AM</SelectItem>
                            <SelectItem value="9am">9:00 AM</SelectItem>
                            <SelectItem value="10am">10:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="5pm">
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4pm">4:00 PM</SelectItem>
                            <SelectItem value="5pm">5:00 PM</SelectItem>
                            <SelectItem value="6pm">6:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Friday</Label>
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <Select defaultValue="9am">
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="8am">8:00 AM</SelectItem>
                            <SelectItem value="9am">9:00 AM</SelectItem>
                            <SelectItem value="10am">10:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="4pm">
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3pm">3:00 PM</SelectItem>
                            <SelectItem value="4pm">4:00 PM</SelectItem>
                            <SelectItem value="5pm">5:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Saturday</Label>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Switch id="saturday" />
                          <Label htmlFor="saturday">Not available</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 flex items-center">
                        <Label className="font-medium">Sunday</Label>
                      </div>
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Switch id="sunday" />
                          <Label htmlFor="sunday">Not available</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Appointment Settings</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appointmentDuration">Default Appointment Duration</Label>
                        <Select defaultValue="30">
                          <SelectTrigger id="appointmentDuration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bufferTime">Buffer Time Between Appointments</Label>
                        <Select defaultValue="10">
                          <SelectTrigger id="bufferTime">
                            <SelectValue placeholder="Select buffer time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="20">20 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAppointments">Maximum Appointments Per Day</Label>
                      <Input id="maxAppointments" type="number" defaultValue="12" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="allowOnlineBooking" defaultChecked />
                        <Label htmlFor="allowOnlineBooking">Allow patients to book appointments online</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="requireApproval" />
                        <Label htmlFor="requireApproval">Require approval for appointment requests</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Time Off & Vacation</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeOffReason">Reason (Optional)</Label>
                      <Select>
                        <SelectTrigger id="timeOffReason">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Time</SelectItem>
                          <SelectItem value="conference">Conference/Training</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline">Add Time Off</Button>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Upcoming Time Off</h4>
                      <p className="text-sm text-muted-foreground">No upcoming time off scheduled.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSave}>
                  Save Availability
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newAppointmentEmail" className="font-medium">
                          New Appointment
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive an email when a patient books an appointment
                        </p>
                      </div>
                      <Switch id="newAppointmentEmail" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="appointmentReminderEmail" className="font-medium">
                          Appointment Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
                      </div>
                      <Switch id="appointmentReminderEmail" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="appointmentCancelEmail" className="font-medium">
                          Appointment Cancellations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when appointments are cancelled
                        </p>
                      </div>
                      <Switch id="appointmentCancelEmail" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newMessageEmail" className="font-medium">
                          New Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive an email when you get a new message</p>
                      </div>
                      <Switch id="newMessageEmail" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemUpdateEmail" className="font-medium">
                          System Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about system updates and maintenance
                        </p>
                      </div>
                      <Switch id="systemUpdateEmail" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newAppointmentApp" className="font-medium">
                          New Appointment
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show notification when a patient books an appointment
                        </p>
                      </div>
                      <Switch id="newAppointmentApp" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="appointmentReminderApp" className="font-medium">
                          Appointment Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">Show reminders about upcoming appointments</p>
                      </div>
                      <Switch id="appointmentReminderApp" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newMessageApp" className="font-medium">
                          New Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">Show notification when you get a new message</p>
                      </div>
                      <Switch id="newMessageApp" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="patientUpdateApp" className="font-medium">
                          Patient Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show notification when patients update their health data
                        </p>
                      </div>
                      <Switch id="patientUpdateApp" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSave}>
                  Save Notification Preferences
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="twoFactor" />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                      <p className="text-sm">
                        Two-factor authentication adds an extra layer of security to your account by requiring more than
                        just a password to sign in.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSave}>
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <div className="h-20 w-full rounded bg-white border"></div>
                      <p className="text-sm font-medium">Light</p>
                    </div>

                    <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <div className="h-20 w-full rounded bg-slate-900 border border-slate-700"></div>
                      <p className="text-sm font-medium">Dark</p>
                    </div>

                    <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 ring-2 ring-blue-500">
                      <div className="h-20 w-full rounded bg-gradient-to-b from-white to-slate-900 border"></div>
                      <p className="text-sm font-medium">System</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Color Scheme</h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 ring-2 ring-blue-500">
                      <div className="h-10 w-full rounded bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                      <p className="text-sm font-medium">Default</p>
                    </div>

                    <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <div className="h-10 w-full rounded bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <p className="text-sm font-medium">Purple</p>
                    </div>

                    <div className="border rounded-lg p-4 flex flex-col items-center space-y-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <div className="h-10 w-full rounded bg-gradient-to-r from-green-500 to-teal-500"></div>
                      <p className="text-sm font-medium">Green</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSave}>
                  Save Appearance Settings
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "language" && (
            <Card>
              <CardHeader>
                <CardTitle>Language & Regional Settings</CardTitle>
                <CardDescription>Configure language preferences and regional formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Language</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Interface Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalTerms">Medical Terminology</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="medicalTerms">
                          <SelectValue placeholder="Select terminology preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Medical Terms</SelectItem>
                          <SelectItem value="simplified">Simplified Terms</SelectItem>
                          <SelectItem value="detailed">Detailed Technical Terms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Regional Formats</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY (US)</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY (UK, EU)</SelectItem>
                          <SelectItem value="ymd">YYYY/MM/DD (ISO)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select defaultValue="12h">
                        <SelectTrigger id="timeFormat">
                          <SelectValue placeholder="Select time format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSave}>
                  Save Language & Regional Settings
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

