export type DishCategory =
  | 'Todos'
  | 'Pacífico Ahumado'
  | 'Andes Curados'
  | 'De la Sabana'
  | 'Cajas Degustación'
  | 'Bebidas Artesanales';

export interface DishItem {
  id: string;
  name: string;
  regionTag: string;
  category: Exclude<DishCategory, 'Todos'>;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  sensoryAttributes: string[];
  pairingNote: string;
  zeroWasteNote: string;
  portionSize: string;
  prepTimeMinutes: number;
  priceCOP: number;
  featured: boolean;
  imageUrl: string;
  fallbackGradient: string;
}

export interface CartItem {
  dish: DishItem;
  quantity: number;
  notes?: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  signatureContribution: string;
}

export interface SpeakeasyFridaySlot {
  id: string;
  dateLabel: string;
  timeRange: string;
  conversationTopic: string;
  tableLeader: string;
  totalSeats: number;
  bookedSeats: number;
  pricePerPersonCOP: number;
}

export const HERO_IMAGE =
  '/src/assets/images/hero_colombian_tasting_menu_1791342984459.jpg';
export const SPEAKEASY_IMAGE =
  '/src/assets/images/speakeasy_secret_dinner_1791343021051.jpg';

export const MENU_ITEMS: DishItem[] = [
  {
    id: 'pacifico-encocado-minimalista',
    name: 'Encocado de Camarón Versión Minimalista',
    regionTag: 'Pacífico Ahumado · Tumaco & Guapi',
    category: 'Pacífico Ahumado',
    shortDescription:
      'Camarón tigre del Pacífico sellado al carbón de coco, reducción aterciopelada de leche de coco ahumada, achiote y chillangua.',
    fullDescription:
      'Inspirado en los fogones de leña del litoral Pacífico. Seleccionamos camarón tigre de pesca responsable, curado brevemente en sal marina y limón mandarino, bañado en una emulsión concentrada de primera leche de coco ahumada al carbón con hierbas de azotea (chillangua y chirarán) y crocante de plátano hartón.',
    ingredients: [
      'Camarón tigre del Pacífico',
      'Leche de coco ahumada en frío',
      'Aceite de achiote artesanal',
      'Chillangua y chirarán frescos',
      'Hilos de plátano verde crocante',
    ],
    sensoryAttributes: ['Ahumado profundo', 'Cremoso', 'Herbal cítrico'],
    pairingNote: 'Ideal con nuestro Elixir Botánico de Chontaduro & Limoncillo.',
    zeroWasteNote:
      'Las carcasas del camarón se deshidratan y tuestan para elaborar la sal de coral que corona el bocado, logrando 0% desperdicio.',
    portionSize: 'Bocado degustación (130 g · 3 piezas de autor)',
    prepTimeMinutes: 18,
    priceCOP: 38000,
    featured: true,
    imageUrl: '/src/assets/images/dish_pacifico_encocado_1791342993644.jpg',
    fallbackGradient: 'from-amber-950/80 via-stone-900 to-neutral-950',
  },
  {
    id: 'andes-ceviche-trucha-chontaduro',
    name: 'Ceviche de Trucha Curada con Chontaduro',
    regionTag: 'Andes Curados · Cordillera & Cauca',
    category: 'Andes Curados',
    shortDescription:
      'Trucha arcoíris de páramo curada en cítricos andinos, leche de tigre cremosa de chontaduro fermentado, maíz cancha y oxalis.',
    fullDescription:
      'Un encuentro entre los ríos fríos de los Andes y el fruto emblema del piedemonte. La trucha arcoíris se cura en sal de Zipaquirá y cítricos locales para lograr una textura sedosa, servida sobre una emulsión vibrante de chontaduro cocido lentamente con jengibre, ají dulce y maíz tostado.',
    ingredients: [
      'Trucha arcoíris de laguna de alta montaña',
      'Leche de tigre de chontaduro y miel de caña',
      'Maíz chulpi tostado al bronce',
      'Ají dulce amazónico',
      'Brotes de cilantro y acedera morada',
    ],
    sensoryAttributes: ['Acidez brillante', 'Terroso dulce', 'Textura sedosa'],
    pairingNote: 'Acompaña con Elixir Botánico de Chontaduro & Limoncillo.',
    zeroWasteNote:
      'La piel de la trucha se sufríe hasta quedar crujiente y las cáscaras de chontaduro se infusionan en el aceite aromático del plato.',
    portionSize: 'Bocado degustación (140 g)',
    prepTimeMinutes: 15,
    priceCOP: 36000,
    featured: true,
    imageUrl: '/src/assets/images/dish_andes_ceviche_1791343002816.jpg',
    fallbackGradient: 'from-orange-950/80 via-stone-900 to-neutral-950',
  },
  {
    id: 'sabana-empanada-mini-ajiaco',
    name: 'Empanada Mini de Ajiaco Santafereño',
    regionTag: 'De la Sabana · Altiplano Cundiboyacense',
    category: 'De la Sabana',
    shortDescription:
      'Trío de empanadas de maíz criollo rellenas de confit de pollo campesino y tres papas nativas, con emulsión de guascas y polvo de alcaparras.',
    fullDescription:
      'El clásico santafereño reinterpretado en un bocado limpio y preciso para comer en la oficina o en casa sin perder su complejidad. Masa ultra delgada de maíz amarillo molido en piedra, rellena de reducción espesa de papa criolla, pastusa y sabanera con pollo desmechado en su propio fondo, coronada con gel de crema agria, emulsión de guascas frescas y polvo de alcaparras deshidratadas.',
    ingredients: [
      'Masa de maíz criollo nixtamalizado',
      'Papas criolla, pastusa y sabanera',
      'Pollo campesino braseado a baja temperatura',
      'Emulsión tibia de guascas de huerta',
      'Polvo de alcaparras y crema de leche de cabra',
    ],
    sensoryAttributes: ['Crujiente exterior', 'Cremoso interior', 'Herbal mentolado'],
    pairingNote: 'Marida con nuestro Elixir Botánico de ingredientes propios.',
    zeroWasteNote:
      'Las cáscaras de las tres papas se hornean y muelen para integrarse en la corteza de maíz, potenciando el sabor tostado.',
    portionSize: 'Trío de bocados (150 g · 3 unidades)',
    prepTimeMinutes: 16,
    priceCOP: 29000,
    featured: true,
    imageUrl: '/src/assets/images/dish_sabana_empanadas_1791343012064.jpg',
    fallbackGradient: 'from-yellow-950/80 via-stone-900 to-neutral-950',
  },
  {
    id: 'caja-degustacion-ejecutiva-individual',
    name: 'Caja Degustación "Travesía por Regiones" (4 Tiempos)',
    regionTag: 'Menú de Autor Completo · Individual o Compartir',
    category: 'Cajas Degustación',
    shortDescription:
      'La experiencia completa: Encocado Minimalista + Ceviche de Trucha con Chontaduro + Mini Empanadas de Ajiaco + Bebida Artesanal.',
    fullDescription:
      'Diseñada específicamente para profesionales y ejecutivos en Chapinero y Zona G que desean almorzar o cenar alta cocina colombiana sin esfuerzo ni demoras. Empaque térmico biodegradable compartimentado que preserva las temperaturas exactas de cada región.',
    ingredients: [
      '1x Pacífico Ahumado: Encocado de camarón minimalista',
      '1x Andes Curados: Ceviche de trucha con chontaduro',
      '1x De la Sabana: Trío de empanadas mini de ajiaco santafereño',
      '1x Bebida artesanal a base de ingredientes propios',
    ],
    sensoryAttributes: ['Recorrido sensorial completo', 'Listo en mesa en 30 seg', 'Empaque cero plástico'],
    pairingNote: 'Incluye 1 bebida artesanal de autor maridada con los 3 bocados salados.',
    zeroWasteNote:
      'Porciones calibradas al gramo bajo nuestra metodología de Desperdicio 0 y empaque 100% compostable de bagazo de caña.',
    portionSize: 'Menú completo 4 tiempos (420 g + Bebida 280 ml)',
    prepTimeMinutes: 20,
    priceCOP: 89000,
    featured: true,
    imageUrl: '/src/assets/images/hero_colombian_tasting_menu_1791342984459.jpg',
    fallbackGradient: 'from-amber-900/50 via-stone-900 to-neutral-950',
  },
  {
    id: 'bebida-soda-frutos-rojos',
    name: 'Soda de Frutos Rojos',
    regionTag: 'Bebida Artesanal · Frutos Andinos',
    category: 'Bebidas Artesanales',
    shortDescription:
      'Soda burbujeante con reducción artesanal de mora silvestre, agraz y fresa de la sabana, hierbabuena fresca y hielo cristalino.',
    fullDescription:
      'Elaborada en nuestra cocina oculta a partir de una reducción natural de mora de Castilla, agraz de páramo y fresas locales con baja adición de azúcar, servida sobre hielo y agua finamente gasificada para realzar los sabores salinos y ahumados del menú.',
    ingredients: [
      'Mora silvestre y agraz de la cordillera',
      'Fresas frescas maceradas',
      'Agua manantial gasificada',
      'Brotes de hierbabuena fresca y hielo',
    ],
    sensoryAttributes: ['Burbujeante', 'Frutal ácido', 'Refrescante'],
    pairingNote: 'Marida idealmente con las Empanadas Mini de Ajiaco y el Ceviche de Trucha.',
    zeroWasteNote:
      'La pulpa remanente de los frutos rojos se deshidrata para crear cristales aromáticos que decoran el borde de la bebida.',
    portionSize: 'Vaso / Envase sellado (350 ml)',
    prepTimeMinutes: 5,
    priceCOP: 14000,
    featured: true,
    imageUrl: '/src/assets/images/drink_soda_frutos_rojos_1791344413927.jpg',
    fallbackGradient: 'from-rose-950/80 via-stone-900 to-neutral-950',
  },
  {
    id: 'bebida-limonada-de-coco',
    name: 'Limonada de Coco',
    regionTag: 'Bebida Artesanal · Litoral & Tradición',
    category: 'Bebidas Artesanales',
    shortDescription:
      'Leche fresca de coco recién prensada en cocina con zumo de limón mandarino y Tahití, batida con hielo frappé.',
    fullDescription:
      'Aprovechando los cocos abiertos diariamente para nuestra partida de Pacífico Ahumado, preparamos una limonada de coco sedosa, equilibrada en dulzor y con acidez brillante de limón recién exprimido al momento del pedido.',
    ingredients: [
      'Primera leche y crema de coco natural',
      'Zumo de limón Tahití y limón mandarino',
      'Toque de ralladura de lima y panela orgánica clara',
      'Hielo frappé',
    ],
    sensoryAttributes: ['Cremosa', 'Cítrica', 'Tropical'],
    pairingNote: 'El acompañante clásico e infalible del Encocado de Camarón Versión Minimalista.',
    zeroWasteNote:
      'Aprovechamiento 100% integral del coco compartido con la línea de salsas del Pacífico.',
    portionSize: 'Vaso / Envase sellado (350 ml)',
    prepTimeMinutes: 5,
    priceCOP: 15000,
    featured: true,
    imageUrl: '/src/assets/images/drink_limonada_coco_1791344423986.jpg',
    fallbackGradient: 'from-amber-950/70 via-stone-900 to-neutral-950',
  },
  {
    id: 'bebida-agua-con-hielo',
    name: 'Agua con Hielo',
    regionTag: 'Hidratación Pura · Limpieza de Paladar',
    category: 'Bebidas Artesanales',
    shortDescription:
      'Agua filtrada de manantial acompañada de cubos de hielo cristalino, ideal para limpiar el paladar entre cada bocado de autor.',
    fullDescription:
      'Para quienes prefieren apreciar cada matiz sensorial del menú degustación sin interferencias. Servida bien fría con hielo cristalino y una sutil rodaja opcional de limón.',
    ingredients: [
      'Agua purificada de manantial',
      'Cubos de hielo cristalino',
      'Rodaja opcional de limón fresco',
    ],
    sensoryAttributes: ['Pura', 'Helada', 'Neutra'],
    pairingNote: 'Perfecta para alternar entre los 4 tiempos de la Caja Degustación.',
    zeroWasteNote:
      'Entregada en envase 100% reciclable y compostable.',
    portionSize: 'Vaso / Botella con hielo (350 ml)',
    prepTimeMinutes: 2,
    priceCOP: 6000,
    featured: true,
    imageUrl: '/src/assets/images/drink_agua_con_hielo_1791344433570.jpg',
    fallbackGradient: 'from-sky-950/60 via-stone-900 to-neutral-950',
  },
  {
    id: 'bebida-te-hatsu',
    name: 'Té Hatsu (Con Hielo)',
    regionTag: 'Selección de Té · Favorito de Oficina',
    category: 'Bebidas Artesanales',
    shortDescription:
      'Té Hatsu frío acompañado de vaso con hielo. Disponible en sus variedades insignia (Blanco & Mangostino, Rosas, Lila o Negro).',
    fullDescription:
      'Una de las bebidas predilectas de nuestros clientes ejecutivos en las oficinas y coworkings de Chapinero Zona G. Se envía bien frío junto con vaso de hielo listo para servir en el escritorio o en casa.',
    ingredients: [
      'Botella de Té Hatsu 400 ml (Sabor a elección en notas)',
      'Vaso térmico con hielo cristalino',
    ],
    sensoryAttributes: ['Aromático', 'Floral frutal', 'Ligero'],
    pairingNote: 'Práctico y refrescante para acompañar almuerzos ejecutivos de lunes a domingo.',
    zeroWasteNote:
      'Botella de vidrio 100% reutilizable y reciclable.',
    portionSize: 'Botella (400 ml) + Vaso con hielo',
    prepTimeMinutes: 2,
    priceCOP: 11000,
    featured: true,
    imageUrl: '/src/assets/images/drink_te_hatsu_1791344445857.jpg',
    fallbackGradient: 'from-purple-950/70 via-stone-900 to-neutral-950',
  },
];

