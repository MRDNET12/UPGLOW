import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (email) {
      const user = await db.user.findUnique({
        where: { email },
        include: {
          settings: true,
          challengeDays: true,
          journalEntries: true,
          trackers: true,
          visionBoardImages: true,
          routines: true,
          bonuses: true
        }
      });
      return NextResponse.json({ user });
    }

    if (id) {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          settings: true,
          challengeDays: true,
          journalEntries: true,
          trackers: true,
          visionBoardImages: true,
          routines: true,
          bonuses: true
        }
      });
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: 'Email or ID required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check if user exists
    let user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          email,
          name: name || null
        }
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
