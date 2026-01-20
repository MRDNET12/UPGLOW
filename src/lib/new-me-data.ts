export interface NewMePillar {
  id: number;
  icon: string;
  title: {
    fr: string;
    en: string;
    es: string;
  };
  shortDescription: {
    fr: string;
    en: string;
    es: string;
  };
  detailedExplanation: {
    fr: string;
    en: string;
    es: string;
  };
  benefits: {
    fr: string[];
    en: string[];
    es: string[];
  };
  gloweeMessage?: {
    fr: string;
    en: string;
    es: string;
  };
}

export const newMePillars: NewMePillar[] = [
  {
    id: 1,
    icon: '🚶‍♀️',
    title: {
      fr: 'Marcher 30 minutes par jour',
      en: 'Walk 30 minutes a day',
      es: 'Caminar 30 minutos al día'
    },
    shortDescription: {
      fr: 'Remplace les trajets en voiture/bus par la marche',
      en: 'Replace car/bus trips with walking',
      es: 'Reemplaza los viajes en coche/autobús por caminar'
    },
    detailedExplanation: {
      fr: "Marche au moins 30 minutes par jour, donc s'il y avait des déplacements que tu faisais en voiture ou en bus, eh ben remplace-les par de la marche plutôt. Vraiment, essaye de marcher le plus possible par jour, tu verras grave la différence au niveau de ton corps. Tu vas perdre du poids sans avoir besoin de faire de régime ou de sport particulier. La marche, c'est la vie.",
      en: "Walk at least 30 minutes a day, so if there were trips you used to do by car or bus, replace them with walking instead. Really, try to walk as much as possible per day, you'll see a huge difference in your body. You'll lose weight without needing to diet or do any particular sport. Walking is life.",
      es: "Camina al menos 30 minutos al día, así que si había desplazamientos que hacías en coche o autobús, reemplázalos por caminar. De verdad, intenta caminar lo más posible al día, verás una gran diferencia en tu cuerpo. Perderás peso sin necesidad de hacer dieta o deporte en particular. Caminar es vida."
    },
    benefits: {
      fr: [
        "Ton corps s'affine progressivement",
        "Tu perds du poids sans t'en rendre compte",
        'Tes jambes deviennent plus légères',
        'Tu te sens mieux mentalement'
      ],
      en: [
        'Your body gradually gets slimmer',
        'You lose weight without realizing it',
        'Your legs become lighter',
        'You feel better mentally'
      ],
      es: [
        'Tu cuerpo se afina progresivamente',
        'Pierdes peso sin darte cuenta',
        'Tus piernas se vuelven más ligeras',
        'Te sientes mejor mentalmente'
      ]
    },
    gloweeMessage: {
      fr: "Marche. Vraiment. Tu verras grave la différence.",
      en: "Walk. Really. You'll see a huge difference.",
      es: "Camina. De verdad. Verás una gran diferencia."
    }
  },
  {
    id: 2,
    icon: '🌿',
    title: {
      fr: 'Glutamine le matin à jeun',
      en: 'Glutamine in the morning on an empty stomach',
      es: 'Glutamina por la mañana en ayunas'
    },
    shortDescription: {
      fr: 'Le meilleur complément pour la digestion',
      en: 'The best supplement for digestion',
      es: 'El mejor suplemento para la digestión'
    },
    detailedExplanation: {
      fr: "Commence à prendre de la glutamine le matin à jeun, si t'as des problèmes de digestion, de ballonnement, etc. C'est vraiment le meilleur complément, tu vas voir ton ventre qui va s'aplatir et qui sera beaucoup moins ballonné.",
      en: "Start taking glutamine in the morning on an empty stomach, if you have digestion problems, bloating, etc. It's really the best supplement, you'll see your belly flatten and be much less bloated.",
      es: "Comienza a tomar glutamina por la mañana en ayunas, si tienes problemas de digestión, hinchazón, etc. Es realmente el mejor suplemento, verás cómo tu vientre se aplana y estará mucho menos hinchado."
    },
    benefits: {
      fr: [
        "Un ventre qui s'aplatit visiblement",
        'Beaucoup moins de ballonnements',
        'Une sensation de ventre plus léger dès le matin'
      ],
      en: [
        'A visibly flatter belly',
        'Much less bloating',
        'A lighter belly feeling from the morning'
      ],
      es: [
        'Un vientre visiblemente más plano',
        'Mucha menos hinchazón',
        'Una sensación de vientre más ligero desde la mañana'
      ]
    },
    gloweeMessage: {
      fr: "Tu vas voir ton ventre changer.",
      en: "You'll see your belly change.",
      es: "Verás cómo cambia tu vientre."
    }
  },
  {
    id: 3,
    icon: '📖',
    title: {
      fr: 'Lire du développement personnel',
      en: 'Read personal development books',
      es: 'Leer libros de desarrollo personal'
    },
    shortDescription: {
      fr: 'Un petit peu chaque jour',
      en: 'A little bit every day',
      es: 'Un poco cada día'
    },
    detailedExplanation: {
      fr: "Prends un livre de développement personnel et commence à en lire un petit peu tous les jours. Tu verras, au bout d'un mois, du coup, tu l'auras totalement terminé et tu vas te sentir beaucoup mieux. T'auras certainement appris des choses sur toi-même, c'est vraiment très important. Parce que le but, c'est de glouer de l'extérieur, mais également de l'intérieur.",
      en: "Take a personal development book and start reading a little bit every day. You'll see, after a month, you'll have completely finished it and you'll feel much better. You'll have certainly learned things about yourself, it's really very important. Because the goal is to glow from the outside, but also from the inside.",
      es: "Toma un libro de desarrollo personal y comienza a leer un poco cada día. Verás, después de un mes, lo habrás terminado completamente y te sentirás mucho mejor. Seguramente habrás aprendido cosas sobre ti misma, es realmente muy importante. Porque el objetivo es brillar desde afuera, pero también desde adentro."
    },
    benefits: {
      fr: [
        'Tu comprends mieux tes émotions',
        'Tu prends confiance',
        'Tu évolues mentalement'
      ],
      en: [
        'You understand your emotions better',
        'You gain confidence',
        'You evolve mentally'
      ],
      es: [
        'Comprendes mejor tus emociones',
        'Ganas confianza',
        'Evolucionas mentalmente'
      ]
    },
    gloweeMessage: {
      fr: "Le but, c'est de glow de l'extérieur, mais aussi de l'intérieur.",
      en: "The goal is to glow from the outside, but also from the inside.",
      es: "El objetivo es brillar desde afuera, pero también desde adentro."
    }
  },
  {
    id: 4,
    icon: '💧',
    title: {
      fr: "Boire 2 litres d'eau par jour",
      en: 'Drink 2 liters of water a day',
      es: 'Beber 2 litros de agua al día'
    },
    shortDescription: {
      fr: "L'hydratation pour une peau et cheveux parfaits",
      en: 'Hydration for perfect skin and hair',
      es: 'Hidratación para una piel y cabello perfectos'
    },
    detailedExplanation: {
      fr: 'Bois tes deux litres d\'eau par jour. Je sais que tu le fais pas, et je le fais pas non plus, mais dès que je commence à boire beaucoup d\'eau, je le vois sur ma peau, sur mes cheveux, et je me sens beaucoup mieux, même pour la digestion. L\'eau agit directement sur la peau, les cheveux, la digestion et l\'énergie générale.',
      en: 'Drink your two liters of water a day. I know you don\'t do it, and I don\'t either, but as soon as I start drinking a lot of water, I see it on my skin, on my hair, and I feel much better, even for digestion. Water acts directly on the skin, hair, digestion and general energy.',
      es: 'Bebe tus dos litros de agua al día. Sé que no lo haces, y yo tampoco, pero en cuanto empiezo a beber mucha agua, lo veo en mi piel, en mi cabello, y me siento mucho mejor, incluso para la digestión. El agua actúa directamente sobre la piel, el cabello, la digestión y la energía general.'
    },
    benefits: {
      fr: [
        'Une peau plus belle',
        'Des cheveux plus brillants',
        'Une meilleure digestion',
        'Un corps qui fonctionne mieux'
      ],
      en: [
        'More beautiful skin',
        'Shinier hair',
        'Better digestion',
        'A body that works better'
      ],
      es: [
        'Una piel más bella',
        'Cabello más brillante',
        'Mejor digestión',
        'Un cuerpo que funciona mejor'
      ]
    }
  },
  {
    id: 5,
    icon: '🧴',
    title: {
      fr: 'Brossage à sec avant la douche',
      en: 'Dry brushing before shower',
      es: 'Cepillado en seco antes de la ducha'
    },
    shortDescription: {
      fr: 'Pour une peau douce et atténuer la cellulite',
      en: 'For soft skin and reduced cellulite',
      es: 'Para una piel suave y reducir la celulitis'
    },
    detailedExplanation: {
      fr: "Fais du brossage à sec tous les jours avant d'aller prendre ta douche. Je t'assure que dans un mois, tu verras grave la différence, et surtout avant l'été, je te promets que ça va t'atténuer la cellulite et que ta peau sera beaucoup plus douce, beaucoup plus lisse, beaucoup plus lumineuse.",
      en: "Do dry brushing every day before taking your shower. I assure you that in a month, you'll see a huge difference, and especially before summer, I promise it will reduce your cellulite and your skin will be much softer, much smoother, much more luminous.",
      es: "Haz cepillado en seco todos los días antes de ducharte. Te aseguro que en un mes, verás una gran diferencia, y especialmente antes del verano, te prometo que reducirá tu celulitis y tu piel será mucho más suave, mucho más lisa, mucho más luminosa."
    },
    benefits: {
      fr: [
        'Cellulite atténuée',
        'Peau plus douce',
        'Peau plus lisse',
        'Peau plus lumineuse'
      ],
      en: [
        'Reduced cellulite',
        'Softer skin',
        'Smoother skin',
        'More luminous skin'
      ],
      es: [
        'Celulitis reducida',
        'Piel más suave',
        'Piel más lisa',
        'Piel más luminosa'
      ]
    },
    gloweeMessage: {
      fr: "Tu verras grave la différence.",
      en: "You'll see a huge difference.",
      es: "Verás una gran diferencia."
    }
  },
  {
    id: 6,
    icon: '💆‍♀️',
    title: {
      fr: 'Masser son visage',
      en: 'Massage your face',
      es: 'Masajear tu rostro'
    },
    shortDescription: {
      fr: 'Avec les mains ou le gua sha',
      en: 'With hands or gua sha',
      es: 'Con las manos o gua sha'
    },
    detailedExplanation: {
      fr: "Masse-toi le visage tous les jours, que ce soit avec tes mains ou avec un gua sha. Il y a plein de tutos sur les deux (sur tiktok), que ce soit avec les mains ou avec le gua sha, et tu verras vraiment la différence au bout d'un mois. Ton visage aura vraiment changé si tu t'y tiens. Ton visage va vraiment dégonfler, et il sera beaucoup plus défini.",
      en: "Massage your face every day, whether with your hands or with a gua sha. There are plenty of tutorials on both (on tiktok), whether with hands or with gua sha, and you'll really see the difference after a month. Your face will have really changed if you stick to it. Your face will really de-puff, and it will be much more defined.",
      es: "Masajea tu rostro todos los días, ya sea con tus manos o con un gua sha. Hay muchos tutoriales sobre ambos (en tiktok), ya sea con las manos o con gua sha, y realmente verás la diferencia después de un mes. Tu rostro habrá cambiado realmente si te mantienes constante. Tu rostro se deshinchará realmente, y estará mucho más definido."
    },
    benefits: {
      fr: [
        'Visage qui dégonfle',
        'Traits plus définis',
        'Visage transformé en un mois'
      ],
      en: [
        'Face de-puffs',
        'More defined features',
        'Face transformed in a month'
      ],
      es: [
        'Rostro que se desinflama',
        'Rasgos más definidos',
        'Rostro transformado en un mes'
      ]
    },
    gloweeMessage: {
      fr: "Ton visage va vraiment changer si tu t'y tiens.",
      en: "Your face will really change if you stick to it.",
      es: "Tu rostro realmente cambiará si te mantienes constante."
    }
  },
  {
    id: 7,
    icon: '🏃‍♀️',
    title: {
      fr: 'Trouver un sport que tu aimes',
      en: 'Find a sport you love',
      es: 'Encuentra un deporte que ames'
    },
    shortDescription: {
      fr: '2 à 3 fois par semaine',
      en: '2 to 3 times a week',
      es: '2 a 3 veces por semana'
    },
    detailedExplanation: {
      fr: "Trouve un sport que tu aimes bien, et essaye d'en pratiquer deux à trois fois par semaine. Pour commencer, tu vas grave voir les résultats, ça va être génial, tu vas te sentir trop bien pour cet été. Que ce soit de faire du pilates chez toi, que ce soit d'aller courir, que ce soit d'aller à la salle de sport, vraiment trouve ton truc et commence à le faire.",
      en: "Find a sport you like, and try to practice it two to three times a week. To start, you'll really see the results, it's going to be great, you'll feel so good for this summer. Whether it's doing pilates at home, going for a run, or going to the gym, really find your thing and start doing it.",
      es: "Encuentra un deporte que te guste, e intenta practicarlo dos o tres veces por semana. Para empezar, realmente verás los resultados, va a ser genial, te sentirás muy bien para este verano. Ya sea hacer pilates en casa, salir a correr o ir al gimnasio, realmente encuentra lo tuyo y comienza a hacerlo."
    },
    benefits: {
      fr: [
        'Corps plus ferme',
        'Sensation de bien-être',
        "Motivation pour l'été"
      ],
      en: [
        'Firmer body',
        'Feeling of well-being',
        'Motivation for summer'
      ],
      es: [
        'Cuerpo más firme',
        'Sensación de bienestar',
        'Motivación para el verano'
      ]
    }
  },
  {
    id: 8,
    icon: '🍳',
    title: {
      fr: 'Manger des protéines à chaque repas',
      en: 'Eat protein at every meal',
      es: 'Comer proteínas en cada comida'
    },
    shortDescription: {
      fr: 'Pour des muscles et un corps ferme',
      en: 'For muscles and a firm body',
      es: 'Para músculos y un cuerpo firme'
    },
    detailedExplanation: {
      fr: 'Mange des protéines à chaque repas, que ce soit pour le petit déjeuner, le déjeuner ou le dîner, vraiment tu verras, associé au sport, tu vas grave voir une différence sur ton corps, tes muscles ont vraiment besoin de protéines.',
      en: 'Eat protein at every meal, whether for breakfast, lunch or dinner, really you\'ll see, combined with sport, you\'ll really see a difference on your body, your muscles really need protein.',
      es: 'Come proteínas en cada comida, ya sea para el desayuno, almuerzo o cena, realmente verás, combinado con el deporte, realmente verás una diferencia en tu cuerpo, tus músculos realmente necesitan proteínas.'
    },
    benefits: {
      fr: [
        'Les muscles en ont besoin',
        'Le corps se raffermit',
        'Meilleure récupération'
      ],
      en: [
        'Muscles need it',
        'Body firms up',
        'Better recovery'
      ],
      es: [
        'Los músculos lo necesitan',
        'El cuerpo se reafirma',
        'Mejor recuperación'
      ]
    }
  },
  {
    id: 9,
    icon: '🧼',
    title: {
      fr: 'Routine skincare matin et soir',
      en: 'Skincare routine morning and night',
      es: 'Rutina de cuidado de la piel mañana y noche'
    },
    shortDescription: {
      fr: 'Pendant 30 jours',
      en: 'For 30 days',
      es: 'Durante 30 días'
    },
    detailedExplanation: {
      fr: "Fais ta routine skincare le matin et le soir pendant un mois, et je te promets, ma star, que tu vas grave voir des résultats sur ta peau. Tu vas avoir une belle peau pour cet été, et tu vas te sentir super bien dans ta peau.",
      en: "Do your skincare routine in the morning and evening for a month, and I promise you, my star, that you'll really see results on your skin. You'll have beautiful skin for this summer, and you'll feel super good in your skin.",
      es: "Haz tu rutina de cuidado de la piel por la mañana y por la noche durante un mes, y te prometo, mi estrella, que realmente verás resultados en tu piel. Tendrás una piel hermosa para este verano, y te sentirás súper bien en tu piel."
    },
    benefits: {
      fr: [
        'Peau plus belle',
        'Peau plus nette',
        'Confiance en soi renforcée'
      ],
      en: [
        'More beautiful skin',
        'Clearer skin',
        'Reinforced self-confidence'
      ],
      es: [
        'Piel más bella',
        'Piel más clara',
        'Confianza en sí misma reforzada'
      ]
    },
    gloweeMessage: {
      fr: "Tu vas grave voir des résultats.",
      en: "You'll really see results.",
      es: "Realmente verás resultados."
    }
  },
  {
    id: 10,
    icon: '👁️',
    title: {
      fr: 'Sérum pour la pousse des cils',
      en: 'Eyelash growth serum',
      es: 'Sérum para el crecimiento de pestañas'
    },
    shortDescription: {
      fr: 'Des cils naturels et longs',
      en: 'Natural and long lashes',
      es: 'Pestañas naturales y largas'
    },
    detailedExplanation: {
      fr: "Utilise un sérum pour la pousse des cils, je te promets, ça a été la meilleure décision que j'ai pu prendre. J'ai des cils qui sont longs sans mascara, et franchement, ça fait toute la différence. Surtout pour l'été, quand on se maquille pas parce qu'on va se baigner, etc., si tu fais juste un rehaussement de cils avec les cils qui auront poussé, tu verras, ça va être magnifique. Avec le temps, les cils deviennent naturellement longs, même sans mascara.",
      en: "Use an eyelash growth serum, I promise you, it was the best decision I could make. I have lashes that are long without mascara, and honestly, it makes all the difference. Especially for summer, when we don't wear makeup because we're going swimming, etc., if you just do a lash lift with the lashes that have grown, you'll see, it's going to be beautiful. Over time, lashes become naturally long, even without mascara.",
      es: "Usa un sérum para el crecimiento de pestañas, te lo prometo, fue la mejor decisión que pude tomar. Tengo pestañas que son largas sin rímel, y francamente, hace toda la diferencia. Especialmente para el verano, cuando no nos maquillamos porque vamos a nadar, etc., si solo haces un lifting de pestañas con las pestañas que han crecido, verás, va a ser hermoso. Con el tiempo, las pestañas se vuelven naturalmente largas, incluso sin rímel."
    },
    benefits: {
      fr: [
        'Regard intense sans maquillage',
        'Parfait avec un rehaussement de cils',
        'Différence visible'
      ],
      en: [
        'Intense look without makeup',
        'Perfect with a lash lift',
        'Visible difference'
      ],
      es: [
        'Mirada intensa sin maquillaje',
        'Perfecto con un lifting de pestañas',
        'Diferencia visible'
      ]
    }
  },
  {
    id: 11,
    icon: '🌙',
    title: {
      fr: 'Coiffures protectrices la nuit',
      en: 'Protective hairstyles at night',
      es: 'Peinados protectores por la noche'
    },
    shortDescription: {
      fr: 'Pour des cheveux longs et soyeux',
      en: 'For long and silky hair',
      es: 'Para cabello largo y sedoso'
    },
    detailedExplanation: {
      fr: "Fais des coiffures protectrices tous les soirs avant d'aller te coucher, tu vas avoir des cheveux qui seront soyeux, qui vont grave plus vite pousser, parce qu'ils vont moins se casser, et qui seront vraiment hyper doux et brillants.",
      en: "Do protective hairstyles every night before going to bed, you'll have hair that will be silky, that will grow much faster, because it will break less, and that will be really super soft and shiny.",
      es: "Haz peinados protectores todas las noches antes de acostarte, tendrás cabello que será sedoso, que crecerá mucho más rápido, porque se romperá menos, y que será realmente súper suave y brillante."
    },
    benefits: {
      fr: [
        'Cheveux plus longs',
        'Cheveux plus doux',
        'Cheveux plus brillants'
      ],
      en: [
        'Longer hair',
        'Softer hair',
        'Shinier hair'
      ],
      es: [
        'Cabello más largo',
        'Cabello más suave',
        'Cabello más brillante'
      ]
    }
  },
  {
    id: 12,
    icon: '🧴',
    title: {
      fr: 'Crème hydratante après la douche',
      en: 'Moisturizer after shower',
      es: 'Crema hidratante después de la ducha'
    },
    shortDescription: {
      fr: 'Pour une peau uniforme et lumineuse',
      en: 'For even and luminous skin',
      es: 'Para una piel uniforme y luminosa'
    },
    detailedExplanation: {
      fr: "Mets de la crème hydratante sur tout ton corps juste après t'être douché, tu verras, en plus, juste avant l'été, ça va être génial, parce que ta peau sera beaucoup plus uniforme et sera beaucoup plus lumineuse. Avant l'été, cela change tout : peau plus uniforme et peau plus lumineuse.",
      en: "Put moisturizer all over your body right after showering, you'll see, plus, just before summer, it's going to be great, because your skin will be much more even and much more luminous. Before summer, it changes everything: more even skin and more luminous skin.",
      es: "Pon crema hidratante en todo tu cuerpo justo después de ducharte, verás, además, justo antes del verano, va a ser genial, porque tu piel estará mucho más uniforme y mucho más luminosa. Antes del verano, lo cambia todo: piel más uniforme y piel más luminosa."
    },
    benefits: {
      fr: [
        'Peau plus uniforme',
        'Peau plus lumineuse',
        'Sensation de peau saine'
      ],
      en: [
        'More even skin',
        'More luminous skin',
        'Feeling of healthy skin'
      ],
      es: [
        'Piel más uniforme',
        'Piel más luminosa',
        'Sensación de piel sana'
      ]
    }
  },
  {
    id: 13,
    icon: '⏰',
    title: {
      fr: 'Se réveiller un peu plus tôt',
      en: 'Wake up a little earlier',
      es: 'Despertarse un poco más temprano'
    },
    shortDescription: {
      fr: 'Pour des journées plus équilibrées',
      en: 'For more balanced days',
      es: 'Para días más equilibrados'
    },
    detailedExplanation: {
      fr: "Essaye de te réveiller un tout petit peu plus tôt que tu n'as l'habitude de le faire le matin, parce que ça va te permettre de faire les choses plus lentement, et ton taux de cortisol sera beaucoup moins élevé, donc tu vas le voir sur ton visage, sur ton corps. Le fais de faire les choses hyper hyper rapidement, ça augmente ton taux de cortisol, et en fait, t'as l'impression d'avoir le visage plus gonflé, etc., c'est vraiment mauvais.",
      en: "Try to wake up a little bit earlier than you usually do in the morning, because it will allow you to do things more slowly, and your cortisol level will be much lower, so you'll see it on your face, on your body. Doing things super super quickly increases your cortisol level, and actually, you feel like your face is more puffy, etc., it's really bad.",
      es: "Intenta despertarte un poco más temprano de lo que sueles hacer por la mañana, porque te permitirá hacer las cosas más lentamente, y tu nivel de cortisol será mucho más bajo, así que lo verás en tu rostro, en tu cuerpo. Hacer las cosas súper súper rápido aumenta tu nivel de cortisol, y en realidad, sientes que tu rostro está más hinchado, etc., es realmente malo."
    },
    benefits: {
      fr: [
        'Visage plus détendu',
        'Corps plus apaisé',
        'Journées plus équilibrées'
      ],
      en: [
        'More relaxed face',
        'More soothed body',
        'More balanced days'
      ],
      es: [
        'Rostro más relajado',
        'Cuerpo más calmado',
        'Días más equilibrados'
      ]
    },
    gloweeMessage: {
      fr: "La lenteur, c'est du self-care.",
      en: "Slowness is self-care.",
      es: "La lentitud es autocuidado."
    }
  }
];

