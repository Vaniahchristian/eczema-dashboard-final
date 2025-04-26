"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  loading?: boolean
  trend?: {
    value: number
    label: string
    inverse?: boolean
  }
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  loading = false,
  trend
}: MetricCardProps) {
  const isPositiveTrend = trend ? (trend.inverse ? trend.value < 0 : trend.value > 0) : false;

  return (
    <Card>
      <div className="p-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && (
              <div className="p-2 bg-primary/10 rounded-full">
                {icon}
              </div>
            )}
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
          </div>
        </div>
        <div className="mt-3">
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          ) : (
            <h3 className="text-2xl font-bold">{value}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <div
                className={cn(
                  "flex items-center text-sm",
                  isPositiveTrend ? "text-green-600" : "text-red-600"
                )}
              >
                {isPositiveTrend ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
