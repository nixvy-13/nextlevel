import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
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
    
    const db = await getDbAsync();
    const tasks = await db.task.findMany({
      where: {
        isDefault: true,
      },
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}