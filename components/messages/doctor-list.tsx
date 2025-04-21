"use client"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface Doctor {
  id: string
  first_name: string
  last_name: string
  email: string
  doctor_profile: {
    specialty: string
    bio: string
    rating: number
    experienceYears: number
    clinicName: string
    clinicAddress: string
    consultationFee: number
  }
  image?: string
  role: 'doctor'
}

interface DoctorListProps {
  doctors: Doctor[]
  selectedId?: string
  onSelect: (doctor: Doctor) => void
  onSearch: (query: string) => void
}

export function DoctorList({
  doctors,
  selectedId,
  onSelect,
  onSearch
}: DoctorListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {doctors.map((doctor) => (
            <button
              key={doctor.id}
              onClick={() => onSelect(doctor)}
              className={cn(
                "flex items-center gap-4 w-full p-3 rounded-lg transition-colors",
                selectedId === doctor.id
                  ? "bg-accent"
                  : "hover:bg-accent/50"
              )}
            >
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <img
                  src={doctor.image || "/placeholder.svg?height=40&width=40"}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Dr. {doctor.first_name} {doctor.last_name}</div>
                <div className="text-sm text-muted-foreground">
                  {doctor.doctor_profile.specialty || 'General Practice'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
