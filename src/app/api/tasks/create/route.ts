import { getDbAsync } from '@/lib/db';

type TaskType = 'ONCE' | 'RECURRENT';
type TaskCategory = 'SALUD' | 'ENTRETENIMIENTO' | 'SOCIALES' | 'NATURALEZA' | 'VARIADAS';

interface TaskData {
  userId: string;
  title: string;
  description?: string;
  type: TaskType;
  category?: TaskCategory;
  difficulty?: number;
  experienceReward?: number;
  recurrencePattern?: string;
  recurrenceInterval?: number;
  isDefault?: boolean;
}

export async function POST(req: Request) {
  try {
    const db = await getDbAsync();
    
    
    const taskData = await req.json() as TaskData;
    
    const newTask = await db.task.create({
      data: {
        userId: taskData.userId,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        category: taskData.category,
        difficulty: taskData.difficulty,
        experienceReward: taskData.experienceReward,
        recurrencePattern: taskData.recurrencePattern,
        recurrenceInterval: taskData.recurrenceInterval,
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