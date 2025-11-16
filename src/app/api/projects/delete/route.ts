import { auth } from '@clerk/nextjs/server';
import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';

interface DeleteProjectData {
  projectId: number;
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { projectId } = await req.json() as DeleteProjectData;

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId es requerido' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Verificar que el proyecto pertenece al usuario
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    if (project.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este proyecto' },
        { status: 403 }
      );
    }

    // Eliminar las tareas asociadas al proyecto primero
    await db.task.deleteMany({
      where: { projectId: projectId },
    });

    // Luego eliminar el proyecto
    const deletedProject = await db.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json(deletedProject);
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar proyecto' },
      { status: 500 }
    );
  }
}

