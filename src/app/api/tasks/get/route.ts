import { getDbAsync } from '@/lib/db';
import {NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
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
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get default tasks' }, { status: 500 });
  }
}