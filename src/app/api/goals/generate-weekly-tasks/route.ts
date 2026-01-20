import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal';
  description: string;
  deadline: string;
  targetAmount?: number;
  competency?: string;
  progress?: number;
}

interface Task {
  day: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { goal, previousTasks, completionRate, weekNumber } = await req.json();

    if (!goal || !goal.name) {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Calculer les jours restants
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Calculer l'objectif journalier
    let dailyTarget = 0;
    if (goal.type === 'financial' && goal.targetAmount) {
      dailyTarget = goal.targetAmount / daysRemaining;
    }

    // Déterminer le niveau de difficulté selon la performance
    let taskAdjustment = '';
    if (completionRate >= 90) {
      taskAdjustment = 'Augmente légèrement la difficulté et le nombre de tâches (8-10 tâches). L\'utilisateur performe très bien.';
    } else if (completionRate >= 70) {
      taskAdjustment = 'Maintiens le même niveau de difficulté (7-8 tâches). L\'utilisateur est sur la bonne voie.';
    } else if (completionRate >= 40) {
      taskAdjustment = 'Réduis légèrement la difficulté et le nombre de tâches (5-6 tâches). L\'utilisateur a besoin de plus de temps.';
    } else {
      taskAdjustment = 'Réduis significativement la difficulté (3-4 tâches simples de 15-30 min). L\'utilisateur est en difficulté.';
    }

    const systemPrompt = `Tu es Glowee Work, une IA spécialisée dans la planification d'objectifs.

Ta mission :
1. Générer des tâches pour la SEMAINE ${weekNumber} de cet objectif
2. Tenir compte de la progression actuelle (${goal.progress || 0}%)
3. Adapter selon la performance précédente (${completionRate}% de complétion)
4. Créer des tâches progressives qui s'appuient sur les semaines précédentes

${taskAdjustment}

Format de réponse OBLIGATOIRE (JSON uniquement) :
{
  "tasks": [
    {
      "day": "monday",
      "task": "Description de la tâche",
      "priority": "high",
      "category": "action"
    }
  ]
}

Jours : monday, tuesday, wednesday, thursday, friday, saturday, sunday
Priorités : high, medium, low
Catégories : recherche, planification, action, apprentissage, création, organisation, réflexion, marketing, vente, optimisation

Réponds UNIQUEMENT avec le JSON.`;

    const userPrompt = `Génère les tâches de la semaine ${weekNumber} pour :

Objectif :
- Type : ${goal.type === 'financial' ? 'Financier' : 'Personnel'}
- Nom : ${goal.name}
- Description : ${goal.description}
- Deadline : ${goal.deadline} (${daysRemaining} jours restants)
${goal.targetAmount ? `- Montant cible : ${goal.targetAmount}€` : ''}
${dailyTarget > 0 ? `- Objectif journalier : ${dailyTarget.toFixed(2)}€/jour` : ''}
${goal.competency ? `- Niveau : ${goal.competency}` : ''}

Performance semaine précédente : ${completionRate}%
Progression globale : ${goal.progress || 0}%

${previousTasks && previousTasks.length > 0 ? `
Tâches de la semaine précédente :
${previousTasks.map((t: Task) => `- ${t.task} (${t.completed ? '✓' : '✗'})`).join('\n')}
` : ''}

Génère des tâches qui :
1. S'appuient sur les tâches précédentes
2. Font progresser vers l'objectif final
3. Sont adaptées à la performance actuelle
4. Restent motivantes et réalisables`;

    // Appeler OpenRouter API
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Weekly Tasks API] OpenRouter error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate tasks' },
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

    // Parser la réponse
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedResponse = JSON.parse(cleanedContent);

    return NextResponse.json({
      success: true,
      tasks: parsedResponse.tasks,
      weekNumber,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating weekly tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

