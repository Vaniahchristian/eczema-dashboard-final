"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  Activity,
  Moon,
  Utensils,
  Heart,
  Thermometer,
  Pill,
  Search,
  BrainCircuit,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Droplets,
  Brain,
} from "lucide-react"
import type { TimeRange, MetricType } from "./health-tracking-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HealthMetricsDashboardProps {
  timeRange: TimeRange
  activeMetrics: MetricType[]
  onLogHealth: (metric: MetricType) => void
}

const sleepData = [
  { date: "Mon", hours: 7.5 },
  { date: "Tue", hours: 6.8 },
  { date: "Wed", hours: 8.2 },
  { date: "Thu", hours: 7.0 },
  { date: "Fri", hours: 6.5 },
  { date: "Sat", hours: 8.5 },
  { date: "Sun", hours: 9.0 },
]

const activityData = [
  { date: "Mon", steps: 8500, active: 45 },
  { date: "Tue", steps: 10200, active: 60 },
  { date: "Wed", steps: 7800, active: 35 },
  { date: "Thu", steps: 9300, active: 50 },
  { date: "Fri", steps: 11500, active: 65 },
  { date: "Sat", steps: 6500, active: 30 },
  { date: "Sun", steps: 5200, active: 25 },
]

const nutritionData = [
  { date: "Mon", calories: 2100, protein: 85, carbs: 220, fat: 65 },
  { date: "Tue", calories: 1950, protein: 90, carbs: 200, fat: 60 },
  { date: "Wed", calories: 2200, protein: 95, carbs: 230, fat: 70 },
  { date: "Thu", calories: 2050, protein: 88, carbs: 210, fat: 63 },
  { date: "Fri", calories: 2300, protein: 100, carbs: 240, fat: 75 },
  { date: "Sat", calories: 2500, protein: 105, carbs: 260, fat: 80 },
  { date: "Sun", calories: 1900, protein: 80, carbs: 190, fat: 58 },
]

const vitalsData = [
  { date: "Mon", heartRate: 68, bp: "120/80" },
  { date: "Tue", heartRate: 72, bp: "122/82" },
  { date: "Wed", heartRate: 65, bp: "118/78" },
  { date: "Thu", heartRate: 70, bp: "121/81" },
  { date: "Fri", heartRate: 75, bp: "124/84" },
  { date: "Sat", heartRate: 67, bp: "119/79" },
  { date: "Sun", heartRate: 64, bp: "117/77" },
]

const hydrationData = [
  { date: "Mon", water: 2.1 },
  { date: "Tue", water: 1.8 },
  { date: "Wed", water: 2.5 },
  { date: "Thu", water: 2.2 },
  { date: "Fri", water: 1.9 },
  { date: "Sat", water: 2.7 },
  { date: "Sun", water: 2.3 },
]

const stressData = [
  { date: "Mon", level: 4 },
  { date: "Tue", level: 6 },
  { date: "Wed", level: 3 },
  { date: "Thu", level: 5 },
  { date: "Fri", level: 7 },
  { date: "Sat", level: 2 },
  { date: "Sun", level: 3 },
]

