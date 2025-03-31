"use client"

import { useState } from "react"
import { ChevronDown, Download, Edit, Filter, Search, Trash, UserPlus, X } from "lucide-react"
import Image from "next/image"

// Sample data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Dermatology",
    patients: 156,
    rating: 4.8,
    status: "Active",
    email: "sarah.johnson@eczemaai.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Jan 15, 2023",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Pediatric Dermatology",
    patients: 132,
    rating: 4.9,
    status: "Active",
    email: "michael.chen@eczemaai.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Feb 3, 2023",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    patients: 98,
    rating: 4.7,
    status: "On Leave",
    email: "emily.rodriguez@eczemaai.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Mar 22, 2023",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Allergology",
    patients: 112,
    rating: 4.6,
    status: "Active",
    email: "james.wilson@eczemaai.com",
    phone: "+1 (555) 456-7890",
    location: "Boston, MA",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Apr 10, 2023",
  },
  {
    id: 5,
    name: "Dr. Olivia Kim",
    specialty: "Dermatology",
    patients: 145,
    rating: 4.9,
    status: "Active",
    email: "olivia.kim@eczemaai.com",
    phone: "+1 (555) 567-8901",
    location: "Los Angeles, CA",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "May 5, 2023",
  },
  {
    id: 6,
    name: "Dr. Robert Taylor",
    specialty: "Immunology",
    patients: 87,
    rating: 4.5,
    status: "Inactive",
    email: "robert.taylor@eczemaai.com",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Jun 18, 2023",
  },
  {
    id: 7,
    name: "Dr. Sophia Martinez",
    specialty: "Pediatric Dermatology",
    patients: 124,
    rating: 4.8,
    status: "Active",
    email: "sophia.martinez@eczemaai.com",
    phone: "+1 (555) 789-0123",
    location: "Miami, FL",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Jul 7, 2023",
  },
  {
    id: 8,
    name: "Dr. William Lee",
    specialty: "Dermatology",
    patients: 110,
    rating: 4.7,
    status: "Active",
    email: "william.lee@eczemaai.com",
    phone: "+1 (555) 890-1234",
    location: "Houston, TX",
    avatar: "/placeholder.svg?height=40&width=40",
    joined: "Aug 14, 2023",
  },
]

export default function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [isAddingDoctor, setIsAddingDoctor] = useState(false)
  const [isEditingDoctor, setIsEditingDoctor] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [specialtyFilter, setSpecialtyFilter] = useState("All")

  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || doctor.status === statusFilter
    const matchesSpecialty = specialtyFilter === "All" || doctor.specialty === specialtyFilter

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
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={doctor.avatar || "/placeholder.svg"}
                          alt={doctor.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{doctor.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{doctor.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{doctor.patients}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{doctor.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doctor.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : doctor.status === "On Leave"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {doctor.status}
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
                      <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{filteredDoctors.length}</span> of{" "}
            <span className="font-medium">{doctorsData.length}</span> doctors
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
                    src={selectedDoctor.avatar || "/placeholder.svg"}
                    alt={selectedDoctor.name}
                    width={120}
                    height={120}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{selectedDoctor.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedDoctor.specialty}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p>{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p>{selectedDoctor.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p>{selectedDoctor.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                      <p>{selectedDoctor.joined}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Patients</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {selectedDoctor.patients}
                      </p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{selectedDoctor.rating}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedDoctor.status}</p>
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

