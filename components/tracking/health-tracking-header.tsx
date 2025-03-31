import { Button } from "@/components/ui/button"
import { Calendar, LineChart, PlusCircle, Settings } from "lucide-react"

export default function HealthTrackingHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Tracking</h1>
        <p className="text-muted-foreground mt-1">Monitor your health metrics and track your progress over time</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Date Range</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Export Data</span>
        </Button>
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Log Entry</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

