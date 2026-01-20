export type Language = 'fr' | 'en' | 'es';

export interface Translation {
  // Navigation
  nav: {
    home: string;
    challenge: string;
    journal: string;
    glowee: string;
    trackers: string;
    routine: string;
    visionBoard: string;
    bonus: string;
    settings: string;
  };
  
  // Onboarding
  onboarding: {
    title: string;
    subtitle: string;
    description: string;
    startButton: string;
    thirtyDays: string;
    fullContent: string;
    advancedTracking: string;
    selfReflection: string;
    habits: string;
    // Glowee introduction
    gloweeGreeting: string;
    gloweeIntro: string;
    gloweeMessage: string;
    gloweeButton: string;
  };
  
  // Language Selection
  languageSelection: {
    title: string;
    subtitle: string;
    selectLanguage: string;
    continue: string;
  };

  // Challenge Selection
  challengeSelection: {
    title: string;
    subtitle: string;
    mindLifeTitle: string;
    mindLifeEmoji: string;
    mindLifeDesc: string;
    beautyBodyTitle: string;
    beautyBodyEmoji: string;
    beautyBodyDesc: string;
    selectButton: string;
  };

  // Presentation
  presentation: {
    title: string;
    subtitle: string;
    quote: string;
    description: string;
    cta: string;
    triangleTitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    rulesTitle: string;
    rule1: string;
    rule2: string;
    rule3: string;
    rule4: string;
    rule5: string;
    startChallenge: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    progress: string;
    daysCompleted: string;
    currentDay: string;
    startDay: string;
    continueChallenge: string;
    quickActions: string;
    todayChallenge: string;
    viewDetails: string;
    yourProgress: string;
    week: string;
    continueYourChallenge: string;
  };
  
  // Challenge
  challenge: {
    title: string;
    day: string;
    completed: string;
    notCompleted: string;
    markComplete: string;
    markIncomplete: string;
    notes: string;
    addNotes: string;
    saveNotes: string;
    viewDay: string;
    congratulations: string;
    dayCompletedTitle: string;
    dayCompletedMessage: string;
    seeYouTomorrow: string;
    keepGoing: string;
    lockedDay: string;
    completeCurrentDay: string;
    week: string;
    yourDailyActions: string;
    beauty: string;
    mental: string;
    lifestyle: string;
    notesPlaceholder: string;
    completedButton: string;
    completeButton: string;
    progression: string;
    days: string;
  };
  
  // Journal
  journal: {
    title: string;
    newEntry: string;
    editEntry: string;
    deleteEntry: string;
    date: string;
    mood: string;
    feelings: string;
    glow: string;
    learned: string;
    freeContent: string;
    save: string;
    cancel: string;
    confirmDelete: string;
    expressYourself: string;
    howFeelToday: string;
    yourMood: string;
    whatBroughtGlow: string;
    momentsOfJoy: string;
    whatLearned: string;
    discoveriesLearnings: string;
    addToJournal: string;
    history: string;
    noEntries: string;
    glowOfDay: string;
    entries: string;
  };
  
  // Trackers
  trackers: {
    title: string;
    today: string;
    waterGlasses: string;
    sleepHours: string;
    mood: string;
    activityMinutes: string;
    skincare: string;
    habits: string;
    save: string;
    dailyHabits: string;
    meditation5min: string;
    journaling: string;
    gratitude: string;
    exercise: string;
    reading: string;
    noScrollBeforeSleep: string;
    skincareCompleted: string;
    todaysRoutine: string;
    hydration: string;
    glasses: string;
    sleep: string;
    hours: string;
    hoursPlaceholder: string;
    activityMovement: string;
    minutes: string;
    minutesPlaceholder: string;
  };
  
  // Routine
  routine: {
    title: string;
    customize: string;
    step: string;
    markComplete: string;
    completed: string;
    save: string;
    myGlowUpRoutine: string;
    dailyRoutine: string;
    customizeRoutine: string;
    completedToday: string;
    completedQuestion: string;
    markWhenDone: string;
    steps: string;
  };
  
  // Vision Board
  visionBoard: {
    title: string;
    addImage: string;
    addCaption: string;
    imageUrl: string;
    caption: string;
    add: string;
    delete: string;
    download: string;
    myImages: string;
    noImages: string;
    addImagesInspire: string;
    uploadInspire: string;
    optional: string;
    descriptionPlaceholder: string;
    addToVisionBoard: string;
    images: string;
  };
  
  // Bonus
  bonus: {
    title: string;
    affirmations: string;
    checklists: string;
    miniGuide: string;
    duration: string;
    completed: string;
    fiftyThingsAlone: string;
    completedItems: string;
    weeklyTracking: string;
    weeks: string;
    guides: string;
    globalProgress: string;
    affirmationOfDay: string;
    myImages: string;
    noImages: string;
    addImages: string;
    discoverSoftLife: string;
    arsenalPositive: string;
    practicalGuides: string;
    softLifeSteps: string;
    guide: string;
    steps: string;
    smallWinsTitle: string;
    smallWinsThisWeek: string;
    addSmallWin: string;
    smallWinPlaceholder: string;
    history: string;
    congratulations: string;
    keepGoing: string;
    why: string;
    whyItWorks: string;
    smallWinsDescription: string;
    smallWinsStep1: string;
    smallWinsStep2: string;
    smallWinsStep3: string;
    smallWinsExplanation: string;
    eveningQuestionTitle: string;
    eveningQuestionDescription: string;
    eveningQuestionStep1: string;
    eveningQuestionStep2: string;
    eveningQuestionStep3: string;
    eveningQuestionExplanation: string;
    eveningQuestionThisMonth: string;
    addEveningQuestion: string;
    questionPlaceholder: string;
    answerPlaceholder: string;
    boundariesTitle: string;
    boundariesThisWeek: string;
    addBoundary: string;
    selectBoundary: string;
    idealFrequency: string;
    timesPerWeek: string;
  };
  
  // Settings
  settings: {
    title: string;
    theme: string;
    light: string;
    dark: string;
    notifications: string;
    enabled: string;
    disabled: string;
    language: string;
    selectLanguage: string;
    changeAppearance: string;
    export: string;
    downloadData: string;
    percentage: string;
  };
  
