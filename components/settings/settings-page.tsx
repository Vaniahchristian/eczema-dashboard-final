"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import SettingsSidebar from "@/components/settings/settings-sidebar"
import AccountSettings from "@/components/settings/account-settings"
import PrivacySettings from "@/components/settings/privacy-settings"
import NotificationSettings from "@/components/settings/notification-settings"
import AccessibilitySettings from "@/components/settings/accessibility-settings"
import DataSettings from "@/components/settings/data-settings"
import AppearanceSettings from "@/components/settings/appearance-settings"
import IntegrationSettings from "@/components/settings/integration-settings"
import AdvancedSettings from "@/components/settings/advanced-settings"

type SettingsTab =
  | "account"
  | "privacy"
  | "notifications"
  | "accessibility"
  | "data"
  | "appearance"
  | "integrations"
  | "advanced"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-6 rounded-2xl shadow-sm mb-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Customize your EczemaAI experience and manage your account
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {activeTab === "account" && <AccountSettings />}
                {activeTab === "privacy" && <PrivacySettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "accessibility" && <AccessibilitySettings />}
                {activeTab === "data" && <DataSettings />}
                {activeTab === "appearance" && <AppearanceSettings />}
                {activeTab === "integrations" && <IntegrationSettings />}
                {activeTab === "advanced" && <AdvancedSettings />}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

