import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const images = await db.visionBoardImage.findMany({
      where: { userId },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching vision board images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, imageUrl, caption } = body;

    if (!userId || !imageUrl) {
      return NextResponse.json({ error: 'User ID and image URL required' }, { status: 400 });
    }

    // Get current max position
    const maxPosition = await db.visionBoardImage.findFirst({
      where: { userId },
      orderBy: { position: 'desc' }
    });

    const image = await db.visionBoardImage.create({
      data: {
        userId,
        imageUrl,
        caption,
        position: (maxPosition?.position || 0) + 1
      }
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error('Error creating vision board image:', error);
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!imageId || !userId) {
      return NextResponse.json({ error: 'Image ID and User ID required' }, { status: 400 });
    }

    // Verify ownership
    const image = await db.visionBoardImage.findFirst({
      where: { id: imageId, userId }
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await db.visionBoardImage.delete({
      where: { id: imageId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vision board image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
