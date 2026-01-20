import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Goal {
  name: string;
  type: 'financial' | 'personal';
  description: string;
  deadline: string;
  targetAmount?: number;
  competency?: string;
  why?: string;
  desiredFeeling?: string;
}

interface Task {
  day: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { goal }: { goal: Goal } = await req.json();

    if (!goal || !goal.name || !goal.description || !goal.deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      console.error('[Goals API] OPENROUTER_API_KEY not configured');
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Calculer le nombre de jours jusqu'à la deadline
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Créer le prompt pour OpenRouter (DeepSeek)
    const systemPrompt = `Tu es Glowee Work, une IA spécialisée dans la planification d'objectifs pour les femmes.

Ta mission :
1. Analyser l'objectif et le découper en tâches concrètes et actionnables
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

    // Calculer l'objectif journalier pour les objectifs financiers
    let dailyTarget = 0;
    if (goal.type === 'financial' && goal.targetAmount) {
      dailyTarget = goal.targetAmount / daysUntilDeadline;
    }

    const userPrompt = `Objectif à analyser :
- Type : ${goal.type === 'financial' ? 'Financier' : 'Personnel'}
- Nom : ${goal.name}
- Description : ${goal.description}
- Deadline : ${goal.deadline} (dans ${daysUntilDeadline} jours)
${goal.targetAmount ? `- Montant cible : ${goal.targetAmount}€` : ''}
${dailyTarget > 0 ? `- Objectif journalier : ${dailyTarget.toFixed(2)}€/jour` : ''}
${goal.competency ? `- Niveau de compétence : ${goal.competency}` : ''}
${goal.why ? `- Motivation : ${goal.why}` : ''}
${goal.desiredFeeling ? `- Ressenti recherché : ${goal.desiredFeeling}` : ''}

IMPORTANT pour les objectifs financiers :
${goal.type === 'financial' && dailyTarget > 0 ? `
- L'utilisateur doit générer ${dailyTarget.toFixed(2)}€ par jour pour atteindre ${goal.targetAmount}€ en ${daysUntilDeadline} jours
- Les tâches doivent être orientées vers la génération de revenus
- Priorise les actions qui ont un impact direct sur le chiffre d'affaires
- Si c'est un projet e-commerce, concentre-toi sur : création produit, marketing, ventes, optimisation conversion
- Adapte la complexité des tâches selon le niveau de compétence (${goal.competency || 'non spécifié'})
` : ''}`;

    // Appeler OpenRouter API avec DeepSeek
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://upglow.app',
        'X-Title': 'Glowee Work - UPGLOW'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Goals API] OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to analyze goal with AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

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

