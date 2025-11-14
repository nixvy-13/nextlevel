import { getDbAsync } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { calculateLevelFromXp } from '@/lib/xp';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = await getDbAsync();

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { experience: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calcular información de nivel y XP
    const levelInfo = calculateLevelFromXp(user.experience);

    return NextResponse.json(
      {
        experience: user.experience,
        currentLevelXp: levelInfo.currentLevelXp,
        nextLevelXp: levelInfo.nextLevelXp,
        progressPercentage: levelInfo.progressPercentage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting user experience:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

