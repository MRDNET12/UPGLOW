import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let tracker;
    if (date) {
      tracker = await db.tracker.findUnique({
        where: {
          userId_date: {
            userId,
            date: new Date(date)
          }
        }
      });
    } else {
      const trackers = await db.tracker.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30
      });
      return NextResponse.json({ trackers });
    }

    return NextResponse.json({ tracker });
  } catch (error) {
    console.error('Error fetching tracker:', error);
    return NextResponse.json({ error: 'Failed to fetch tracker' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, waterGlasses, sleepHours, mood, activityMinutes, skincareCompleted, habits } = body;

    if (!userId || !date) {
      return NextResponse.json({ error: 'User ID and date required' }, { status: 400 });
    }

    // Parse date at noon to avoid timezone issues
    const parsedDate = new Date(date);
    parsedDate.setHours(12, 0, 0, 0);

    const tracker = await db.tracker.upsert({
      where: {
        userId_date: {
          userId,
          date: parsedDate
        }
      },
      update: {
        waterGlasses,
        sleepHours,
        mood,
        activityMinutes,
        skincareCompleted,
        habits: JSON.stringify(habits || {})
      },
      create: {
        userId,
        date: parsedDate,
        waterGlasses,
        sleepHours,
        mood,
        activityMinutes,
        skincareCompleted,
        habits: JSON.stringify(habits || {})
      }
    });

    return NextResponse.json({ tracker });
  } catch (error) {
    console.error('Error updating tracker:', error);
    return NextResponse.json({ error: 'Failed to update tracker' }, { status: 500 });
  }
}
