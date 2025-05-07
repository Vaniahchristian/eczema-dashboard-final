"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Download, Edit, Filter, Search, Trash, UserPlus, X } from "lucide-react"
import Image from "next/image"
import { AdminUser, DoctorProfile } from "./user-management"
import { adminService } from "@/services/adminService"

// Remove static doctors. We'll fetch from backend.

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<AdminUser|null>(null)
  const [isAddingDoctor, setIsAddingDoctor] = useState(false)
  const [isEditingDoctor, setIsEditingDoctor] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [specialtyFilter, setSpecialtyFilter] = useState("All")

  // Fetch doctors from backend
  useEffect(() => {
    setLoading(true)
    adminService.getUsers()
      .then(res => {
        const users: AdminUser[] = res.users || res.data || []
        setDoctors(users.filter(u => u.role === "doctor"))
      })
      .catch(() => setError("Failed to fetch doctors"))
      .finally(() => setLoading(false))
  }, [])

  const filteredDoctors = doctors.filter((doctor) => {
    const name = doctor.first_name && doctor.last_name ? `${doctor.first_name} ${doctor.last_name}` : doctor.email || ""
    const specialty = doctor.doctor_profile?.specialty || ""
    const status = doctor.status || "Active"
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || status === statusFilter
    const matchesSpecialty = specialtyFilter === "All" || specialty === specialtyFilter

    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const handleViewDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
  }

  const handleCloseModal = () => {
    setSelectedDoctor(null)
    setIsAddingDoctor(false)
    setIsEditingDoctor(false)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
            onClick={() => setIsAddingDoctor(true)}
          >
            <UserPlus className="h-4 w-4" />
            <span className="text-sm font-medium">Add Doctor</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
                <span className="text-sm">Status: {statusFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown would go here */}
            </div>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
                <span className="text-sm">Specialty: {specialtyFilter}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {/* Dropdown would go here */}
            </div>

            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patients
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDoctors.map((doctor) => {
                const name = doctor.first_name && doctor.last_name ? `${doctor.first_name} ${doctor.last_name}` : doctor.email || ""
                const doctorProfile = doctor.doctor_profile as DoctorProfile | null
                const specialty = doctorProfile?.specialty || "-"
                const rating = doctorProfile?.rating ?? "-"
                const patients = doctorProfile?.clinic_name ? undefined : "-" // You can fetch patients count if available
                const status = doctor.status || "Active"
                const avatar = doctor.image_url || "/placeholder.svg"
                return (
                  <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={avatar}
                            alt={name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{specialty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{patients}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          onClick={() => handleViewDoctor(doctor)}
                        >
                          View
                        </button>
                        <button
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                          onClick={() => {
                            setSelectedDoctor(doctor)
                            setIsEditingDoctor(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {/* TODO: Implement delete logic */}
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{filteredDoctors.length}</span> of{" "}
            <span className="font-medium">{doctors.length}</span> doctors
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm">2</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm">3</button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && !isEditingDoctor && !isAddingDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">Doctor Profile</h2>
              <button onClick={handleCloseModal}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={selectedDoctor.image_url || "/placeholder.svg"}
                    alt={selectedDoctor.first_name + " " + selectedDoctor.last_name}
                    width={120}
                    height={120}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{selectedDoctor.first_name} {selectedDoctor.last_name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedDoctor.doctor_profile?.specialty || "-"}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p>{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p>{selectedDoctor.doctor_profile?.clinic_name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p>{selectedDoctor.doctor_profile?.clinic_address || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                      <p>{selectedDoctor.created_at ? new Date(selectedDoctor.created_at).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {selectedDoctor.doctor_profile?.rating ?? "-"}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedDoctor.status || "Active"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                  onClick={() => setIsEditingDoctor(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="text-lg font-bold text-white">Loading...</div>
        </div>
      )}
      {error && (
        <div className="fixed top-0 left-0 w-full h-full bg-red-500 bg-opacity-50 flex items-center justify-center">
          <div className="text-lg font-bold text-white">{error}</div>
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      {(isAddingDoctor || isEditingDoctor) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold">{isAddingDoctor ? "Add New Doctor" : "Edit Doctor"}</h2>
              <button onClick={handleCloseModal}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue={isEditingDoctor ? selectedDoctor.name : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue={isEditingDoctor ? selectedDoctor.email : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialty</label>
                    <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Dermatology</option>
                      <option>Pediatric Dermatology</option>
                      <option>Allergology</option>
                      <option>Immunology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue={isEditingDoctor ? selectedDoctor.phone : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue={isEditingDoctor ? selectedDoctor.location : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      defaultValue={isEditingDoctor ? selectedDoctor.status : "Active"}
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                    {isAddingDoctor ? "Add Doctor" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

