"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Loader2, MapPin, Video, Phone, Calendar } from "lucide-react"
import type { Doctor } from "@/services/patientAppointmentService"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
                    <img
                      src={doctor.image_url || "/placeholder-doctor.png"}
                      alt={`${doctor.first_name} ${doctor.last_name}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-medium">{`Dr. ${doctor.first_name} ${doctor.last_name}`}</h3>
                      <p className="text-white/80 text-sm">{doctor.doctor_profile?.specialty}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(doctor.doctor_profile?.experience_years || 0) ? "fill-current" : "fill-none"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {doctor.doctor_profile?.experience_years || "N/A"}
                      </span>
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
                        About Dr. {doctor.last_name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(doctor.id)}
                      >
                        Close
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{doctor.doctor_profile?.bio}</p>

                    <div className="mt-4 space-y-4">
                      {doctor.doctor_profile?.clinic_address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Clinic Location</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {doctor.doctor_profile?.clinic_address}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white">Available Hours</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {doctor.doctor_profile?.available_hours || "Contact clinic for availability"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="flex gap-2">
                          <Badge variant="secondary">
                            <Video className="h-4 w-4 mr-1" />
                            Video Consult
                          </Badge>
                          <Badge variant="secondary">
                            <Phone className="h-4 w-4 mr-1" />
                            Phone Consult
                          </Badge>
                          <Badge variant="secondary">
                            <MapPin className="h-4 w-4 mr-1" />
                            In-Person
                          </Badge>
                        </div>
                      </div>

                      {doctor.doctor_profile?.consultation_fee && (
                        <Badge variant="outline" className="mt-2">
                          Consultation Fee: ${doctor.doctor_profile.consultation_fee}
                        </Badge>
                      )}
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
