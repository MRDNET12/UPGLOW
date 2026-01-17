// Test de l'API Google Gemini
const testGeminiAPI = async () => {
  console.log('🧪 Test de l\'API Google Gemini...\n');

  const goal = {
    name: "Atteindre 5000€ de CA",
    type: "financial",
    description: "Je veux générer 5000€ de chiffre d'affaires avec mon activité de coaching",
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() // Dans 6 mois
  };

  try {
    console.log('📤 Envoi de la requête à l\'API...');
    console.log('Objectif:', goal.name);
    console.log('Type:', goal.type);
    console.log('Deadline:', new Date(goal.deadline).toLocaleDateString('fr-FR'));
    console.log('');

    const response = await fetch('http://localhost:3000/api/goals/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal }),
    });

    console.log('📥 Réponse reçue - Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur:', errorText);
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Succès ! Tâches générées:\n');
    console.log('Nombre de tâches:', data.tasks.length);
    console.log('');

    // Afficher les tâches par jour
    const tasksByDay = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    };

    data.tasks.forEach(task => {
      tasksByDay[task.day].push(task);
    });

    const dayNames = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };

    Object.keys(tasksByDay).forEach(day => {
      if (tasksByDay[day].length > 0) {
        console.log(`\n📅 ${dayNames[day]}:`);
        tasksByDay[day].forEach((task, index) => {
          const priorityEmoji = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
          console.log(`  ${index + 1}. ${priorityEmoji} ${task.task}`);
          console.log(`     Catégorie: ${task.category} | Priorité: ${task.priority}`);
        });
      }
    });

    console.log('\n\n🎉 Test réussi ! Google Gemini fonctionne parfaitement !\n');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
};

// Lancer le test
testGeminiAPI();