  // New Me
  newMe: {
    title: string;
    subtitle: string;
    mascot: string;
    dailyTracking: string;
    progress: string;
    completed: string;
    todayFeeling: string;
    viewDetails: string;
    habits: string;
    habitDetails: string;
    gloweeMessage: string;
    finalMessage: string;
    day: string;
    today: string;
    progressOn30Days: string;
    badges: string;
    daysCompleted: string;
    // Messages dynamiques
    helloReady: string; // "Bonjour, prête pour ton jour X !"
    dayProgress: string; // "Progression du jour"
    the13Pillars: string; // "Les 13 piliers"
    completedDay: string; // "Jour X complété !"
    completeThisDay: string; // "J'ai complété ce jour"
      trackingShort: string; // "Suivi" (version courte pour mobile)
      progressShort: string; // "Progrès" (version courte pour mobile)
    // Badges
    badgeFirstDay: string;
    badgeFirstDayDesc: string;
    badgeFirstWeek: string;
    badgeFirstWeekDesc: string;
    badgePerfectDay: string;
    badgePerfectDayDesc: string;
    badgeWaterMaster: string;
    badgeWaterMasterDesc: string;
    badgeWalkingStar: string;
    badgeWalkingStarDesc: string;
    badgeSkincareQueen: string;
    badgeSkincareQueenDesc: string;
    badgeTwoWeeks: string;
    badgeTwoWeeksDesc: string;
    badgeComplete: string;
    badgeCompleteDesc: string;
    // Encouragements
    encouragement1: string;
    encouragement2: string;
    encouragement3: string;
    encouragement4: string;
  };

  // Common
  common: {
    close: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    yes: string;
    no: string;
    loading: string;
    error: string;
    success: string;
  };
}

