import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Goal {
  name: string;
  type: 'financial' | 'project' | 'personal';
  description: string;
  deadline: string;
}

interface Task {
  day: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export async function POST(req: NextRequest) {
  try {
    const { goal }: { goal: Goal } = await req.json();

    if (!goal || !goal.name || !goal.description || !goal.deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculer le nombre de jours jusqu'à la deadline
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Créer le prompt pour Grok
    const prompt = `Tu es Glowee Work, une IA spécialisée dans la planification d'objectifs pour les femmes.

Objectif à analyser :
- Type : ${goal.type === 'financial' ? 'Financier' : goal.type === 'project' ? 'Projet' : 'Personnel'}
- Nom : ${goal.name}
- Description : ${goal.description}
- Deadline : ${goal.deadline} (dans ${daysUntilDeadline} jours)

Ta mission :
1. Analyser cet objectif et le découper en tâches concrètes et actionnables
2. Répartir ces tâches sur les 7 jours de la semaine (lundi à dimanche)
3. Créer entre 7 et 14 tâches au total (1-2 par jour)
4. Chaque tâche doit être :
   - Spécifique et actionnable
   - Réalisable en 30-60 minutes
   - Adaptée au type d'objectif
   - Motivante et positive

Format de réponse OBLIGATOIRE (JSON uniquement, pas de texte avant ou après) :
{
  "tasks": [
    {
      "day": "monday",
      "task": "Description de la tâche",
      "priority": "high",
      "category": "recherche"
    }
  ]
}

Jours possibles : monday, tuesday, wednesday, thursday, friday, saturday, sunday
Priorités possibles : high, medium, low
Catégories possibles : recherche, planification, action, apprentissage, création, organisation, réflexion

Réponds UNIQUEMENT avec le JSON, sans aucun texte avant ou après.`;

    // Appeler Grok API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Tu es Glowee Work, une IA experte en planification d\'objectifs. Tu réponds UNIQUEMENT en JSON valide, sans texte supplémentaire.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to analyze goal' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Parser la réponse JSON
    let parsedResponse;
    try {
      // Nettoyer la réponse (enlever les backticks si présents)
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      );
    }

    // Valider la structure de la réponse
    if (!parsedResponse.tasks || !Array.isArray(parsedResponse.tasks)) {
      return NextResponse.json(
        { error: 'Invalid tasks format' },
        { status: 500 }
      );
    }

    // Retourner les tâches
    return NextResponse.json({
      tasks: parsedResponse.tasks,
      goalId: Date.now().toString(),
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

