"use client"

// --- Interfaces for admin user management ---
export interface DoctorProfile {
  id: string;
  user_id: string;
  specialty: string;
  bio: string;
  rating: number;
  experience_years: number;
  clinic_name: string;
  clinic_address: string;
  consultation_fee: number;
  available_hours: Record<string, string[]>;
  created_at: string;
  updated_at: string;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  date_of_birth: string;
  gender: string;
  medical_history: string;
  allergies: string;
  region: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient' | string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  status?: string; // Optional, if available
  last_active?: string; // Optional, if available
  doctor_profile?: DoctorProfile | null;
  patient?: PatientProfile | null;
}

// --- Use the interface in the component ---
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Trash,
  UserCog,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminService } from "@/services/adminService"

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser|null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [editUser, setEditUser] = useState<AdminUser|null>(null)
  const [showEdit, setShowEdit] = useState(false)

  // Fetch users from backend
  useEffect(() => {
    setLoading(true)
    adminService.getUsers()
      .then(res => setUsers(res.users || res.data || []))
      .catch(e => setError("Failed to fetch users"))
      .finally(() => setLoading(false))
  }, [])

  // Filter users based on search query and current tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())

    if (currentTab === "all") return matchesSearch
    if (currentTab === "patients") return matchesSearch && user.role === "patient"
    if (currentTab === "doctors") return matchesSearch && user.role === "doctor"
    if (currentTab === "admins") return matchesSearch && user.role === "admin"

    return matchesSearch
  })

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "doctor":
        return <Badge className="bg-indigo-500">Doctor</Badge>
      case "patient":
        return <Badge className="bg-blue-500">Patient</Badge>
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-gray-500">
            Inactive
          </Badge>
        )
      case "suspended":
        return <Badge className="bg-red-500">Suspended</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Add user
  const handleAddUser = async (userData: any) => {
    setLoading(true)
    setError(null)
    try {
      await adminService.registerUser(userData)
      const res = await adminService.getUsers()
      setUsers(res.users || res.data || [])
      setShowAddUserDialog(false)
    } catch (e) {
      setError("Failed to add user")
    } finally {
      setLoading(false)
    }
  }

  // Update user
  const handleUpdateUser = async (id: string, updates: any) => {
    setLoading(true)
    setError(null)
    try {
      await adminService.updateUser(id, updates)
      const res = await adminService.getUsers()
      setUsers(res.users || res.data || [])
    } catch (e) {
      setError("Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  // Delete user(s)
  const handleDeleteUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all(selectedUsers.map(id => adminService.deleteUser(id)))
      const res = await adminService.getUsers()
      setUsers(res.users || res.data || [])
      setSelectedUsers([])
      setShowDeleteDialog(false)
    } catch (e) {
      setError("Failed to delete user(s)")
    } finally {
      setLoading(false)
    }
  }

  // Show details modal
  const handleShowDetails = (user: AdminUser) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  // Show edit modal
  const handleShowEdit = (user: AdminUser) => {
    setEditUser(user)
    setShowEdit(true)
  }

  // Render details modal
  const renderDetailsModal = () => (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div>
            <div><b>Name:</b> {selectedUser.first_name} {selectedUser.last_name}</div>
            <div><b>Email:</b> {selectedUser.email}</div>
            <div><b>Role:</b> {selectedUser.role}</div>
            <div><b>Status:</b> {selectedUser.status ?? "-"}</div>
            <div><b>Created:</b> {selectedUser.created_at}</div>
            {selectedUser.doctor_profile && (
              <div style={{marginTop:8}}>
                <b>Doctor Profile:</b>
                <div>Specialty: {selectedUser.doctor_profile.specialty}</div>
                <div>Clinic: {selectedUser.doctor_profile.clinic_name}</div>
                <div>Experience: {selectedUser.doctor_profile.experience_years} yrs</div>
                <div>Rating: {selectedUser.doctor_profile.rating}</div>
              </div>
            )}
            {selectedUser.patient && (
              <div style={{marginTop:8}}>
                <b>Patient Profile:</b>
                <div>Medical History: {selectedUser.patient.medical_history}</div>
                <div>Allergies: {selectedUser.patient.allergies}</div>
                <div>Region: {selectedUser.patient.region}</div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={()=>setShowDetails(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Render edit/create modal (type-safe form)
  const renderEditModal = () => (
    <Dialog open={showEdit} onOpenChange={setShowEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editUser ? "Edit User" : "Create User"}</DialogTitle>
        </DialogHeader>
        <form /* onSubmit={handleSaveUser} */>
          <div className="grid gap-4 py-4">
            <Input
              label="First Name"
              value={editUser?.first_name ?? ""}
              onChange={e => setEditUser(editUser ? { ...editUser, first_name: e.target.value } : null)}
              required
            />
            <Input
              label="Last Name"
              value={editUser?.last_name ?? ""}
              onChange={e => setEditUser(editUser ? { ...editUser, last_name: e.target.value } : null)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={editUser?.email ?? ""}
              onChange={e => setEditUser(editUser ? { ...editUser, email: e.target.value } : null)}
              required
            />
            <Select
              label="Role"
              value={editUser?.role ?? "patient"}
              onValueChange={role => setEditUser(editUser ? { ...editUser, role } : null)}
            >
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </Select>
            {/* Add more fields as needed, e.g. gender, date_of_birth, etc. */}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={()=>setShowEdit(false)}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAddUserDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button size="sm">
            <UserCog className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage all user accounts in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full sm:w-[260px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Checkbox id="status-active" className="mr-2" />
                    <label htmlFor="status-active">Active</label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="status-inactive" className="mr-2" />
                    <label htmlFor="status-inactive">Inactive</label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="status-suspended" className="mr-2" />
                    <label htmlFor="status-suspended">Suspended</label>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button variant="outline" size="sm" className="w-full">
                      Apply Filters
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" onValueChange={setCurrentTab}>
            <div className="border-b px-6">
              <TabsList className="justify-start -mb-px">
                <TabsTrigger
                  value="all"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  All Users ({users.length})
                </TabsTrigger>
                <TabsTrigger
                  value="patients"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  Patients ({users.filter((u) => u.role === "patient").length})
                </TabsTrigger>
                <TabsTrigger
                  value="doctors"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  Doctors ({users.filter((u) => u.role === "doctor").length})
                </TabsTrigger>
                <TabsTrigger
                  value="admins"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  Admins ({users.filter((u) => u.role === "admin").length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all users"
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Name
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Email
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Last Active
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => toggleSelectUser(user.id)}
                            aria-label={`Select ${user.first_name} ${user.last_name}`}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{user.first_name} {user.last_name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-6 py-4">{user.last_active}</td>
                        <td className="px-6 py-4">{user.created_at}</td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link href={`/admin/users/${user.id}`} className="flex w-full">
                                  View Profile
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShowDetails(user)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShowEdit(user)}>Edit User</DropdownMenuItem>
                              <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete User</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Other tabs have the same content structure */}
            <TabsContent value="patients" className="m-0">
              <div className="p-6 text-center text-gray-500">
                Showing {users.filter((u) => u.role === "patient").length} patients
              </div>
            </TabsContent>
            <TabsContent value="doctors" className="m-0">
              <div className="p-6 text-center text-gray-500">
                Showing {users.filter((u) => u.role === "doctor").length} doctors
              </div>
            </TabsContent>
            <TabsContent value="admins" className="m-0">
              <div className="p-6 text-center text-gray-500">
                Showing {users.filter((u) => u.role === "admin").length} administrators
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="px-4">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account in the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="first_name" className="text-right text-sm font-medium">
                First Name
              </label>
              <Input id="first_name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="last_name" className="text-right text-sm font-medium">
                Last Name
              </label>
              <Input id="last_name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role" className="text-right text-sm font-medium">
                Role
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected users? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUsers}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {renderDetailsModal()}
      {renderEditModal()}

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
    </div>
  )
}
