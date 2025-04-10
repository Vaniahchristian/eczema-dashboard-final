"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Camera, Pencil, Save, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth" // 👈 adjust path as needed

export default function AccountSettings() {
  const { user } = useAuth() // 👈 get user from Auth Context
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Account Settings</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="default" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Photo */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={
                      user?.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt="User avatar"
                  />
                  <AvatarFallback className="w-full h-full flex items-center justify-center text-xl">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Button size="icon" variant="default" className="rounded-full h-8 w-8">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue={user?.firstName || ""} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue={user?.lastName || ""} disabled={!isEditing} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="+ (256)75 123-4567" disabled={!isEditing} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="Tell us something about yourself"
              disabled={!isEditing}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                defaultValue={user?.dateOfBirth || ""}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select disabled={!isEditing} defaultValue={user?.gender || ""}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Preferences */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch id="two-factor" disabled={!isEditing} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow other users to see your profile
              </p>
            </div>
            <Switch id="profile-visibility" defaultChecked disabled={!isEditing} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Status: Verified</p>
            </div>
            <div className="text-sm text-green-500 font-medium">Verified</div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Danger Zone */}
      <div>
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Permanently delete your account and all your data
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled={!isEditing}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