export const translations: Record<Language, Translation> = {
  fr: {
    nav: {
      home: 'Accueil',
      challenge: 'Challenge',
      journal: 'Journal',
      glowee: 'Glowee',
      trackers: 'Trackers',
      routine: 'Routine',
      visionBoard: 'Vision Board',
      bonus: 'Bonus',
      settings: 'Profil',
    },
    onboarding: {
      title: 'Glow Up Challenge',
      subtitle: '30 jours pour rayonner',
      description: 'Transforme ta vie en 30 jours avec des défis quotidiens, du journaling, et des outils de bien-être.',
      startButton: 'Commencer le Challenge',
      thirtyDays: '30 Jours',
      fullContent: 'Contenu complet',
      advancedTracking: 'Suivi avancé',
      selfReflection: 'Introspection',
      habits: 'Habitudes',
      gloweeGreeting: 'Bonjour!',
      gloweeIntro: 'Je m\'appelle Glowee\nTon reflet bienveillant.',
      gloweeMessage: 'Je t\'aide à voir tout ce qui brille déjà en toi ✨',
      gloweeButton: 'Avançons ensemble',
    },
    languageSelection: {
      title: 'Bienvenue',
      subtitle: 'Choisissez votre langue',
      selectLanguage: 'Sélectionner la langue',
      continue: 'Continuer',
    },
    challengeSelection: {
      title: 'Je suis là pour t\'aider à forger la nouvelle toi.',
      subtitle: 'Sur quoi veux-tu glow up en priorité ?',
      mindLifeTitle: 'Esprit & Vie',
      mindLifeEmoji: '🌱',
      mindLifeDesc: 'Confiance, objectifs, relations, clarté, moi profond',
      beautyBodyTitle: 'Beauté & Corps',
      beautyBodyEmoji: '💄',
      beautyBodyDesc: 'Soins, corps, énergie, discipline douce, glow naturel',
      selectButton: 'Choisir ce challenge',
    },
    presentation: {
      title: 'Révèle ta meilleure version',
      subtitle: 'Un programme de 30 jours pour transformer ton corps, ton mental et ton style de vie avec douceur.',
      quote: 'Le changement ne se produit pas par hasard, il se produit par le choix.',
      description: 'Deviens la meilleure version de toi-même en 30 jours.',
      cta: 'Commencer le Challenge',
      triangleTitle: 'Le triangle de transformation',
      pillar1Title: '1. Apparence (la base)',
      pillar1Desc: 'Beauté intérieure et extérieure : corps, énergie, soins de la peau, coiffure, posture, maquillage minimal si souhaité, parfum.',
      pillar2Title: '2. Personnalité',
      pillar2Desc: 'Qui vous êtes vraiment (intérieur) et ce que vous dégagez (extérieur). Confiance, charisme, communication, authenticité.',
      pillar3Title: '3. Sens de la vie & argent',
      pillar3Desc: 'Vision, ambition, compétences, autonomie financière, Dieu.',
      rulesTitle: 'RÈGLES DU CHALLENGE',
      rule1: 'Réveil fixe (±30 min max)',
      rule2: 'Téléphone interdit 30 min après le réveil',
      rule3: 'Prendre des notes journalières (obligatoire)',
      rule4: 'Chaque jour : 1 action pour chaque pilier',
      rule5: 'ZÉRO excuse',
      startChallenge: 'Commencer le Challenge',
    },
    dashboard: {
      welcome: 'Bienvenue',
      progress: 'Progression',
      daysCompleted: 'jours complétés',
      currentDay: 'Jour actuel',
      startDay: 'Commencer le jour',
      continueChallenge: 'Continuer le challenge',
      quickActions: 'Actions rapides',
      todayChallenge: 'Challenge du jour',
      viewDetails: 'Voir les détails',
      yourProgress: 'Ta Progression',
      week: 'Semaine',
      continueYourChallenge: 'Continue ton Glow Up Challenge',
    },
    challenge: {
      title: 'Esprit & Vie',
      day: 'Jour',
      completed: 'Complété',
      notCompleted: 'Non complété',
      markComplete: 'Marquer comme complété',
      markIncomplete: 'Marquer comme non complété',
      notes: 'Notes',
      addNotes: 'Ajouter des notes',
      saveNotes: 'Sauvegarder les notes',
      viewDay: 'Voir le jour',
      congratulations: 'Félicitations ! 🎉',
      dayCompletedTitle: 'Jour complété avec succès !',
      dayCompletedMessage: 'Tu as terminé le défi d\'aujourd\'hui. Continue comme ça !',
      seeYouTomorrow: 'On se retrouve demain pour le prochain défi ! 💪',
      keepGoing: 'Continue ton Glow Up !',
      lockedDay: 'Jour verrouillé',
      completeCurrentDay: 'Complète d\'abord le jour actuel pour débloquer celui-ci.',
      week: 'Semaine',
      yourDailyActions: 'Tes Actions du Jour',
      beauty: 'Beauté',
      mental: 'Mental',
      lifestyle: 'Lifestyle',
      notesPlaceholder: 'Note tes pensées, tes ressentis...',
      completedButton: 'Jour Complété ✓',
      completeButton: 'J\'ai complété ce jour',
      progression: 'Progression',
      days: 'jours',
    },
    journal: {
      title: 'Mon Journal',
      newEntry: 'Nouvelle entrée',
      editEntry: 'Modifier l\'entrée',
      deleteEntry: 'Supprimer l\'entrée',
      date: 'Date',
      mood: 'Humeur',
      feelings: 'Ressentis',
      glow: 'Glow du jour',
      learned: 'Apprentissages',
      freeContent: 'Journal libre',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette entrée ?',
      expressYourself: 'Exprime-toi librement',
      howFeelToday: 'Comment je me sens aujourd\'hui ?',
      yourMood: 'Ton humeur du moment...',
      whatBroughtGlow: 'Qu\'est-ce qui m\'a apporté du glow ?',
      momentsOfJoy: 'Les petits moments de joie...',
      whatLearned: 'Qu\'est-ce que j\'ai appris ?',
      discoveriesLearnings: 'Tes découvertes et apprentissages...',
      addToJournal: 'Ajouter au Journal',
      history: 'Historique',
      noEntries: 'Aucune entrée pour le moment',
      glowOfDay: 'Glow du jour',
      entries: 'entrées',
    },
    trackers: {
      title: 'Mes Trackers',
      today: 'Aujourd\'hui',
      waterGlasses: 'Verres d\'eau',
      sleepHours: 'Heures de sommeil',
      mood: 'Humeur',
      activityMinutes: 'Minutes d\'activité',
      skincare: 'Routine skincare',
      habits: 'Habitudes',
      save: 'Sauvegarder',
      dailyHabits: 'Habitudes quotidiennes',
      meditation5min: 'Médite sur dieu 5 min',
      journaling: 'Journal 5 min',
      gratitude: 'Gratitude',
      exercise: 'Exercice 10 min',
      reading: 'Lecture 5 min',
      noScrollBeforeSleep: 'Pas de scroll avant de dormir',
      skincareCompleted: 'Skincare complété',
      todaysRoutine: 'Routine du jour',
      hydration: 'Hydratation',
      glasses: 'verres',
      sleep: 'Sommeil',
      hours: 'h',
      hoursPlaceholder: 'Nombre d\'heures',
      activityMovement: 'Activité / Mouvement',
      minutes: 'min',
      minutesPlaceholder: 'Minutes d\'activité',
    },
    routine: {
      title: 'Ma Routine',
      customize: 'Personnaliser',
      step: 'Étape',
      markComplete: 'Marquer comme complété',
      completed: 'Complété aujourd\'hui',
      save: 'Sauvegarder',
      myGlowUpRoutine: 'Ma Routine Glow Up',
      dailyRoutine: 'Routine Quotidienne - 5 Étapes',
      customizeRoutine: 'Personnalise ta routine Glow Up',
      completedToday: 'Routine Glow Up complétée aujourd\'hui ! ✨',
      completedQuestion: 'Routine complétée aujourd\'hui ?',
      markWhenDone: 'Marque quand tu as fini',
      steps: 'étapes',
    },
    visionBoard: {
      title: 'Vision Board',
      addImage: 'Ajouter une image',
      addCaption: 'Ajouter une légende',
      imageUrl: 'URL de l\'image',
      caption: 'Légende',
      add: 'Ajouter',
      delete: 'Supprimer',
      download: 'Télécharger',
      myImages: 'Mes Images',
      noImages: 'Aucune image pour le moment',
      addImagesInspire: 'Ajoute des images qui t\'inspirent',
      uploadInspire: 'Upload une image qui t\'inspire',
      optional: 'optionnel',
      descriptionPlaceholder: 'Une description ou affirmation...',
      addToVisionBoard: 'Ajouter au Vision Board',
      images: 'images',
    },
    bonus: {
      title: 'Glow Up',
      affirmations: 'Affirmations',
      checklists: 'Checklists',
      miniGuide: 'Mini-Guide',
      duration: 'Durée',
      completed: 'complétées',
      fiftyThingsAlone: '50 choses à faire seule',
      completedItems: 'complétées',
      weeklyTracking: 'Suivi Hebdomadaire',
      weeks: 'semaines',
      guides: 'Guides',
      globalProgress: 'Progression Globale',
      affirmationOfDay: 'Affirmation du jour',
      myImages: 'Mes Images',
      noImages: 'Aucune image pour le moment',
      addImages: 'Ajoute des images qui t\'inspirent',
      discoverSoftLife: 'Découvre comment créer une vie alignée et sereine',
      arsenalPositive: 'Ton arsenal de pensées positives',
      practicalGuides: 'Des guides pratiques pour t\'organiser',
      softLifeSteps: '5 étapes pour une vie douce et épanouie',
      guide: 'Guide',
      steps: 'étapes',
      smallWinsTitle: 'Petits Succès',
      smallWinsThisWeek: 'Cette semaine',
      addSmallWin: 'Ajouter un succès',
      smallWinPlaceholder: 'Décris ton petit succès...',
      history: 'Historique',
      congratulations: 'On ne se connaît pas, mais ta joie est contagieuse : je suis très heureux pour toi et je fête avec toi ! 🥂',
      keepGoing: 'Continue comme ça !',
      why: 'Pourquoi ?',
      whyItWorks: 'Pourquoi ça marche ?',
      smallWinsDescription: 'Célèbre tes victoires quotidiennes !',
      smallWinsStep1: 'Note trois petits accomplissements réalisés cette semaine (même les plus minimes).',
      smallWinsStep2: 'Décris pourquoi ces accomplissements sont importants pour toi.',
      smallWinsStep3: 'Relis cette liste chaque matin pour te rappeler que tu es capable.',
      smallWinsExplanation: "L'auto-valorisation aide à renforcer la confiance et réduire le sentiment d'échec.",
      eveningQuestionTitle: 'Question du Soir',
      eveningQuestionDescription: 'Réfléchis sur ta journée',
      eveningQuestionStep1: 'Pose-toi une question profonde chaque soir.',
      eveningQuestionStep2: 'Réponds honnêtement, sans jugement.',
      eveningQuestionStep3: 'Relis tes réponses pour voir ton évolution.',
      eveningQuestionExplanation: "L'introspection quotidienne aide à mieux se connaître et à grandir.",
      eveningQuestionThisMonth: 'Ce mois-ci',
      addEveningQuestion: 'Ajouter une question',
      questionPlaceholder: 'Ta question du soir...',
      answerPlaceholder: 'Ta réponse...',
      boundariesTitle: '8 Limites pour ta Paix Intérieure',
      boundariesThisWeek: 'Cette semaine',
      addBoundary: 'Ajouter une limite',
      selectBoundary: 'Sélectionne une limite',
      idealFrequency: 'Fréquence idéale',
      timesPerWeek: 'fois/semaine',
    },
    settings: {
      title: 'Profil',
      theme: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      notifications: 'Notifications',
      enabled: 'Activées',
      disabled: 'Désactivées',
      language: 'Langue',
      selectLanguage: 'Choisir la langue',
      changeAppearance: 'Change l\'apparence',
      export: 'Export',
      downloadData: 'Télécharge tes données',
      percentage: 'Pourcentage',
    },
    common: {
      close: 'Fermer',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      yes: 'Oui',
      no: 'Non',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
    newMe: {
      title: 'Beauté & Corps',
      subtitle: 'Challenge Glow Up Beauté & Corps – 30 jours',
      mascot: 'Glowee 🦋',
      dailyTracking: 'Aujourd\'hui',
      progress: 'Progression',
      completed: 'complétées',
      todayFeeling: 'Comment te sens-tu aujourd\'hui ?',
      viewDetails: 'Voir les détails',
      habits: 'habitudes',
      habitDetails: 'Détails de l\'habitude',
      gloweeMessage: 'Message de Glowee',
      finalMessage: 'En 30 jours, tu ne changes pas qui tu es. Tu redeviens qui tu étais censée être. 🦋',
      day: 'Jour',
      today: 'Aujourd\'hui',
      progressOn30Days: 'Progression',
      badges: 'Badges',
      daysCompleted: 'jours complétés',
      helloReady: 'Bonjour, prête pour ton jour',
      dayProgress: 'Progression du jour',
      the13Pillars: 'Les 13 piliers',
      completedDay: 'Jour {day} complété !',
      completeThisDay: 'J\'ai complété ce jour',
      trackingShort: 'Suivi',
      progressShort: 'Progrès',
      badgeFirstDay: '🌱 Premier jour',
      badgeFirstDayDesc: 'Tu as commencé ton voyage New Me !',
      badgeFirstWeek: '🌿 Première semaine',
      badgeFirstWeekDesc: '7 jours de transformation !',
      badgePerfectDay: '✨ Journée parfaite',
      badgePerfectDayDesc: 'Toutes les habitudes complétées en un jour !',
      badgeWaterMaster: '💧 Maîtresse de l\'eau',
      badgeWaterMasterDesc: '7 jours d\'eau à 2L complétés',
      badgeWalkingStar: '🚶‍♀️ Star de la marche',
      badgeWalkingStarDesc: '7 jours de marche 30 min complétés',
      badgeSkincareQueen: '👑 Reine du skincare',
      badgeSkincareQueenDesc: '7 jours de skincare complétés',
      badgeTwoWeeks: '🌸 Deux semaines',
      badgeTwoWeeksDesc: '14 jours de transformation !',
      badgeComplete: '🦋 Transformation complète',
      badgeCompleteDesc: '30 jours terminés ! Tu as brillé !',
      encouragement1: 'Chaque petit pas compte. Tu es sur la bonne voie ! 🦋',
      encouragement2: 'Tu rayonnes de plus en plus chaque jour ! ✨',
      encouragement3: 'Regarde tout ce chemin parcouru, tu es incroyable ! 💜',
      encouragement4: 'Continue, la transformation est en cours ! 🌸',
    },
  },
  en: {
    nav: {
      home: 'Home',
      challenge: 'Challenge',
      journal: 'Journal',
      glowee: 'Glowee',
      trackers: 'Trackers',
      routine: 'Routine',
      visionBoard: 'Vision Board',
      bonus: 'Bonus',
      settings: 'Profile',
    },
    onboarding: {
      title: 'Glow Up Challenge',
      subtitle: '30 days to shine',
      description: 'Transform your life in 30 days with daily challenges, journaling, and wellness tools.',
      startButton: 'Start the Challenge',
      thirtyDays: '30 Days',
      fullContent: 'Full content',
      advancedTracking: 'Advanced tracking',
      selfReflection: 'Self-reflection',
      habits: 'Habits',
      gloweeGreeting: 'Hello!',
      gloweeIntro: 'I\'m Glowee\nYour kind reflection.',
      gloweeMessage: 'I help you see everything that already shines in you ✨',
      gloweeButton: 'Let\'s move forward together',
    },
    languageSelection: {
      title: 'Welcome',
      subtitle: 'Choose your language',
      selectLanguage: 'Select language',
      continue: 'Continue',
    },
    challengeSelection: {
      title: 'I\'m here to help you forge the new you.',
      subtitle: 'What do you want to glow up first?',
      mindLifeTitle: 'Mind & Life',
      mindLifeEmoji: '🌱',
      mindLifeDesc: 'Confidence, goals, relationships, clarity, deep self',
      beautyBodyTitle: 'Beauty & Body',
      beautyBodyEmoji: '💄',
      beautyBodyDesc: 'Care, body, energy, gentle discipline, natural glow',
      selectButton: 'Choose this challenge',
    },
    presentation: {
      title: 'Reveal Your Best Version',
      subtitle: 'A 30-day program to transform your body, mind and lifestyle with gentleness.',
      quote: 'Change doesn\'t happen by chance, it happens by choice.',
      description: 'Become the best version of yourself in 30 days.',
      cta: 'Start the Challenge',
      triangleTitle: 'The Transformation Triangle',
      pillar1Title: '1. Appearance (the foundation)',
      pillar1Desc: 'Inner and outer beauty: body, energy, skincare, hair, posture, minimal makeup if desired, fragrance.',
      pillar2Title: '2. Personality',
      pillar2Desc: 'Who you really are (inside) and what you radiate (outside). Confidence, charisma, communication, authenticity.',
      pillar3Title: '3. Life Purpose & Money',
      pillar3Desc: 'Vision, ambition, skills, financial autonomy, God.',
      rulesTitle: 'CHALLENGE RULES',
      rule1: 'Fixed wake-up time (±30 min max)',
      rule2: 'No phone for 30 min after waking up',
      rule3: 'Daily journaling (mandatory)',
      rule4: 'Every day: 1 action for each pillar',
      rule5: 'ZERO excuses',
      startChallenge: 'Start the Challenge',
    },
    dashboard: {
      welcome: 'Welcome',
      progress: 'Progress',
      daysCompleted: 'days completed',
      currentDay: 'Current day',
      startDay: 'Start day',
      continueChallenge: 'Continue challenge',
      quickActions: 'Quick actions',
      todayChallenge: 'Today\'s challenge',
      viewDetails: 'View details',
      yourProgress: 'Your Progress',
      week: 'Week',
      continueYourChallenge: 'Continue your Glow Up Challenge',
    },
    challenge: {
      title: 'Mind & Life',
      day: 'Day',
      completed: 'Completed',
      notCompleted: 'Not completed',
      markComplete: 'Mark as complete',
      markIncomplete: 'Mark as incomplete',
      notes: 'Notes',
      addNotes: 'Add notes',
      saveNotes: 'Save notes',
      viewDay: 'View day',
      congratulations: 'Congratulations! 🎉',
      dayCompletedTitle: 'Day completed successfully!',
      dayCompletedMessage: 'You\'ve finished today\'s challenge. Keep it up!',
      seeYouTomorrow: 'See you tomorrow for the next challenge! 💪',
      keepGoing: 'Keep up your Glow Up!',
      lockedDay: 'Locked day',
      completeCurrentDay: 'Complete the current day first to unlock this one.',
      week: 'Week',
      yourDailyActions: 'Your Daily Actions',
      beauty: 'Beauty',
      mental: 'Mental',
      lifestyle: 'Lifestyle',
      notesPlaceholder: 'Write your thoughts, feelings...',
      completedButton: 'Day Completed ✓',
      completeButton: 'I completed this day',
      progression: 'Progress',
      days: 'days',
    },
    journal: {
      title: 'My Journal',
      newEntry: 'New entry',
      editEntry: 'Edit entry',
      deleteEntry: 'Delete entry',
      date: 'Date',
      mood: 'Mood',
      feelings: 'Feelings',
      glow: 'Today\'s glow',
      learned: 'Learnings',
      freeContent: 'Free journal',
      save: 'Save',
      cancel: 'Cancel',
      confirmDelete: 'Are you sure you want to delete this entry?',
      expressYourself: 'Express yourself freely',
      howFeelToday: 'How do I feel today?',
      yourMood: 'Your current mood...',
      whatBroughtGlow: 'What brought me glow?',
      momentsOfJoy: 'Little moments of joy...',
      whatLearned: 'What did I learn?',
      discoveriesLearnings: 'Your discoveries and learnings...',
      addToJournal: 'Add to Journal',
      history: 'History',
      noEntries: 'No entries yet',
      glowOfDay: 'Today\'s glow',
      entries: 'entries',
    },
    trackers: {
      title: 'My Trackers',
      today: 'Today',
      waterGlasses: 'Water glasses',
      sleepHours: 'Sleep hours',
      mood: 'Mood',
      activityMinutes: 'Activity minutes',
      skincare: 'Skincare routine',
      habits: 'Habits',
      save: 'Save',
      dailyHabits: 'Daily Habits',
      meditation5min: 'Meditate on God 5 min',
      journaling: 'Journal 5 min',
      gratitude: 'Gratitude',
      exercise: 'Exercise 10 min',
      reading: 'Reading 5 min',
      noScrollBeforeSleep: 'No scrolling before bed',
      skincareCompleted: 'Skincare completed',
      todaysRoutine: 'Today\'s routine',
      hydration: 'Hydration',
      glasses: 'glasses',
      sleep: 'Sleep',
      hours: 'h',
      hoursPlaceholder: 'Number of hours',
      activityMovement: 'Activity / Movement',
      minutes: 'min',
      minutesPlaceholder: 'Activity minutes',
    },
    routine: {
      title: 'My Routine',
      customize: 'Customize',
      step: 'Step',
      markComplete: 'Mark as complete',
      completed: 'Completed today',
      save: 'Save',
      myGlowUpRoutine: 'My Glow Up Routine',
      dailyRoutine: 'Daily Routine - 5 Steps',
      customizeRoutine: 'Customize your Glow Up routine',
      completedToday: 'Glow Up routine completed today! ✨',
      completedQuestion: 'Routine completed today?',
      markWhenDone: 'Mark when you\'re done',
      steps: 'steps',
    },
    visionBoard: {
      title: 'Vision Board',
      addImage: 'Add image',
      addCaption: 'Add caption',
      imageUrl: 'Image URL',
      caption: 'Caption',
      add: 'Add',
      delete: 'Delete',
      download: 'Download',
      myImages: 'My Images',
      noImages: 'No images yet',
      addImagesInspire: 'Add images that inspire you',
      uploadInspire: 'Upload an image that inspires you',
      optional: 'optional',
      descriptionPlaceholder: 'A description or affirmation...',
      addToVisionBoard: 'Add to Vision Board',
      images: 'images',
    },
    bonus: {
      title: 'Glow Up',
      affirmations: 'Affirmations',
      checklists: 'Checklists',
      miniGuide: 'Mini-Guide',
      duration: 'Duration',
      completed: 'completed',
      fiftyThingsAlone: '50 things to do alone',
      completedItems: 'completed',
      weeklyTracking: 'Weekly Tracking',
      weeks: 'weeks',
      guides: 'Guides',
      globalProgress: 'Overall Progress',
      affirmationOfDay: 'Today\'s affirmation',
      myImages: 'My Images',
      noImages: 'No images yet',
      addImages: 'Add images that inspire you',
      discoverSoftLife: 'Discover how to create an aligned and serene life',
      arsenalPositive: 'Your arsenal of positive thoughts',
      practicalGuides: 'Practical guides to organize yourself',
      softLifeSteps: '5 steps for a soft and fulfilling life',
      guide: 'Guide',
      steps: 'steps',
      smallWinsTitle: 'Small Wins',
      smallWinsThisWeek: 'This week',
      addSmallWin: 'Add a win',
      smallWinPlaceholder: 'Describe your small win...',
      history: 'History',
      congratulations: 'We don\'t know each other, but your joy is contagious: I\'m very happy for you and I celebrate with you! 🥂',
      keepGoing: 'Keep it up!',
      why: 'Why?',
      whyItWorks: 'Why does it work?',
      smallWinsDescription: 'Celebrate your daily victories!',
      smallWinsStep1: 'Write down three small accomplishments from this week (even the smallest ones).',
      smallWinsStep2: 'Describe why these accomplishments are important to you.',
      smallWinsStep3: 'Reread this list every morning to remind yourself that you are capable.',
      smallWinsExplanation: 'Self-validation helps strengthen confidence and reduce feelings of failure.',
      eveningQuestionTitle: 'Evening Question',
      eveningQuestionDescription: 'Reflect on your day',
      eveningQuestionStep1: 'Ask yourself a deep question every evening.',
      eveningQuestionStep2: 'Answer honestly, without judgment.',
      eveningQuestionStep3: 'Reread your answers to see your evolution.',
      eveningQuestionExplanation: 'Daily introspection helps you know yourself better and grow.',
      eveningQuestionThisMonth: 'This month',
      addEveningQuestion: 'Add a question',
      questionPlaceholder: 'Your evening question...',
      answerPlaceholder: 'Your answer...',
      boundariesTitle: '8 Boundaries for Your Inner Peace',
      boundariesThisWeek: 'This week',
      addBoundary: 'Add a boundary',
      selectBoundary: 'Select a boundary',
      idealFrequency: 'Ideal frequency',
      timesPerWeek: 'times/week',
    },
    settings: {
      title: 'Profile',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      notifications: 'Notifications',
      enabled: 'Enabled',
      disabled: 'Disabled',
      language: 'Language',
      selectLanguage: 'Choose language',
      changeAppearance: 'Change appearance',
      export: 'Export',
      downloadData: 'Download your data',
      percentage: 'Percentage',
    },
    common: {
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    newMe: {
      title: 'Beauty & Body',
      subtitle: 'Beauty & Body Glow Up Challenge – 30 days',
      mascot: 'Glowee 🦋',
      dailyTracking: 'Today',
      progress: 'Progress',
      completed: 'completed',
      todayFeeling: 'How do you feel today?',
      viewDetails: 'View details',
      habits: 'habits',
      habitDetails: 'Habit details',
      gloweeMessage: 'Glowee\'s message',
      finalMessage: 'In 30 days, you don\'t change who you are. You become who you were meant to be. 🦋',
      day: 'Day',
      today: 'Today',
      progressOn30Days: 'Progress',
      badges: 'Badges',
      daysCompleted: 'days completed',
      helloReady: 'Hello, ready for day',
      dayProgress: 'Day progress',
      the13Pillars: 'The 13 pillars',
      completedDay: 'Day {day} completed!',
      completeThisDay: 'I completed this day',
      trackingShort: 'Track',
      progressShort: 'Progress',
      badgeFirstDay: '🌱 First day',
      badgeFirstDayDesc: 'You started your New Me journey!',
      badgeFirstWeek: '🌿 First week',
      badgeFirstWeekDesc: '7 days of transformation!',
      badgePerfectDay: '✨ Perfect day',
      badgePerfectDayDesc: 'All habits completed in one day!',
      badgeWaterMaster: '💧 Water master',
      badgeWaterMasterDesc: '7 days of 2L water completed',
      badgeWalkingStar: '🚶‍♀️ Walking star',
      badgeWalkingStarDesc: '7 days of 30 min walk completed',
      badgeSkincareQueen: '👑 Skincare queen',
      badgeSkincareQueenDesc: '7 days of skincare completed',
      badgeTwoWeeks: '🌸 Two weeks',
      badgeTwoWeeksDesc: '14 days of transformation!',
      badgeComplete: '🦋 Complete transformation',
      badgeCompleteDesc: '30 days completed! You shined!',
      encouragement1: 'Every small step counts. You\'re on the right path! 🦋',
      encouragement2: 'You\'re glowing more and more each day! ✨',
      encouragement3: 'Look at all this progress, you\'re amazing! 💜',
      encouragement4: 'Keep going, the transformation is happening! 🌸',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      challenge: 'Desafío',
      journal: 'Diario',
      glowee: 'Glowee',
      trackers: 'Rastreadores',
      routine: 'Rutina',
      visionBoard: 'Tablero de Visión',
      bonus: 'Bonus',
      settings: 'Perfil',
    },
    onboarding: {
      title: 'Desafío Glow Up',
      subtitle: '30 días para brillar',
      description: 'Transforma tu vida en 30 días con desafíos diarios, diario personal y herramientas de bienestar.',
      startButton: 'Comenzar el Desafío',
      thirtyDays: '30 Días',
      fullContent: 'Contenido completo',
      advancedTracking: 'Seguimiento avanzado',
      selfReflection: 'Introspección',
      habits: 'Hábitos',
      gloweeGreeting: '¡Hola!',
      gloweeIntro: 'Me llamo Glowee\nTu reflejo amable.',
      gloweeMessage: 'Te ayudo a ver todo lo que ya brilla en ti ✨',
      gloweeButton: 'Avancemos juntas',
    },
    languageSelection: {
      title: 'Bienvenida',
      subtitle: 'Elige tu idioma',
      selectLanguage: 'Seleccionar idioma',
      continue: 'Continuar',
    },
    challengeSelection: {
      title: 'Estoy aquí para ayudarte a forjar la nueva tú.',
      subtitle: '¿En qué quieres brillar primero?',
      mindLifeTitle: 'Mente & Vida',
      mindLifeEmoji: '🌱',
      mindLifeDesc: 'Confianza, objetivos, relaciones, claridad, yo profundo',
      beautyBodyTitle: 'Belleza & Cuerpo',
      beautyBodyEmoji: '💄',
      beautyBodyDesc: 'Cuidados, cuerpo, energía, disciplina suave, brillo natural',
      selectButton: 'Elegir este desafío',
    },
    presentation: {
      title: 'Revela tu mejor versión',
      subtitle: 'Un programa de 30 días para transformar tu cuerpo, mente y estilo de vida con suavidad.',
      quote: 'El cambio no ocurre por casualidad, ocurre por elección.',
      description: 'Conviértete en la mejor versión de ti misma en 30 días.',
      cta: 'Comenzar el Desafío',
      triangleTitle: 'El triángulo de transformación',
      pillar1Title: '1. Apariencia (la base)',
      pillar1Desc: 'Belleza interior y exterior: cuerpo, energía, cuidado de la piel, cabello, postura, maquillaje mínimo si se desea, perfume.',
      pillar2Title: '2. Personalidad',
      pillar2Desc: 'Quién eres realmente (interior) y lo que irradias (exterior). Confianza, carisma, comunicación, autenticidad.',
      pillar3Title: '3. Sentido de la vida y dinero',
      pillar3Desc: 'Visión, ambición, habilidades, autonomía financiera, Dios.',
      rulesTitle: 'REGLAS DEL DESAFÍO',
      rule1: 'Hora de despertar fija (±30 min máx)',
      rule2: 'Teléfono prohibido 30 min después de despertar',
      rule3: 'Tomar notas diarias (obligatorio)',
      rule4: 'Cada día: 1 acción para cada pilar',
      rule5: 'CERO excusas',
      startChallenge: 'Comenzar el Desafío',
    },
    dashboard: {
      welcome: 'Bienvenida',
      progress: 'Progreso',
      daysCompleted: 'días completados',
      currentDay: 'Día actual',
      startDay: 'Comenzar día',
      continueChallenge: 'Continuar desafío',
      quickActions: 'Acciones rápidas',
      todayChallenge: 'Desafío de hoy',
      viewDetails: 'Ver detalles',
      yourProgress: 'Tu Progreso',
      week: 'Semana',
      continueYourChallenge: 'Continúa tu Desafío Glow Up',
    },
    challenge: {
      title: 'Mente & Vida',
      day: 'Día',
      completed: 'Completado',
      notCompleted: 'No completado',
      markComplete: 'Marcar como completado',
      markIncomplete: 'Marcar como no completado',
      notes: 'Notas',
      addNotes: 'Agregar notas',
      saveNotes: 'Guardar notas',
      viewDay: 'Ver día',
      congratulations: '¡Felicitaciones! 🎉',
      dayCompletedTitle: '¡Día completado con éxito!',
      dayCompletedMessage: 'Has terminado el desafío de hoy. ¡Sigue así!',
      seeYouTomorrow: '¡Nos vemos mañana para el próximo desafío! 💪',
      keepGoing: '¡Continúa tu Glow Up!',
      lockedDay: 'Día bloqueado',
      completeCurrentDay: 'Completa primero el día actual para desbloquear este.',
      week: 'Semana',
      yourDailyActions: 'Tus Acciones del Día',
      beauty: 'Belleza',
      mental: 'Mental',
      lifestyle: 'Estilo de vida',
      notesPlaceholder: 'Escribe tus pensamientos, sentimientos...',
      completedButton: 'Día Completado ✓',
      completeButton: 'He completado este día',
      progression: 'Progreso',
      days: 'días',
    },
    journal: {
      title: 'Mi Diario',
      newEntry: 'Nueva entrada',
      editEntry: 'Editar entrada',
      deleteEntry: 'Eliminar entrada',
      date: 'Fecha',
      mood: 'Estado de ánimo',
      feelings: 'Sentimientos',
      glow: 'Brillo del día',
      learned: 'Aprendizajes',
      freeContent: 'Diario libre',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirmDelete: '¿Estás segura de que quieres eliminar esta entrada?',
      expressYourself: 'Exprésate libremente',
      howFeelToday: '¿Cómo me siento hoy?',
      yourMood: 'Tu estado de ánimo actual...',
      whatBroughtGlow: '¿Qué me trajo brillo?',
      momentsOfJoy: 'Pequeños momentos de alegría...',
      whatLearned: '¿Qué aprendí?',
      discoveriesLearnings: 'Tus descubrimientos y aprendizajes...',
      addToJournal: 'Agregar al Diario',
      history: 'Historial',
      noEntries: 'Sin entradas por ahora',
      glowOfDay: 'Brillo del día',
      entries: 'entradas',
    },
    trackers: {
      title: 'Mis Rastreadores',
      today: 'Hoy',
      waterGlasses: 'Vasos de agua',
      sleepHours: 'Horas de sueño',
      mood: 'Estado de ánimo',
      activityMinutes: 'Minutos de actividad',
      skincare: 'Rutina de cuidado de la piel',
      habits: 'Hábitos',
      save: 'Guardar',
      dailyHabits: 'Hábitos diarios',
      meditation5min: 'Medita sobre Dios 5 min',
      journaling: 'Diario 5 min',
      gratitude: 'Gratitud',
      exercise: 'Ejercicio 10 min',
      reading: 'Lectura 5 min',
      noScrollBeforeSleep: 'No desplazarse antes de dormir',
      skincareCompleted: 'Cuidado de la piel completado',
      todaysRoutine: 'Rutina del día',
      hydration: 'Hidratación',
      glasses: 'vasos',
      sleep: 'Sueño',
      hours: 'h',
      hoursPlaceholder: 'Número de horas',
      activityMovement: 'Actividad / Movimiento',
      minutes: 'min',
      minutesPlaceholder: 'Minutos de actividad',
    },
    routine: {
      title: 'Mi Rutina',
      customize: 'Personalizar',
      step: 'Paso',
      markComplete: 'Marcar como completado',
      completed: 'Completado hoy',
      save: 'Guardar',
      myGlowUpRoutine: 'Mi Rutina Glow Up',
      dailyRoutine: 'Rutina Diaria - 5 Pasos',
      customizeRoutine: 'Personaliza tu rutina Glow Up',
      completedToday: '¡Rutina Glow Up completada hoy! ✨',
      completedQuestion: '¿Rutina completada hoy?',
      markWhenDone: 'Marca cuando termines',
      steps: 'pasos',
    },
    visionBoard: {
      title: 'Tablero de Visión',
      addImage: 'Agregar imagen',
      addCaption: 'Agregar leyenda',
      imageUrl: 'URL de la imagen',
      caption: 'Leyenda',
      add: 'Agregar',
      delete: 'Eliminar',
      download: 'Descargar',
      myImages: 'Mis Imágenes',
      noImages: 'Sin imágenes por ahora',
      addImagesInspire: 'Agrega imágenes que te inspiren',
      uploadInspire: 'Sube una imagen que te inspire',
      optional: 'opcional',
      descriptionPlaceholder: 'Una descripción o afirmación...',
      addToVisionBoard: 'Agregar al Tablero de Visión',
      images: 'imágenes',
    },
    bonus: {
      title: 'Glow Up',
      affirmations: 'Afirmaciones',
      checklists: 'Listas de verificación',
      miniGuide: 'Mini-Guía',
      duration: 'Duración',
      completed: 'completadas',
      fiftyThingsAlone: '50 cosas para hacer sola',
      completedItems: 'completadas',
      weeklyTracking: 'Seguimiento Semanal',
      weeks: 'semanas',
      guides: 'Guías',
      globalProgress: 'Progreso Global',
      affirmationOfDay: 'Afirmación del día',
      myImages: 'Mis Imágenes',
      noImages: 'Sin imágenes por ahora',
      addImages: 'Agrega imágenes que te inspiren',
      discoverSoftLife: 'Descubre cómo crear una vida alineada y serena',
      arsenalPositive: 'Tu arsenal de pensamientos positivos',
      practicalGuides: 'Guías prácticas para organizarte',
      softLifeSteps: '5 pasos para una vida suave y plena',
      guide: 'Guía',
      steps: 'pasos',
      smallWinsTitle: 'Pequeños Éxitos',
      smallWinsThisWeek: 'Esta semana',
      addSmallWin: 'Agregar un éxito',
      smallWinPlaceholder: 'Describe tu pequeño éxito...',
      history: 'Historial',
      congratulations: 'No nos conocemos, pero tu alegría es contagiosa: ¡estoy muy feliz por ti y celebro contigo! 🥂',
      keepGoing: '¡Sigue así!',
      why: '¿Por qué?',
      whyItWorks: '¿Por qué funciona?',
      smallWinsDescription: '¡Celebra tus victorias diarias!',
      smallWinsStep1: 'Anota tres pequeños logros de esta semana (incluso los más pequeños).',
      smallWinsStep2: 'Describe por qué estos logros son importantes para ti.',
      smallWinsStep3: 'Relee esta lista cada mañana para recordarte que eres capaz.',
      smallWinsExplanation: 'La autovaloración ayuda a fortalecer la confianza y reducir el sentimiento de fracaso.',
      eveningQuestionTitle: 'Pregunta de la Noche',
      eveningQuestionDescription: 'Reflexiona sobre tu día',
      eveningQuestionStep1: 'Hazte una pregunta profunda cada noche.',
      eveningQuestionStep2: 'Responde honestamente, sin juzgarte.',
      eveningQuestionStep3: 'Relee tus respuestas para ver tu evolución.',
      eveningQuestionExplanation: 'La introspección diaria te ayuda a conocerte mejor y crecer.',
      eveningQuestionThisMonth: 'Este mes',
      addEveningQuestion: 'Agregar una pregunta',
      questionPlaceholder: 'Tu pregunta de la noche...',
      answerPlaceholder: 'Tu respuesta...',
      boundariesTitle: '8 Límites para tu Paz Interior',
      boundariesThisWeek: 'Esta semana',
      addBoundary: 'Agregar un límite',
      selectBoundary: 'Selecciona un límite',
      idealFrequency: 'Frecuencia ideal',
      timesPerWeek: 'veces/semana',
    },
    settings: {
      title: 'Perfil',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      notifications: 'Notificaciones',
      enabled: 'Activadas',
      disabled: 'Desactivadas',
      language: 'Idioma',
      selectLanguage: 'Elegir idioma',
      changeAppearance: 'Cambiar apariencia',
      export: 'Exportar',
      downloadData: 'Descarga tus datos',
      percentage: 'Porcentaje',
    },
    common: {
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      yes: 'Sí',
      no: 'No',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
    },
    newMe: {
      title: 'Belleza & Cuerpo',
      subtitle: 'Desafío Glow Up Belleza & Cuerpo – 30 días',
      mascot: 'Glowee 🦋',
      dailyTracking: 'Hoy',
      progress: 'Progreso',
      completed: 'completadas',
      todayFeeling: '¿Cómo te sientes hoy?',
      viewDetails: 'Ver detalles',
      habits: 'hábitos',
      habitDetails: 'Detalles del hábito',
      gloweeMessage: 'Mensaje de Glowee',
      finalMessage: 'En 30 días, no cambias quién eres. Te conviertes en quien estabas destinada a ser. 🦋',
      day: 'Día',
      today: 'Hoy',
      progressOn30Days: 'Progreso',
      badges: 'Insignias',
      daysCompleted: 'días completados',
      helloReady: 'Hola, ¿lista para el día',
      dayProgress: 'Progreso del día',
      the13Pillars: 'Los 13 pilares',
      completedDay: '¡Día {day} completado!',
      completeThisDay: 'Completé este día',
      trackingShort: 'Seguir',
      progressShort: 'Progreso',
      badgeFirstDay: '🌱 Primer día',
      badgeFirstDayDesc: '¡Comenzaste tu viaje New Me!',
      badgeFirstWeek: '🌿 Primera semana',
      badgeFirstWeekDesc: '¡7 días de transformación!',
      badgePerfectDay: '✨ Día perfecto',
      badgePerfectDayDesc: '¡Todos los hábitos completados en un día!',
      badgeWaterMaster: '💧 Maestra del agua',
      badgeWaterMasterDesc: '7 días de 2L de agua completados',
      badgeWalkingStar: '🚶‍♀️ Estrella caminante',
      badgeWalkingStarDesc: '7 días de 30 min de caminata completados',
      badgeSkincareQueen: '👑 Reina del skincare',
      badgeSkincareQueenDesc: '7 días de skincare completados',
      badgeTwoWeeks: '🌸 Dos semanas',
      badgeTwoWeeksDesc: '¡14 días de transformación!',
      badgeComplete: '🦋 Transformación completa',
      badgeCompleteDesc: '¡30 días completados! ¡Brillaste!',
      encouragement1: 'Cada pequeño paso cuenta. ¡Estás en el camino correcto! 🦋',
      encouragement2: '¡Brillas más y más cada día! ✨',
      encouragement3: '¡Mira todo este progreso, eres increíble! 💜',
      encouragement4: '¡Continúa, la transformación está en marcha! 🌸',
    },
  },
};


