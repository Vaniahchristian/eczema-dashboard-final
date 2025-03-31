"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ProfileHeader from "@/components/profile/profile-header"
import Achievements from "@/components/profile/achievements"
import SocialConnections from "@/components/profile/social-connections"
import ActivityFeed from "@/components/profile/activity-feed"
import PersonalizationPanel from "@/components/profile/personalization-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-mobile"

export default function ProfilePage() {
  const isMobile = useIsMobile()
  const [theme, setTheme] = useState<"default" | "nature" | "ocean" | "sunset">("default")
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false)

  const getThemeClass = () => {
    switch (theme) {
      case "nature":
        return "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900"
      case "ocean":
        return "bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900"
      case "sunset":
        return "bg-gradient-to-br from-orange-50 to-rose-100 dark:from-orange-950 dark:to-rose-900"
      default:
        return "bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-sky-950 dark:to-indigo-900"
    }
  }

  return (
    <div className={`min-h-screen ${getThemeClass()} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 pt-20 md:pt-24">
        <ProfileHeader onPersonalize={() => setIsPersonalizationOpen(true)} />

        {isMobile ? (
          <Tabs defaultValue="achievements" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="mt-4">
              <Achievements />
            </TabsContent>
            <TabsContent value="connections" className="mt-4">
              <SocialConnections />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <ActivityFeed />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Achievements />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2"
            >
              <ActivityFeed />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SocialConnections />
            </motion.div>
          </div>
        )}

        <PersonalizationPanel
          isOpen={isPersonalizationOpen}
          onClose={() => setIsPersonalizationOpen(false)}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      </div>
    </div>
  )
}

