"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { messageService } from "@/services/messageService"
import { useToast } from "@/components/ui/use-toast"

interface Doctor {
    id: string
    firstName: string
    lastName: string
    imageUrl?: string
    specialization?: string
}

interface DoctorListProps {
    doctors: Doctor[]
    onSelectDoctor: (doctor: Doctor) => void
    onCreateConversation: (doctorId: string) => Promise<void>
}

export function DoctorList({
    doctors,
    onSelectDoctor,
    onCreateConversation
}: DoctorListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const { toast } = useToast()
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

    const handleDoctorSelect = async (doctor: Doctor) => {
        try {
            setLoading(prev => ({ ...prev, [doctor.id]: true }))
            await onCreateConversation(doctor.id)
            onSelectDoctor(doctor)
        } catch (error) {
            console.error("Error creating conversation:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create conversation",
                variant: "destructive"
            })
        } finally {
            setLoading(prev => ({ ...prev, [doctor.id]: false }))
        }
    }

    const filteredDoctors = doctors.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search doctors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
            
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {filteredDoctors.map((doctor) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button
                                variant="ghost"
                                className="w-full flex items-start gap-3 p-3 h-auto"
                                onClick={() => handleDoctorSelect(doctor)}
                                disabled={loading[doctor.id]}
                            >
                                <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarImage src={doctor.imageUrl} />
                                    <AvatarFallback>
                                        {doctor.firstName.charAt(0)}
                                        {doctor.lastName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left space-y-1">
                                    <p className="font-medium leading-none">
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </p>
                                    {doctor.specialization && (
                                        <p className="text-sm text-muted-foreground">
                                            {doctor.specialization}
                                        </p>
                                    )}
                                </div>
                                {loading[doctor.id] && (
                                    <div className="shrink-0 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                )}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
