"use client"

import { useState } from "react"
import ProfileHeader from "@/components/profile/profile-header"
import PersonalizationPanel from "@/components/profile/personalization-panel"

export default function ProfilePage() {
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

