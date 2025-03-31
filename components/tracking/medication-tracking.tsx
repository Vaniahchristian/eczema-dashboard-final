"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pill, Plus, ChevronDown, ChevronUp, Check, X, Bell } from "lucide-react"

export default function MedicationTracking() {
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null)
  const [newMedicationData, setNewMedicationData] = useState({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "",
    instructions: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    reminders: true,
  })

  // Sample medications data - in a real app, this would come from an API
  const [medications, setMedications] = useState([
    {
      id: "med-001",
      name: "Hydrocortisone Cream",
      dosage: "1% strength",
      frequency: "twice daily",
      time: "08:00, 20:00",
      instructions: "Apply a thin layer to affected areas. Do not use on face unless directed.",
      startDate: "2023-05-15",
      endDate: "2023-08-15",
      reminders: true,
      adherence: 95,
    },
    {
      id: "med-002",
      name: "Antihistamine",
      dosage: "10mg",
      frequency: "daily",
      time: "22:00",
      instructions: "Take one tablet before bedtime to help with itching and sleep.",
      startDate: "2023-05-15",
      endDate: "",
      reminders: true,
      adherence: 90,
    },
    {
      id: "med-003",
      name: "Moisturizer",
      dosage: "As needed",
      frequency: "multiple times daily",
      time: "After shower, before bed",
      instructions: "Apply generously to entire body, especially after showering.",
      startDate: "2023-05-15",
      endDate: "",
      reminders: false,
      adherence: 85,
    },
  ])

  const toggleMedicationExpand = (medicationId: string) => {
    if (expandedMedication === medicationId) {
      setExpandedMedication(null)
    } else {
      setExpandedMedication(medicationId)
    }
  }

  const handleAddMedication = () => {
    if (newMedicationData.name.trim() === "") return

    const newMedication = {
      id: `med-${Date.now()}`,
      ...newMedicationData,
      adherence: 100,
    }

    setMedications([...medications, newMedication])
    setNewMedicationData({
      name: "",
      dosage: "",
      frequency: "daily",
      time: "",
      instructions: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      reminders: true,
    })
    setShowAddMedication(false)
  }

  const handleDeleteMedication = (medicationId: string) => {
    setMedications(medications.filter((med) => med.id !== medicationId))
  }

  const handleTakeMedication = (medicationId: string) => {
    // In a real app, this would log the medication as taken
    alert(`Marked ${medications.find((med) => med.id === medicationId)?.name} as taken!`)
  }

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return "bg-emerald-500"
    if (adherence >= 75) return "bg-sky-500"
    if (adherence >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">Medication Tracking</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Manage and track your medications effectively.</p>
      </div>

      {/* Add Medication Section */}
      <motion.div layout className="px-4 py-3 bg-gray-50 dark:bg-slate-700 sm:px-6">
        <button
          onClick={() => setShowAddMedication(!showAddMedication)}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medication
        </button>

        {showAddMedication && (
          <motion.div layout className="mt-4">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Medication Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.name}
                  onChange={(e) => setNewMedicationData({ ...newMedicationData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dosage
                </label>
                <input
                  type="text"
                  name="dosage"
                  id="dosage"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.dosage}
                  onChange={(e) => setNewMedicationData({ ...newMedicationData, dosage: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.frequency}
                  onChange={(e) =>
                    setNewMedicationData({
                      ...newMedicationData,
                      frequency: e.target.value as "daily" | "weekly" | "monthly",
                    })
                  }
                >
                  <option>daily</option>
                  <option>weekly</option>
                  <option>monthly</option>
                </select>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  id="time"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.time}
                  onChange={(e) => setNewMedicationData({ ...newMedicationData, time: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.instructions}
                  onChange={(e) => setNewMedicationData({ ...newMedicationData, instructions: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.startDate}
                  onChange={(e) => setNewMedicationData({ ...newMedicationData, startDate: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-gray-50"
                  value={newMedicationData.endDate}
                  onChange={(e) => setNewMedicationData({ ...newMedicationData, endDate: e.target.value })}
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="reminders"
                    name="reminders"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded dark:bg-slate-800 dark:border-slate-600 dark:text-indigo-500"
                    checked={newMedicationData.reminders}
                    onChange={(e) => setNewMedicationData({ ...newMedicationData, reminders: e.target.checked })}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="reminders" className="font-medium text-gray-700 dark:text-gray-300">
                    Reminders
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Get notified when it's time to take your medication.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                onClick={handleAddMedication}
              >
                Add
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-500 dark:text-gray-50"
                onClick={() => setShowAddMedication(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Medication List */}
      <ul className="divide-y divide-gray-200 dark:divide-slate-700">
        {medications.map((medication) => (
          <motion.li layout key={medication.id} className="bg-white dark:bg-slate-800">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Pill className="h-6 w-6 mr-2 text-indigo-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{medication.name}</p>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAdherenceColor(medication.adherence)} text-white`}
                  >
                    {medication.adherence}%
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Dosage: {medication.dosage}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Frequency: {medication.frequency}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Time: {medication.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Start Date: {medication.startDate}</p>
                    {medication.endDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-300">End Date: {medication.endDate}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center sm:mt-0">
                  <button
                    onClick={() => handleTakeMedication(medication.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Take
                  </button>
                  <button
                    onClick={() => handleDeleteMedication(medication.id)}
                    className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-500 dark:text-gray-50"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={() => toggleMedicationExpand(medication.id)}
                    className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-500 dark:text-gray-50"
                  >
                    {expandedMedication === medication.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {expandedMedication === medication.id && (
              <motion.div layout className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-slate-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">Instructions: {medication.instructions}</p>
                {medication.reminders && (
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-300">
                    <Bell className="h-5 w-5 mr-2" />
                    Reminders are enabled for this medication.
                  </div>
                )}
              </motion.div>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

