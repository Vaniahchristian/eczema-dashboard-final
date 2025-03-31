"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function LogHealthData() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("physical")
  const [itchLevel, setItchLevel] = useState([3])
  const [painLevel, setPainLevel] = useState([2])
  const [stressLevel, setStressLevel] = useState([4])
  const [sleepQuality, setSleepQuality] = useState([7])
  const [moodLevel, setMoodLevel] = useState([6])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    alert("Health data logged successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Log Health Data</h2>
          <p className="text-muted-foreground">Record your daily health metrics</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="eczema">Eczema</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="medication">Medication</TabsTrigger>
        </TabsList>

        <TabsContent value="physical" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="steps">Steps</Label>
                <Input id="steps" type="number" placeholder="e.g., 8,500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="active-minutes">Active Minutes</Label>
                <Input id="active-minutes" type="number" placeholder="e.g., 45" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercise-type">Exercise Type</Label>
                <Select>
                  <SelectTrigger id="exercise-type">
                    <SelectValue placeholder="Select exercise type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heart-rate">Average Heart Rate (bpm)</Label>
                <Input id="heart-rate" type="number" placeholder="e.g., 72" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories Burned</Label>
                <Input id="calories" type="number" placeholder="e.g., 350" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercise-notes">Notes</Label>
                <Textarea id="exercise-notes" placeholder="Any additional details about your physical activity" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="eczema" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="affected-areas">Affected Areas</Label>
                <Select>
                  <SelectTrigger id="affected-areas">
                    <SelectValue placeholder="Select affected areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="face">Face</SelectItem>
                    <SelectItem value="neck">Neck</SelectItem>
                    <SelectItem value="arms">Arms</SelectItem>
                    <SelectItem value="hands">Hands</SelectItem>
                    <SelectItem value="legs">Legs</SelectItem>
                    <SelectItem value="torso">Torso</SelectItem>
                    <SelectItem value="multiple">Multiple Areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Itch Severity (1-10)</Label>
                <Slider value={itchLevel} min={1} max={10} step={1} onValueChange={setItchLevel} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Pain Level (1-10)</Label>
                <Slider value={painLevel} min={1} max={10} step={1} onValueChange={setPainLevel} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>None</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flare-trigger">Potential Triggers</Label>
                <Select>
                  <SelectTrigger id="flare-trigger">
                    <SelectValue placeholder="Select potential trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stress">Stress</SelectItem>
                    <SelectItem value="food">Food Allergen</SelectItem>
                    <SelectItem value="weather">Weather Change</SelectItem>
                    <SelectItem value="fabric">Fabric/Clothing</SelectItem>
                    <SelectItem value="product">New Product</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment-used">Treatment Used</Label>
                <Input id="treatment-used" placeholder="e.g., Hydrocortisone cream" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eczema-notes">Notes</Label>
                <Textarea id="eczema-notes" placeholder="Any additional details about your eczema symptoms" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="water-intake">Water Intake (oz)</Label>
                <Input id="water-intake" type="number" placeholder="e.g., 64" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meals">Meals Eaten Today</Label>
                <Select>
                  <SelectTrigger id="meals">
                    <SelectValue placeholder="Select number of meals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Avoided Trigger Foods</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="dairy" />
                  <Label htmlFor="dairy">Dairy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="gluten" />
                  <Label htmlFor="gluten">Gluten</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="nuts" />
                  <Label htmlFor="nuts">Nuts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="eggs" />
                  <Label htmlFor="eggs">Eggs</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diet-type">Diet Type</Label>
                <RadioGroup defaultValue="balanced">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced">Balanced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anti-inflammatory" id="anti-inflammatory" />
                    <Label htmlFor="anti-inflammatory">Anti-inflammatory</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="elimination" id="elimination" />
                    <Label htmlFor="elimination">Elimination</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other-diet" />
                    <Label htmlFor="other-diet">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nutrition-notes">Notes</Label>
                <Textarea id="nutrition-notes" placeholder="Any additional details about your nutrition" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sleep-duration">Sleep Duration (hours)</Label>
                <Input id="sleep-duration" type="number" placeholder="e.g., 7.5" />
              </div>

              <div className="space-y-2">
                <Label>Sleep Quality (1-10)</Label>
                <Slider value={sleepQuality} min={1} max={10} step={1} onValueChange={setSleepQuality} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input id="bedtime" type="time" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wake-time">Wake Time</Label>
                <Input id="wake-time" type="time" />
              </div>

              <div className="space-y-2">
                <Label>Sleep Disruptions</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="itching" />
                  <Label htmlFor="itching">Itching</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="pain" />
                  <Label htmlFor="pain">Pain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="other-disruption" />
                  <Label htmlFor="other-disruption">Other</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sleep-notes">Notes</Label>
                <Textarea id="sleep-notes" placeholder="Any additional details about your sleep" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Overall Mood (1-10)</Label>
                <Slider value={moodLevel} min={1} max={10} step={1} onValueChange={setMoodLevel} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Neutral</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stress Level (1-10)</Label>
                <Slider value={stressLevel} min={1} max={10} step={1} onValueChange={setStressLevel} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood-type">Primary Mood</Label>
                <Select>
                  <SelectTrigger id="mood-type">
                    <SelectValue placeholder="Select primary mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Happy</SelectItem>
                    <SelectItem value="calm">Calm</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                    <SelectItem value="frustrated">Frustrated</SelectItem>
                    <SelectItem value="sad">Sad</SelectItem>
                    <SelectItem value="irritable">Irritable</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Stress Management Activities</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="meditation" />
                  <Label htmlFor="meditation">Meditation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="deep-breathing" />
                  <Label htmlFor="deep-breathing">Deep Breathing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="exercise" />
                  <Label htmlFor="exercise">Exercise</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="other-activity" />
                  <Label htmlFor="other-activity">Other</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood-notes">Notes</Label>
                <Textarea id="mood-notes" placeholder="Any additional details about your mood and mental wellbeing" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medication" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medication-name">Medication Name</Label>
                <Input id="medication-name" placeholder="e.g., Hydrocortisone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="e.g., 10mg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="three">Three times daily</SelectItem>
                    <SelectItem value="four">Four times daily</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                    <SelectItem value="other-freq">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="application-method">Application Method</Label>
                <Select>
                  <SelectTrigger id="application-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="other-method">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Side Effects Experienced</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="drowsiness" />
                  <Label htmlFor="drowsiness">Drowsiness</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="skin-thinning" />
                  <Label htmlFor="skin-thinning">Skin Thinning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="nausea" />
                  <Label htmlFor="nausea">Nausea</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="other-side-effect" />
                  <Label htmlFor="other-side-effect">Other</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medication-notes">Notes</Label>
                <Textarea id="medication-notes" placeholder="Any additional details about your medication" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Health Data
        </Button>
      </div>
    </div>
  )
}

