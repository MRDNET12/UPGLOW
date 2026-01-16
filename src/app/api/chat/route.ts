import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Store conversations in memory (use database in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

let zaiInstance: any = null;

async function initZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, systemPrompt } = await req.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize ZAI
    const zai = await initZAI();

    // Get or create conversation history
    let history = conversations.get(sessionId);

    if (!history) {
      // Create new conversation with system prompt
      history = [
        {
          role: 'assistant',
          content: systemPrompt || 'Tu es Glowee, une assistante IA bienveillante et encourageante. Tu aides les utilisateurs dans leur parcours de développement personnel avec empathie et positivité. Tu réponds toujours dans la langue de l\'utilisateur.'
        }
      ];
    }

    // Add user message
    history.push({
      role: 'user',
      content: message
    });

    // Get completion
    const completion = await zai.chat.completions.create({
      messages: history,
      model: 'GLM-4.6V-Flash',
      thinking: { type: 'disabled' }
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Empty response from AI');
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

