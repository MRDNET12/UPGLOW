import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    let settings = await db.settings.findUnique({
      where: { userId }
    });

    if (!settings) {
      // Create default settings
      settings = await db.settings.create({
        data: {
          userId,
          theme: 'light',
          notificationsEnabled: true
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, theme, notificationsEnabled, reminderTime, name, avatarUrl, startDate } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const settings = await db.settings.upsert({
      where: { userId },
      update: {
        theme,
        notificationsEnabled,
        reminderTime,
        name,
        avatarUrl,
        startDate: startDate ? new Date(startDate) : null
      },
      create: {
        userId,
        theme: theme || 'light',
        notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
        reminderTime,
        name,
        avatarUrl,
        startDate: startDate ? new Date(startDate) : null
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
