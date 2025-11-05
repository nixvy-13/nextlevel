import { getDbAsync } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const db = await getDbAsync();
    
    const taskData = await req.json();
    
    const newTask = await db.task.create({
      data: {
        
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