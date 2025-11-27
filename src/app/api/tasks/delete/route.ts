import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

interface DeleteTaskRequest {
  taskId: number;
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { taskId } = await req.json() as DeleteTaskRequest;
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'ID de tarea es requerido' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();
    
    // Verificar que la tarea pertenece al usuario autenticado
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
    
    // Eliminar la tarea
    await db.task.delete({
      where: {
        id: taskId,
      }
    });
    
    return NextResponse.json(
      { message: 'Tarea borrada correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error borrando tarea:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}