"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Mail,
  MessageSquare,
  Star,
  Stethoscope
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DoctorProfile {
  specialty: string
  bio: string
  rating: number
  experienceYears: number
  clinicName: string
  clinicAddress: string
  consultationFee: number
}

interface Doctor {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'doctor'
  image?: string
  doctor_profile?: DoctorProfile
}

interface DoctorProfileProps {
  doctor: Doctor
  onStartChat: () => void
  onSchedule: () => void
}

export function DoctorProfile({
  doctor,
  onStartChat,
  onSchedule
}: DoctorProfileProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const fullName = `${doctor.first_name} ${doctor.last_name}`

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              {doctor.image && (
                <AvatarImage src={doctor.image} alt={fullName} />
              )}
              <AvatarFallback>{getInitials(doctor.first_name, doctor.last_name)}</AvatarFallback>
            </Avatar>
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background",
                "bg-green-500"
              )}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Dr. {fullName}</h2>
                <p className="text-muted-foreground">{doctor.doctor_profile?.specialty || 'General Practice'}</p>
              </div>
              {doctor.doctor_profile?.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{doctor.doctor_profile.rating}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={onStartChat} className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
              <Button onClick={onSchedule} variant="outline" className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${doctor.email}`} className="hover:underline">
                  {doctor.email}
                </a>
              </div>
            </div>
          </div>

          <Separator />

          {doctor.doctor_profile && (
            <>
              <div className="space-y-2">
                <h3 className="font-medium">About</h3>
                <div className="space-y-4">
                  {doctor.doctor_profile.experienceYears > 0 && (
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doctor.doctor_profile.experienceYears} years of experience</span>
                    </div>
                  )}
                  {doctor.doctor_profile.bio && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Bio</h4>
                      <p className="text-sm text-muted-foreground">
                        {doctor.doctor_profile.bio}
                      </p>
                    </div>
                  )}
                  {doctor.doctor_profile.clinicName && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Practice</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{doctor.doctor_profile.clinicName}</p>
                        {doctor.doctor_profile.clinicAddress && (
                          <p>{doctor.doctor_profile.clinicAddress}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {doctor.doctor_profile.consultationFee > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Consultation Fee</h4>
                      <p className="text-sm text-muted-foreground">
                        ${doctor.doctor_profile.consultationFee}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
