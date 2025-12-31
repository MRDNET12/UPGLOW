import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { challengeDays } from '@/lib/challenge-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get all challenge progress for user
    const progress = await db.challengeDayProgress.findMany({
      where: { userId },
      orderBy: { dayNumber: 'asc' }
    });

    return NextResponse.json({ progress, challengeDays });
  } catch (error) {
    console.error('Error fetching challenge progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, dayNumber, completed, notes } = body;

    if (!userId || !dayNumber) {
      return NextResponse.json({ error: 'User ID and day number required' }, { status: 400 });
    }

    // Upsert challenge day progress
    const progress = await db.challengeDayProgress.upsert({
      where: {
        userId_dayNumber: {
          userId,
          dayNumber
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        notes
      },
      create: {
        userId,
        dayNumber,
        completed,
        completedAt: completed ? new Date() : null,
        notes
      }
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
