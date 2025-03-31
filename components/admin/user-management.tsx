"use client"

import { useState } from "react"
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

// Sample user data
const users = [
  {
    id: "u1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "doctor",
    status: "active",
    lastActive: "2 hours ago",
    createdAt: "Jan 15, 2023",
  },
  {
    id: "u2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "patient",
    status: "active",
    lastActive: "1 day ago",
    createdAt: "Feb 3, 2023",
  },
  {
    id: "u3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    role: "doctor",
    status: "inactive",
    lastActive: "2 weeks ago",
    createdAt: "Mar 20, 2023",
  },
  {
    id: "u4",
    name: "James Wilson",
    email: "james.wilson@example.com",
    role: "patient",
    status: "active",
    lastActive: "3 hours ago",
    createdAt: "Apr 12, 2023",
  },
  {
    id: "u5",
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    role: "admin",
    status: "active",
    lastActive: "Just now",
    createdAt: "May 5, 2023",
  },
  {
    id: "u6",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    role: "patient",
    status: "suspended",
    lastActive: "1 month ago",
    createdAt: "Jun 18, 2023",
  },
  {
    id: "u7",
    name: "Dr. David Brown",
    email: "david.brown@example.com",
    role: "doctor",
    status: "active",
    lastActive: "5 hours ago",
    createdAt: "Jul 22, 2023",
  },
  {
    id: "u8",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@example.com",
    role: "patient",
    status: "active",
    lastActive: "Yesterday",
    createdAt: "Aug 9, 2023",
  },
  {
    id: "u9",
    name: "Dr. Lisa Wang",
    email: "lisa.wang@example.com",
    role: "doctor",
    status: "active",
    lastActive: "4 days ago",
    createdAt: "Sep 14, 2023",
  },
  {
    id: "u10",
    name: "Daniel Garcia",
    email: "daniel.garcia@example.com",
    role: "patient",
    status: "inactive",
    lastActive: "3 weeks ago",
    createdAt: "Oct 30, 2023",
  },
]

export default function UserManagement() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState("all")

  // Filter users based on search query and current tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

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
                            aria-label={`Select ${user.name}`}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-6 py-4">{user.lastActive}</td>
                        <td className="px-6 py-4">{user.createdAt}</td>
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
                              <DropdownMenuItem>Edit User</DropdownMenuItem>
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
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input id="name" className="col-span-3" />
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
            <Button type="submit">Create User</Button>
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
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

