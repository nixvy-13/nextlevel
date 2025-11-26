import { getDbAsync } from "@/lib/db";
import { TaskStatus, TaskType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    // Verificar el secreto del Cron
    const authHeader = request.headers.get("x-cron-secret");
    if (authHeader !== process.env.CRON_SECRET) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const prisma = await getDbAsync();

    // Obtener todas las misiones recurrentes que están en estado DONE
    const completedRecurrentTasks = await prisma.task.findMany({
      where: {
        type: TaskType.RECURRENT,
        status: TaskStatus.DONE,
      },
      include: {
        taskCompletions: {
          orderBy: {
            completedAt: "desc",
          },
          take: 1, // Solo la última compleción
        },
      },
    });

    // Obtener la fecha de hoy a las 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let updatedCount = 0;
    const tasksToUpdate = [];

    // Iterar sobre cada misión recurrente DONE
    for (const task of completedRecurrentTasks) {
      if (task.taskCompletions.length > 0 && task.recurrency) {
        // Obtener la última fecha de compleción a las 00:00:00
        const lastCompletionDate = new Date(task.taskCompletions[0].completedAt);
        lastCompletionDate.setHours(0, 0, 0, 0);

        // Calcular diferencia en días
        const daysDifference = (today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24);

        // Si la diferencia de días es mayor o igual a la recurrencia, cambiar a ACTIVE
        if (daysDifference >= task.recurrency) {
          tasksToUpdate.push(task.id);
        }
      }
    }

    // Actualizar las misiones que cumplen con la condición
    if (tasksToUpdate.length > 0) {
      const result = await prisma.task.updateMany({
        where: {
          id: {
            in: tasksToUpdate,
          },
        },
        data: {
          status: TaskStatus.ACTIVE,
        },
      });

      updatedCount = result.count;
    }

    return Response.json(
      {
        success: true,
        message: `Se regeneraron ${updatedCount} misiones recurrentes`,
        updatedCount,
        totalRecurrentDone: completedRecurrentTasks.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al regenerar misiones recurrentes:", error);
    return Response.json(
      {
        success: false,
        error: "Error al procesar las misiones recurrentes",
      },
      { status: 500 }
    );
  }
}

