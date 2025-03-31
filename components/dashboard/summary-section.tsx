import { ArrowUpRight, Calendar, Clock, Droplet, Thermometer } from "lucide-react"
import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function SummarySection() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Your Eczema Summary</CardTitle>
        <CardDescription>Overview of your condition and treatment progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <MetricCard
            title="Severity Score"
            value="Mild"
            description="Based on your latest assessment"
            icon={<ArrowUpRight className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Treatment Adherence"
            value="87%"
            description="You're doing great!"
            icon={<Calendar className="h-4 w-4" />}
            trend={{ value: 4, isPositive: true }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Treatment Progress</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Symptom Reduction</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <Progress value={42} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
              <Thermometer className="h-5 w-5 text-sky-500 mr-3" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p>
                <p className="font-medium">72°F</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl">
              <Droplet className="h-5 w-5 text-sky-500 mr-3" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p>
                <p className="font-medium">45%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl mt-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-sky-500 mr-3" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Next Check-up</p>
                <p className="font-medium">June 15, 2023</p>
              </div>
            </div>
            <button className="text-xs font-medium text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300">
              View Details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

