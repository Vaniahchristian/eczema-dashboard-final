import { ArrowUpRight, BarChart3, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/ui/metric-card"

export default function AnalyticsSection() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Analytics & Insights</CardTitle>
        <CardDescription>Trends and patterns in your eczema condition</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Flare-ups"
            value="2"
            description="Last 30 days"
            icon={<ArrowUpRight className="h-4 w-4" />}
            trend={{ value: 50, isPositive: false }}
          />
          <MetricCard
            title="Avg. Severity"
            value="3.2"
            description="Scale of 1-10"
            icon={<LineChart className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Triggers Identified"
            value="5"
            description="Most common: Stress"
            icon={<PieChart className="h-4 w-4" />}
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-10 w-10 text-sky-500 mr-4" />
            <div>
              <h4 className="font-medium">Detailed Analytics</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">View comprehensive reports and trends</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors">
            View Reports
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

