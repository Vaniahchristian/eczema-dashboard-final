"use client"

import { useState } from "react"
import { Eye, Monitor, Moon, Sun, Type, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AccessibilitySettings() {
  const [fontSize, setFontSize] = useState(100)
  const [contrast, setContrast] = useState(100)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Accessibility Settings</h2>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      {/* Visual Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Monitor className="h-5 w-5 mr-2 text-sky-500" />
          Visual Settings
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">Font Size ({fontSize}%)</Label>
              <Button variant="outline" size="sm" onClick={() => setFontSize(100)} disabled={fontSize === 100}>
                Reset
              </Button>
            </div>
            <Slider
              id="font-size"
              min={75}
              max={150}
              step={5}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span>Smaller</span>
              <span>Default</span>
              <span>Larger</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">Contrast ({contrast}%)</Label>
              <Button variant="outline" size="sm" onClick={() => setContrast(100)} disabled={contrast === 100}>
                Reset
              </Button>
            </div>
            <Slider
              id="contrast"
              min={75}
              max={125}
              step={5}
              value={[contrast]}
              onValueChange={(value) => setContrast(value[0])}
            />
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-1">
              <span>Lower</span>
              <span>Default</span>
              <span>Higher</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reduce Motion</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Minimize animations and transitions</p>
            </div>
            <Switch id="reduce-motion" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">High Contrast Mode</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Increase contrast for better visibility</p>
            </div>
            <Switch id="high-contrast" />
          </div>

          <div>
            <Label htmlFor="theme-mode" className="mb-2 block font-medium">
              Theme Mode
            </Label>
            <RadioGroup defaultValue="system" className="flex space-x-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">Light</Label>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Moon className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark</Label>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="flex">
                    <div className="bg-amber-500 w-3 h-6 rounded-l-sm"></div>
                    <div className="bg-indigo-500 w-3 h-6 rounded-r-sm"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system">System</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Text Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Type className="h-5 w-5 mr-2 text-teal-500" />
          Text Settings
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="font-family" className="mb-2 block font-medium">
              Font Family
            </Label>
            <Select defaultValue="system">
              <SelectTrigger id="font-family" className="w-full md:w-[250px]">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Default</SelectItem>
                <SelectItem value="sans">Sans-serif</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Monospace</SelectItem>
                <SelectItem value="dyslexic">OpenDyslexic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Line Spacing</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Increase space between lines of text</p>
            </div>
            <Select defaultValue="normal">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="relaxed">Relaxed</SelectItem>
                <SelectItem value="loose">Loose</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Letter Spacing</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Adjust space between letters</p>
            </div>
            <Select defaultValue="normal">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tight">Tight</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
                <SelectItem value="wider">Wider</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Audio & Media */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Volume2 className="h-5 w-5 mr-2 text-emerald-500" />
          Audio & Media
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Screen Reader Support</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Optimize content for screen readers</p>
            </div>
            <Switch id="screen-reader" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autoplay Media</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Automatically play videos and animations</p>
            </div>
            <Switch id="autoplay" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Captions</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show captions for audio and video content</p>
            </div>
            <Switch id="captions" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">Audio Volume</Label>
            <Slider id="volume" min={0} max={100} step={5} defaultValue={[80]} />
          </div>
        </div>
      </div>
    </div>
  )
}

