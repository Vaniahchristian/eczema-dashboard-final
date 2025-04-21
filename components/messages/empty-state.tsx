"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = "No messages yet",
  description = "Start a conversation with your doctor to get personalized advice and support.",
  action
}: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto p-8">
        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {action && (
          <Button
            onClick={action.onClick}
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
