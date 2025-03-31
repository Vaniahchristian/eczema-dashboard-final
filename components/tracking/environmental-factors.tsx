import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Sample data for environmental factors
const humidityData = [
  { date: "Mon", value: 45 },
  { date: "Tue", value: 48 },
  { date: "Wed", value: 52 },
  { date: "Thu", value: 49 },
  { date: "Fri", value: 53 },
  { date: "Sat", value: 58 },
  { date: "Sun", value: 55 },
]

const temperatureData = [
  { date: "Mon", value: 72 },
  { date: "Tue", value: 74 },
  { date: "Wed", value: 76 },
  { date: "Thu", value: 75 },
  { date: "Fri", value: 73 },
  { date: "Sat", value: 71 },
  { date: "Sun", value: 70 },
]

const allergenData = [
  { date: "Mon", pollen: 3, dust: 2, pet: 1 },
  { date: "Tue", pollen: 4, dust: 2, pet: 1 },
  { date: "Wed", pollen: 5, dust: 3, pet: 2 },
  { date: "Thu", pollen: 4, dust: 3, pet: 2 },
  { date: "Fri", pollen: 3, dust: 2, pet: 1 },
  { date: "Sat", pollen: 2, dust: 1, pet: 1 },
  { date: "Sun", pollen: 2, dust: 2, pet: 1 },
]

const EnvironmentalFactors: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Environmental Factors</CardTitle>
        <CardDescription>Track environmental conditions that may affect your eczema</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="humidity" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="allergens">Allergens</TabsTrigger>
          </TabsList>

          <TabsContent value="humidity" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer>
                  <LineChart data={humidityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: "Humidity (%)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent>
                              <div className="font-medium">{payload[0].payload.date}</div>
                              <div className="text-sm text-muted-foreground">Humidity: {payload[0].value}%</div>
                            </ChartTooltipContent>
                          )
                        }
                        return null
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="humidity-alert">Alert when humidity is too low</Label>
              <Switch id="humidity-alert" />
            </div>
            <div className="space-y-2">
              <Label>Set ideal humidity range</Label>
              <Slider defaultValue={[40, 60]} max={100} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer>
                  <LineChart data={temperatureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: "Temperature (°F)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent>
                              <div className="font-medium">{payload[0].payload.date}</div>
                              <div className="text-sm text-muted-foreground">Temperature: {payload[0].value}°F</div>
                            </ChartTooltipContent>
                          )
                        }
                        return null
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="temp-alert">Alert when temperature is outside range</Label>
              <Switch id="temp-alert" />
            </div>
            <div className="space-y-2">
              <Label>Set ideal temperature range</Label>
              <Slider defaultValue={[68, 75]} min={50} max={90} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50°F</span>
                <span>70°F</span>
                <span>90°F</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="allergens" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer>
                  <LineChart data={allergenData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: "Level (1-10)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent>
                              <div className="font-medium">{payload[0]?.payload.date}</div>
                              {payload.map((entry, index) => (
                                <div key={index} className="text-sm text-muted-foreground">
                                  {entry.name}: {entry.value}
                                </div>
                              ))}
                            </ChartTooltipContent>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="pollen" name="Pollen" stroke="#8884d8" />
                    <Line type="monotone" dataKey="dust" name="Dust" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="pet" name="Pet Dander" stroke="#ffc658" />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="pollen-alert">Pollen alerts</Label>
                <Switch id="pollen-alert" />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="dust-alert">Dust alerts</Label>
                <Switch id="dust-alert" />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="pet-alert">Pet dander alerts</Label>
                <Switch id="pet-alert" />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Log Allergen Exposure
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EnvironmentalFactors

