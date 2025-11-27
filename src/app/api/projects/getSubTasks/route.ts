import { auth } from '@clerk/nextjs/server';
import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Obtener el projectId de los query parameters
    const url = new URL(req.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'ID del proyecto es requerido' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Verificar que el proyecto pertenece al usuario
    const project = await db.project.findFirst({
      where: {
        id: parseInt(projectId),
        userId: userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Obtener las tareas del proyecto
    const subTasks = await db.task.findMany({
      where: {
        projectId: parseInt(projectId),
        userId: userId,
      },
      include: {
        taskCompletions: {
          where: {
            userId: userId,
          },
          orderBy: {
            completedAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(subTasks);
  } catch (error) {
    console.error('Error al obtener subtareas del proyecto:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

