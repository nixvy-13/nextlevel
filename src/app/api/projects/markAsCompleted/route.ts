import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { processXpGain } from '@/lib/xp';

interface CompleteProjectRequest {
  projectId: number;
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

    const { projectId } = await req.json() as CompleteProjectRequest;

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const db = await getDbAsync();

    // Verificar que el proyecto existe y pertenece al usuario
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: userId,
      },
      include: {
        tasks: true,
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    // Verificar que el proyecto no esté ya completado
    if (project.status === 'DONE') {
      return NextResponse.json(
        { error: 'Project is already completed' },
        { status: 400 }
      );
    }

    // Validar condiciones de completación
    // 1. Todas las tareas ONCE deben estar en estado DONE
    // 2. Todas las tareas RECURRENT deben estar en estado INACTIVE
    const onceTasksNotDone = project.tasks.filter(task => task.type === 'ONCE' && task.status !== 'DONE');
    const recurrentTasksNotInactive = project.tasks.filter(task => task.type === 'RECURRENT' && task.status !== 'INACTIVE');

    if (onceTasksNotDone.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot complete project',
          message: 'All ONCE type missions must be in DONE status',
          incompleteTasks: onceTasksNotDone.map(task => ({
            id: task.id,
            title: task.title,
            type: task.type,
            status: task.status
          }))
        },
        { status: 400 }
      );
    }

    if (recurrentTasksNotInactive.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot complete project',
          message: 'All RECURRENT type missions must be in INACTIVE status',
          incompleteTasks: recurrentTasksNotInactive.map(task => ({
            id: task.id,
            title: task.title,
            type: task.type,
            status: task.status
          }))
        },
        { status: 400 }
      );
    }

    // Actualizar el estado del proyecto a DONE
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        status: 'DONE',
      },
      include: {
        tasks: true,
      }
    });

    // Obtener la información actual del usuario
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calcular nueva experiencia y nivel
    const xpGain = project.experienceReward;
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
        message: 'Project completed successfully',
        project: updatedProject,
        user: updatedUser,
        xpGained: xpGain,
        leveledUp: xpResult.leveledUp,
        newLevel: xpResult.newLevel,
        oldLevel: xpResult.oldLevel,
        newTotalXp: xpResult.newTotalXp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error completing project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

