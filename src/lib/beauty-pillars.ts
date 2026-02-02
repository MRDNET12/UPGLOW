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
  detailedExplanation?: {
    fr: string;
    en: string;
    es: string;
  };
  promisedResults?: {
    fr: string[];
    en: string[];
    es: string[];
  };
  gloweeMessage?: {
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
      fr: 'Corde à sauter ou marche rapide pour des résultat visible en 30 jours',
      en: 'Jump rope or brisk walk for visible results in 30 days',
      es: 'Saltar la cuerda o caminata rápida para resultados visibles en 30 días'
    },
    type: 'mandatory'
  },
  {
    id: 'face-massage',
    icon: '💆‍♀️',
    title: {
      fr: 'Massage visage',
      en: 'Face massage',
      es: 'Masaje facial'
    },
    description: {
      fr: 'Stimule la circulation sanguine et donne bonne mine',
      en: 'Stimulates blood circulation and gives a healthy glow',
      es: 'Estimula la circulación sanguínea y da buena cara'
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
    },
    detailedExplanation: {
      fr: "Fais-toi un massage facial tous les jours pendant un mois, et je te promets, ma star, que tu vas grave voir des résultats sur ta peau. Tu vas avoir une belle peau pour cet été, et tu vas te sentir super bien dans ta peau.",
      en: "Give yourself a facial massage every day for a month, and I promise you, my star, that you'll seriously see results on your skin. You'll have beautiful skin for this summer, and you'll feel great in your skin.",
      es: "Hazte un masaje facial todos los días durante un mes, y te prometo, mi estrella, que verás resultados serios en tu piel. Tendrás una piel hermosa para este verano, y te sentirás muy bien en tu piel."
    },
    promisedResults: {
      fr: ["Peau plus belle", "Peau plus nette", "Confiance en soi renforcée"],
      en: ["More beautiful skin", "Clearer skin", "Boosted self-confidence"],
      es: ["Piel más bella", "Piel más limpia", "Autoestima reforzada"]
    },
    gloweeMessage: {
      fr: "Tu vas grave voir des résultats.",
      en: "You're going to seriously see results.",
      es: "Vas a ver resultados serios."
    }
  },
  {
    id: 'skincare',
    icon: '🧼',
    title: {
      fr: 'Skincare',
      en: 'Skincare',
      es: 'Cuidado de la piel'
    },
    detailedExplanation: {
      fr: "Fais ta routine skincare le matin et le soir pendant un mois, et je te promets, ma star, que tu vas grave voir des résultats sur ta peau. Tu vas avoir une belle peau pour cet été, et tu vas te sentir super bien dans ta peau.",
      en: "Do your skincare routine morning and evening for a month, and I promise you, my star, that you'll seriously see results on your skin. You'll have beautiful skin for this summer, and you'll feel great in your skin.",
      es: "Haz tu rutina de cuidado de la piel por la mañana y por la noche durante un mes, y te prometo, mi estrella, que verás resultados serios en tu piel. Tendrás una piel hermosa para este verano, y te sentirás muy bien en tu piel."
    },
    promisedResults: {
      fr: ["Peau plus belle", "Peau plus nette", "Confiance en soi renforcée"],
      en: ["More beautiful skin", "Clearer skin", "Boosted self-confidence"],
      es: ["Piel más bella", "Piel más limpia", "Autoestima reforzada"]
    },
    gloweeMessage: {
      fr: "Tu vas grave voir des résultats.",
      en: "You're going to seriously see results.",
      es: "Vas a ver resultados serios."
    }
  },
  {
    id: 'dry-brushing',
    icon: '🧽',
    title: {
      fr: 'Brossage à sec',
      en: 'Dry brushing',
      es: 'Cepillado en seco'
    },
    detailedExplanation: {
      fr: "Fais du brossage à sec tous les jours pendant un mois, et je te promets, ma star, que tu vas grave voir des résultats sur ta peau. Tu vas avoir une peau plus lisse, et tu vas te sentir super bien dans ta peau.",
      en: "Do dry brushing every day for a month, and I promise you, my star, that you'll seriously see results on your skin. You'll have smoother skin, and you'll feel great in your skin.",
      es: "Haz cepillado en seco todos los días durante un mes, y te prometo, mi estrella, que verás resultados serios en tu piel. Tendrás una piel más suave, y te sentirás muy bien en tu piel."
    },
    promisedResults: {
      fr: ["Peau plus lisse", "Meilleure circulation", "Confiance en soi renforcée"],
      en: ["Smoother skin", "Better circulation", "Boosted self-confidence"],
      es: ["Piel más suave", "Mejor circulación", "Autoestima reforzada"]
    },
    gloweeMessage: {
      fr: "Tu vas grave voir des résultats.",
      en: "You're going to seriously see results.",
      es: "Vas a ver resultados serios."
    }
  },
  {
    id: 'body-cream',
    icon: '🧴',
    title: {
      fr: 'Crème corps',
      en: 'Body cream',
      es: 'Crema corporal'
    },
    detailedExplanation: {
      fr: "Mets de la crème corps tous les jours pendant un mois, et je te promets, ma star, que tu vas grave voir des résultats sur ta peau. Tu vas avoir une peau plus douce, et tu vas te sentir super bien dans ta peau.",
      en: "Apply body cream every day for a month, and I promise you, my star, that you'll seriously see results on your skin. You'll have softer skin, and you'll feel great in your skin.",
      es: "Aplica crema corporal todos los días durante un mes, y te prometo, mi estrella, que verás resultados serios en tu piel. Tendrás una piel más suave, y te sentirás muy bien en tu piel."
    },
    promisedResults: {
      fr: ["Peau plus douce", "Peau hydratée", "Confiance en soi renforcée"],
      en: ["Softer skin", "Hydrated skin", "Boosted self-confidence"],
      es: ["Piel más suave", "Piel hidratada", "Autoestima reforzada"]
    },
    gloweeMessage: {
      fr: "Tu vas grave voir des résultats.",
      en: "You're going to seriously see results.",
      es: "Vas a ver resultados serios."
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
    detailedExplanation: {
      fr: "Utilise un sérum pour la pousse des cils ou prends soin de tes cheveux avec des coiffures protectrices, je te promets, ça a été la meilleure décision que j'ai pu prendre. J'ai des cils qui sont longs sans mascara, et franchement, ça fait toute la différence. Surtout pour l'été, quand on se maquille pas parce qu'on va se baigner, etc., si tu fais juste un rehaussement de cils avec les cils qui auront poussé, tu verras, ça va être magnifique.",
      en: "Use a lash growth serum or take care of your hair with protective hairstyles, I promise you, it's been the best decision I could make. I have lashes that are long without mascara, and honestly, it makes all the difference. Especially for summer, when we don't wear makeup because we're going swimming, etc., if you just do a lash lift with grown lashes, you'll see, it's going to be beautiful.",
      es: "Usa un sérum para el crecimiento de las pestañas o cuida tu cabello con peinados protectores, te lo prometo, ha sido la mejor decisión que he podido tomar. Tengo pestañas que son largas sin máscara, y honestamente, marca toda la diferencia. Especialmente para el verano, cuando no usamos maquillaje porque vamos a nadar, etc., si solo haces un lifting de pestañas con pestañas crecidas, verás, va a ser hermoso."
    },
    promisedResults: {
      fr: ["Cils naturellement longs", "Cheveux protégés", "Regard intense sans maquillage"],
      en: ["Naturally long lashes", "Protected hair", "Intense look without makeup"],
      es: ["Pestañas naturalmente largas", "Cabello protegido", "Mirada intensa sin maquillaje"]
    },
    gloweeMessage: {
      fr: "Tu vas grave voir des résultats.",
      en: "You're going to seriously see results.",
      es: "Vas a ver resultados serios."
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

