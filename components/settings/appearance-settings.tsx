"use client"

import { useState } from "react"
import { Brush, Check, Layout, Palette, Smartphone, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const colorThemes = [
  { name: "Sky Blue", primary: "bg-sky-500", secondary: "bg-teal-500", accent: "bg-indigo-500" },
  { name: "Emerald", primary: "bg-emerald-500", secondary: "bg-teal-500", accent: "bg-cyan-500" },
  { name: "Purple", primary: "bg-purple-500", secondary: "bg-violet-500", accent: "bg-indigo-500" },
  { name: "Rose", primary: "bg-rose-500", secondary: "bg-pink-500", accent: "bg-red-500" },
  { name: "Amber", primary: "bg-amber-500", secondary: "bg-yellow-500", accent: "bg-orange-500" },
  { name: "Slate", primary: "bg-slate-500", secondary: "bg-slate-600", accent: "bg-slate-700" },
]

export default function AppearanceSettings() {
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [themeMode, setThemeMode] = useState("system")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Appearance</h2>
        <Button variant="outline" size="sm">
          <Brush className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </div>

      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        {/* Theme Tab */}
        <TabsContent value="theme" className="pt-6">
          <div className="space-y-8">
            {/* Color Theme */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2 text-sky-500" />
                Color Theme
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorThemes.map((theme, index) => (
                  <div
                    key={index}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${
                        selectedTheme === index
                          ? "border-sky-500 dark:border-sky-400 ring-2 ring-sky-500/50"
                          : "border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800"
                      }
                    `}
                    onClick={() => setSelectedTheme(index)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">{theme.name}</span>
                      {selectedTheme === index && <Check className="h-4 w-4 text-sky-500" />}
                    </div>
                    <div className="flex space-x-2">
                      <div className={`w-8 h-8 rounded-full ${theme.primary}`}></div>
                      <div className={`w-8 h-8 rounded-full ${theme.secondary}`}></div>
                      <div className={`w-8 h-8 rounded-full ${theme.accent}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Theme Mode */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
              <RadioGroup
                value={themeMode}
                onValueChange={setThemeMode}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div
                  className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${
                    themeMode === "light"
                      ? "border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/20"
                      : "border-slate-200 dark:border-slate-700"
                  }
                `}
                >
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  <Label htmlFor="theme-light" className="cursor-pointer">
                    <div className="flex items-center justify-center mb-3">
                      <Sun className="h-8 w-8 text-amber-500" />
                    </div>
                    <div className="text-center font-medium">Light Mode</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
                      Light background with dark text
                    </p>
                  </Label>
                </div>

                <div
                  className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${
                    themeMode === "dark"
                      ? "border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/20"
                      : "border-slate-200 dark:border-slate-700"
                  }
                `}
                >
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  <Label htmlFor="theme-dark" className="cursor-pointer">
                    <div className="flex items-center justify-center mb-3">
                      <Moon className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div className="text-center font-medium">Dark Mode</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
                      Dark background with light text
                    </p>
                  </Label>
                </div>

                <div
                  className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${
                    themeMode === "system"
                      ? "border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/20"
                      : "border-slate-200 dark:border-slate-700"
                  }
                `}
                >
                  <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  <Label htmlFor="theme-system" className="cursor-pointer">
                    <div className="flex items-center justify-center mb-3">
                      <Monitor className="h-8 w-8 text-slate-500" />
                    </div>
                    <div className="text-center font-medium">System</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1">
                      Follow system preferences
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="pt-6">
          <div className="space-y-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Layout className="h-5 w-5 mr-2 text-teal-500" />
              Layout Options
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reduce spacing and padding</p>
                </div>
                <Switch id="compact-mode" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sidebar Position</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Choose sidebar location</p>
                </div>
                <RadioGroup defaultValue="left" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="left" id="sidebar-left" />
                    <Label htmlFor="sidebar-left">Left</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="right" id="sidebar-right" />
                    <Label htmlFor="sidebar-right">Right</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Content Width</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Maximum width of content area</p>
                </div>
                <RadioGroup defaultValue="wide" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="narrow" id="width-narrow" />
                    <Label htmlFor="width-narrow">Narrow</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="width-medium" />
                    <Label htmlFor="width-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wide" id="width-wide" />
                    <Label htmlFor="width-wide">Wide</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sticky Header</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Keep header visible when scrolling</p>
                </div>
                <Switch id="sticky-header" defaultChecked />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Dashboard Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:border-sky-200 dark:hover:border-sky-800">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md mb-3 overflow-hidden">
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex h-[calc(100%-12px)]">
                      <div className="w-1/4 h-full bg-slate-200 dark:bg-slate-700 p-1">
                        <div className="w-full h-3 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                        <div className="w-full h-3 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                        <div className="w-full h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      </div>
                      <div className="w-3/4 h-full p-1">
                        <div className="grid grid-cols-2 gap-1 h-full">
                          <div className="bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-center">Grid Layout</div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:border-sky-200 dark:hover:border-sky-800">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-md mb-3 overflow-hidden">
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex h-[calc(100%-12px)]">
                      <div className="w-1/4 h-full bg-slate-200 dark:bg-slate-700 p-1">
                        <div className="w-full h-3 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                        <div className="w-full h-3 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                        <div className="w-full h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                      </div>
                      <div className="w-3/4 h-full p-1">
                        <div className="space-y-1 h-full">
                          <div className="bg-slate-200 dark:bg-slate-700 h-1/4 rounded"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-1/4 rounded"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-1/4 rounded"></div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-1/4 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-center">List Layout</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="pt-6">
          <div className="space-y-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-emerald-500" />
              Display Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Welcome Message</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Display welcome message on dashboard</p>
                </div>
                <Switch id="welcome-message" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Metrics</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Display health metrics on dashboard</p>
                </div>
                <Switch id="show-metrics" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Recent Activity</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Display recent activity on dashboard</p>
                </div>
                <Switch id="recent-activity" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Upcoming Appointments</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Display upcoming appointments on dashboard
                  </p>
                </div>
                <Switch id="upcoming-appointments" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Weather Information</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Display local weather that may affect eczema
                  </p>
                </div>
                <Switch id="weather-info" />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Card Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-sky-500 dark:border-sky-400 ring-2 ring-sky-500/50 rounded-lg p-4 cursor-pointer">
                  <div className="aspect-video bg-white dark:bg-slate-800 rounded-md shadow-md mb-3 overflow-hidden">
                    <div className="w-full h-1/4 bg-slate-100 dark:bg-slate-700 p-1">
                      <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                    <div className="p-2">
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded mb-1"></div>
                      <div className="w-2/3 h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="font-medium text-center">Default</div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 rounded-lg p-4 cursor-pointer">
                  <div className="aspect-video bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-3 overflow-hidden">
                    <div className="w-full h-1/4 bg-gradient-to-r from-sky-500 to-teal-500 p-1">
                      <div className="w-1/2 h-3 bg-white/20 rounded"></div>
                    </div>
                    <div className="p-2">
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded mb-1"></div>
                      <div className="w-2/3 h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="font-medium text-center">Gradient</div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 rounded-lg p-4 cursor-pointer">
                  <div className="aspect-video bg-white dark:bg-slate-800 rounded-none border-l-4 border-sky-500 shadow-md mb-3 overflow-hidden">
                    <div className="w-full h-1/4 bg-slate-100 dark:bg-slate-700 p-1">
                      <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                    <div className="p-2">
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded mb-1"></div>
                      <div className="w-2/3 h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="font-medium text-center">Bordered</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

