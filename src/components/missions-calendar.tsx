"use client"

import * as React from "react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle2 } from "lucide-react"
import { DayButton } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CompletedTask {
  id: number
  title: string
  description: string | null
  category: string | null
  experienceReward: number
  completedAt: Date
}

interface DayCompletions {
  date: string
  count: number
  tasks: CompletedTask[]
}

interface MissionsCalendarProps {
  missions?: any[]
}

const categoryColors: { [key: string]: string } = {
  SALUD: "bg-red-500/20 text-red-300 border-red-500/30",
  ENTRETENIMIENTO: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  SOCIALES: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  NATURALEZA: "bg-green-500/20 text-green-300 border-green-500/30",
  VARIADAS: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  PROYECTO: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
}

// Componente personalizado para renderizar los días del calendario
function CustomDayButton({
  day,
  className,
  completedDates,
  completedMissions,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  completedDates: Set<string>
  completedMissions: DayCompletions[]
}) {
  const dateString = format(day.date, "yyyy-MM-dd")
  const isCompleted = completedDates.has(dateString)
  const missionCount = completedMissions.find(
    (m) => m.date === dateString
  )?.count

  return (
    <Button
      className={cn(
        "relative flex aspect-square size-auto w-full min-w-[--cell-size] flex-col gap-1 leading-none font-normal",
        isCompleted && "bg-purple-500/20 hover:bg-purple-500/30",
        className
      )}
      variant="ghost"
      size="icon"
      {...props}
    >
      <span>{day.date.getDate()}</span>
      {isCompleted && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(missionCount || 0, 3) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                />
              )
            )}
          </div>
        </div>
      )}
    </Button>
  )
}

export function MissionsCalendar({ missions = [] }: MissionsCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [completedMissions, setCompletedMissions] = React.useState<
    DayCompletions[]
  >([])
  const [selectedDayMissions, setSelectedDayMissions] = React.useState<
    CompletedTask[]
  >([])
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [completedDates, setCompletedDates] = React.useState<Set<string>>(
    new Set()
  )

  // Obtener misiones completadas
  React.useEffect(() => {
    const fetchCompletedMissions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/tasks/getCompletedMissions")
        if (!response.ok) {
          throw new Error("Error fetching missions")
        }
        const data: DayCompletions[] = await response.json()
        setCompletedMissions(data)

        // Crear un set de fechas completadas para acceso rápido
        const dates = new Set(data.map((d) => d.date))
        setCompletedDates(dates)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompletedMissions()
  }, [])

  // Manejar click en una fecha del calendario
  const handleSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate)

    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd")
      const dayMissions = completedMissions.find(
        (m) => m.date === dateString
      )?.tasks

      if (dayMissions && dayMissions.length > 0) {
        setSelectedDayMissions(dayMissions)
        setIsDialogOpen(true)
      }
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center w-full">
        <div className="w-full max-w-5xl">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            locale={es}
            weekStartsOn={1}
            captionLayout="dropdown"
            className="rounded-sm border-2 border-purple-500/50 bg-gradient-to-br from-gray-900 to-gray-950 p-8 shadow-xl shadow-purple-500/20 w-full max-w-full [--cell-size:5rem]"
            components={{
              DayButton: (dayProps) => (
                <CustomDayButton
                  {...dayProps}
                  completedDates={completedDates}
                  completedMissions={completedMissions}
                />
              ),
            }}
          />
        </div>
      </div>

      {/* Dialog para mostrar misiones del día */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-gray-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-400 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Misiones Completadas{" "}
              {date && `- ${format(date, "d 'de' MMMM", { locale: es })}`}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-6">
            {selectedDayMissions.map((mission) => (
              <Card
                key={mission.id}
                className="bg-gradient-to-r from-gray-800 to-gray-750 border-purple-500/30 hover:border-purple-500/60 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-purple-300 text-lg">
                        {mission.title}
                      </CardTitle>
                      {mission.description && (
                        <p className="text-sm text-gray-400 mt-2">
                          {mission.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {mission.category && (
                        <Badge
                          className={`${categoryColors[mission.category] || "bg-gray-700"} border`}
                        >
                          {mission.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <Zap className="w-4 h-4" />
                      {mission.experienceReward} XP
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDayMissions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay misiones completadas en este día
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


