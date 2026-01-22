import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface Goal {
  id: string;
  name: string;
  type: 'financial' | 'personal' | 'project';
  description: string;
  deadline: string;
  createdAt: string;
  targetAmount?: number;
  why?: string;
  desiredFeeling?: string;
}

interface TimeBreakdown {
  level: string; // 'trimestre', 'mois', 'semaine', 'jour'
  title: string;
  steps: string[];
  motivation: string;
}

export async function POST(req: NextRequest) {
  try {
    const { goal }: { goal: Goal } = await req.json();

    if (!goal || !goal.name || !goal.deadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculer la durée en jours
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const monthsRemaining = Math.ceil(daysRemaining / 30);

    // Déterminer le découpage selon la durée
    let breakdownLevels: string[] = [];
    if (monthsRemaining >= 12) {
      breakdownLevels = ['Trimestre', 'Mois', 'Semaine', 'Jour'];
    } else if (monthsRemaining >= 6) {
      breakdownLevels = ['Mois', 'Semaine', 'Jour'];
    } else if (monthsRemaining >= 3) {
      breakdownLevels = ['Semaine', 'Jour'];
    } else {
      breakdownLevels = ['Semaine', 'Jour'];
    }

    // Si l'API key n'est pas configurée, utiliser un plan générique
    if (!OPENROUTER_API_KEY) {
      console.warn('[Generate Plan API] OPENROUTER_API_KEY not configured, using fallback plan');

      const fallbackBreakdown: TimeBreakdown[] = [];

      if (breakdownLevels.includes('Trimestre')) {
        fallbackBreakdown.push({
          level: 'Trimestre',
          title: '🎯 Vision Trimestrielle',
          steps: [
            'Définir les grandes étapes de ton objectif',
            'Identifier les ressources nécessaires',
            'Créer un plan d\'action global',
            'Établir des indicateurs de progression'
          ],
          motivation: 'Chaque trimestre est une opportunité de transformer ta vision en réalité ! ✨'
        });
      }

      if (breakdownLevels.includes('Mois')) {
        fallbackBreakdown.push({
          level: 'Mois',
          title: '🚀 Objectifs Mensuels',
          steps: [
            'Décomposer l\'objectif en jalons mensuels',
            'Planifier les actions prioritaires',
            'Suivre ta progression régulièrement',
            'Ajuster ta stratégie si nécessaire'
          ],
          motivation: 'Chaque mois te rapproche de ton objectif. Continue, tu es sur la bonne voie ! 💪'
        });
      }

      if (breakdownLevels.includes('Semaine')) {
        fallbackBreakdown.push({
          level: 'Semaine',
          title: '⚡ Actions Hebdomadaires',
          steps: [
            'Définir 3-5 actions concrètes pour la semaine',
            'Bloquer du temps dans ton agenda',
            'Célébrer chaque petite victoire',
            'Faire le point en fin de semaine'
          ],
          motivation: 'Une semaine à la fois, tu construis ton succès ! Chaque action compte ! 🌟'
        });
      }

      if (breakdownLevels.includes('Jour')) {
        fallbackBreakdown.push({
          level: 'Jour',
          title: '✨ Routine Quotidienne',
          steps: [
            'Commencer par la tâche la plus importante',
            'Avancer sur ton objectif pendant 30 minutes minimum',
            'Noter tes progrès et apprentissages',
            'Visualiser ton objectif atteint'
          ],
          motivation: 'Chaque jour est une nouvelle chance d\'avancer. Tu es capable de grandes choses ! 🔥'
        });
      }

      return NextResponse.json({
        success: true,
        breakdown: fallbackBreakdown,
        daysRemaining,
        monthsRemaining,
        isFallback: true
      });
    }

    const systemPrompt = `Tu es Glowee Work, une coach motivante et bienveillante qui aide les femmes à atteindre leurs objectifs.

Ton rôle : Créer un plan de découpage temporel ULTRA MOTIVANT et DOPAMINERGIQUE pour l'objectif de l'utilisatrice.

RÈGLES IMPORTANTES :
1. Utilise un langage MOTIVANT et ÉNERGISANT
2. Chaque étape doit donner ENVIE d'avancer
3. Utilise des emojis pour créer de la dopamine 🎯✨🚀💪
4. Sois CONCRÈTE et ACTIONNABLE
5. Crée un sentiment de PROGRESSION et de VICTOIRE

Format de réponse JSON :
{
  "breakdown": [
    {
      "level": "Trimestre/Mois/Semaine/Jour",
      "title": "Titre motivant avec emoji",
      "steps": ["Étape 1 concrète", "Étape 2 concrète", "Étape 3 concrète"],
      "motivation": "Message ultra motivant qui donne envie d'agir"
    }
  ]
}`;

    const userPrompt = `Objectif : ${goal.name}
Description : ${goal.description}
Type : ${goal.type}
Durée restante : ${daysRemaining} jours (${monthsRemaining} mois)
${goal.targetAmount ? `Montant cible : ${goal.targetAmount}€` : ''}
${goal.why ? `Pourquoi : ${goal.why}` : ''}
${goal.desiredFeeling ? `Ressenti recherché : ${goal.desiredFeeling}` : ''}

Niveaux de découpage à utiliser : ${breakdownLevels.join(' → ')}

Crée un plan de découpage ULTRA MOTIVANT avec :
- Pour chaque niveau (${breakdownLevels.join(', ')}) : 3-5 étapes CONCRÈTES
- Des titres qui donnent ENVIE d'avancer
- Des messages de motivation DOPAMINERGIQUES
- Un sentiment de PROGRESSION claire

Réponds UNIQUEMENT en JSON valide.`;

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
        model: 'deepseek/deepseek-r1', // DeepSeek R1 pour génération de plan
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Generate Plan API] OpenRouter error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate plan' },
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
    let parsedResponse: { breakdown: TimeBreakdown[] };
    try {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      breakdown: parsedResponse.breakdown,
      daysRemaining,
      monthsRemaining,
      isFallback: false
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

