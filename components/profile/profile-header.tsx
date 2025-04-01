"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, Edit } from "lucide-react"
import EditProfileDialog from "./edit-profile-dialog"
import { API_URL } from "@/lib/config"
import { motion } from "framer-motion"
import { Camera, Palette } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface ProfileData {
  id: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  role: string
}

export default function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error("No authentication token found")
        }

        const response = await fetch(`${API_URL}/auth/profile`, {
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please log in again")
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        if (!data.success || !data.data) {
          throw new Error(data.message || "Invalid response format")
        }

        setProfileData(data.data)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="relative bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="relative bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
        <p className="text-red-500">Error loading profile</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-sky-400 to-teal-400 relative">
        <Button size="sm" variant="secondary" className="absolute top-4 right-4 rounded-full" onClick={() => console.log("Customize")}>
          <Palette className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-6 py-6 md:px-8 md:py-8 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-6 md:left-8 border-4 border-white dark:border-slate-800 rounded-full">
          <Avatar className="h-32 w-32">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email}`} />
            <AvatarFallback>
              {profileData.firstName.charAt(0)}
              {profileData.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mb-4">
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* User Info */}
        <div className="mt-12">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {profileData.email} • {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">Gender: {profileData.gender}</Badge>
            <Badge variant="secondary">
              Date of Birth: {new Date(profileData.dateOfBirth).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information and interests</DialogDescription>
          </DialogHeader>

          <EditProfileDialog
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={async (data) => {
              try {
                const response = await fetch(`${API_URL}/auth/profile`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify(data),
                })

                if (!response.ok) {
                  throw new Error("Failed to update profile")
                }

                const result = await response.json()
                if (!result.success) {
                  throw new Error(result.message || "Failed to update profile")
                }

                setProfileData(result.data)
                setIsEditing(false)
                toast.success("Profile updated successfully")
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to update profile")
              }
            }}
            initialData={profileData}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
