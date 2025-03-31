"use client"

import { useState } from "react"
import {
  Bell,
  Check,
  Cloud,
  Code,
  Edit,
  Globe,
  Mail,
  Moon,
  Palette,
  Save,
  Server,
  Settings,
  Smartphone,
  Sun,
  Upload,
  User,
  Plus,
} from "lucide-react"
import Image from "next/image"

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [darkMode, setDarkMode] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-medium">Settings</h2>
            </div>

            <nav className="p-2">
              <button
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-left ${
                  activeTab === "general"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab("general")}
              >
                <Settings className="h-4 w-4" />
                <span>General</span>
              </button>

              <button
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-left ${
                  activeTab === "appearance"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </button>

              <button
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-left ${
                  activeTab === "notifications"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </button>

              <button
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-left ${
                  activeTab === "integrations"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab("integrations")}
              >
                <Cloud className="h-4 w-4" />
                <span>Integrations</span>
              </button>

              <button
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-left ${
                  activeTab === "localization"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab("localization")}
              >
                <Globe className="h-4 w-4" />
                <span>Localization</span>
              </button>

              <button
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm rounded-lg text-left ${
                  activeTab === "advanced"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setActiveTab("advanced")}
              >
                <Code className="h-4 w-4" />
                <span>Advanced</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="flex-grow">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 flex justify-between items-center">
                  <h3 className="font-medium">System Information</h3>
                  <button
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => setEditingSection(editingSection === "system_info" ? null : "system_info")}
                  >
                    {editingSection === "system_info" ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">System Name</p>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="EczemaAI Platform"
                        disabled={editingSection !== "system_info"}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Version</p>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="2.5.1"
                        disabled={editingSection !== "system_info"}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Environment</p>
                      <select
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="production"
                        disabled={editingSection !== "system_info"}
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">API Version</p>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="v3"
                        disabled={editingSection !== "system_info"}
                      />
                    </div>
                  </div>

                  {editingSection === "system_info" && (
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                        onClick={() => setEditingSection(null)}
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Save Changes</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 flex justify-between items-center">
                  <h3 className="font-medium">Contact Information</h3>
                  <button
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => setEditingSection(editingSection === "contact_info" ? null : "contact_info")}
                  >
                    {editingSection === "contact_info" ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Support Email</p>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="support@eczemaai.com"
                        disabled={editingSection !== "contact_info"}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Admin Email</p>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="admin@eczemaai.com"
                        disabled={editingSection !== "contact_info"}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="+1 (555) 123-4567"
                        disabled={editingSection !== "contact_info"}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Website</p>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        defaultValue="https://eczemaai.com"
                        disabled={editingSection !== "contact_info"}
                      />
                    </div>
                  </div>

                  {editingSection === "contact_info" && (
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                        onClick={() => setEditingSection(null)}
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Save Changes</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Theme Settings</h3>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div
                      className={`border rounded-xl p-4 flex-1 cursor-pointer ${
                        !darkMode
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setDarkMode(false)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Light Mode</h4>
                        {!darkMode && <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center">
                        <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
                        <div className="w-full h-20 bg-gray-50 rounded mb-2"></div>
                        <div className="w-full h-4 bg-gray-100 rounded"></div>
                        <Sun className="h-8 w-8 text-yellow-500 mt-2" />
                      </div>
                    </div>

                    <div
                      className={`border rounded-xl p-4 flex-1 cursor-pointer ${
                        darkMode
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setDarkMode(true)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Dark Mode</h4>
                        {darkMode && <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 flex flex-col items-center">
                        <div className="w-full h-4 bg-gray-800 rounded mb-2"></div>
                        <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                        <div className="w-full h-4 bg-gray-800 rounded"></div>
                        <Moon className="h-8 w-8 text-blue-400 mt-2" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Primary Color</h4>
                    <div className="flex flex-wrap gap-3">
                      <button className="w-8 h-8 rounded-full bg-purple-500 ring-2 ring-offset-2 ring-purple-500"></button>
                      <button className="w-8 h-8 rounded-full bg-blue-500"></button>
                      <button className="w-8 h-8 rounded-full bg-green-500"></button>
                      <button className="w-8 h-8 rounded-full bg-red-500"></button>
                      <button className="w-8 h-8 rounded-full bg-yellow-500"></button>
                      <button className="w-8 h-8 rounded-full bg-pink-500"></button>
                      <button className="w-8 h-8 rounded-full bg-indigo-500"></button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Logo</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Image src="/placeholder.svg?height=64&width=64" alt="Logo" width={64} height={64} />
                      </div>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Upload New Logo</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recommended size: 512x512px. Max file size: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Layout Settings</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="compact_mode" className="flex items-center gap-2">
                        <span>Compact Mode</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Reduces spacing in the UI</span>
                      </label>
                      <input
                        type="checkbox"
                        id="compact_mode"
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="fixed_sidebar" className="flex items-center gap-2">
                        <span>Fixed Sidebar</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Keeps sidebar visible while scrolling
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        id="fixed_sidebar"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="show_breadcrumbs" className="flex items-center gap-2">
                        <span>Show Breadcrumbs</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Displays navigation path</span>
                      </label>
                      <input
                        type="checkbox"
                        id="show_breadcrumbs"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Email Notifications</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="email_system_alerts" className="flex items-center gap-2">
                        <span>System Alerts</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Critical system notifications</span>
                      </label>
                      <input
                        type="checkbox"
                        id="email_system_alerts"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="email_user_signups" className="flex items-center gap-2">
                        <span>New User Signups</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Notification when new users register
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        id="email_user_signups"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="email_doctor_signups" className="flex items-center gap-2">
                        <span>New Doctor Signups</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Notification when new doctors register
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        id="email_doctor_signups"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="email_weekly_reports" className="flex items-center gap-2">
                        <span>Weekly Reports</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Weekly system performance reports
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        id="email_weekly_reports"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">In-App Notifications</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="inapp_system_alerts" className="flex items-center gap-2">
                        <span>System Alerts</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Critical system notifications</span>
                      </label>
                      <input
                        type="checkbox"
                        id="inapp_system_alerts"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="inapp_user_activity" className="flex items-center gap-2">
                        <span>User Activity</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Notifications about user actions
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        id="inapp_user_activity"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="inapp_doctor_activity" className="flex items-center gap-2">
                        <span>Doctor Activity</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Notifications about doctor actions
                        </span>
                      </label>
                      <input
                        type="checkbox"
                        id="inapp_doctor_activity"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Connected Services</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email Service</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connected to SendGrid</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Configure
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Server className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Storage Service</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connected to AWS S3</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Configure
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Push Notifications</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Connected to Firebase</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Available Integrations</h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Single Sign-On</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Enable SSO authentication with popular providers.
                      </p>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Connect</button>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Globe className="h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Analytics</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Connect with Google Analytics or similar services.
                      </p>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Connect</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "localization" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Language & Region</h3>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Language</label>
                      <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="zh">Chinese (Simplified)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Time Zone</label>
                      <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="utc">UTC</option>
                        <option value="est">Eastern Time (ET)</option>
                        <option value="cst">Central Time (CT)</option>
                        <option value="mst">Mountain Time (MT)</option>
                        <option value="pst">Pacific Time (PT)</option>
                        <option value="gmt">Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Date Format</label>
                      <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="mdy">MM/DD/YYYY</option>
                        <option value="dmy">DD/MM/YYYY</option>
                        <option value="ymd">YYYY/MM/DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Time Format</label>
                      <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="12h">12-hour (AM/PM)</option>
                        <option value="24h">24-hour</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <label htmlFor="auto_detect" className="flex items-center gap-2">
                      <span>Auto-detect user language</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Based on browser settings</span>
                    </label>
                    <input
                      type="checkbox"
                      id="auto_detect"
                      defaultChecked
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Save Changes</button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">Available Languages</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇺🇸</span>
                        <span>English (US)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                          Active
                        </span>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇪🇸</span>
                        <span>Spanish</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                          Active
                        </span>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇫🇷</span>
                        <span>French</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                          Active
                        </span>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇩🇪</span>
                        <span>German</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
                          In Progress
                        </span>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🇯🇵</span>
                        <span>Japanese</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          Inactive
                        </span>
                        <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Language</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">System Maintenance</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Cache Management</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Clear system caches to resolve potential issues or apply changes.
                      </p>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Clear Cache
                      </button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Database Optimization</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Optimize database performance by cleaning up unused data and indexes.
                      </p>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Optimize Database
                      </button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">System Backup</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Create a full system backup including database and files.
                      </p>
                      <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                        Create Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-slate-700 p-4">
                  <h3 className="font-medium">API Settings</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <label htmlFor="enable_api" className="flex items-center gap-2">
                        <span>Enable API Access</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Allow external API access</span>
                      </label>
                      <input
                        type="checkbox"
                        id="enable_api"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="rate_limiting" className="flex items-center gap-2">
                        <span>API Rate Limiting</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Limit API requests per client</span>
                      </label>
                      <input
                        type="checkbox"
                        id="rate_limiting"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="api_logging" className="flex items-center gap-2">
                        <span>API Request Logging</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Log all API requests</span>
                      </label>
                      <input
                        type="checkbox"
                        id="api_logging"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">API Keys</h4>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700 text-left">
                          <tr>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Created</th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              Last Used
                            </th>
                            <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr>
                            <td className="px-4 py-3 text-sm">Production API Key</td>
                            <td className="px-4 py-3 text-sm">2023-05-15</td>
                            <td className="px-4 py-3 text-sm">2023-08-14</td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                Revoke
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">Development API Key</td>
                            <td className="px-4 py-3 text-sm">2023-06-22</td>
                            <td className="px-4 py-3 text-sm">2023-08-15</td>
                            <td className="px-4 py-3 text-sm">
                              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                                Revoke
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Generate New API Key</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