export default function HealthMetricsDashboard() {
  const [timeRange, setTimeRange] = useState("week")
  const [expandedMetrics, setExpandedMetrics] = useState<MetricType[]>([])
  const [timeRange2, setTimeRange2] = useState("week")
  const [activeMetrics, setActiveMetrics] = useState<MetricType[]>([
    "eczema",
    "sleep",
    "activity",
    "nutrition",
    "stress",
    "vitals",
  ])

  const onLogHealth = (metric: MetricType) => {
    // In a real app, this would open a form or modal to log health data
    console.log(`Logging data for ${metric}`)
    // For demo purposes, we'll just show a message
    alert(`Logging data for ${metric} - This would open a form in the real app`)
  }

  const toggleExpand = (metric: MetricType) => {
    if (expandedMetrics.includes(metric)) {
      setExpandedMetrics(expandedMetrics.filter((m) => m !== metric))
    } else {
      setExpandedMetrics([...expandedMetrics, metric])
    }
  }

  // Sample data - in a real app, this would come from an API
  const generateEczemaData = () => {
    const data = []
    const daysToGenerate =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 30
          : timeRange === "90d"
            ? 90
            : timeRange === "6m"
              ? 180
              : timeRange === "1y"
                ? 365
                : 365

    // For demo purposes, we'll generate fewer data points for longer time ranges
    const step =
      timeRange === "7d"
        ? 1
        : timeRange === "30d"
          ? 2
          : timeRange === "90d"
            ? 6
            : timeRange === "6m"
              ? 12
              : timeRange === "1y"
                ? 24
                : 24

    let severity = 7 // Start with a moderate severity
    let itching = 6
    let redness = 5
    let dryness = 6

    const now = new Date()
    for (let i = daysToGenerate; i >= 0; i -= step) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      // Randomly adjust values with a slight downward trend (improvement)
      severity = Math.max(1, Math.min(10, severity + (Math.random() * 2 - 1.1)))
      itching = Math.max(1, Math.min(10, itching + (Math.random() * 2 - 1.1)))
      redness = Math.max(1, Math.min(10, redness + (Math.random() * 2 - 1.1)))
      dryness = Math.max(1, Math.min(10, dryness + (Math.random() * 2 - 1.1)))

      data.push({
        date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        severity: Math.round(severity * 10) / 10,
        itching: Math.round(itching * 10) / 10,
        redness: Math.round(redness * 10) / 10,
        dryness: Math.round(dryness * 10) / 10,
      })
    }

    return data
  }

  const generateSleepData2 = () => {
    const data = []
    const daysToGenerate =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 30
          : timeRange === "90d"
            ? 30
            : timeRange === "6m"
              ? 30
              : timeRange === "1y"
                ? 30
                : 30

    let duration = 7.5 // Start with 7.5 hours
    let quality = 7 // Start with quality of 7/10

    const now = new Date()
    for (let i = daysToGenerate; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      // Randomly adjust values
      duration = Math.max(4, Math.min(10, duration + (Math.random() * 1 - 0.5)))
      quality = Math.max(3, Math.min(10, quality + (Math.random() * 2 - 1)))

      data.push({
        date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        duration: Math.round(duration * 10) / 10,
        quality: Math.round(quality),
      })
    }

    return data
  }

  const generateActivityData2 = () => {
    const data = []
    const daysToGenerate =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 30
          : timeRange === "90d"
            ? 30
            : timeRange === "6m"
              ? 30
              : timeRange === "1y"
                ? 30
                : 30

    const now = new Date()
    for (let i = daysToGenerate; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      // Random values with weekend pattern
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const steps = Math.round((isWeekend ? 4000 : 7000) + (Math.random() * 4000 - 2000))
      const activeMinutes = Math.round((isWeekend ? 20 : 35) + (Math.random() * 30 - 15))

      data.push({
        date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        steps,
        activeMinutes,
      })
    }

    return data
  }

  const generateNutritionData2 = () => {
    return [
      { name: "Fruits & Vegetables", value: 35 },
      { name: "Proteins", value: 25 },
      { name: "Grains", value: 20 },
      { name: "Dairy", value: 10 },
      { name: "Processed Foods", value: 10 },
    ]
  }

  const generateStressData2 = () => {
    const data = []
    const daysToGenerate =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 30
          : timeRange === "90d"
            ? 30
            : timeRange === "6m"
              ? 30
              : timeRange === "1y"
                ? 30
                : 30

    let stress = 5 // Start with medium stress

    const now = new Date()
    for (let i = daysToGenerate; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      // Randomly adjust with slight upward trend
      stress = Math.max(1, Math.min(10, stress + (Math.random() * 2 - 0.9)))

      data.push({
        date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        level: Math.round(stress),
      })
    }

    return data
  }

  const generateVitalsData2 = () => {
    const data = []
    const daysToGenerate =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 14
          : timeRange === "90d"
            ? 14
            : timeRange === "6m"
              ? 14
              : timeRange === "1y"
                ? 14
                : 14

    let heartRate = 72
    let systolic = 120
    let diastolic = 80

    const now = new Date()
    for (let i = daysToGenerate; i >= 0; i -= 1) {
      const date = new Date()
      date.setDate(now.getDate() - i * 2)

      // Randomly adjust values
      heartRate = Math.round(heartRate + (Math.random() * 8 - 4))
      systolic = Math.round(systolic + (Math.random() * 10 - 5))
      diastolic = Math.round(diastolic + (Math.random() * 8 - 4))

      data.push({
        date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        heartRate,
        systolic,
        diastolic,
      })
    }

    return data
  }

  const generateEnvironmentData = () => {
    return [
      { factor: "Humidity", score: 65 },
      { factor: "Temperature", score: 72 },
      { factor: "Pollen", score: 45 },
      { factor: "Air Quality", score: 82 },
      { factor: "UV Index", score: 58 },
    ]
  }

  const generateMedicationData = () => {
    const data = []
    const daysToGenerate =
      timeRange === "7d"
        ? 7
        : timeRange === "30d"
          ? 30
          : timeRange === "90d"
            ? 30
            : timeRange === "6m"
              ? 30
              : timeRange === "1y"
                ? 30
                : 30

    const now = new Date()
    for (let i = daysToGenerate; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      // Random adherence with mostly high values
      const adherence = Math.random() > 0.2 ? 1 : 0

      data.push({
        date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
        adherence,
      })
    }

    return data
  }

  const eczemaData = generateEczemaData()
  const sleepData2 = generateSleepData2()
  const activityData2 = generateActivityData2()
  const nutritionData2 = generateNutritionData2()
  const stressData3 = generateStressData2()
  const vitalsData2 = generateVitalsData2()
  const environmentData = generateEnvironmentData()
  const medicationData = generateMedicationData()

  const COLORS = ["#0ea5e9", "#14b8a6", "#eab308", "#ef4444", "#8884d8", "#82ca9d"]

  const renderMetricCard = (metric: MetricType) => {
    const isExpanded = expandedMetrics.includes(metric)

    switch (metric) {
      case "eczema":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Eczema Symptoms
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("eczema")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Eczema Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("eczema")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Current Severity: Mild (3.2/10)</div>
                <div className="ml-2 text-white/80">↓ 15% improvement</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={eczemaData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    name="Overall Severity"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="itching"
                    name="Itching"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="redness"
                    name="Redness"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dryness"
                    name="Dryness"
                    stroke="#fb923c"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Affected Areas</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Arms</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Neck</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Legs</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Face</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Potential Triggers</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                        <span>Stress levels correlate with flare-ups (correlation: 0.72)</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                        <span>Dairy consumption may be a dietary trigger</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                        <span>Low humidity environments worsen symptoms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "sleep":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Moon className="mr-2 h-5 w-5" />
                  Sleep Patterns
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("sleep")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Sleep Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("sleep")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Average: 7.2 hours/night</div>
                <div className="ml-2 text-white/80">↑ 8% improvement</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sleepData2} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" domain={[0, 12]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="duration"
                    name="Sleep Duration (hours)"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="quality"
                    name="Sleep Quality (1-10)"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Sleep Metrics</h4>
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Average Time to Fall Asleep</span>
                          <span>18 minutes</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Average Wakeups</span>
                          <span>1.2 per night</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Deep Sleep</span>
                          <span>1.8 hours/night</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Sleep Insights</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
                        <span>Better sleep quality correlates with reduced eczema symptoms</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
                        <span>Screen time before bed reduces sleep quality</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-indigo-500 mr-2 mt-0.5" />
                        <span>Consistent bedtime improves overall sleep patterns</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "activity":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Physical Activity
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("activity")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Activity Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("activity")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Daily Average: 6,842 steps</div>
                <div className="ml-2 text-white/80">↑ 12% improvement</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData2} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 120]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="steps" name="Steps" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="activeMinutes"
                    name="Active Minutes"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity Types</h4>
                    <ResponsiveContainer width="100%" height={200} className="mt-3">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Walking", value: 45 },
                            { name: "Running", value: 15 },
                            { name: "Cycling", value: 10 },
                            { name: "Swimming", value: 5 },
                            { name: "Other", value: 25 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {nutritionData2.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, ""]}
                          contentStyle={{
                            backgroundColor: "white",
                            borderColor: "#e2e8f0",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity Insights</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                        <span>Moderate exercise correlates with reduced eczema severity</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                        <span>Aim for 30+ minutes of activity 5 days per week</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                        <span>Excessive sweating during intense workouts may trigger flare-ups</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "nutrition":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Utensils className="mr-2 h-5 w-5" />
                  Nutrition
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("nutrition")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Nutrition Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("nutrition")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Diet Quality Score: 78/100</div>
                <div className="ml-2 text-white/80">↑ 5% improvement</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={nutritionData2}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {nutritionData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Potential Trigger Foods</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Dairy</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Eggs</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Gluten</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Nuts</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Nutrition Insights</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                        <span>Increased omega-3 intake correlates with reduced inflammation</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                        <span>Consider an elimination diet to identify food triggers</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                        <span>Hydration levels impact skin moisture and barrier function</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "stress":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Stress Levels
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("stress")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Stress Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("stress")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Current Level: Medium (5.8/10)</div>
                <div className="ml-2 text-white/80">↑ 5% increase</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stressData3} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    formatter={(value) => [`${value}/10`, "Stress Level"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="level"
                    name="Stress Level"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Stress Factors</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Work</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Health Concerns</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Financial</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Relationships</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Stress Management</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-violet-500 mr-2 mt-0.5" />
                        <span>Stress is strongly correlated with eczema flare-ups</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-violet-500 mr-2 mt-0.5" />
                        <span>Try mindfulness meditation to reduce stress levels</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-violet-500 mr-2 mt-0.5" />
                        <span>Regular exercise helps manage stress and improves skin health</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "vitals":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Vital Signs
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("vitals")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Vitals Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("vitals")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">BP: 120/80 mmHg</div>
                <div className="ml-2 bg-white/20 rounded-full px-2 py-0.5">HR: 72 bpm</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsData2} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" domain={[60, 180]} />
                  <YAxis yAxisId="right" orientation="right" domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="systolic"
                    name="Systolic BP"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="diastolic"
                    name="Diastolic BP"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="heartRate"
                    name="Heart Rate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "white" }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Vital Statistics</h4>
                    <div className="mt-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Blood Pressure</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">120/80 mmHg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Heart Rate</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">72 bpm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Temperature</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">98.6°F</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Respiratory Rate</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">16 breaths/min</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Vital Sign Insights</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-sky-500 mr-2 mt-0.5" />
                        <span>Your vital signs are within normal ranges</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-sky-500 mr-2 mt-0.5" />
                        <span>Lower heart rate correlates with better stress management</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-sky-500 mr-2 mt-0.5" />
                        <span>Consider monitoring blood pressure during flare-ups</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "environment":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-green-500 to-lime-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Thermometer className="mr-2 h-5 w-5" />
                  Environmental Factors
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("environment")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Environment Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("environment")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Humidity: 45%</div>
                <div className="ml-2 bg-white/20 rounded-full px-2 py-0.5">Temperature: 72°F</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius={150} data={environmentData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Environmental Factors"
                    dataKey="score"
                    stroke="#84cc16"
                    fill="#84cc16"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}/100`, ""]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Environmental Impact</h4>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Humidity</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Temperature</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Pollen</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Air Quality</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Environmental Insights</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Low humidity correlates with increased skin dryness</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>Consider using a humidifier when humidity drops below 40%</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>High pollen days may trigger allergic reactions and eczema flares</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "medication":
        return (
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-slate-900/30">
            <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Pill className="mr-2 h-5 w-5" />
                  Medication Adherence
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onLogHealth("medication")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Log Medication Data"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand("medication")}
                    className="p-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <div className="bg-white/20 rounded-full px-2 py-0.5">Adherence Rate: 92%</div>
                <div className="ml-2 text-white/80">↑ 4% improvement</div>
              </div>
            </div>
            <div className={`p-4 ${isExpanded ? "" : "max-h-[300px] overflow-hidden"}`}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={medicationData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(value) => (value === 0 ? "Missed" : "Taken")} />
                  <Tooltip
                    formatter={(value) => [value === 1 ? "Taken" : "Missed", "Medication"]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="adherence" name="Medication Adherence" fill="#d946ef" radius={[4, 4, 0, 0]}>
                    {medicationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.adherence === 1 ? "#d946ef" : "#f87171"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {isExpanded && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Medications</h4>
                    <div className="mt-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Hydrocortisone Cream
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Apply twice daily</div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          95% adherence
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Antihistamine</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Take once daily</div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          90% adherence
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Moisturizer</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Apply after shower</div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          85% adherence
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Medication Insights</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-fuchsia-500 mr-2 mt-0.5" />
                        <span>Higher medication adherence correlates with reduced symptom severity</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-fuchsia-500 mr-2 mt-0.5" />
                        <span>Most commonly missed: evening applications</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-fuchsia-500 mr-2 mt-0.5" />
                        <span>Set reminders to improve adherence rates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Metrics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sleep Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Sleep</CardTitle>
              <Moon className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Hours of sleep per night</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" stroke="#3b82f6" fillOpacity={1} fill="url(#sleepGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-semibold">7.6 hrs</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-xl font-semibold">8 hrs</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quality</p>
                <p className="text-xl font-semibold">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Physical Activity</CardTitle>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <CardDescription>Daily steps and active minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="steps" fill="#10b981" name="Steps" />
                  <Bar yAxisId="right" dataKey="active" fill="#3b82f6" name="Active Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Avg Steps</p>
                <p className="text-xl font-semibold">8,429</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Active</p>
                <p className="text-xl font-semibold">44 min</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-xl font-semibold">10,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Metrics */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Nutrition</CardTitle>
              <Utensils className="h-5 w-5 text-orange-500" />
            </div>
            <CardDescription>Caloric and macronutrient intake</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calories">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calories">Calories</TabsTrigger>
                <TabsTrigger value="protein">Protein</TabsTrigger>
                <TabsTrigger value="carbs">Carbs</TabsTrigger>
                <TabsTrigger value="fat">Fat</TabsTrigger>
              </TabsList>
              <TabsContent value="calories" className="h-[200px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nutritionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="protein" className="h-[200px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nutritionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="carbs" className="h-[200px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nutritionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="carbs" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="fat" className="h-[200px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={nutritionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Avg Calories</p>
                <p className="text-xl font-semibold">2,143</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-xl font-semibold">2,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Vital Signs</CardTitle>
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <CardDescription>Heart rate and blood pressure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate (bpm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Avg HR</p>
                <p className="text-xl font-semibold">68 bpm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg BP</p>
                <p className="text-xl font-semibold">120/80</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-semibold text-green-500">Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hydration */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Hydration</CardTitle>
              <Droplets className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Daily water intake (liters)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hydrationData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="hydrationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 3.5]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="water"
                    stroke="#0ea5e9"
                    fillOpacity={1}
                    fill="url(#hydrationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-semibold">2.2 L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-xl font-semibold">2.5 L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-semibold text-yellow-500">Fair</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stress Levels */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Stress Levels</CardTitle>
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>Daily stress level (1-10 scale)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stressData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="level" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-xl font-semibold">4.3</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-xl font-semibold">&lt; 5</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-semibold text-green-500">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {activeMetrics.map((metric) => (
        <motion.div
          key={metric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderMetricCard(metric)}
        </motion.div>
      ))}
    </div>
  )
}

