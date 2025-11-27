import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

type TaskType = 'ONCE' | 'RECURRENT';
type TaskCategory = 'SALUD' | 'ENTRETENIMIENTO' | 'SOCIALES' | 'NATURALEZA' | 'VARIADAS';
type TaskStatus = 'ACTIVE' | 'DONE' | 'INACTIVE';

interface TaskData {
  userId: string;
  projectId?: number;
  title: string;
  description?: string;
  type: TaskType;
  status?: TaskStatus;
  category?: TaskCategory;
  difficulty?: number;
  experienceReward?: number;
  recurrency?: number;
  isDefault?: boolean;
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
    
    const taskData = await req.json() as TaskData;
    
    const newTask = await db.task.create({
      data: {
        userId: taskData.userId,
        projectId: taskData.projectId,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
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
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}