export const FOUNDERS: FounderProfile[] = [
  {
    name: 'Susan Roa',
    role: 'Co-Fundadora & Directora Culinaria de Regiones',
    specialty: 'Investigación de Ingredientes Locales & Menú Degustación',
    bio: 'Lidera la curaduría estricta de productores locales desde el litoral Pacífico hasta el altiplano cundiboyacense. Su obsesión es traducir guisos y preparaciones tradicionales colombianas en bocados pequeños de alta precisión sensorial.',
    signatureContribution: 'Creadora del Encocado de Camarón versión minimalista y del estándar de selección regional.',
  },
  {
    name: 'Juan Cardoso',
    role: 'Co-Fundador & Chef de Salsas, Fermentos y Desperdicio Cero',
    specialty: 'Ingeniería de Producto & Bebidas Artesanales',
    bio: 'Arquitecto del sistema de aprovechamiento exacto del ingrediente (Desperdicio 0). Diseña las bebidas artesanales elaboradas a partir de los mismos ingredientes propios de cada plato del menú degustación.',
    signatureContribution: 'Desarrollo de la línea de elixires botánicos y control de porciones de exactitud milimétrica.',
  },
  {
    name: 'Harold Ávila',
    role: 'Co-Fundador & Director de Operaciones Dark Kitchen (Zona G)',
    specialty: 'Logística Express 3-5 km & Experiencia Día a Día',
    bio: 'Especialista en eficiencia operativa de cocinas ocultas en Bogotá. Diseñó el flujo de despacho para que los profesionales y ejecutivos de Chapinero reciban comida de autor de dos a cuatro veces por semana con calidad intacta.',
    signatureContribution: 'Optimización del radio de entrega de 3 a 5 km y empaques térmicos para oficinas y coworkings.',
  },
  {
    name: 'Thomas Gomez',
    role: 'Co-Fundador & Anfitrión del Comedor Secreto (Viernes)',
    specialty: 'Diseño de Experiencias, Networking & Líder de Mesa',
    bio: 'Curador de las noches clandestinas de los viernes. Coordina la experiencia de cocina abierta y guía la conversación entre los 8 a 12 desconocidos que se sientan a la mesa para combatir la rutina urbana y tejer nuevas alianzas.',
    signatureContribution: 'Metodología de conversación con Líder Dinámico de Mesa y posicionamiento voz a voz.',
  },
];

