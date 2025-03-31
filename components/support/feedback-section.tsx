"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Send, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackSection() {
  const { toast } = useToast()
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      toast({
        title: "Feedback submitted",
        description: "Thank you for helping us improve EczemaAI",
        duration: 3000,
      })
    }, 1500)
  }

  const handleReset = () => {
    setRating(null)
    setFeedback("")
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center py-8"
      >
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <ThumbsUp className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You for Your Feedback!</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Your feedback helps us improve EczemaAI for everyone. We appreciate you taking the time to share your
          thoughts.
        </p>
        <Button onClick={handleReset}>Submit Another Response</Button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Share Your Feedback</h2>
        <p className="text-muted-foreground">Your feedback helps us improve EczemaAI. Let us know what you think!</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label className="text-base">How would you rate your experience with EczemaAI?</Label>
            <div className="flex justify-center my-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(value)}
                  className="mx-2 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating !== null && value <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground px-2">
              <span>Very Dissatisfied</span>
              <span>Very Satisfied</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-base">
              What could we improve?
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or issues you've encountered..."
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">What aspects of EczemaAI are you providing feedback on?</Label>
            <RadioGroup defaultValue="overall">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overall" id="overall" />
                  <Label htmlFor="overall">Overall Experience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ui" id="ui" />
                  <Label htmlFor="ui">User Interface</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="features" id="features" />
                  <Label htmlFor="features">Features & Functionality</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="performance" id="performance" />
                  <Label htmlFor="performance">Performance & Speed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accuracy" id="accuracy" />
                  <Label htmlFor="accuracy">Diagnosis Accuracy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="support" id="support" />
                  <Label htmlFor="support">Customer Support</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

