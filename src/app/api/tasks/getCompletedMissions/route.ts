import { auth } from "@clerk/nextjs/server"
import { getDbAsync } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Not authenticated" }, { status: 401 })
    }

    const db = await getDbAsync()

    // Obtener todas las tareas completadas del usuario con sus fechas
    const completions = await db.taskCompletion.findMany({
      where: {
        userId: userId,
      },
      select: {
        completedAt: true,
      },
      orderBy: {
        completedAt: "asc",
      },
    })

    // Agrupar por fecha
    const groupedByDate: { [key: string]: number } = {}

    completions.forEach((completion: { completedAt: Date }) => {
      const date = completion.completedAt.toISOString().split("T")[0]
      groupedByDate[date] = (groupedByDate[date] || 0) + 1
    })

    // Convertir a formato de array
    const result = Object.entries(groupedByDate).map(([date, count]) => ({
      date,
      count,
    }))

    return Response.json(result)
  } catch (error) {
    console.error("Error fetching completed missions:", error)
    return Response.json(
      { error: "Failed to fetch completed missions" },
      { status: 500 }
    )
  }
}

