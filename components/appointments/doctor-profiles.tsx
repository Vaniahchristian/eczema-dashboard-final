"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { Doctor } from "./appointments-page"

interface DoctorProfilesProps {
  doctors: Doctor[]
  onSchedule: () => void
}

export default function DoctorProfiles({ doctors, onSchedule }: DoctorProfilesProps) {
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null)

  const toggleExpand = (doctorId: string) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null)
    } else {
      setExpandedDoctor(doctorId)
    }
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
                      src={doctor.image || "/placeholder.svg"}
                      alt={doctor.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-medium">{doctor.name}</h3>
                      <p className="text-white/80 text-sm">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? "fill-current" : "fill-none"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {doctor.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {doctor.experience} years of experience
                    </div>

                    {!expandedDoctor || expandedDoctor !== doctor.id ? (
                      <>
                        <div className="mt-4 flex justify-between">
                          <button
                            onClick={() => toggleExpand(doctor.id)}
                            className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={onSchedule}
                            className="px-3 py-1 text-sm rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                          >
                            Book
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {expandedDoctor === doctor.id && (
                  <div className="p-4 md:flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        About Dr. {doctor.name.split(" ")[1]}
                      </h3>
                      <button
                        onClick={() => toggleExpand(doctor.id)}
                        className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
                      >
                        Close
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{doctor.bio}</p>

                    <h4 className="mt-4 font-medium text-slate-900 dark:text-white">Availability</h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {doctor.availability.map((avail, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="font-medium text-sm">{avail.day}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {avail.slots.map((slot, slotIdx) => (
                              <span
                                key={slotIdx}
                                className="inline-block px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={onSchedule}
                        className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                      >
                        Schedule Appointment
                      </button>
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

