import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface DailyCheckRequest {
  goalId: string;
  goalType: 'financial' | 'personal';
  targetAmount?: number;
  daysRemaining: number;
  todayRevenue?: number; // Revenu généré aujourd'hui
  todayTasksCompleted: number;
  todayTasksTotal: number;
}

interface DailyCheckResponse {
  status: 'on_track' | 'behind' | 'ahead';
  message: string;
  suggestions: string[];
  urgency: 'low' | 'medium' | 'high';
  encouragement?: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: DailyCheckRequest = await req.json();

    if (!data.goalId || !data.goalType) {
      return NextResponse.json(
        { error: 'Goal ID and type are required' },
        { status: 400 }
      );
    }

    const suggestions: string[] = [];
    let status: 'on_track' | 'behind' | 'ahead' = 'on_track';
    let urgency: 'low' | 'medium' | 'high' = 'low';
    let message = '';
    let encouragement: string | undefined;

    // Pour les objectifs financiers
    if (data.goalType === 'financial' && data.targetAmount) {
      const dailyTarget = data.targetAmount / data.daysRemaining;
      const todayRevenue = data.todayRevenue || 0;
      const percentageOfTarget = (todayRevenue / dailyTarget) * 100;

      if (percentageOfTarget >= 100) {
        status = 'ahead';
        urgency = 'low';
        message = `🎉 Bravo ! Tu as atteint ${percentageOfTarget.toFixed(0)}% de ton objectif journalier (${todayRevenue.toFixed(2)}€ / ${dailyTarget.toFixed(2)}€) !`;
        encouragement = "Continue comme ça ! Tu es sur la bonne voie pour atteindre ton objectif final ! 💪";
        
        if (percentageOfTarget >= 150) {
          suggestions.push("Incroyable performance ! Profite de cet élan pour préparer demain.");
          suggestions.push("Documente ce qui a bien fonctionné aujourd'hui pour le reproduire.");
        } else {
          suggestions.push("Excellente journée ! Garde ce rythme pour les jours à venir.");
        }
      } else if (percentageOfTarget >= 70) {
        status = 'on_track';
        urgency = 'low';
        message = `👍 Tu es à ${percentageOfTarget.toFixed(0)}% de ton objectif journalier (${todayRevenue.toFixed(2)}€ / ${dailyTarget.toFixed(2)}€). Encore un petit effort !`;
        suggestions.push(`Il te reste ${(dailyTarget - todayRevenue).toFixed(2)}€ à générer aujourd'hui.`);
        suggestions.push("Concentre-toi sur une action à fort impact pour finir la journée en beauté.");
      } else if (percentageOfTarget >= 40) {
        status = 'behind';
        urgency = 'medium';
        message = `⚠️ Tu es à ${percentageOfTarget.toFixed(0)}% de ton objectif journalier (${todayRevenue.toFixed(2)}€ / ${dailyTarget.toFixed(2)}€).`;
        suggestions.push(`Il te manque ${(dailyTarget - todayRevenue).toFixed(2)}€ pour atteindre ton objectif.`);
        suggestions.push("Identifie une action rapide qui peut générer du revenu maintenant.");
        suggestions.push("Relance tes prospects ou clients potentiels.");
        suggestions.push("Propose une offre flash pour booster les ventes aujourd'hui.");
      } else {
        status = 'behind';
        urgency = 'high';
        message = `🚨 Attention ! Tu es seulement à ${percentageOfTarget.toFixed(0)}% de ton objectif journalier (${todayRevenue.toFixed(2)}€ / ${dailyTarget.toFixed(2)}€).`;
        suggestions.push(`Il te manque ${(dailyTarget - todayRevenue).toFixed(2)}€. C'est le moment d'agir !`);
        suggestions.push("URGENT : Lance une action de vente immédiate.");
        suggestions.push("Contacte tes meilleurs prospects maintenant.");
        suggestions.push("Propose une réduction limitée dans le temps (24h).");
        suggestions.push("Demande des recommandations à tes clients satisfaits.");
        suggestions.push("Si tu ne peux pas rattraper aujourd'hui, prépare un plan pour demain.");
      }
    }

    // Pour tous les types d'objectifs : vérifier les tâches
    const taskCompletionRate = data.todayTasksTotal > 0 
      ? (data.todayTasksCompleted / data.todayTasksTotal) * 100 
      : 0;

    if (taskCompletionRate === 0 && data.todayTasksTotal > 0) {
      suggestions.push("⏰ Tu n'as pas encore commencé tes tâches aujourd'hui. Commence par la plus simple !");
      if (urgency === 'low') urgency = 'medium';
    } else if (taskCompletionRate < 50 && data.todayTasksTotal > 0) {
      suggestions.push(`📋 Tu as complété ${data.todayTasksCompleted}/${data.todayTasksTotal} tâches. Continue !`);
    } else if (taskCompletionRate === 100 && data.todayTasksTotal > 0) {
      encouragement = encouragement || "🎉 Toutes tes tâches sont complétées ! Bravo !";
    }

    // Suggestions générales selon l'urgence
    if (urgency === 'high') {
      suggestions.push("💡 Rappel : Chaque jour compte. Reste focus sur ton objectif final.");
    }

    const response: DailyCheckResponse = {
      status,
      message,
      suggestions,
      urgency,
      encouragement
    };

    return NextResponse.json({
      success: true,
      check: response
    });

  } catch (error) {
    console.error('Error in daily check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

