"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

type ViewMode = "week" | "month"

interface MissionsChartProps {
  completedMissions?: {
    date: string
    count: number
  }[]
}

export function MissionsChart({
  completedMissions: initialMissions,
}: MissionsChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [completedMissions, setCompletedMissions] = useState(
    initialMissions || []
  )
  const [loading, setLoading] = useState(!initialMissions)

  useEffect(() => {
    if (!initialMissions) {
      const fetchMissions = async () => {
        try {
          setLoading(true)
          const response = await fetch("/api/tasks/getCompletedMissions")
          if (response.ok) {
            const data = await response.json() as { date: string; count: number; }[]
            setCompletedMissions(data)
          }
        } catch (error) {
          console.error("Error fetching missions:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchMissions()
    }
  }, [initialMissions])

  const chartData = useMemo(() => {
    if (viewMode === "week") {
      const today = new Date()
      const daysOfWeek = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ]

      const weekData = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        const dayOfWeek = (date.getDay() + 6) % 7
        const missions = completedMissions.find((m) => m.date === dateStr)

        weekData.push({
          name: daysOfWeek[dayOfWeek],
          date: dateStr,
          missions: missions?.count || 0,
        })
      }
      return weekData
    } else {
      // Modo mes: últimos 12 meses
      const today = new Date()
      const monthData = []
      const monthNames = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ]

      for (let i = 11; i >= 0; i--) {
        const date = new Date(today)
        date.setMonth(date.getMonth() - i)
        const yearMonth = date.toISOString().slice(0, 7)
        const monthMissions = completedMissions.filter((m) =>
          m.date.startsWith(yearMonth)
        )
        const total = monthMissions.reduce((sum, m) => sum + m.count, 0)

        monthData.push({
          name: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
          date: yearMonth,
          missions: total,
        })
      }
      return monthData
    }
  }, [viewMode, completedMissions])

  const totalMissions = useMemo(
    () => chartData.reduce((sum, item) => sum + item.missions, 0),
    [chartData]
  )

  const averageMissions = useMemo(
    () =>
      chartData.length > 0
        ? Math.round(totalMissions / chartData.length)
        : 0,
    [totalMissions, chartData]
  )

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-700 rounded-sm overflow-hidden">
      <CardHeader className="border-b border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-white">Misiones Completadas</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
              className={`text-xs ${
                viewMode === "week"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
              }`}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
              className={`text-xs ${
                viewMode === "month"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
              }`}
            >
              Mes
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Total
            </p>
            <p className="text-purple-400 text-2xl font-bold mt-1">
              {totalMissions}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Promedio
            </p>
            <p className="text-green-400 text-2xl font-bold mt-1">
              {averageMissions}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Período
            </p>
            <p className="text-blue-400 text-2xl font-bold mt-1">
              {viewMode === "week" ? "7 días" : "12 meses"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === "week" ? (
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    tick={{ fill: "#9CA3AF" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    labelStyle={{ color: "#9CA3AF" }}
                    formatter={(value: number) => [
                      value,
                      "Misiones completadas",
                    ]}
                  />
                  <Bar
                    dataKey="missions"
                    fill="#A78BFA"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    tick={{ fill: "#9CA3AF" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: "12px" }}
                    tick={{ fill: "#9CA3AF" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    labelStyle={{ color: "#9CA3AF" }}
                    formatter={(value: number) => [
                      value,
                      "Misiones completadas",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="missions"
                    stroke="#A78BFA"
                    strokeWidth={3}
                    dot={{
                      fill: "#A78BFA",
                      r: 5,
                    }}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            {viewMode === "week"
              ? "Mostrando misiones completadas en los últimos 7 días"
              : "Mostrando misiones completadas en los últimos 12 meses"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

