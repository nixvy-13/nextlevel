import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type ProjectStatus = 'ACTIVE' | 'DONE' | 'INACTIVE';

interface ProjectData {
  userId: string;
  title: string;
  description?: string;
  difficulty?: number;
  experienceReward?: number;
  status?: ProjectStatus;
}

export async function POST(req: Request) {
  try {
    
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDbAsync();    
    
    const projectData = await req.json() as ProjectData;
    
    // Validar que el userId del request coincida con el usuario autenticado
    if (projectData.userId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear un proyecto para otro usuario' },
        { status: 403 }
      );
    }

    const newProject = await db.project.create({
      data: {
        userId: projectData.userId,
        title: projectData.title,
        description: projectData.description,
        status: projectData.status || 'ACTIVE',
        experienceReward: projectData.experienceReward,
      },
      include: {
        tasks: true,
      }
    });
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creando proyecto:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}