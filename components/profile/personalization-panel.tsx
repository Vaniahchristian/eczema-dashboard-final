"use client"

import { useState } from "react"
import { Palette, Layout, Image, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface PersonalizationPanelProps {
  isOpen: boolean
  onClose: () => void
  currentTheme: string
  onThemeChange: (theme: any) => void
}

export default function PersonalizationPanel({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}: PersonalizationPanelProps) {
  const [layout, setLayout] = useState("default")
  const [coverPhoto, setCoverPhoto] = useState("gradient")
  const [showAchievements, setShowAchievements] = useState(true)
  const [showActivity, setShowActivity] = useState(true)
  const [showConnections, setShowConnections] = useState(true)

  const themes = [
    { id: "default", name: "Default", colors: ["from-sky-400", "to-teal-400"] },
    { id: "nature", name: "Nature", colors: ["from-green-400", "to-emerald-500"] },
    { id: "ocean", name: "Ocean", colors: ["from-blue-400", "to-cyan-500"] },
    { id: "sunset", name: "Sunset", colors: ["from-orange-400", "to-rose-500"] },
  ]

  const layouts = [
    { id: "default", name: "Default", description: "Standard three-column layout" },
    { id: "focused", name: "Focused", description: "Emphasize your activity feed" },
    { id: "minimal", name: "Minimal", description: "Clean, distraction-free design" },
  ]

  const coverOptions = [
    { id: "gradient", name: "Gradient", description: "Colorful gradient background" },
    { id: "pattern", name: "Pattern", description: "Subtle pattern background" },
    { id: "custom", name: "Custom Image", description: "Upload your own cover photo" },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Customize Your Profile</SheetTitle>
          <SheetDescription>Personalize your profile appearance and layout</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="theme" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theme">
              <Palette className="h-4 w-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="cover">
              <Image className="h-4 w-4 mr-2" />
              Cover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Color Theme</h3>
              <RadioGroup value={currentTheme} onValueChange={onThemeChange} className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <div key={theme.id} className="relative">
                    <RadioGroupItem value={theme.id} id={`theme-${theme.id}`} className="sr-only" />
                    <Label
                      htmlFor={`theme-${theme.id}`}
                      className="flex flex-col items-center space-y-2 rounded-md border-2 border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                      data-state={currentTheme === theme.id ? "checked" : "unchecked"}
                    >
                      <div
                        className={`w-full h-20 rounded-md bg-gradient-to-r ${theme.colors[0]} ${theme.colors[1]}`}
                      />
                      <span className="text-sm font-medium">{theme.name}</span>
                      {currentTheme === theme.id && (
                        <div className="absolute top-3 right-3 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Layout Style</h3>
              <RadioGroup value={layout} onValueChange={setLayout} className="space-y-3">
                {layouts.map((layoutOption) => (
                  <div key={layoutOption.id} className="relative">
                    <RadioGroupItem value={layoutOption.id} id={`layout-${layoutOption.id}`} className="sr-only" />
                    <Label
                      htmlFor={`layout-${layoutOption.id}`}
                      className="flex items-center space-x-3 rounded-md border-2 border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                      data-state={layout === layoutOption.id ? "checked" : "unchecked"}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{layoutOption.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{layoutOption.description}</p>
                      </div>
                      {layout === layoutOption.id && (
                        <div className="h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-medium mb-3">Visible Sections</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-achievements" className="text-sm">
                      Achievements
                    </Label>
                    <Switch id="show-achievements" checked={showAchievements} onCheckedChange={setShowAchievements} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-activity" className="text-sm">
                      Activity Feed
                    </Label>
                    <Switch id="show-activity" checked={showActivity} onCheckedChange={setShowActivity} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-connections" className="text-sm">
                      Connections
                    </Label>
                    <Switch id="show-connections" checked={showConnections} onCheckedChange={setShowConnections} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cover" className="mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Cover Photo Style</h3>
              <RadioGroup value={coverPhoto} onValueChange={setCoverPhoto} className="space-y-3">
                {coverOptions.map((option) => (
                  <div key={option.id} className="relative">
                    <RadioGroupItem value={option.id} id={`cover-${option.id}`} className="sr-only" />
                    <Label
                      htmlFor={`cover-${option.id}`}
                      className="flex items-center space-x-3 rounded-md border-2 border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer"
                      data-state={coverPhoto === option.id ? "checked" : "unchecked"}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{option.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
                      </div>
                      {coverPhoto === option.id && (
                        <div className="h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {coverPhoto === "custom" && (
                <div className="mt-4">
                  <Button className="w-full">Upload Cover Photo</Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommended size: 1500 x 500 pixels</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

