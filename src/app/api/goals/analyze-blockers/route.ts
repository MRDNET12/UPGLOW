import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface Task {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  date?: string;
}

interface BlockerAnalysis {
  blockedCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  patterns: string[];
  solutions: string[];
  rootCause?: string;
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { tasks, goal } = await req.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    // Analyser les tâches non complétées
    const incompleteTasks = tasks.filter((t: Task) => !t.completed);
    
    if (incompleteTasks.length === 0) {
      return NextResponse.json({
        success: true,
        analysis: {
          blockedCategories: [],
          patterns: ['Aucun blocage détecté ! Toutes les tâches sont complétées. 🎉'],
          solutions: ['Continue comme ça ! Tu gères parfaitement ton objectif.'],
          rootCause: undefined
        }
      });
    }

    // Compter les tâches non complétées par catégorie
    const categoryCount: Record<string, number> = {};
    incompleteTasks.forEach((task: Task) => {
      categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
    });

    const blockedCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / incompleteTasks.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Identifier les patterns
    const patterns: string[] = [];
    const solutions: string[] = [];

    // Pattern 1: Catégorie spécifique bloquée
    if (blockedCategories[0].percentage >= 50) {
      patterns.push(`${blockedCategories[0].percentage}% de tes tâches non complétées sont de type "${blockedCategories[0].category}".`);
      
      // Solutions selon la catégorie
      switch (blockedCategories[0].category) {
        case 'marketing':
          solutions.push("Le marketing te bloque ? Commence par une seule action simple : un post sur les réseaux sociaux.");
          solutions.push("Utilise des templates pour gagner du temps (Canva, ChatGPT).");
          solutions.push("Délègue ou automatise certaines tâches marketing.");
          break;
        case 'vente':
          solutions.push("Les ventes te stressent ? Prépare un script de vente simple et teste-le.");
          solutions.push("Commence par contacter tes prospects les plus chauds.");
          solutions.push("Propose une offre irrésistible pour faciliter la conversion.");
          break;
        case 'création':
          solutions.push("La création te prend trop de temps ? Fixe-toi une limite de temps (ex: 1h max).");
          solutions.push("Vise 'fait' plutôt que 'parfait' pour avancer.");
          solutions.push("Utilise des outils d'IA pour accélérer la création.");
          break;
        case 'apprentissage':
          solutions.push("L'apprentissage te bloque ? Réduis le temps d'étude à 15-30 min par jour.");
          solutions.push("Applique immédiatement ce que tu apprends au lieu de tout lire d'abord.");
          solutions.push("Concentre-toi sur l'essentiel : ce dont tu as besoin MAINTENANT.");
          break;
        case 'organisation':
          solutions.push("L'organisation te freine ? Utilise un outil simple (Notion, Trello, ou papier).");
          solutions.push("Consacre 10 minutes le matin pour planifier ta journée.");
          solutions.push("Simplifie : tu n'as pas besoin d'un système parfait.");
          break;
        default:
          solutions.push(`Les tâches de type "${blockedCategories[0].category}" semblent difficiles. Décompose-les en sous-tâches plus petites.`);
          solutions.push("Commence par la version la plus simple de cette tâche.");
      }
    }

    // Pattern 2: Tâches haute priorité non complétées
    const highPriorityIncomplete = incompleteTasks.filter((t: Task) => t.priority === 'high');
    if (highPriorityIncomplete.length > 0) {
      patterns.push(`${highPriorityIncomplete.length} tâche(s) haute priorité non complétée(s).`);
      solutions.push("🚨 Focus sur UNE seule tâche haute priorité aujourd'hui.");
      solutions.push("Bloque 1h dans ton agenda pour cette tâche, sans distraction.");
    }

    // Pattern 3: Trop de tâches en retard
    if (incompleteTasks.length >= 5) {
      patterns.push(`${incompleteTasks.length} tâches en retard. Tu es peut-être surchargée.`);
      solutions.push("Réduis le nombre de tâches quotidiennes. Qualité > Quantité.");
      solutions.push("Archive les tâches non essentielles pour te concentrer sur l'essentiel.");
    }

    // Utiliser l'IA pour une analyse plus profonde si disponible
    let rootCause: string | undefined;
    if (OPENROUTER_API_KEY && incompleteTasks.length >= 3) {
      try {
        const aiPrompt = `Analyse ces tâches non complétées et identifie la cause racine du blocage :

Tâches non complétées :
${incompleteTasks.map((t: Task) => `- ${t.task} (${t.category}, ${t.priority})`).join('\n')}

Objectif : ${goal?.name || 'Non spécifié'}

Réponds en 1-2 phrases courtes avec la cause racine probable et une solution concrète.`;

        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://upglow.app',
            'X-Title': 'Glowee Work - UPGLOW'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1', // DeepSeek R1 pour analyse
            messages: [
              { role: 'user', content: aiPrompt }
            ],
            temperature: 0.7,
            max_tokens: 200
          })
        });

        if (response.ok) {
          const data = await response.json();
          rootCause = data.choices?.[0]?.message?.content?.trim();
        }
      } catch (error) {
        console.error('Error getting AI analysis:', error);
      }
    }

    const analysis: BlockerAnalysis = {
      blockedCategories,
      patterns,
      solutions,
      rootCause
    };

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing blockers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

