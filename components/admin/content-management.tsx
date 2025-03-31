"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Edit,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
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
import { Textarea } from "@/components/ui/textarea"

// Sample content data
const contentItems = [
  {
    id: "c1",
    title: "Understanding Eczema: Causes and Symptoms",
    type: "article",
    category: "Education",
    status: "published",
    author: "Dr. Sarah Johnson",
    publishDate: "Jan 15, 2023",
    lastUpdated: "Mar 20, 2023",
  },
  {
    id: "c2",
    title: "Treatment Options for Severe Eczema",
    type: "article",
    category: "Treatment",
    status: "published",
    author: "Dr. Michael Chen",
    publishDate: "Feb 3, 2023",
    lastUpdated: "Feb 3, 2023",
  },
  {
    id: "c3",
    title: "Managing Eczema Flare-Ups",
    type: "guide",
    category: "Self-Care",
    status: "published",
    author: "Dr. Emily Rodriguez",
    publishDate: "Mar 20, 2023",
    lastUpdated: "Apr 15, 2023",
  },
  {
    id: "c4",
    title: "Eczema in Children: Special Considerations",
    type: "article",
    category: "Pediatric",
    status: "draft",
    author: "Dr. James Wilson",
    publishDate: "",
    lastUpdated: "Apr 12, 2023",
  },
  {
    id: "c5",
    title: "Dietary Influences on Eczema",
    type: "guide",
    category: "Nutrition",
    status: "published",
    author: "Dr. Sophia Lee",
    publishDate: "May 5, 2023",
    lastUpdated: "May 5, 2023",
  },
  {
    id: "c6",
    title: "Environmental Triggers for Eczema",
    type: "article",
    category: "Education",
    status: "review",
    author: "Dr. Robert Taylor",
    publishDate: "",
    lastUpdated: "Jun 18, 2023",
  },
  {
    id: "c7",
    title: "New Research in Eczema Treatment",
    type: "research",
    category: "Research",
    status: "published",
    author: "Dr. David Brown",
    publishDate: "Jul 22, 2023",
    lastUpdated: "Jul 22, 2023",
  },
  {
    id: "c8",
    title: "Eczema and Mental Health",
    type: "article",
    category: "Mental Health",
    status: "published",
    author: "Dr. Jennifer Martinez",
    publishDate: "Aug 9, 2023",
    lastUpdated: "Aug 9, 2023",
  },
  {
    id: "c9",
    title: "Frequently Asked Questions About Eczema",
    type: "faq",
    category: "Education",
    status: "published",
    author: "Dr. Lisa Wang",
    publishDate: "Sep 14, 2023",
    lastUpdated: "Sep 14, 2023",
  },
  {
    id: "c10",
    title: "Eczema and Allergies: The Connection",
    type: "article",
    category: "Education",
    status: "draft",
    author: "Dr. Daniel Garcia",
    publishDate: "",
    lastUpdated: "Oct 30, 2023",
  },
]

export default function ContentManagement() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddContentDialog, setShowAddContentDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentTab, setCurrentTab] = useState("all")

  // Filter content based on search query and current tab
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (currentTab === "all") return matchesSearch
    if (currentTab === "published") return matchesSearch && item.status === "published"
    if (currentTab === "drafts") return matchesSearch && item.status === "draft"
    if (currentTab === "review") return matchesSearch && item.status === "review"

    return matchesSearch
  })

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredContent.map((item) => item.id))
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "article":
        return <Badge className="bg-blue-500">Article</Badge>
      case "guide":
        return <Badge className="bg-green-500">Guide</Badge>
      case "research":
        return <Badge className="bg-purple-500">Research</Badge>
      case "faq":
        return <Badge className="bg-orange-500">FAQ</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-500">
            Draft
          </Badge>
        )
      case "review":
        return <Badge className="bg-yellow-500">In Review</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-purple-800 dark:text-purple-300">Content Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage content for the application</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAddContentDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Content Library</CardTitle>
              <CardDescription>Manage all content in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search content..."
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
                    <Checkbox id="type-article" className="mr-2" />
                    <label htmlFor="type-article">Articles</label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="type-guide" className="mr-2" />
                    <label htmlFor="type-guide">Guides</label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="type-research" className="mr-2" />
                    <label htmlFor="type-research">Research</label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="type-faq" className="mr-2" />
                    <label htmlFor="type-faq">FAQs</label>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button variant="outline" size="sm" className="w-full">
                      Apply Filters
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  All Content ({contentItems.length})
                </TabsTrigger>
                <TabsTrigger
                  value="published"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  Published ({contentItems.filter((c) => c.status === "published").length})
                </TabsTrigger>
                <TabsTrigger
                  value="drafts"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  Drafts ({contentItems.filter((c) => c.status === "draft").length})
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                >
                  In Review ({contentItems.filter((c) => c.status === "review").length})
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
                            checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all content"
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Title
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Author
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div className="flex items-center">
                          Last Updated
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContent.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            aria-label={`Select ${item.title}`}
                          />
                        </td>
                        <td className="px-6 py-4 font-medium">{item.title}</td>
                        <td className="px-6 py-4">{getTypeBadge(item.type)}</td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                        <td className="px-6 py-4">{item.author}</td>
                        <td className="px-6 py-4">{item.lastUpdated}</td>
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
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
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
            <TabsContent value="published" className="m-0">
              <div className="p-6 text-center text-gray-500">
                Showing {contentItems.filter((c) => c.status === "published").length} published items
              </div>
            </TabsContent>
            <TabsContent value="drafts" className="m-0">
              <div className="p-6 text-center text-gray-500">
                Showing {contentItems.filter((c) => c.status === "draft").length} draft items
              </div>
            </TabsContent>
            <TabsContent value="review" className="m-0">
              <div className="p-6 text-center text-gray-500">
                Showing {contentItems.filter((c) => c.status === "review").length} items in review
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-gray-500">
            Showing {filteredContent.length} of {contentItems.length} items
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

      {/* Add Content Dialog */}
      <Dialog open={showAddContentDialog} onOpenChange={setShowAddContentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
            <DialogDescription>Create new content for the application.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Title
              </label>
              <Input id="title" className="col-span-3" placeholder="Enter content title" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right text-sm font-medium">
                Type
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">
                Category
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="self-care">Self-Care</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="content" className="text-right text-sm font-medium pt-2">
                Content
              </label>
              <Textarea id="content" className="col-span-3" placeholder="Enter content here..." rows={8} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">
                Status
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContentDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected content? This action cannot be undone.
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

