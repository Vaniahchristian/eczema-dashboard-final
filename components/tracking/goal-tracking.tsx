"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Plus, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react"

export default function GoalTracking() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [newGoalData, setNewGoalData] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "eczema",
    progress: 0,
  })

  // Sample goals data - in a real app, this would come from an API
  const [goals, setGoals] = useState([
    {
      id: "goal-001",
      title: "Reduce Eczema Severity",
      description:
        "Reduce overall eczema severity score from 7 to 3 through consistent treatment and trigger avoidance.",
      targetDate: "2023-09-30",
      category: "eczema",
      progress: 65,
    },
    {
      id: "goal-002",
      title: "Improve Sleep Quality",
      description:
        "Achieve 7+ hours of quality sleep per night by establishing a consistent sleep schedule and bedtime routine.",
      targetDate: "2023-08-15",
      category: "sleep",
      progress: 40,
    },
    {
      id: "goal-003",
      title: "Increase Daily Steps",
      description: "Reach 8,000 steps per day on average to improve overall health and reduce stress.",
      targetDate: "2023-07-31",
      category: "activity",
      progress: 85,
    },
  ])

  const toggleGoalExpand = (goalId: string) => {
    if (expandedGoal === goalId) {
      setExpandedGoal(null)
    } else {
      setExpandedGoal(goalId)
    }
  }

  const handleAddGoal = () => {
    if (newGoalData.title.trim() === "") return

    const newGoal = {
      id: `goal-${Date.now()}`,
      ...newGoalData,
      progress: 0,
    }

    setGoals([...goals, newGoal])
    setNewGoalData({
      title: "",
      description: "",
      targetDate: "",
      category: "eczema",
      progress: 0,
    })
    setShowAddGoal(false)
  }

  const handleUpdateGoal = (goalId: string, updates: Partial<(typeof goals)[0]>) => {
    setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)))
  }

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((goal) => goal.id !== goalId))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "eczema":
        return "🔍"
      case "sleep":
        return "😴"
      case "activity":
        return "🏃‍♂️"
      case "nutrition":
        return "🍎"
      case "stress":
        return "😓"
      case "vitals":
        return "❤️"
      case "environment":
        return "🌡️"
      case "medication":
        return "💊"
      default:
        return "🎯"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "eczema":
        return "Eczema"
      case "sleep":
        return "Sleep"
      case "activity":
        return "Activity"
      case "nutrition":
        return "Nutrition"
      case "stress":
        return "Stress"
      case "vitals":
        return "Vitals"
      case "environment":
        return "Environment"
      case "medication":
        return "Medication"
      default:
        return "Other"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-emerald-500"
    if (progress >= 50) return "bg-sky-500"
    if (progress >= 25) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30 h-full">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Goal Tracking
          </h3>
          <button
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            {showAddGoal ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {showAddGoal && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/10">
          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Add New Goal</h4>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Goal title"
                value={newGoalData.title}
                onChange={(e) => setNewGoalData({ ...newGoalData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Description"
                value={newGoalData.description}
                onChange={(e) => setNewGoalData({ ...newGoalData, description: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={newGoalData.category}
                  onChange={(e) => setNewGoalData({ ...newGoalData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="eczema">Eczema</option>
                  <option value="sleep">Sleep</option>
                  <option value="activity">Activity</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="stress">Stress</option>
                  <option value="vitals">Vitals</option>
                  <option value="environment">Environment</option>
                  <option value="medication">Medication</option>
                </select>
              </div>
              <div>
                <input
                  type="date"
                  placeholder="Target date"
                  value={newGoalData.targetDate}
                  onChange={(e) => setNewGoalData({ ...newGoalData, targetDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddGoal(false)}
                className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 max-h-[400px] overflow-y-auto">
        {goals.length > 0 ? (
          <div className="space-y-3">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {editingGoal === goal.id ? (
                  <div className="p-3 space-y-3">
                    <div>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => handleUpdateGoal(goal.id, { title: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <textarea
                        value={goal.description}
                        onChange={(e) => handleUpdateGoal(goal.id, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <select
                          value={goal.category}
                          onChange={(e) => handleUpdateGoal(goal.id, { category: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="eczema">Eczema</option>
                          <option value="sleep">Sleep</option>
                          <option value="activity">Activity</option>
                          <option value="nutrition">Nutrition</option>
                          <option value="stress">Stress</option>
                          <option value="vitals">Vitals</option>
                          <option value="environment">Environment</option>
                          <option value="medication">Medication</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="date"
                          value={goal.targetDate}
                          onChange={(e) => handleUpdateGoal(goal.id, { targetDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Progress: {goal.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => handleUpdateGoal(goal.id, { progress: Number.parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getCategoryIcon(goal.category)}</span>
                          <h4 className="font-medium text-slate-900 dark:text-white">{goal.title}</h4>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingGoal(goal.id)}
                            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleGoalExpand(goal.id)}
                            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          >
                            {expandedGoal === goal.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <span className="bg-slate-200 dark:bg-slate-700 rounded-full px-2 py-0.5">
                          {getCategoryLabel(goal.category)}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Progress</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`${getProgressColor(goal.progress)} h-2 rounded-full`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {expandedGoal === goal.id && (
                        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                          <p>{goal.description}</p>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div className="text-xs text-slate-500 dark:text-slate-400">Start Date</div>
                              <div className="font-medium text-slate-700 dark:text-slate-300">
                                {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                              <div className="text-xs text-slate-500 dark:text-slate-400">Days Remaining</div>
                              <div className="font-medium text-slate-700 dark:text-slate-300">
                                {Math.max(
                                  0,
                                  Math.floor(
                                    (new Date(goal.targetDate).getTime() - new Date().getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-slate-100 dark:bg-slate-700 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-4 font-medium text-slate-700 dark:text-slate-300">No Goals Yet</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Set goals to track your progress and stay motivated.
            </p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

