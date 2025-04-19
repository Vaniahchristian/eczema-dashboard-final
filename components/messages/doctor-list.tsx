"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { doctorService, type Doctor } from "@/services/doctorService"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface DoctorListProps {
    onSelectDoctor: (doctor: Doctor) => void;
    className?: string;
}

export function DoctorList({ onSelectDoctor, className }: DoctorListProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await doctorService.getDoctors();
            setDoctors(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch doctors",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search doctors by name or specialization..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <AnimatePresence initial={false}>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <motion.div
                                key={doctor.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full flex items-start gap-3 p-3 h-auto"
                                    onClick={() => onSelectDoctor(doctor)}
                                >
                                    <Avatar className="flex-shrink-0">
                                        <AvatarImage src={doctor.profileImage} />
                                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <div className="flex justify-between items-start">
                                            <span className="font-medium">{doctor.name}</span>
                                            {doctor.rating && (
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <span className="ml-1 text-xs">{doctor.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {doctor.specialization}
                                        </div>
                                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {doctor.experience || "Experience not specified"}
                                        </div>
                                        {doctor.availability && (
                                            <div className="mt-1 inline-flex items-center text-xs text-green-500">
                                                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                                                Available
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <p>No doctors found</p>
                        </div>
                    )}
                </AnimatePresence>
            </ScrollArea>
        </div>
    );
}
