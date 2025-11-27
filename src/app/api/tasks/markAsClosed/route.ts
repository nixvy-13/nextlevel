import { getDbAsync } from '@/lib/db';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { taskId } = await request.json() as { taskId?: number };

    if (!taskId) {
      return NextResponse.json(
        { error: "ID de tarea requerido" },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Obtener la tarea
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Tarea no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que la tarea sea RECURRENT
    if (task.type !== "RECURRENT") {
      return NextResponse.json(
        { error: "Solo se pueden cerrar tareas recurrentes" },
        { status: 400 }
      );
    }

    // Marcar la tarea como INACTIVE
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: { status: "INACTIVE" },
    });

    return NextResponse.json({
      message: "Tarea recurrente cerrada exitosamente",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error al cerrar la tarea recurrente:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
