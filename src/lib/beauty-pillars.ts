export interface BeautyPillar {
  id: string;
  icon: string;
  title: {
    fr: string;
    en: string;
    es: string;
  };
  description: {
    fr: string;
    en: string;
    es: string;
  };
  type: 'mandatory' | 'choice';
}

export interface BeautyChoice {
  id: string;
  icon: string;
  title: {
    fr: string;
    en: string;
    es: string;
  };
  description?: {
    fr: string;
    en: string;
    es: string;
  };
  subtasks?: {
    id: string;
    title: {
      fr: string;
      en: string;
      es: string;
    };
  }[];
}

export const beautyPillars: BeautyPillar[] = [
  {
    id: 'walk-sport',
    icon: '🚶‍♀️',
    title: {
      fr: 'Marcher 30 min OU sport',
      en: 'Walk 30 min OR sport',
      es: 'Caminar 30 min O deporte'
    },
    description: {
      fr: '🪢 Corde à sauter OU 🚶‍♀️ Marche rapide pour des résultat visible en 30 jours',
      en: '🪢 Jump rope OR 🚶‍♀️ Brisk walk for visible results in 30 days',
      es: '🪢 Saltar la cuerda O 🚶‍♀️ Caminata rápida para resultados visibles en 30 días'
    },
    type: 'mandatory'
  },
  {
    id: 'water',
    icon: '💧',
    title: {
      fr: 'Boire 2 litres d\'eau par jour',
      en: 'Drink 2 liters of water per day',
      es: 'Beber 2 litros de agua al día'
    },
    description: {
      fr: 'L\'hydratation pour une peau et cheveux parfaits',
      en: 'Hydration for perfect skin and hair',
      es: 'Hidratación para una piel y cabello perfectos'
    },
    type: 'mandatory'
  },
  {
    id: 'self-care-choice',
    icon: '🧠',
    title: {
      fr: '1 geste pour toi',
      en: '1 gesture for you',
      es: '1 gesto para ti'
    },
    description: {
      fr: 'AU CHOIX',
      en: 'YOUR CHOICE',
      es: 'A ELEGIR'
    },
    type: 'choice'
  }
];

export const beautyChoices: BeautyChoice[] = [
  {
    id: 'face-massage',
    icon: '💆‍♀️',
    title: {
      fr: 'Massage visage',
      en: 'Face massage',
      es: 'Masaje facial'
    }
  },
  {
    id: 'skincare',
    icon: '🧼',
    title: {
      fr: 'Skincare',
      en: 'Skincare',
      es: 'Cuidado de la piel'
    }
  },
  {
    id: 'dry-brushing',
    icon: '🧽',
    title: {
      fr: 'Brossage à sec',
      en: 'Dry brushing',
      es: 'Cepillado en seco'
    }
  },
  {
    id: 'body-cream',
    icon: '🧴',
    title: {
      fr: 'Crème corps',
      en: 'Body cream',
      es: 'Crema corporal'
    }
  },
  {
    id: 'lashes-hair',
    icon: '✨',
    title: {
      fr: 'Cils / cheveux',
      en: 'Lashes / hair',
      es: 'Pestañas / cabello'
    },
    subtasks: [
      {
        id: 'lash-serum',
        title: {
          fr: 'Sérum cils',
          en: 'Lash serum',
          es: 'Sérum de pestañas'
        }
      },
      {
        id: 'protective-hairstyle',
        title: {
          fr: 'Coiffures protectrices la nuit',
          en: 'Protective hairstyles at night',
          es: 'Peinados protectores por la noche'
        }
      }
    ]
  }
];

export const gloweeMessages = {
  fr: [
    "Quel est le meilleur petit geste pour toi aujourd'hui ?",
    "Qu'est-ce que tu as l'énergie de faire aujourd'hui ?",
    "Quel geste te rapproche de la version glow de toi aujourd'hui ?",
    "Avec l'énergie que tu as aujourd'hui, que choisis-tu ?"
  ],
  en: [
    "What's the best little gesture for you today?",
    "What do you have the energy to do today?",
    "What gesture brings you closer to your glow version today?",
    "With the energy you have today, what do you choose?"
  ],
  es: [
    "¿Cuál es el mejor pequeño gesto para ti hoy?",
    "¿Qué tienes energía para hacer hoy?",
    "¿Qué gesto te acerca a tu versión glow hoy?",
    "Con la energía que tienes hoy, ¿qué eliges?"
  ]
};

