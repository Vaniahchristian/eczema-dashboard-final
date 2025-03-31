"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, Upload, X, Paperclip, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function SupportTicket() {
  const { toast } = useToast()
  const [formState, setFormState] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "medium",
    attachments: [] as File[],
    email: "",
    name: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Check file size (limit to 5MB per file)
      const oversizedFiles = newFiles.filter((file) => file.size > 5 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Files must be less than 5MB each",
          duration: 3000,
        })
        return
      }

      setFormState((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles].slice(0, 3), // Limit to 3 files
      }))
    }
  }

  const removeAttachment = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formState.subject.trim()) {
      errors.subject = "Subject is required"
    }

    if (!formState.description.trim()) {
      errors.description = "Description is required"
    } else if (formState.description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters"
    }

    if (!formState.category) {
      errors.category = "Category is required"
    }

    if (!formState.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Email is invalid"
    }

    if (!formState.name.trim()) {
      errors.name = "Name is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors",
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
        title: "Ticket submitted successfully",
        description: "We'll get back to you as soon as possible",
        duration: 5000,
      })
    }, 2000)
  }

  const resetForm = () => {
    setFormState({
      subject: "",
      description: "",
      category: "",
      priority: "medium",
      attachments: [],
      email: "",
      name: "",
    })
    setFormErrors({})
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Ticket Submitted Successfully</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Your ticket has been submitted and our support team will review it shortly. You'll receive a
                confirmation email with your ticket number.
              </p>

              <div className="bg-card p-4 rounded-lg border w-full max-w-md mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Ticket ID:</span>
                  <span className="text-sm">
                    #TK-
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Subject:</span>
                  <span className="text-sm">{formState.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Priority:</span>
                  <span className="text-sm capitalize">{formState.priority}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={resetForm}>Submit Another Ticket</Button>
                <Button variant="outline">View Ticket Status</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Submit a Support Ticket</h2>
        <p className="text-muted-foreground">
          Fill out the form below to create a support ticket. Our team will respond as soon as possible.
        </p>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Before submitting a ticket</AlertTitle>
        <AlertDescription>
          Check our Knowledge Base for answers to common questions. You might find a solution faster!
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            value={formState.subject}
            onChange={handleInputChange}
            placeholder="Brief summary of your issue"
            className={formErrors.subject ? "border-red-500" : ""}
          />
          {formErrors.subject && <p className="text-sm text-red-500">{formErrors.subject}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formState.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger id="category" className={formErrors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="technical">Technical Problems</SelectItem>
                <SelectItem value="billing">Billing & Subscription</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="data">Data & Privacy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={formState.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="cursor-pointer">
                  High
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="cursor-pointer">
                  Urgent
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Please provide as much detail as possible about your issue"
            className={`min-h-[150px] ${formErrors.description ? "border-red-500" : ""}`}
          />
          {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label>Attachments (Optional)</Label>
          <div className="border border-dashed rounded-lg p-4 text-center">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*, application/pdf, .doc, .docx"
              disabled={formState.attachments.length >= 3}
            />
            <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm font-medium mb-1">
                {formState.attachments.length >= 3 ? "Maximum files reached (3)" : "Click to upload files"}
              </span>
              <span className="text-xs text-muted-foreground">Support JPG, PNG, PDF, DOC up to 5MB</span>
            </Label>
          </div>

          {formState.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formState.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {Object.keys(formErrors).length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Please fix the errors in the form before submitting.</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

