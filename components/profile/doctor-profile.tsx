"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, Edit, Camera, Palette, Stethoscope, Clock, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { API_URL } from "@/lib/config"
import DoctorLayout from "../layout/doctor-layout"

interface DoctorProfileData {
  id: string
  email: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  image_url: string | null
  role: 'doctor'
  doctor_profile: {
    id: string
    user_id: string
    specialty: string
    bio: string
    rating: number
    experience_years: number
    clinic_name: string
    clinic_address: string
    consultation_fee: number
    available_hours: string
  } | null
}

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<DoctorProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
      <DoctorLayout>
      <div className="relative bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
      </DoctorLayout>
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
    <DoctorLayout>
    <motion.div

      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-teal-500 relative">
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
            <AvatarImage src={profileData.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email}`} />
            <AvatarFallback>
              {profileData.first_name?.charAt(0)}
              {profileData.last_name?.charAt(0)}
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
            Share Profile
          </Button>
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Doctor Info */}
        <div className="mt-12 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Dr. {profileData.first_name} {profileData.last_name}
              {profileData.doctor_profile?.specialty && (
                <Badge variant="secondary" className="ml-2">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  {profileData.doctor_profile.specialty}
                </Badge>
              )}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {profileData.email}
            </p>
          </div>

          {profileData.doctor_profile && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.doctor_profile.clinic_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Clinic Address</h3>
                      <p className="text-slate-500 dark:text-slate-400">{profileData.doctor_profile.clinic_address}</p>
                    </div>
                  </div>
                )}
                {profileData.doctor_profile.available_hours && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Consultation Hours</h3>
                      <p className="text-slate-500 dark:text-slate-400">{profileData.doctor_profile.available_hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {profileData.doctor_profile.bio && (
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">About</h3>
                  <p className="text-slate-500 dark:text-slate-400">{profileData.doctor_profile.bio}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">Experience</h3>
                  <Badge variant="secondary">{profileData.doctor_profile.experience_years} years</Badge>
                </div>

                {profileData.doctor_profile.consultation_fee && (
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Consultation Fee</h3>
                    <Badge variant="secondary">${profileData.doctor_profile.consultation_fee}</Badge>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Doctor Profile</DialogTitle>
            <DialogDescription>Update your professional information and credentials</DialogDescription>
          </DialogHeader>

          {/* TODO: Add DoctorEditProfileDialog component */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
    </DoctorLayout>
  )
}
