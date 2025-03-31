"use client"

import { Bell, Brush, Database, Eye, Globe, Lock, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

type SettingsTab =
  | "account"
  | "privacy"
  | "notifications"
  | "accessibility"
  | "data"
  | "appearance"
  | "integrations"
  | "advanced"

interface SettingsSidebarProps {
  activeTab: SettingsTab
  setActiveTab: (tab: SettingsTab) => void
}

const settingsTabs = [
  {
    id: "account",
    label: "Account",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: <Lock className="h-5 w-5" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    id: "data",
    label: "Data Management",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: <Brush className="h-5 w-5" />,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <nav className="p-2">
        <ul className="space-y-1">
          {settingsTabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50",
                )}
              >
                <span
                  className={cn(
                    activeTab === tab.id ? "text-sky-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

