import { NextRequest, NextResponse } from 'next/server';

// Store conversations in memory (use database in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, systemPrompt, shortResponse } = await req.json();

    console.log('[Chat API] Received message:', { sessionId, messageLength: message?.length, shortResponse });

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      console.error('[Chat API] OPENROUTER_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('[Chat API] API Key present:', OPENROUTER_API_KEY.substring(0, 10) + '...');

    // Get or create conversation history
    let history = conversations.get(sessionId);

    if (!history) {
      // Create new conversation with system prompt
      const basePrompt = systemPrompt || 'Tu es Glowee, le reflet bienveillant de l\'utilisatrice. Tu l\'aides dans son parcours de développement personnel avec empathie et positivité. Tu la tutoies toujours et tu réponds dans sa langue. Tu es chaleureuse, motivante et tu utilises des emojis pour rendre la conversation plus agréable. 💫';
      const shortPromptAddition = shortResponse ? ' IMPORTANT: Réponds de manière CONCISE et DIRECTE en 2-3 phrases maximum. Va droit au but sans listes longues ni explications détaillées. Sois brève mais chaleureuse.' : '';

      history = [
        {
          role: 'system',
          content: basePrompt + shortPromptAddition
        }
      ];
    }

    // Add user message
    history.push({
      role: 'user',
      content: message
    });

    // Call OpenRouter API
    console.log('[Chat API] Calling OpenRouter API with', history.length, 'messages');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://upglow.app', // Optionnel : ton site
        'X-Title': 'Glowee - UPGLOW' // Optionnel : nom de ton app
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free', // Modèle DeepSeek gratuit
        messages: history,
        temperature: 0.7,
        max_tokens: shortResponse ? 300 : 1000 // Réponses plus courtes et rapides
      })
    });

    console.log('[Chat API] OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Chat API] OpenRouter API error:', errorData);
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    console.log('[Chat API] AI response received:', aiResponse?.substring(0, 100) + '...');

    if (!aiResponse) {
      console.error('[Chat API] Empty response from OpenRouter AI');
      throw new Error('Empty response from OpenRouter AI');
    }

    // Add AI response to history
    history.push({
      role: 'assistant',
      content: aiResponse
    });

    // Trim old messages if exceeding limit (keep system prompt and recent messages)
    const MAX_MESSAGES = 30;
    if (history.length > MAX_MESSAGES) {
      history = [
        history[0], // Keep system prompt
        ...history.slice(-(MAX_MESSAGES - 1))
      ];
    }

    // Save updated history
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageCount: history.length - 1 // Exclude system prompt from count
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process chat message'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    conversations.delete(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Conversation cleared'
    });
  } catch (error: any) {
    console.error('Delete Chat Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to clear conversation'
      },
      { status: 500 }
    );
  }
}

