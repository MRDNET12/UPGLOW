export interface NewMePillar {
  id: number;
  icon: string;
  title: string;
  shortDescription: string;
  detailedExplanation: string;
  benefits: string[];
  gloweeMessage?: string;
}

export const newMePillars: NewMePillar[] = [
  {
    id: 1,
    icon: '🚶‍♀️',
    title: 'Marcher 30 minutes par jour',
    shortDescription: 'Remplace les trajets en voiture/bus par la marche',
    detailedExplanation: 'Marche au moins 30 minutes par jour, donc s\'il y avait des déplacements que tu faisais en voiture ou en bus, eh ben remplace-les par de la marche plutôt. Vraiment, essaye de marcher le plus possible par jour, tu verras grave la différence au niveau de ton corps. Tu vas perdre du poids sans avoir besoin de faire de régime ou de sport particulier. La marche, c\'est la vie.',
    benefits: [
      'Ton corps s\'affine progressivement',
      'Tu perds du poids sans t\'en rendre compte',
      'Tes jambes deviennent plus légères',
      'Tu te sens mieux mentalement'
    ],
    gloweeMessage: 'Marche. Vraiment. Tu verras grave la différence.'
  },
  {
    id: 2,
    icon: '🌿',
    title: 'Glutamine le matin à jeun',
    shortDescription: 'Le meilleur complément pour la digestion',
    detailedExplanation: 'Commence à prendre de la glutamine le matin à jeun, si t\'as des problèmes de digestion, de ballonnement, etc. C\'est vraiment le meilleur complément, tu vas voir ton ventre qui va s\'aplatir et qui sera beaucoup moins ballonné.',
    benefits: [
      'Un ventre qui s\'aplatit visiblement',
      'Beaucoup moins de ballonnements',
      'Une sensation de ventre plus léger dès le matin'
    ],
    gloweeMessage: 'Tu vas voir ton ventre changer.'
  },
  {
    id: 3,
    icon: '📖',
    title: 'Lire du développement personnel',
    shortDescription: 'Un petit peu chaque jour',
    detailedExplanation: 'Prends un livre de développement personnel et commence à en lire un petit peu tous les jours. Tu verras, au bout d\'un mois, du coup, tu l\'auras totalement terminé et tu vas te sentir beaucoup mieux. T\'auras certainement appris des choses sur toi-même, c\'est vraiment très important. Parce que le but, c\'est de glouer de l\'extérieur, mais également de l\'intérieur.',
    benefits: [
      'Tu comprends mieux tes émotions',
      'Tu prends confiance',
      'Tu évolues mentalement'
    ],
    gloweeMessage: 'Le but, c\'est de glow de l\'extérieur, mais aussi de l\'intérieur.'
  },
  {
    id: 4,
    icon: '💧',
    title: 'Boire 2 litres d\'eau par jour',
    shortDescription: 'L\'hydratation pour une peau et cheveux parfaits',
    detailedExplanation: 'Bois tes deux litres d\'eau par jour. Je sais que tu le fais pas, et je le fais pas non plus, mais dès que je commence à boire beaucoup d\'eau, je le vois sur ma peau, sur mes cheveux, et je me sens beaucoup mieux, même pour la digestion. L\'eau agit directement sur la peau, les cheveux, la digestion et l\'énergie générale.',
    benefits: [
      'Une peau plus belle',
      'Des cheveux plus brillants',
      'Une meilleure digestion',
      'Un corps qui fonctionne mieux'
    ]
  },
  {
    id: 5,
    icon: '🧴',
    title: 'Brossage à sec avant la douche',
    shortDescription: 'Pour une peau douce et atténuer la cellulite',
    detailedExplanation: 'Fais du brossage à sec tous les jours avant d\'aller prendre ta douche. Je t\'assure que dans un mois, tu verras grave la différence, et surtout avant l\'été, je te promets que ça va t\'atténuer la cellulite et que ta peau sera beaucoup plus douce, beaucoup plus lisse, beaucoup plus lumineuse.',
    benefits: [
      'Cellulite atténuée',
      'Peau plus douce',
      'Peau plus lisse',
      'Peau plus lumineuse'
    ],
    gloweeMessage: 'Tu verras grave la différence.'
  },
  {
    id: 6,
    icon: '💆‍♀️',
    title: 'Masser son visage',
    shortDescription: 'Avec les mains ou le gua sha',
    detailedExplanation: 'Masse-toi le visage tous les jours, que ce soit avec tes mains ou avec un gua sha. Il y a plein de tutos sur les deux (sur tiktok), que ce soit avec les mains ou avec le gua sha, et tu verras vraiment la différence au bout d\'un mois. Ton visage aura vraiment changé si tu t\'y tiens. Ton visage va vraiment dégonfler, et il sera beaucoup plus défini.',
    benefits: [
      'Visage qui dégonfle',
      'Traits plus définis',
      'Visage transformé en un mois'
    ],
    gloweeMessage: 'Ton visage va vraiment changer si tu t\'y tiens.'
  },
  {
    id: 7,
    icon: '🏃‍♀️',
    title: 'Trouver un sport que tu aimes',
    shortDescription: '2 à 3 fois par semaine',
    detailedExplanation: 'Trouve un sport que tu aimes bien, et essaye d\'en pratiquer deux à trois fois par semaine. Pour commencer, tu vas grave voir les résultats, ça va être génial, tu vas te sentir trop bien pour cet été. Que ce soit de faire du pilates chez toi, que ce soit d\'aller courir, que ce soit d\'aller à la salle de sport, vraiment trouve ton truc et commence à le faire.',
    benefits: [
      'Corps plus ferme',
      'Sensation de bien-être',
      'Motivation pour l\'été'
    ]
  },
  {
    id: 8,
    icon: '🍳',
    title: 'Manger des protéines à chaque repas',
    shortDescription: 'Pour des muscles et un corps ferme',
    detailedExplanation: 'Mange des protéines à chaque repas, que ce soit pour le petit déjeuner, le déjeuner ou le dîner, vraiment tu verras, associé au sport, tu vas grave voir une différence sur ton corps, tes muscles ont vraiment besoin de protéines.',
    benefits: [
      'Les muscles en ont besoin',
      'Le corps se raffermit',
      'Meilleure récupération'
    ]
  },
  {
    id: 9,
    icon: '🧼',
    title: 'Routine skincare matin et soir',
    shortDescription: 'Pendant 30 jours',
    detailedExplanation: 'Fais ta routine skincare le matin et le soir pendant un mois, et je te promets, ma star, que tu vas grave voir des résultats sur ta peau. Tu vas avoir une belle peau pour cet été, et tu vas te sentir super bien dans ta peau.',
    benefits: [
      'Peau plus belle',
      'Peau plus nette',
      'Confiance en soi renforcée'
    ],
    gloweeMessage: 'Tu vas grave voir des résultats.'
  },
  {
    id: 10,
    icon: '👁️',
    title: 'Sérum pour la pousse des cils',
    shortDescription: 'Des cils naturels et longs',
    detailedExplanation: 'Utilise un sérum pour la pousse des cils, je te promets, ça a été la meilleure décision que j\'ai pu prendre. J\'ai des cils qui sont longs sans mascara, et franchement, ça fait toute la différence. Surtout pour l\'été, quand on se maquille pas parce qu\'on va se baigner, etc., si tu fais juste un rehaussement de cils avec les cils qui auront poussé, tu verras, ça va être magnifique. Avec le temps, les cils deviennent naturellement longs, même sans mascara.',
    benefits: [
      'Regard intense sans maquillage',
      'Parfait avec un rehaussement de cils',
      'Différence visible'
    ]
  },
  {
    id: 11,
    icon: '🌙',
    title: 'Coiffures protectrices la nuit',
    shortDescription: 'Pour des cheveux longs et soyeux',
    detailedExplanation: 'Fais des coiffures protectrices tous les soirs avant d\'aller te coucher, tu vas avoir des cheveux qui seront soyeux, qui vont grave plus vite pousser, parce qu\'ils vont moins se casser, et qui seront vraiment hyper doux et brillants.',
    benefits: [
      'Cheveux plus longs',
      'Cheveux plus doux',
      'Cheveux plus brillants'
    ]
  },
  {
    id: 12,
    icon: '🧴',
    title: 'Crème hydratante après la douche',
    shortDescription: 'Pour une peau uniforme et lumineuse',
    detailedExplanation: 'Mets de la crème hydratante sur tout ton corps juste après t\'être douché, tu verras, en plus, juste avant l\'été, ça va être génial, parce que ta peau sera beaucoup plus uniforme et sera beaucoup plus lumineuse. Avant l\'été, cela change tout : peau plus uniforme et peau plus lumineuse.',
    benefits: [
      'Peau plus uniforme',
      'Peau plus lumineuse',
      'Sensation de peau saine'
    ]
  },
  {
    id: 13,
    icon: '⏰',
    title: 'Se réveiller un peu plus tôt',
    shortDescription: 'Pour des journées plus équilibrées',
    detailedExplanation: 'Essaye de te réveiller un tout petit peu plus tôt que tu n\'as l\'habitude de le faire le matin, parce que ça va te permettre de faire les choses plus lentement, et ton taux de cortisol sera beaucoup moins élevé, donc tu vas le voir sur ton visage, sur ton corps. Le fais de faire les choses hyper hyper rapidement, ça augmente ton taux de cortisol, et en fait, t\'as l\'impression d\'avoir le visage plus gonflé, etc., c\'est vraiment mauvais.',
    benefits: [
      'Visage plus détendu',
      'Corps plus apaisé',
      'Journées plus équilibrées'
    ],
    gloweeMessage: 'La lenteur, c\'est du self-care.'
  }
];

export const newMeGloweeMessage = {
  final: 'En 30 jours, tu ne changes pas qui tu es. Tu redeviens qui tu étais censée être.',
  tagline: 'New Me n\'est pas une contrainte, c\'est un rituel d\'amour pour toi-même.'
};
