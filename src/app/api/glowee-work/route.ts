import { NextRequest, NextResponse } from 'next/server';
import { getGoalById, getAverageEnergy, createBreakdown, createAILog } from '@/lib/firebase/goals-service';

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Prompt système pour Glowee Work
const GLOWEE_WORK_SYSTEM_PROMPT = `
Tu es Glowee Work, une coach IA spécialisée dans l'atteinte d'objectifs professionnels et personnels ambitieux.

Ton rôle :
- Analyser les objectifs annuels
- Créer des plans d'action concrets et réalistes
- Découper les grands objectifs en micro-actions quotidiennes
- Adapter les recommandations selon l'énergie de l'utilisatrice
- Apprendre des patterns de complétion

Tes principes :
- Stratégique mais bienveillante
- Réaliste et pragmatique
- Adaptative (apprend des échecs)
- Jamais culpabilisante

Méthodologie de découpage :
1. Analyser l'objectif (type, montant, deadline)
2. Identifier les phases : apprentissage → lancement → optimisation → scale
3. Créer des jalons trimestriels
4. Décomposer en actions mensuelles
5. Générer des micro-actions quotidiennes (max 3/jour)
6. Adapter selon l'énergie moyenne

Format de réponse :
Tu dois répondre UNIQUEMENT en JSON valide avec cette structure :
{
  "phases": {
    "learning": { "duration": "X mois", "focus": ["compétence 1", "compétence 2"] },
    "launch": { "duration": "X mois", "focus": ["action 1", "action 2"] },
    "optimization": { "duration": "X mois", "focus": ["amélioration 1"] },
    "scale": { "duration": "X mois", "focus": ["expansion 1"] }
  },
  "quarters": [
    {
      "period": "Q1",
      "title": "Titre du trimestre",
      "description": "Description",
      "milestones": ["jalon 1", "jalon 2"],
      "tasks": ["tâche 1", "tâche 2"]
    }
  ],
  "months": [
    {
      "period": "2026-01",
      "title": "Titre du mois",
      "description": "Description",
      "tasks": ["tâche 1", "tâche 2", "tâche 3"]
    }
  ],
  "dailyTasksLimit": 3,
  "explanation": "Explication courte de la logique de découpage"
}

Tu réponds toujours dans la langue de l'utilisatrice (français).
`;

export async function POST(req: NextRequest) {
  try {
    const { goalId, userId } = await req.json();

    if (!goalId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Goal ID and User ID are required' },
        { status: 400 }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OPENROUTER_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Récupérer l'objectif
    const goal = await getGoalById(goalId);
    if (!goal) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Récupérer l'énergie moyenne
    const averageEnergy = await getAverageEnergy(userId, 7);

    // Construire le prompt utilisateur
    const userPrompt = `
Analyse cet objectif et crée un plan d'action détaillé :

Type : ${goal.type}
Nom : ${goal.name}
${goal.targetAmount ? `Montant cible : ${goal.targetAmount}€` : ''}
Deadline : ${goal.targetDate}
Durée : ${goal.timeframe} mois
${goal.competencies ? `Compétences à acquérir : ${goal.competencies.join(', ')}` : ''}

Motivation : ${goal.why}
Ressenti recherché : ${goal.desiredFeeling}

Énergie moyenne de l'utilisatrice : ${averageEnergy}/100

Crée un découpage intelligent en phases, trimestres et mois.
Adapte la charge de travail selon l'énergie (${averageEnergy < 50 ? 'basse' : averageEnergy < 70 ? 'moyenne' : 'haute'}).
`;

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
        model: 'deepseek/deepseek-r1-0528:free', // Modèle DeepSeek gratuit
        messages: [
          {
            role: 'system',
            content: GLOWEE_WORK_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Empty response from OpenRouter AI');
    }

    // Parser la réponse JSON
    let breakdown;
    try {
      // Extraire le JSON de la réponse (au cas où il y aurait du texte autour)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      breakdown = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    // Sauvegarder le découpage dans Firestore
    // (On sauvegarde les trimestres et mois pour l'instant)
    
    // Log de l'action IA
    await createAILog({
      userId,
      goalId,
      action: 'breakdown_generated',
      context: {
        energyLevel: averageEnergy,
        goalType: goal.type,
        timeframe: goal.timeframe
      },
      aiResponse: JSON.stringify(breakdown),
      aiModel: 'glowee-work'
    });

    return NextResponse.json({
      success: true,
      breakdown,
      goal
    });
  } catch (error: any) {
    console.error('Glowee Work API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate breakdown'
      },
      { status: 500 }
    );
  }
}

