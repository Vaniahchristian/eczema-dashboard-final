"use client"

import { motion } from "framer-motion"
import { X, Star, Calendar, Clock, MapPin, Phone, Mail, FileText, Award, BookOpen } from "lucide-react"

interface DoctorProfileProps {
  participant: {
    id: string
    name: string
    image: string
    role: string
    isOnline: boolean
    lastActive?: string
  }
  onClose: () => void
}

export default function DoctorProfile({ participant, onClose }: DoctorProfileProps) {
  // Sample doctor data - in a real app, this would come from an API
  const doctorInfo = {
    specialty: participant.role,
    rating: 4.9,
    experience: participant.role.includes("Dermatologist") ? 12 : 8,
    education: ["MD, Harvard Medical School", "Residency, Mayo Clinic", "Fellowship in Dermatology, Johns Hopkins"],
    certifications: ["American Board of Dermatology", "American Academy of Dermatology"],
    publications: ["Novel Treatments for Atopic Dermatitis (2022)", "Eczema Management in Pediatric Patients (2021)"],
    contactInfo: {
      email: `${participant.name.split(" ")[0].toLowerCase()}.${participant.name.split(" ")[1].toLowerCase()}@dermatology.com`,
      phone: "(555) 123-4567",
      office: "Dermatology Clinic, 123 Medical Center Dr",
    },
    availability: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Friday", hours: "9:00 AM - 3:00 PM" },
    ],
    bio: "Specializes in treating various skin conditions including eczema, psoriasis, and acne. Takes a patient-centered approach to dermatological care with a focus on long-term skin health.",
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-medium text-slate-900 dark:text-white">Profile</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={participant.image || "/placeholder.svg"}
              alt={participant.name}
              className="h-24 w-24 rounded-full object-cover mx-auto"
            />
            {participant.isOnline && (
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{participant.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">{doctorInfo.specialty}</p>
          <div className="flex items-center justify-center mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(doctorInfo.rating) ? "fill-current" : "fill-none"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{doctorInfo.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-sky-500 mr-2" />
              <h3 className="font-medium text-slate-900 dark:text-white">About</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{doctorInfo.bio}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-sky-500 mr-2" />
              <h3 className="font-medium text-slate-900 dark:text-white">Experience & Education</h3>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span>{doctorInfo.experience} years of experience</span>
              </div>
              <div className="space-y-1 mt-3">
                <h4 className="font-medium text-slate-700 dark:text-slate-300">Education</h4>
                <ul className="list-disc list-inside space-y-1">
                  {doctorInfo.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-sky-500 mr-2" />
              <h3 className="font-medium text-slate-900 dark:text-white">Certifications & Publications</h3>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <div className="space-y-1">
                <h4 className="font-medium text-slate-700 dark:text-slate-300">Certifications</h4>
                <ul className="list-disc list-inside space-y-1">
                  {doctorInfo.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1 mt-3">
                <h4 className="font-medium text-slate-700 dark:text-slate-300">Publications</h4>
                <ul className="list-disc list-inside space-y-1">
                  {doctorInfo.publications.map((pub, index) => (
                    <li key={index}>{pub}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-sky-500 mr-2" />
              <h3 className="font-medium text-slate-900 dark:text-white">Availability</h3>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <ul className="space-y-2">
                {doctorInfo.availability.map((avail, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{avail.day}</span>
                    <span>{avail.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Phone className="h-5 w-5 text-sky-500 mr-2" />
              <h3 className="font-medium text-slate-900 dark:text-white">Contact Information</h3>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{doctorInfo.contactInfo.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{doctorInfo.contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{doctorInfo.contactInfo.office}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-sm hover:shadow-md transition-all">
          Schedule Appointment
        </button>
      </div>
    </motion.div>
  )
}

