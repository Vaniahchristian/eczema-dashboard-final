"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

interface DateRangePickerProps {
  value: [Date, Date]
  onChange: (range: [Date, Date]) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isSelectingStart, setIsSelectingStart] = useState(true)

  const handleSelect = (date: Date | undefined) => {
    if (!date) return

    if (isSelectingStart) {
      // If selecting start date, keep the end date the same unless it's before the new start date
      onChange([date, date > value[1] ? date : value[1]])
      setIsSelectingStart(false)
    } else {
      // If selecting end date, ensure it's not before the start date
      onChange([value[0], date < value[0] ? value[0] : date])
      setIsSelectingStart(true)
    }
  }

  return (
    <Card className="p-4 bg-white dark:bg-slate-800 shadow-lg">
      <div className="space-y-4">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {isSelectingStart ? "Select start date" : "Select end date"}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {value[0].toLocaleDateString()} - {value[1].toLocaleDateString()}
        </div>
        <Calendar
          mode="single"
          selected={isSelectingStart ? value[0] : value[1]}
          onSelect={handleSelect}
          initialFocus
        />
      </div>
    </Card>
  )
}
