"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Users, Award, Search, ArrowUpRight, ThumbsUp, MessageCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Sample community forum posts
const forumPosts = [
  {
    id: "post-1",
    title: "Tips for managing eczema flare-ups during winter",
    author: {
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Community Leader",
    },
    category: "Tips & Tricks",
    content:
      "Winter is coming and my eczema always gets worse. I've found that using a humidifier at night and applying moisturizer immediately after showering helps a lot. What are your winter strategies?",
    likes: 42,
    comments: 18,
    views: 230,
    timestamp: "2 days ago",
    tags: ["winter", "flare-ups", "moisturizing"],
  },
  {
    id: "post-2",
    title: "New steroid-free treatment working well for me",
    author: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Active Member",
    },
    category: "Treatment",
    content:
      "After years of using topical steroids, I've switched to a new non-steroidal cream my dermatologist recommended. Three weeks in and my skin is clearer than it's been in years!",
    likes: 37,
    comments: 24,
    views: 189,
    timestamp: "5 days ago",
    tags: ["treatment", "non-steroid", "success-story"],
  },
  {
    id: "post-3",
    title: "How accurate is the EczemaAI diagnosis tool?",
    author: {
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "New Member",
    },
    category: "App Features",
    content:
      "I just used the AI diagnosis tool and it suggested I might have dyshidrotic eczema. Has anyone else received accurate diagnoses from the app? Should I trust it or see a dermatologist?",
    likes: 15,
    comments: 31,
    views: 142,
    timestamp: "1 week ago",
    tags: ["diagnosis", "AI", "accuracy"],
  },
]

// Sample community experts
const communityExperts = [
  {
    id: "expert-1",
    name: "Dr. Sarah Miller",
    avatar: "/placeholder.svg?height=60&width=60",
    role: "Dermatologist",
    specialty: "Pediatric Eczema",
    contributions: 87,
    helpfulRating: 98,
  },
  {
    id: "expert-2",
    name: "Prof. James Wilson",
    avatar: "/placeholder.svg?height=60&width=60",
    role: "Research Scientist",
    specialty: "Immunology",
    contributions: 64,
    helpfulRating: 95,
  },
  {
    id: "expert-3",
    name: "Lisa Thompson",
    avatar: "/placeholder.svg?height=60&width=60",
    role: "Certified Nurse",
    specialty: "Holistic Treatments",
    contributions: 112,
    helpfulRating: 97,
  },
]

export default function CommunitySupportSection() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Search initiated",
      description: `Searching community for "${searchQuery}"`,
      duration: 3000,
    })
  }

  const handleJoinCommunity = () => {
    toast({
      title: "Welcome to the community!",
      description: "You've successfully joined the EczemaAI community",
      duration: 3000,
    })
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">EczemaAI Community</h2>
          <p className="text-muted-foreground">Connect with others, share experiences, and learn from the community</p>
        </div>

        <Button onClick={handleJoinCommunity}>
          <Users className="h-4 w-4 mr-2" />
          Join Community
        </Button>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community discussions..."
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <Tabs defaultValue="discussions" className="mb-6">
        <TabsList>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="experts">Community Experts</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="mt-4">
          <div className="space-y-4">
            {forumPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="mb-2">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center mt-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <span className="font-medium">{post.author.name}</span>
                        <span className="text-muted-foreground ml-2">{post.author.role}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <span>View Discussion</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">View More Discussions</Button>
          </div>
        </TabsContent>

        <TabsContent value="experts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={expert.avatar} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle>{expert.name}</CardTitle>
                    <CardDescription className="flex flex-col items-center">
                      <Badge variant="secondary" className="mb-1">
                        {expert.role}
                      </Badge>
                      <span>{expert.specialty}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-center">
                    <div className="flex justify-center space-x-6 text-sm">
                      <div>
                        <p className="font-medium">{expert.contributions}</p>
                        <p className="text-muted-foreground">Contributions</p>
                      </div>
                      <div>
                        <p className="font-medium">{expert.helpfulRating}%</p>
                        <p className="text-muted-foreground">Helpful Rating</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-center">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask a Question
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">View All Experts</Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 rounded-lg p-6 text-center">
        <Award className="h-10 w-10 mx-auto text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Become a Community Contributor</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Share your knowledge, help others, and earn recognition as a valued member of the EczemaAI community.
        </p>
        <Button>Learn More</Button>
      </div>
    </div>
  )
}

