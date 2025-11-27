import { auth } from "@clerk/nextjs/server"
import { getDbAsync } from "@/lib/db"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json({ error: "Authentication required" }, { status: 401 })
    }

    const db = await getDbAsync()

    // Obtener todas las tareas completadas del usuario con sus fechas y detalles
    const completions = await db.taskCompletion.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        completedAt: true,
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            experienceReward: true,
          },
        },
      },
      orderBy: {
        completedAt: "asc",
      },
    })

    // Agrupar por fecha con detalles de las tareas
    const groupedByDate: {
      [key: string]: Array<{
        id: number
        title: string
        description: string | null
        category: string | null
        experienceReward: number
        completedAt: Date
      }>
    } = {}

    completions.forEach(
      (completion: {
        id: number
        completedAt: Date
        task: {
          id: number
          title: string
          description: string | null
          category: string | null
          experienceReward: number
        }
      }) => {
        const date = completion.completedAt.toISOString().split("T")[0]
        if (!groupedByDate[date]) {
          groupedByDate[date] = []
        }
        groupedByDate[date].push({
          id: completion.id,
          title: completion.task.title,
          description: completion.task.description,
          category: completion.task.category,
          experienceReward: completion.task.experienceReward,
          completedAt: completion.completedAt,
        })
      }
    )

    // Convertir a formato de array
    const result = Object.entries(groupedByDate).map(([date, tasks]) => ({
      date,
      count: tasks.length,
      tasks,
    }))

    return Response.json(result)
  } catch (error) {
    console.error("Error fetching completed missions:", error)
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

