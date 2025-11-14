import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

interface ProjectData {
  userId: string;
  title: string;
  description?: string;
  difficulty?: number;
  experienceReward?: number;
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
    
    const newProject = await db.task.create({
      data: {
        userId: projectData.userId,
        title: projectData.title,
        description: projectData.description,
        status: taskData.status || 'ACTIVE',
        category: taskData.category,
        difficulty: taskData.difficulty,
        experienceReward: taskData.experienceReward,
        recurrency: taskData.recurrency,
        isDefault: taskData.isDefault,
      }
    });
    
    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creando tarea:', error);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}