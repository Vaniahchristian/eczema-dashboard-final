"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, UserPlus, Facebook, Twitter, Instagram, Linkedin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function SocialConnections() {
  const [searchQuery, setSearchQuery] = useState("")

  const connections = [
    {
      id: 1,
      name: "Emma Wilson",
      username: "emma_w",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualConnections: 3,
      isFollowing: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      username: "mike_c",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualConnections: 5,
      isFollowing: true,
    },
    {
      id: 3,
      name: "Olivia Taylor",
      username: "olivia_t",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualConnections: 2,
      isFollowing: false,
    },
  ]

  const suggestions = [
    {
      id: 4,
      name: "Dr. James Rodriguez",
      username: "dr_james",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Dermatologist",
      mutualConnections: 8,
    },
    {
      id: 5,
      name: "Sophia Kim",
      username: "sophia_k",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Nutritionist",
      mutualConnections: 4,
    },
  ]

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Connections
        </CardTitle>
        <CardDescription>Connect with others and share your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search connections..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="connections">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connections">Following</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="connections" className="mt-4 space-y-3">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection, index) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={connection.avatar} alt={connection.name} />
                        <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{connection.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          @{connection.username} • {connection.mutualConnections} mutual
                        </p>
                      </div>
                    </div>
                    <Button variant={connection.isFollowing ? "outline" : "default"} size="sm" className="h-8">
                      {connection.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">No connections found</p>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="mt-4 space-y-3">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                        <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-sm">{suggestion.name}</p>
                          <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                            {suggestion.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          @{suggestion.username} • {suggestion.mutualConnections} mutual
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="h-8">
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Follow
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">No suggestions found</p>
              )}
            </TabsContent>
          </Tabs>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium mb-3">Connect social accounts</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                Instagram
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

