"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreDiagnosisSurveyProps {
  onComplete: (data: PreDiagnosisData) => void
  onSkip: () => void
}

export interface PreDiagnosisData {
  eczemaHistory: string
  lastFlareup: string
  flareupTriggers: string[]
  currentSymptoms: string
  previousTreatments: string
  severity: string
}

export function PreDiagnosisSurvey({ onComplete, onSkip }: PreDiagnosisSurveyProps) {
  const [formData, setFormData] = useState<PreDiagnosisData>({
    eczemaHistory: "",
    lastFlareup: "",
    flareupTriggers: [],
    currentSymptoms: "",
    previousTreatments: "",
    severity: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const triggers = [
    "Stress",
    "Weather",
    "Food",
    "Allergens",
    "Skincare products",
    "Sweat",
    "Other"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>How long have you had eczema?</Label>
        <Select
          value={formData.eczemaHistory}
          onValueChange={(value) => setFormData({ ...formData, eczemaHistory: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Recently diagnosed</SelectItem>
            <SelectItem value="<1">Less than 1 year</SelectItem>
            <SelectItem value="1-5">1-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value=">10">More than 10 years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>When was your last flare-up?</Label>
        <Select
          value={formData.lastFlareup}
          onValueChange={(value) => setFormData({ ...formData, lastFlareup: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Currently experiencing</SelectItem>
            <SelectItem value="<1w">Less than a week ago</SelectItem>
            <SelectItem value="1-4w">1-4 weeks ago</SelectItem>
            <SelectItem value="1-6m">1-6 months ago</SelectItem>
            <SelectItem value=">6m">More than 6 months ago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>What triggers your flare-ups? (Select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {triggers.map((trigger) => (
            <label key={trigger} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.flareupTriggers.includes(trigger)}
                onChange={(e) => {
                  const newTriggers = e.target.checked
                    ? [...formData.flareupTriggers, trigger]
                    : formData.flareupTriggers.filter(t => t !== trigger)
                  setFormData({ ...formData, flareupTriggers: newTriggers })
                }}
                className="rounded border-gray-300"
              />
              <span>{trigger}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Describe your current symptoms:</Label>
        <Textarea
          value={formData.currentSymptoms}
          onChange={(e) => setFormData({ ...formData, currentSymptoms: e.target.value })}
          placeholder="E.g., redness, itching, scaling..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Have you tried any treatments before?</Label>
        <Textarea
          value={formData.previousTreatments}
          onChange={(e) => setFormData({ ...formData, previousTreatments: e.target.value })}
          placeholder="List any medications, creams, or remedies you've used..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>How would you rate the current severity?</Label>
        <RadioGroup
          value={formData.severity}
          onValueChange={(value) => setFormData({ ...formData, severity: value })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mild" id="mild" />
            <Label htmlFor="mild">Mild</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moderate" id="moderate" />
            <Label htmlFor="moderate">Moderate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="severe" id="severe" />
            <Label htmlFor="severe">Severe</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          Continue
        </Button>
        <Button type="button" variant="outline" onClick={onSkip} className="flex-1">
          Skip
        </Button>
      </div>
    </form>
  )
}