// Piliers spéciaux pour les jours 1 et 2 (avec lien vers objectifs)
export const specialNewMePillars: { [key: number]: NewMePillar } = {
  1: {
    id: 14,
    icon: '🎯',
    title: {
      fr: 'Créer ton premier objectif',
      en: 'Create your first goal',
      es: 'Crea tu primer objetivo'
    },
    shortDescription: {
      fr: 'OBJECTIF_LINK_DAY1',
      en: 'OBJECTIF_LINK_DAY1',
      es: 'OBJECTIF_LINK_DAY1'
    },
    detailedExplanation: {
      fr: 'OBJECTIF_LINK_DAY1',
      en: 'OBJECTIF_LINK_DAY1',
      es: 'OBJECTIF_LINK_DAY1'
    },
    benefits: {
      fr: [],
      en: [],
      es: []
    }
  },
  2: {
    id: 14,
    icon: '🎯',
    title: {
      fr: 'Avancer dans ton objectif',
      en: 'Progress on your goal',
      es: 'Avanza en tu objetivo'
    },
    shortDescription: {
      fr: 'OBJECTIF_LINK_DAY2',
      en: 'OBJECTIF_LINK_DAY2',
      es: 'OBJECTIF_LINK_DAY2'
    },
    detailedExplanation: {
      fr: 'OBJECTIF_LINK_DAY2',
      en: 'OBJECTIF_LINK_DAY2',
      es: 'OBJECTIF_LINK_DAY2'
    },
    benefits: {
      fr: [],
      en: [],
      es: []
    }
  }
};

export const newMeGloweeMessage = {
  final: {
    fr: 'En 30 jours, tu ne changes pas qui tu es. Tu redeviens qui tu étais censée être.',
    en: 'In 30 days, you don\'t change who you are. You become who you were meant to be.',
    es: 'En 30 días, no cambias quién eres. Te conviertes en quien estabas destinada a ser.'
  },
  tagline: {
    fr: 'New Me n\'est pas une contrainte, c\'est un rituel d\'amour pour toi-même.',
    en: 'New Me is not a constraint, it\'s a ritual of love for yourself.',
    es: 'New Me no es una restricción, es un ritual de amor para ti misma.'
  }
};
