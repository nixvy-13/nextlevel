import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { processXpGain } from '@/lib/xp';

interface CompleteTaskRequest {
  taskId: number;
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { taskId } = await req.json() as CompleteTaskRequest;

    if (!taskId) {
      return NextResponse.json(
        { error: 'ID de tarea es requerido' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Verificar que la tarea existe y pertenece al usuario
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Tarea no encontrada o no autorizada' },
        { status: 404 }
      );
    }

    // Verificar que la tarea no esté ya completada
    if (task.status === 'DONE') {
      return NextResponse.json(
        { error: 'La tarea ya está completada' },
        { status: 400 }
      );
    }

    // Actualizar el estado de la tarea a DONE
    const updatedTask = await db.task.update({
      where: { id: taskId },
      data: {
        status: 'DONE',
      }
    });

    // Crear registro en TaskCompletion
    const taskCompletion = await db.taskCompletion.create({
      data: {
        taskId: taskId,
        userId: userId,
      }
    });

    // Obtener la información actual del usuario
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calcular nueva experiencia y nivel
    const xpGain = task.experienceReward;
    const xpResult = processXpGain(user.experience, xpGain);

    // Actualizar experiencia y nivel del usuario
    const updatedUser = await db.user.update({
      where: { clerkId: userId },
      data: {
        experience: xpResult.newTotalXp,
        level: xpResult.newLevel,
      }
    });

    return NextResponse.json(
      {
        message: 'Tarea completada correctamente',
        task: {
          ...updatedTask,
          taskCompletions: [taskCompletion],
        },
        user: updatedUser,
        xpGained: xpGain,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel,
        oldLevel: xpResult.oldLevel,
        newTotalXp: xpResult.newTotalXp,
        completedAt: taskCompletion.completedAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al completar la tarea:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

