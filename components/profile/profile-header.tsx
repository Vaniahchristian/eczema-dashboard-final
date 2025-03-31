"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, Edit, Share2, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileHeaderProps {
  onPersonalize: () => void
}

export default function ProfileHeader({ onPersonalize }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    username: "sarah_j",
    bio: "Living with eczema for 15+ years. Passionate about sharing my journey and helping others manage their symptoms. Nature lover, yoga enthusiast, and amateur chef exploring skin-friendly recipes.",
    location: "Portland, OR",
    interests: ["Yoga", "Cooking", "Hiking", "Skincare", "Reading"],
  })

  const [editForm, setEditForm] = useState({ ...profileData })

  const handleSaveProfile = () => {
    setProfileData(editForm)
    setIsEditing(false)
  }

  const handleAddInterest = () => {
    const newInterest = document.getElementById("new-interest") as HTMLInputElement
    if (newInterest.value.trim() !== "") {
      setEditForm({
        ...editForm,
        interests: [...editForm.interests, newInterest.value.trim()],
      })
      newInterest.value = ""
    }
  }

  const handleRemoveInterest = (index: number) => {
    setEditForm({
      ...editForm,
      interests: editForm.interests.filter((_, i) => i !== index),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-sky-400 to-teal-400 relative">
        <Button size="sm" variant="secondary" className="absolute top-4 right-4 rounded-full" onClick={onPersonalize}>
          <Palette className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-6 py-6 md:px-8 md:py-8 relative">
        {/* Avatar */}
        <div className="absolute -top-16 left-6 md:left-8 border-4 border-white dark:border-slate-800 rounded-full">
          <Avatar className="h-32 w-32">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
            <AvatarFallback className="text-3xl">SJ</AvatarFallback>
          </Avatar>
          <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mb-4">
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* User Info */}
        <div className="mt-12">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData.name}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            @{profileData.username} • {profileData.location}
          </p>

          <p className="mt-4 text-slate-700 dark:text-slate-300">{profileData.bio}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {profileData.interests.map((interest, index) => (
              <Badge key={index} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information and interests</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right">
                Username
              </label>
              <Input
                id="username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right">
                Location
              </label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="bio" className="text-right">
                Bio
              </label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="col-span-3"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right">Interests</label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveInterest(index)}
                    >
                      {interest} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input id="new-interest" placeholder="Add an interest" />
                  <Button type="button" onClick={handleAddInterest}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

