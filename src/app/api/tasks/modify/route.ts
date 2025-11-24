import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type TaskType = 'ONCE' | 'RECURRENT';
type TaskCategory = 'SALUD' | 'ENTRETENIMIENTO' | 'SOCIALES' | 'NATURALEZA' | 'VARIADAS';
type TaskStatus = 'ACTIVE' | 'DONE' | 'INACTIVE';

interface UpdateTaskRequest {
  taskId: number;
  title?: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  category?: TaskCategory;
  difficulty?: number;
  experienceReward?: number;
  recurrency?: number;
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

    const taskData = await req.json() as UpdateTaskRequest;

    if (!taskData.taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Verificar que la tarea pertenece al usuario autenticado
    const task = await db.task.findFirst({
      where: {
        id: taskData.taskId,
        userId: userId,
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar (solo campos definidos)
    const updateData: Partial<UpdateTaskRequest> = {};
    
    if (taskData.title !== undefined) updateData.title = taskData.title;
    if (taskData.description !== undefined) updateData.description = taskData.description;
    if (taskData.type !== undefined) updateData.type = taskData.type;
    if (taskData.status !== undefined) updateData.status = taskData.status;
    if (taskData.category !== undefined) updateData.category = taskData.category;
    if (taskData.difficulty !== undefined) updateData.difficulty = taskData.difficulty;
    if (taskData.experienceReward !== undefined) updateData.experienceReward = taskData.experienceReward;
    if (taskData.recurrency !== undefined) updateData.recurrency = taskData.recurrency;

    const updatedTask = await db.task.update({
      where: { id: taskData.taskId },
      data: updateData,
    });
    
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}