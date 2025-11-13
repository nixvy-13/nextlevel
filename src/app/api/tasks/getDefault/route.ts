import { NextResponse } from 'next/server';
import { getDbAsync } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const db = await getDbAsync();
    const tasks = await db.task.findMany({
      where: {
        isDefault: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get default tasks' }, { status: 500 });
  }
}