export const SPEAKEASY_FRIDAY_SLOTS: SpeakeasyFridaySlot[] = [
  {
    id: 'viernes-prox-1',
    dateLabel: 'Próximo Viernes · 19:30 h',
    timeRange: '7:30 PM – 11:00 PM',
    conversationTopic: 'Creatividad urbana, gastronomía con identidad y proyectos emergentes en Bogotá',
    tableLeader: 'Thomas Gomez & Susan Roa (En cocina abierta)',
    totalSeats: 10,
    bookedSeats: 7,
    pricePerPersonCOP: 145000,
  },
  {
    id: 'viernes-prox-2',
    dateLabel: 'Viernes Siguiente · 19:30 h',
    timeRange: '7:30 PM – 11:00 PM',
    conversationTopic: 'Viajes, diseño sostenible y conexiones multiculturales en la ciudad',
    tableLeader: 'Thomas Gomez & Juan Cardoso (En cocina abierta)',
    totalSeats: 12,
    bookedSeats: 5,
    pricePerPersonCOP: 145000,
  },
  {
    id: 'viernes-prox-3',
    dateLabel: 'Último Viernes del Mes · 20:00 h',
    timeRange: '8:00 PM – 11:30 PM',
    conversationTopic: 'Innovación, emprendimiento independiente y el futuro del buen comer',
    tableLeader: 'Equipo Fundador Completo (Edición Especial Mensual)',
    totalSeats: 10,
    bookedSeats: 4,
    pricePerPersonCOP: 145000,
  },
];

export const DELIVERY_ZONES_CHAPINERO = [
  'Chapinero Alto & Zona G (55 a 72)',
  'Rosales & Emaús (Radio 3 km)',
  'Quinta Camacho & Financiero Calle 72',
  'Chicó Norte & Parque de la 93 (Radio 5 km)',
  'Chapinero Central & Coworkings Cra 7 - Cra 15',
];

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}
