import { NextRequest, NextResponse } from 'next/server';

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

interface NotificationPayload {
  title: string;
  message: string;
  url?: string;
  segment?: string; // 'All', 'Active Users', 'Inactive Users', etc.
  filters?: Array<{ field: string; value: string; relation?: string }>;
  playerId?: string; // Pour envoyer à un utilisateur spécifique
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationPayload = await request.json();
    const { title, message, url, segment, filters, playerId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      return NextResponse.json(
        { error: 'OneSignal configuration missing' },
        { status: 500 }
      );
    }

    // Construire le payload OneSignal
    const notificationPayload: Record<string, unknown> = {
      app_id: ONESIGNAL_APP_ID,
      headings: { en: title, fr: title },
      contents: { en: message, fr: message },
    };

    // Ajouter l'URL si fournie
    if (url) {
      notificationPayload.url = url;
    }

    // Ciblage : par segment, filtres ou player_id
    if (playerId) {
      notificationPayload.include_player_ids = [playerId];
    } else if (filters && filters.length > 0) {
      notificationPayload.filters = filters;
    } else {
      notificationPayload.included_segments = [segment || 'All'];
    }

    // Envoyer la notification via l'API OneSignal
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify(notificationPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('OneSignal API error:', result);
      return NextResponse.json(
        { error: 'Failed to send notification', details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      notificationId: result.id,
      recipients: result.recipients,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET pour vérifier le statut de l'API
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    configured: !!(ONESIGNAL_APP_ID && ONESIGNAL_REST_API_KEY),
  });
}

