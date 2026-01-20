import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Task {
  id: string;
  day: string;
  date?: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  goalId?: string;
  completed?: boolean;
}

interface PerformanceAnalysis {
  completionRate: number;
  trend: 'improving' | 'stable' | 'declining';
  blockedCategories: string[];
  suggestions: string[];
  adjustment: 'increase' | 'maintain' | 'decrease';
  celebrationMessage?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tasks, goal, weekHistory } = await req.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    // Calculer le taux de complétion
    const completedTasks = tasks.filter(t => t.completed);
    const completionRate = tasks.length > 0 
      ? Math.round((completedTasks.length / tasks.length) * 100) 
      : 0;

    // Analyser la tendance (si historique disponible)
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (weekHistory && weekHistory.length >= 2) {
      const previousRate = weekHistory[weekHistory.length - 2];
      if (completionRate > previousRate + 10) trend = 'improving';
      else if (completionRate < previousRate - 10) trend = 'declining';
    }

    // Identifier les catégories bloquées
    const incompleteTasks = tasks.filter(t => !t.completed);
    const blockedCategories = [...new Set(incompleteTasks.map(t => t.category))];

    // Générer des suggestions personnalisées
    const suggestions: string[] = [];
    
    if (completionRate === 0) {
      suggestions.push("Commence par une seule tâche aujourd'hui, la plus simple.");
      suggestions.push("Réduis le temps estimé à 15 minutes par tâche.");
      suggestions.push("Choisis un moment précis dans ta journée pour travailler sur ton objectif.");
    } else if (completionRate < 40) {
      suggestions.push("Tu as du mal à suivre le rythme. Réduisons le nombre de tâches.");
      suggestions.push(`Les tâches de type "${blockedCategories[0]}" semblent difficiles. Décomposons-les.`);
      suggestions.push("Essaie de bloquer 30 minutes le matin pour ta tâche prioritaire.");
    } else if (completionRate < 70) {
      suggestions.push("Tu es sur la bonne voie ! Continue comme ça.");
      suggestions.push("Concentre-toi sur les tâches haute priorité en premier.");
      suggestions.push("Célèbre chaque petite victoire pour rester motivée.");
    } else if (completionRate < 100) {
      suggestions.push("Excellent travail ! Tu es presque à 100%.");
      suggestions.push("Les dernières tâches peuvent attendre si tu manques de temps.");
      suggestions.push("Prends un moment pour réfléchir à ce qui a bien fonctionné cette semaine.");
    } else {
      suggestions.push("🎉 Incroyable ! Tu as tout complété !");
      suggestions.push("Tu es prête pour plus de défis la semaine prochaine.");
      suggestions.push("Partage ta réussite avec quelqu'un qui te soutient.");
    }

    // Déterminer l'ajustement pour la semaine prochaine
    let adjustment: 'increase' | 'maintain' | 'decrease' = 'maintain';
    if (completionRate >= 90 && trend === 'improving') {
      adjustment = 'increase';
    } else if (completionRate < 50 || trend === 'declining') {
      adjustment = 'decrease';
    }

    // Message de célébration si objectif atteint/dépassé
    let celebrationMessage: string | undefined;
    if (goal?.type === 'financial' && goal?.targetAmount) {
      const dailyTarget = goal.targetAmount / goal.daysRemaining;
      // Simuler le revenu généré (à remplacer par vraies données)
      const dailyRevenue = 0; // TODO: Récupérer depuis tracking utilisateur
      
      if (dailyRevenue >= dailyTarget) {
        celebrationMessage = `🎉 Bravo ! Tu as dépassé ton objectif journalier de ${dailyTarget.toFixed(2)}€ ! Tu as généré ${dailyRevenue.toFixed(2)}€ aujourd'hui !`;
      }
    }

    if (completionRate === 100) {
      celebrationMessage = celebrationMessage || "🎉 Semaine parfaite ! Tu as complété toutes tes tâches ! Continue comme ça, tu es incroyable ! 💪✨";
    } else if (completionRate >= 80) {
      celebrationMessage = celebrationMessage || "👏 Excellente semaine ! Tu as complété plus de 80% de tes tâches ! Tu es sur la bonne voie ! 🚀";
    }

    const analysis: PerformanceAnalysis = {
      completionRate,
      trend,
      blockedCategories,
      suggestions,
      adjustment,
      celebrationMessage
    };

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing performance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

