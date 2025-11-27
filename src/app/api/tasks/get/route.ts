import { getDbAsync } from '@/lib/db';
import {NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('userId', userId);

    const db = await getDbAsync();
    const tasks = await db.task.findMany({
      where: {
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
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}