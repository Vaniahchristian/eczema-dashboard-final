"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { type PatientAppointment } from "@/services/patientAppointmentService"

interface AppointmentsCalendarProps {
  appointments: PatientAppointment[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onCancel: (appointmentId: string) => void
  onReschedule: (appointmentId: string, newDate: string) => void
  loading: boolean
}

export default function AppointmentsCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  onCancel,
  onReschedule,
  loading
}: AppointmentsCalendarProps) {
  // Get appointments for the selected date
  const appointmentsForDate = appointments.filter(
    (appointment) => appointment.appointmentDate.split("T")[0] === selectedDate.toISOString().split("T")[0]
  )

  // Get dates with appointments for highlighting in calendar
  const datesWithAppointments = appointments.map(
    (appointment) => new Date(appointment.appointmentDate)
  )

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-[400px] w-full" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            modifiers={{
              hasAppointment: datesWithAppointments
            }}
            modifiersStyles={{
              hasAppointment: {
                backgroundColor: "var(--primary)",
                color: "white",
                borderRadius: "50%"
              }
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Appointments for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsForDate.length === 0 ? (
              <p className="text-muted-foreground">No appointments scheduled for this date.</p>
            ) : (
              <div className="space-y-4">
                {appointmentsForDate.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{appointment.doctor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time} ({appointment.duration} minutes)
                          </p>
                          <p className="text-sm mt-1">{appointment.reason}</p>
                        </div>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReschedule(appointment.id, appointment.appointmentDate)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onCancel(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Badge>{appointment.mode}</Badge>
                        <Badge variant="secondary">{appointment.appointmentType}</Badge>
                        <Badge variant="outline">{appointment.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
