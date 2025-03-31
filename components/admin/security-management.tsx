"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Check,
  Edit,
  Key,
  Lock,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  Users,
} from "lucide-react"

// Sample data
const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access with all permissions",
    users: 5,
    permissions: [
      "user_management.view",
      "user_management.create",
      "user_management.edit",
      "user_management.delete",
      "doctor_management.view",
      "doctor_management.create",
      "doctor_management.edit",
      "doctor_management.delete",
      "system_settings.view",
      "system_settings.edit",
      "security.view",
      "security.edit",
      "analytics.view",
    ],
  },
  {
    id: 2,
    name: "Doctor",
    description: "Access to patient data and medical resources",
    users: 1247,
    permissions: [
      "patients.view",
      "patients.create",
      "patients.edit",
      "medical_records.view",
      "medical_records.create",
      "medical_records.edit",
      "appointments.view",
      "appointments.create",
      "appointments.edit",
      "messages.view",
      "messages.create",
    ],
  },
  {
    id: 3,
    name: "Patient",
    description: "Limited access to personal data and appointments",
    users: 12543,
    permissions: [
      "profile.view",
      "profile.edit",
      "appointments.view",
      "appointments.create",
      "messages.view",
      "messages.create",
      "diagnoses.view",
    ],
  },
  {
    id: 4,
    name: "Support Staff",
    description: "Access to help desk and limited user data",
    users: 28,
    permissions: [
      "support_tickets.view",
      "support_tickets.create",
      "support_tickets.edit",
      "user_management.view",
      "messages.view",
      "messages.create",
    ],
  },
]

const securitySettings = [
  {
    id: "password_policy",
    name: "Password Policy",
    description: "Configure password requirements and expiration",
    settings: [
      { id: "min_length", name: "Minimum Length", value: 8, type: "number" },
      { id: "require_uppercase", name: "Require Uppercase", value: true, type: "boolean" },
      { id: "require_lowercase", name: "Require Lowercase", value: true, type: "boolean" },
      { id: "require_number", name: "Require Number", value: true, type: "boolean" },
      { id: "require_special", name: "Require Special Character", value: true, type: "boolean" },
      { id: "expiration_days", name: "Password Expiration (days)", value: 90, type: "number" },
    ],
  },
  {
    id: "login_security",
    name: "Login Security",
    description: "Configure login attempts and two-factor authentication",
    settings: [
      { id: "max_attempts", name: "Maximum Login Attempts", value: 5, type: "number" },
      { id: "lockout_minutes", name: "Account Lockout Duration (minutes)", value: 30, type: "number" },
      { id: "require_2fa", name: "Require Two-Factor Authentication", value: true, type: "boolean" },
      { id: "session_timeout", name: "Session Timeout (minutes)", value: 60, type: "number" },
    ],
  },
  {
    id: "data_security",
    name: "Data Security",
    description: "Configure data encryption and privacy settings",
    settings: [
      { id: "encrypt_data", name: "Encrypt Sensitive Data", value: true, type: "boolean" },
      { id: "data_retention", name: "Data Retention Period (days)", value: 365, type: "number" },
      { id: "anonymize_exports", name: "Anonymize Data Exports", value: true, type: "boolean" },
    ],
  },
]

export default function SecurityManagement() {
  const [activeTab, setActiveTab] = useState("roles")
  const [editingRole, setEditingRole] = useState<number | null>(null)
  const [editingSettings, setEditingSettings] = useState<string | null>(null)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Security Management</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "roles"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("roles")}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Roles & Permissions</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "settings"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security Settings</span>
              </div>
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "audit"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("audit")}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Audit & Compliance</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "roles" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">User Roles & Permissions</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Create New Role</button>
              </div>

              <div className="space-y-6">
                {roles.map((role) => (
                  <div key={role.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {role.name === "Administrator" && (
                          <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        )}
                        {role.name === "Doctor" && <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        {role.name === "Patient" && <User className="h-5 w-5 text-green-600 dark:text-green-400" />}
                        {role.name === "Support Staff" && (
                          <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{role.users} users</span>
                        <button
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => setEditingRole(editingRole === role.id ? null : role.id)}
                        >
                          {editingRole === role.id ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {editingRole === role.id && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium mb-3">Permissions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {role.permissions.map((permission) => (
                            <div key={permission} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`${role.id}-${permission}`}
                                defaultChecked
                                className="rounded text-purple-600 focus:ring-purple-500"
                              />
                              <label htmlFor={`${role.id}-${permission}`} className="text-sm">
                                {permission
                                  .split(".")
                                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                                  .join(" ")}
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            onClick={() => setEditingRole(null)}
                          >
                            Cancel
                          </button>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Security Settings</h2>
              </div>

              <div className="space-y-6">
                {securitySettings.map((section) => (
                  <div
                    key={section.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{section.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
                      </div>
                      <button
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setEditingSettings(editingSettings === section.id ? null : section.id)}
                      >
                        {editingSettings === section.id ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        {section.settings.map((setting) => (
                          <div key={setting.id} className="flex items-center justify-between">
                            <label htmlFor={setting.id} className="text-sm">
                              {setting.name}
                            </label>
                            {setting.type === "boolean" ? (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={setting.id}
                                  defaultChecked={setting.value as boolean}
                                  disabled={editingSettings !== section.id}
                                  className="rounded text-purple-600 focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  {setting.value ? "Enabled" : "Disabled"}
                                </span>
                              </div>
                            ) : (
                              <input
                                type="number"
                                id={setting.id}
                                defaultValue={setting.value as number}
                                disabled={editingSettings !== section.id}
                                className="w-24 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {editingSettings === section.id && (
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            onClick={() => setEditingSettings(null)}
                          >
                            Cancel
                          </button>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Audit & Compliance</h2>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Export Audit Logs</button>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 dark:bg-slate-700 p-4">
                    <h3 className="font-medium">Compliance Status</h3>
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h4 className="font-medium">HIPAA Compliance</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm">Compliant</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last audit: 2 weeks ago</p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <h4 className="font-medium">GDPR Compliance</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm">Compliant</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Last audit: 1 month ago</p>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          <h4 className="font-medium">Data Encryption</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm">Partial Compliance</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Legacy data needs encryption</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 dark:bg-slate-700 p-4">
                    <h3 className="font-medium">Recent Security Events</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Failed login attempt</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">admin@eczemaai.com</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">192.168.1.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2023-08-15 14:32:45</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              Blocked
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Password changed</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">dr.johnson@eczemaai.com</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">172.16.254.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2023-08-14 09:15:22</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Success
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Role permission changed</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">admin@eczemaai.com</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">192.168.1.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2023-08-13 16:45:10</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Success
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">New user created</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">admin@eczemaai.com</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">192.168.1.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2023-08-12 11:20:33</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Success
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Suspicious login attempt</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">patient123@gmail.com</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">203.0.113.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">2023-08-11 22:05:17</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Flagged
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

