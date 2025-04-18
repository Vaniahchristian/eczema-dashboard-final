"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Loader2, MapPin, Video, Phone, Calendar } from "lucide-react"
import type { Doctor } from "@/services/patientAppointmentService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface DoctorProfilesProps {
  doctors: Doctor[]
  onSchedule: (doctorId: string) => void
  loading?: boolean
}

export default function DoctorProfiles({ doctors, onSchedule, loading = false }: DoctorProfilesProps) {
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null)

  const toggleExpand = (doctorId: string) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null)
    } else {
      setExpandedDoctor(doctorId)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
        <h2 className="text-xl font-semibold">Our Specialists</h2>
        <p className="text-sm text-white/80 mt-1">
          Expert dermatologists and allergists specializing in eczema treatment
        </p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all ${
                expandedDoctor === doctor.id ? "md:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <div className={`flex flex-col ${expandedDoctor === doctor.id ? "md:flex-row" : ""}`}>
                <div className={`${expandedDoctor === doctor.id ? "md:w-1/3" : ""}`}>
                  <div className="relative">
                    <Image
                      alt={`${doctor.name}'s profile`}
                      className="w-full h-48 object-cover"
                      fill
                      src={doctor.imageUrl}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-medium">{doctor.name}</h3>
                      <p className="text-white/80 text-sm">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10">
                        <Image
                          alt={`${doctor.name}'s profile`}
                          className="rounded-full"
                          fill
                          src={doctor.imageUrl}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">
                          {doctor.specialty} • {doctor.experienceYears} years experience
                        </p>
                      </div>
                    </div>

                    {!expandedDoctor || expandedDoctor !== doctor.id ? (
                      <>
                        <div className="mt-4 flex justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(doctor.id)}
                          >
                            View Profile
                          </Button>
                          <Button
                            onClick={() => onSchedule(doctor.id)}
                            size="sm"
                            className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                          >
                            Book
                          </Button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {expandedDoctor === doctor.id && (
                  <div className="p-4 md:flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        About {doctor.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(doctor.id)}
                      >
                        Close
                      </Button>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium">About</h4>
                      <p className="mt-2 text-sm text-gray-500">{doctor.bio || 'No bio available'}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium">Clinic Information</h4>
                      <div className="mt-2 space-y-2 text-sm text-gray-500">
                        <p>Clinic: {doctor.clinicName || 'Not specified'}</p>
                        <p>Address: {doctor.clinicAddress || 'Not specified'}</p>
                        <p>Consultation Fee: ${doctor.consultationFee || 0}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium">Rating</h4>
                      <div className="mt-2 flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-500">{doctor.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => onSchedule(doctor.id)}
                        className="bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                      >
                        Schedule Appointment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
