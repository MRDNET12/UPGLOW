import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const routines = await db.routine.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 1
    });

    const latestRoutine = routines[0] || {
      step1: 'Nettoyage en douceur',
      step2: 'Hydratation visage',
      step3: 'Méditation 5 min',
      step4: 'Journaling',
      step5: 'Gratitude du soir'
    };

    return NextResponse.json({ routine: latestRoutine });
  } catch (error) {
    console.error('Error fetching routine:', error);
    return NextResponse.json({ error: 'Failed to fetch routine' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, step1, step2, step3, step4, step5, completed } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const routine = await db.routine.create({
      data: {
        userId,
        step1,
        step2,
        step3,
        step4,
        step5,
        completed: completed || false,
        date: new Date()
      }
    });

    return NextResponse.json({ routine });
  } catch (error) {
    console.error('Error creating routine:', error);
    return NextResponse.json({ error: 'Failed to create routine' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, completed } = body;

    if (!userId || !date) {
      return NextResponse.json({ error: 'User ID and date required' }, { status: 400 });
    }

    // Parse date at noon to avoid timezone issues
    const parsedDate = new Date(date);
    parsedDate.setHours(12, 0, 0, 0);

    // Find or create routine for this date
    let routine = await db.routine.findFirst({
      where: {
        userId,
        date: parsedDate
      }
    });

    if (routine) {
      routine = await db.routine.update({
        where: { id: routine.id },
        data: { completed }
      });
    } else {
      routine = await db.routine.create({
        data: {
          userId,
          step1: 'Nettoyage en douceur',
          step2: 'Hydratation visage',
          step3: 'Méditation 5 min',
          step4: 'Journaling',
          step5: 'Gratitude du soir',
          completed,
          date: parsedDate
        }
      });
    }

    return NextResponse.json({ routine });
  } catch (error) {
    console.error('Error updating routine:', error);
    return NextResponse.json({ error: 'Failed to update routine' }, { status: 500 });
  }
}
