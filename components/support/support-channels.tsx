"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Phone, Video, Mail, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function SupportChannels() {
  const { toast } = useToast()
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  const handleContactRequest = (channel: string) => {
    toast({
      title: "Contact Request Sent",
      description: `We'll connect with you via ${channel} shortly.`,
      duration: 3000,
    })
    setActiveChannel(null)
  }

  const channels = [
    {
      id: "chat",
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      waitTime: "< 2 min",
      availability: "24/7",
    },
    {
      id: "phone",
      title: "Phone Support",
      description: "Speak directly with a support specialist",
      icon: <Phone className="h-8 w-8 text-primary" />,
      waitTime: "~5 min",
      availability: "8am-8pm",
    },
    {
      id: "video",
      title: "Video Consultation",
      description: "Schedule a face-to-face video call",
      icon: <Video className="h-8 w-8 text-primary" />,
      waitTime: "By appointment",
      availability: "9am-5pm",
    },
    {
      id: "email",
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="h-8 w-8 text-primary" />,
      waitTime: "~4 hours",
      availability: "24/7",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Choose Your Support Channel</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((channel, index) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  {channel.icon}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{channel.waitTime}</span>
                  </div>
                </div>
                <CardTitle className="mt-4">{channel.title}</CardTitle>
                <CardDescription>{channel.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Available: {channel.availability}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={activeChannel === channel.id}
                  onOpenChange={(open) => setActiveChannel(open ? channel.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">Connect Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect via {channel.title}</DialogTitle>
                      <DialogDescription>
                        Fill in your details and we'll connect you with a support specialist.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" className="col-span-3" placeholder="Your name" />
                      </div>

                      {channel.id === "email" || channel.id === "chat" ? (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="message" className="text-right">
                            Message
                          </Label>
                          <Textarea id="message" className="col-span-3" placeholder="How can we help you today?" />
                        </div>
                      ) : channel.id === "phone" ? (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">
                            Phone
                          </Label>
                          <Input id="phone" className="col-span-3" placeholder="Your phone number" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="time" className="text-right">
                            Preferred Time
                          </Label>
                          <Input id="time" type="datetime-local" className="col-span-3" />
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button onClick={() => handleContactRequest(channel.title)}>
                        {channel.id === "video" ? "Schedule Call" : "Connect Now"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

