import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDbAsync } from "@/lib/db";
import { TaskStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { taskId } = (await req.json()) as { taskId: number };

    if (!taskId) {
      return new NextResponse("Task ID is required", { status: 400 });
    }

    const db = await getDbAsync();

    // Obtener la tarea original para copiar sus datos
    const sourceTask = await db.task.findUnique({
      where: { id: taskId },
    });

    if (!sourceTask) {
      return new NextResponse("Source task not found", { status: 404 });
    }

    // Crear la nueva tarea para el usuario actual
    const newTask = await db.task.create({
      data: {
        userId: userId,
        title: sourceTask.title,
        description: sourceTask.description,
        category: sourceTask.category,
        type: sourceTask.type,
        status: TaskStatus.ACTIVE,
        difficulty: sourceTask.difficulty,
        experienceReward: sourceTask.experienceReward,
        recurrency: sourceTask.recurrency,
        isDefault: false, // Es una instancia de usuario, no la tarea por defecto
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("[TASK_ADD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

