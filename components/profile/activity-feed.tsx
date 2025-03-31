"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Heart, BarChart, Camera, Calendar, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ActivityFeed() {
  const [filters, setFilters] = useState({
    posts: true,
    comments: true,
    achievements: true,
    uploads: true,
    appointments: true,
  })

  const activities = [
    {
      id: 1,
      type: "post",
      user: {
        name: "Sarah Johnson",
        username: "sarah_j",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just discovered that reducing dairy in my diet has significantly improved my eczema symptoms! Has anyone else had similar experiences with food triggers?",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 5,
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 2,
      type: "achievement",
      user: {
        name: "Sarah Johnson",
        username: "sarah_j",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Earned the 'Consistency Champion' badge for tracking health data for 30 consecutive days!",
      timestamp: "Yesterday",
      likes: 8,
      comments: 2,
      icon: <BarChart className="h-4 w-4 text-purple-500" />,
    },
    {
      id: 3,
      type: "upload",
      user: {
        name: "Sarah Johnson",
        username: "sarah_j",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Uploaded a new progress photo to track my eczema healing journey.",
      timestamp: "2 days ago",
      likes: 15,
      comments: 3,
      image: "/placeholder.svg?height=200&width=400",
      icon: <Camera className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: 4,
      type: "comment",
      user: {
        name: "Sarah Johnson",
        username: "sarah_j",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Commented on Dr. James Rodriguez's article: 'This was incredibly helpful! I'm going to try these moisturizing techniques.'",
      timestamp: "3 days ago",
      likes: 4,
      comments: 1,
      icon: <MessageSquare className="h-4 w-4 text-amber-500" />,
    },
    {
      id: 5,
      type: "appointment",
      user: {
        name: "Sarah Johnson",
        username: "sarah_j",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Scheduled a follow-up appointment with Dr. Emma Wilson for next Tuesday at 2:00 PM.",
      timestamp: "4 days ago",
      likes: 6,
      comments: 0,
      icon: <Calendar className="h-4 w-4 text-sky-500" />,
    },
  ]

  const filteredActivities = activities.filter((activity) => {
    if (activity.type === "post" && filters.posts) return true
    if (activity.type === "comment" && filters.comments) return true
    if (activity.type === "achievement" && filters.achievements) return true
    if (activity.type === "upload" && filters.uploads) return true
    if (activity.type === "appointment" && filters.appointments) return true
    return false
  })

  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-primary" />
            Activity Feed
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Show Activity Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={filters.posts} onCheckedChange={() => toggleFilter("posts")}>
                Posts
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filters.comments} onCheckedChange={() => toggleFilter("comments")}>
                Comments
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.achievements}
                onCheckedChange={() => toggleFilter("achievements")}
              >
                Achievements
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filters.uploads} onCheckedChange={() => toggleFilter("uploads")}>
                Uploads
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.appointments}
                onCheckedChange={() => toggleFilter("appointments")}
              >
                Appointments
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Your recent activity and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
              >
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-sm">{activity.user.name}</p>
                      <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{activity.content}</p>
                    {activity.image && (
                      <div className="mt-2 rounded-lg overflow-hidden">
                        <img src={activity.image || "/placeholder.svg"} alt="Activity" className="w-full h-auto" />
                      </div>
                    )}
                    <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        {activity.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        {activity.comments}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              No activities match your current filters
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

