"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

interface PostDiagnosisSurveyProps {
  diagnosisId: string
  onComplete: (data: PostDiagnosisData) => void
  onSkip: () => void
}

export interface PostDiagnosisData {
  diagnosisAccuracy: number
  diagnosisHelpfulness: number
  treatmentClarity: number
  userConfidence: number
  feedback: string
  wouldRecommend: boolean
}

export function PostDiagnosisSurvey({ diagnosisId, onComplete, onSkip }: PostDiagnosisSurveyProps) {
  const [formData, setFormData] = useState<PostDiagnosisData>({
    diagnosisAccuracy: 5,
    diagnosisHelpfulness: 5,
    treatmentClarity: 5,
    userConfidence: 5,
    feedback: "",
    wouldRecommend: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>How accurate do you feel this diagnosis is?</Label>
        <div className="pt-2">
          <Slider
            value={[formData.diagnosisAccuracy]}
            onValueChange={([value]) => setFormData({ ...formData, diagnosisAccuracy: value })}
            max={10}
            step={1}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>Not accurate</span>
            <span>Very accurate</span>
          </div>
        </div>
      </div>

      <div>
        <Label>How helpful was the diagnosis information?</Label>
        <div className="pt-2">
          <Slider
            value={[formData.diagnosisHelpfulness]}
            onValueChange={([value]) => setFormData({ ...formData, diagnosisHelpfulness: value })}
            max={10}
            step={1}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>Not helpful</span>
            <span>Very helpful</span>
          </div>
        </div>
      </div>

      <div>
        <Label>How clear were the treatment recommendations?</Label>
        <div className="pt-2">
          <Slider
            value={[formData.treatmentClarity]}
            onValueChange={([value]) => setFormData({ ...formData, treatmentClarity: value })}
            max={10}
            step={1}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>Not clear</span>
            <span>Very clear</span>
          </div>
        </div>
      </div>

      <div>
        <Label>How confident do you feel about managing your condition after this diagnosis?</Label>
        <div className="pt-2">
          <Slider
            value={[formData.userConfidence]}
            onValueChange={([value]) => setFormData({ ...formData, userConfidence: value })}
            max={10}
            step={1}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
        </div>
      </div>

      <div>
        <Label>Would you recommend this AI diagnosis tool to others?</Label>
        <RadioGroup
          value={formData.wouldRecommend ? "yes" : "no"}
          onValueChange={(value) => setFormData({ ...formData, wouldRecommend: value === "yes" })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Any additional feedback or suggestions?</Label>
        <Textarea
          value={formData.feedback}
          onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
          placeholder="Share your thoughts on how we can improve..."
          className="mt-1"
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit" className="flex-1">
          Submit Feedback
        </Button>
        <Button type="button" variant="outline" onClick={onSkip} className="flex-1">
          Skip
        </Button>
      </div>
    </form>
  )
}
