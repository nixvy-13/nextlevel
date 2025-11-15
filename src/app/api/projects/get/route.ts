import { auth } from '@clerk/nextjs/server';
import { getDbAsync } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    const db = await getDbAsync();

    const projects = await db.project.findMany({
      where: {
        userId: userId,
      },
      include: {
        tasks: {
          include: {
            taskCompletions: {
              where: {
                userId: userId,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return Response.json(
      { error: 'Error al obtener proyectos' },
      { status: 500 }
    );
  }
}

