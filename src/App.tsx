/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  Flame,
  Leaf,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react';
import {
  CartItem,
  DishCategory,
  DishItem,
  HERO_IMAGE,
  MENU_ITEMS,
  SpeakeasyFridaySlot,
  formatCOP,
} from './data/menuData';
import {
  AboutUsSection,
  SpeakeasyBookingSection,
} from './components/Sections';
import {
  CartDrawer,
  SimulatedCheckoutModal,
} from './components/CheckoutFlow';
import { CoverageMapSection } from './components/CoverageMapSection';

const CATEGORIES: DishCategory[] = [
  'Todos',
  'Pacífico Ahumado',
  'Andes Curados',
  'De la Sabana',
  'Cajas Degustación',
  'Bebidas Artesanales',
];

export default function App() {
  const [selectedCategory, setSelectedCategory] =
    React.useState<DishCategory>('Todos');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [showFullMenu, setShowFullMenu] = React.useState<boolean>(true);
  const [activeDishModal, setActiveDishModal] =
    React.useState<DishItem | null>(null);
  const [cart, setCart] = React.useState<CartItem[]>([
    {
      dish: MENU_ITEMS[0], // Encocado de Camarón Versión Minimalista
      quantity: 1,
    },
    {
      dish: MENU_ITEMS[2], // Empanada Mini de Ajiaco Santafereño
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = React.useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState<boolean>(false);
  const [recentlyAddedId, setRecentlyAddedId] = React.useState<string | null>(
    null
  );
  const [mapsQuotaExceeded, setMapsQuotaExceeded] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () =>
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (dish: DishItem, notes?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          notes: notes || updated[existingIndex].notes,
        };
        return updated;
      }
      return [...prev, { dish, quantity: 1, notes }];
    });

    setRecentlyAddedId(dish.id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === dish.id ? null : prev));
    }, 1400);
  };

  const handleReserveSpeakeasySeat = (
    slot: SpeakeasyFridaySlot,
    guests: number,
    guestNotes: string
  ) => {
    const reservationDish: DishItem = {
      id: `reserva-${slot.id}`,
      name: `Reserva Comedor Secreto (${slot.dateLabel})`,
      regionTag: 'Viernes de Networking · Cocina Abierta (8-12 Personas)',
      category: 'Cajas Degustación',
      shortDescription: `Cupo en mesa compartida con líder dinámico. Tema: ${slot.conversationTopic}`,
      fullDescription: slot.conversationTopic,
      ingredients: [
        'Menú degustación de 6 bocados regionales en cocina abierta',
        '3 Bebidas artesanales hechas con ingredientes propios',
        'Dinámica guiada por líder de mesa',
      ],
      sensoryAttributes: ['Experiencia conectiva', 'Cocina abierta'],
      pairingNote: 'Maridaje completo incluido',
      zeroWasteNote: 'Reserva exacta sin desperdicio de alimentos.',
      portionSize: 'Experiencia Presencial Viernes (7:30 PM)',
      prepTimeMinutes: 180,
      priceCOP: slot.pricePerPersonCOP,
      featured: false,
      imageUrl: HERO_IMAGE,
      fallbackGradient: 'from-amber-950 via-stone-900 to-black',
    };

    setCart((prev) => {
      const existing = prev.find((i) => i.dish.id === reservationDish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish.id === reservationDish.id
            ? { ...i, quantity: i.quantity + guests, notes: guestNotes }
            : i
        );
      }
      return [
        ...prev,
        { dish: reservationDish, quantity: guests, notes: guestNotes },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.dish.id === dishId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (dishId: string) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const featuredDishes = MENU_ITEMS.filter(
    (item) => item.category !== 'Bebidas Artesanales'
  );
  const beverageItems = MENU_ITEMS.filter(
    (item) => item.category === 'Bebidas Artesanales'
  );

  const filteredDishes = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regionTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scrollToMenu = (category?: DishCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
    setShowFullMenu(true);
    const el = document.getElementById('menu-completo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0C] text-[#F5F2EB] flex flex-col">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#0F0E0C]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-2xl font-serif-display font-semibold tracking-widest text-[#F5F2EB] whitespace-nowrap"
          >
            BIJAO
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A8A29E]">
            <a
              href="#platos-destacados"
              className="hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Destacados
            </a>
            <a
              href="#menu-completo"
              className="hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Menú Degustación
            </a>
            <a
              href="#mapa-cobertura"
              className="hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Cobertura 3–5 km
            </a>
            <a
              href="#comedor-secreto"
              className="hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Comedor Secreto
            </a>
            <a
              href="#sobre-nosotros"
              className="hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Sobre Nosotros
            </a>
          </nav>

          {/* Zone 3: Primary action button (Cart / Checkout) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pedido en Línea</span>
              <span className="font-mono-tabular font-bold">
                ({totalCartItems})
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-14 lg:py-20 border-b border-white/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Copy */}
              <div className="lg:col-span-6 space-y-6">
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#D49A3D]">
                  <span>Cocina Oculta en Chapinero Zona G</span>
                  <span aria-hidden="true">·</span>
                  <span>Radio Express 3–5 km</span>
                  <span aria-hidden="true">·</span>
                  <span>Viernes de Comedor Secreto</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-serif-display font-semibold text-[#F5F2EB] leading-[1.08] text-balance">
                  Cocina Tradicional Colombiana en Bocados de Autor.
                </h1>

                <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed max-w-xl">
                  Porciones reducidas de alta precisión gastronómica con
                  ingredientes estrictamente seleccionados del Pacífico, los
                  Andes y la Sabana, acompañadas de bebidas artesanales y
                  filosofía de <strong className="text-[#F5F2EB] font-medium">Desperdicio 0</strong>.
                </p>

                {/* Primary CTA + Secondary link */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => scrollToMenu('Todos')}
                    className="px-6 py-3.5 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <span>Ver Menú Completo y Pedir</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#comedor-secreto"
                    className="px-5 py-3.5 rounded-lg border border-white/15 hover:border-white/35 text-[#F5F2EB] text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Reservar Viernes Secreto (8–12 Personas)
                  </a>
                </div>

                {/* Claim-to-proof adjacency metrics from the PDF */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-xl sm:text-2xl font-mono-tabular font-semibold text-[#F5F2EB]">
                      25–30 min
                    </div>
                    <p className="text-xs text-[#A8A29E] mt-0.5">
                      Entrega en oficinas y coworkings (Zona G · 3 a 5 km)
                    </p>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-mono-tabular font-semibold text-[#D49A3D]">
                      0% Merma
                    </div>
                    <p className="text-xs text-[#A8A29E] mt-0.5">
                      Aprovechamiento exacto en bocados y bebidas propias
                    </p>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-mono-tabular font-semibold text-[#F5F2EB]">
                      8 a 12 Cupos
                    </div>
                    <p className="text-xs text-[#A8A29E] mt-0.5">
                      Cada viernes en mesa de desconocidos con cocina abierta
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 16:9 Showcase Image */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-stone-900 aspect-video shadow-2xl">
                  <img
                    src={HERO_IMAGE}
                    alt="Menú degustación colombiano de autor: Pacífico ahumado, Andes curados y De la Sabana"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-[#D49A3D]">
                          Trilogía Insignia del Menú Degustación
                        </div>
                        <p className="text-sm sm:text-base font-serif-display text-[#F5F2EB]">
                          Encocado Minimalista · Ceviche de Trucha con
                          Chontaduro · Empanada Mini de Ajiaco
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleAddToCart(
                            MENU_ITEMS.find(
                              (i) =>
                                i.id === 'caja-degustacion-ejecutiva-individual'
                            ) || MENU_ITEMS[0]
                          )
                        }
                        className="px-3.5 py-2 rounded-lg bg-[#D49A3D] text-[#0F0E0C] text-xs font-semibold hover:bg-[#c2892f] transition-colors shrink-0 cursor-pointer"
                      >
                        Pedir Caja 4 Tiempos · {formatCOP(89000)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORÍAS DE COMIDA & PLATOS DESTACADOS */}
        <section
          id="platos-destacados"
          className="py-16 lg:py-20 border-b border-white/10 bg-[#12110E]"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
            {/* Categories overview cards */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs text-[#D49A3D] mb-1">
                    Regiones & Atributos Sensoriales
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif-display font-semibold text-[#F5F2EB]">
                    Categorías de Nuestra Cocina Oculta
                  </h2>
                </div>
                <p className="text-xs text-[#A8A29E] max-w-md">
                  Selecciona una región colombiana para filtrar el catálogo o
                  explora directamente nuestros tres bocados insignia.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    cat: 'Pacífico Ahumado' as DishCategory,
                    subtitle: 'Tumaco, Guapi & Bahía Solano',
                    desc: 'Cocos ahumados al carbón, camarón tigre, chillangua y pesca artesanal.',
                  },
                  {
                    cat: 'Andes Curados' as DishCategory,
                    subtitle: 'Páramos & Cauca',
                    desc: 'Trucha arcoíris curada, leche de tigre de chontaduro y tubérculos nativos.',
                  },
                  {
                    cat: 'De la Sabana' as DishCategory,
                    subtitle: 'Altiplano Cundiboyacense',
                    desc: 'Mini empanadas de ajiaco santafereño, guascas frescas y Queso Paipa D.O.',
                  },
                  {
                    cat: 'Cajas Degustación' as DishCategory,
                    subtitle: 'Oficina, Coworking & Hogar',
                    desc: 'Menús de 4 tiempos individuales o cajas para compartir con colegas.',
                  },
                  {
                    cat: 'Bebidas Artesanales' as DishCategory,
                    subtitle: 'Refrescantes & Maridaje',
                    desc: 'Soda de frutos rojos, limonada de coco cremosa, agua con hielo y Té Hatsu.',
                  },
                ].map((c, index) => (
                  <button
                    key={c.cat}
                    onClick={() => scrollToMenu(c.cat)}
                    className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      selectedCategory === c.cat
                        ? 'bg-[#221E19] border-[#D49A3D]'
                        : 'bg-[#171512] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="text-xs font-mono-tabular text-[#D49A3D] mb-1">
                      0{index + 1}. {c.subtitle}
                    </div>
                    <h3 className="text-lg font-serif-display font-semibold text-[#F5F2EB]">
                      {c.cat}
                    </h3>
                    <p className="text-xs text-[#A8A29E] mt-1.5 leading-relaxed">
                      {c.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Dishes Spotlight (The exact 3 examples from the PDF + Executive Box) */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D49A3D] mb-1">
                    <span>Selección de Autor</span>
                    <span aria-hidden="true">·</span>
                    <span>Alta Frecuencia (2 a 4 veces por semana)</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif-display font-semibold text-[#F5F2EB]">
                    Platos Destacados del Menú Degustación
                  </h3>
                </div>

                <button
                  onClick={() => scrollToMenu('Todos')}
                  className="text-xs font-semibold text-[#D49A3D] hover:underline underline-offset-4 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Explorar los {MENU_ITEMS.length} platos y bebidas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredDishes.map((dish) => {
                  const isAdded = recentlyAddedId === dish.id;
                  return (
                    <article
                      key={dish.id}
                      className="rounded-xl bg-[#181613] border border-white/10 overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                    >
                      <div>
                        <div
                          onClick={() => setActiveDishModal(dish)}
                          className={`relative aspect-4/3 bg-gradient-to-br ${dish.fallbackGradient} overflow-hidden cursor-pointer group`}
                        >
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#F5F2EB]">
                            <span>{dish.category}</span>
                            <span className="font-mono-tabular">
                              {dish.prepTimeMinutes} min
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2">
                          <div className="text-[11px] text-[#A8A29E]">
                            {dish.regionTag}
                          </div>
                          <h4
                            onClick={() => setActiveDishModal(dish)}
                            className="text-lg font-serif-display font-semibold text-[#F5F2EB] leading-snug hover:text-[#D49A3D] transition-colors cursor-pointer"
                          >
                            {dish.name}
                          </h4>
                          <p className="text-xs text-[#A8A29E] line-clamp-3 leading-relaxed">
                            {dish.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 space-y-3">
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-[#A8A29E]">
                              Valor Bocado
                            </div>
                            <div className="text-sm font-mono-tabular font-semibold text-[#F5F2EB]">
                              {formatCOP(dish.priceCOP)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveDishModal(dish)}
                              className="p-2 rounded-lg border border-white/10 text-[#A8A29E] hover:text-[#F5F2EB] hover:border-white/25 transition-colors cursor-pointer"
                              title="Ver ingredientes y aprovechamiento Desperdicio 0"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddToCart(dish)}
                              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-500 text-stone-950'
                                  : 'bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Añadido</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Agregar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Dedicated Beverages Row: Soda de Frutos Rojos, Limonada de Coco, Agua con Hielo, Té Hatsu */}
              <div className="pt-8 border-t border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#D49A3D] mb-1">
                      <span>Bebidas & Maridaje</span>
                      <span aria-hidden="true">·</span>
                      <span>Soda de Frutos Rojos · Limonada de Coco · Agua con Hielo · Té Hatsu</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif-display font-semibold text-[#F5F2EB]">
                      Bebidas para Acompañar tu Pedido
                    </h3>
                  </div>

                  <button
                    onClick={() => scrollToMenu('Bebidas Artesanales')}
                    className="text-xs font-semibold text-[#D49A3D] hover:underline underline-offset-4 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>Filtrar solo bebidas en el menú</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {beverageItems.map((drink) => {
                    const isAdded = recentlyAddedId === drink.id;
                    return (
                      <article
                        key={drink.id}
                        className="rounded-xl bg-[#181613] border border-white/10 overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
                      >
                        <div>
                          <div
                            onClick={() => setActiveDishModal(drink)}
                            className={`relative aspect-4/3 bg-gradient-to-br ${drink.fallbackGradient} overflow-hidden cursor-pointer group`}
                          >
                            <img
                              src={drink.imageUrl}
                              alt={drink.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-[#F5F2EB]">
                              <span>{drink.portionSize}</span>
                              <span className="font-mono-tabular text-[#D49A3D]">
                                Fría
                              </span>
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <div className="text-[11px] text-[#A8A29E]">
                              {drink.regionTag}
                            </div>
                            <h4
                              onClick={() => setActiveDishModal(drink)}
                              className="text-lg font-serif-display font-semibold text-[#F5F2EB] leading-snug hover:text-[#D49A3D] transition-colors cursor-pointer"
                            >
                              {drink.name}
                            </h4>
                            <p className="text-xs text-[#A8A29E] line-clamp-3 leading-relaxed">
                              {drink.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 pt-0 space-y-3">
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div>
                              <div className="text-[10px] text-[#A8A29E]">
                                Valor Bebida
                              </div>
                              <div className="text-sm font-mono-tabular font-semibold text-[#F5F2EB]">
                                {formatCOP(drink.priceCOP)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setActiveDishModal(drink)}
                                className="p-2 rounded-lg border border-white/10 text-[#A8A29E] hover:text-[#F5F2EB] hover:border-white/25 transition-colors cursor-pointer"
                                title="Ver detalle de la bebida"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleAddToCart(drink)}
                                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-500 text-stone-950'
                                    : 'bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C]'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Añadido</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Agregar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FULL ONLINE ORDERING MENU CATALOG */}
        <section id="menu-completo" className="py-16 lg:py-20 bg-[#0F0E0C]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#D49A3D]">
                  <span>Sistema de Pedidos en Línea</span>
                  <span aria-hidden="true">·</span>
                  <span>Lunes a Domingo 11:30 AM – 9:30 PM</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-serif-display font-semibold text-[#F5F2EB]">
                  Menú Completo & Bebidas de Autor
                </h2>
                <p className="text-sm text-[#A8A29E] max-w-2xl">
                  Pensado para quienes valoran su tiempo libre y desean comer
                  con calidad sin desplazarse de su oficina, coworking o
                  apartamento en Chapinero (Zona G y alrededores).
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar chontaduro, camarón, ajiaco..."
                  className="w-full bg-[#181613] border border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F5F2EB] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#D49A3D]"
                />
              </div>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#161412] border border-white/10 rounded-xl overflow-x-auto">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#D49A3D] text-[#0F0E0C] font-semibold'
                        : 'text-[#A8A29E] hover:text-[#F5F2EB]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* 3-Column Product Grid */}
            {filteredDishes.length === 0 ? (
              <div className="p-12 rounded-xl bg-[#161412] border border-white/10 text-center space-y-3">
                <p className="text-base text-[#F5F2EB]">
                  No encontramos bocados que coincidan con "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todos');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#D49A3D] text-[#0F0E0C] text-xs font-semibold cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDishes.map((dish) => {
                  const isAdded = recentlyAddedId === dish.id;
                  const inCartItem = cart.find((c) => c.dish.id === dish.id);

                  return (
                    <article
                      key={dish.id}
                      className="rounded-xl bg-[#161412] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all"
                    >
                      <div>
                        {/* 4:3 Image Container */}
                        <div
                          onClick={() => setActiveDishModal(dish)}
                          className={`relative aspect-4/3 bg-gradient-to-br ${dish.fallbackGradient} overflow-hidden cursor-pointer group`}
                        >
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#F5F2EB]">
                            <span>{dish.portionSize}</span>
                            <span className="font-mono-tabular text-[#D49A3D]">
                              {dish.prepTimeMinutes} min
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-[#A8A29E]">
                            <span>{dish.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{dish.sensoryAttributes[0]}</span>
                          </div>

                          <h3
                            onClick={() => setActiveDishModal(dish)}
                            className="text-xl font-serif-display font-semibold text-[#F5F2EB] hover:text-[#D49A3D] transition-colors cursor-pointer"
                          >
                            {dish.name}
                          </h3>

                          <p className="text-xs text-[#A8A29E] leading-relaxed">
                            {dish.shortDescription}
                          </p>

                          <div className="pt-2 text-[11px] text-[#A8A29E] border-t border-white/5">
                            <strong className="text-[#F5F2EB] font-medium">
                              Desperdicio 0:
                            </strong>{' '}
                            {dish.zeroWasteNote}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Action */}
                      <div className="px-6 pb-6 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-[#A8A29E]">
                            Precio de Autor
                          </div>
                          <div className="text-base font-mono-tabular font-semibold text-[#F5F2EB]">
                            {formatCOP(dish.priceCOP)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveDishModal(dish)}
                            className="px-3 py-2 rounded-lg border border-white/15 text-xs text-[#F5F2EB] hover:bg-white/5 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Ficha Sensorial
                          </button>

                          <button
                            onClick={() => handleAddToCart(dish)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-500 text-stone-950'
                                : 'bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C]'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>En tu bolsa</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>
                                  Añadir
                                  {inCartItem ? ` (${inCartItem.quantity})` : ''}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* MAPA DE COBERTURA 3-5 KM EN CHAPINERO ZONA G */}
        <CoverageMapSection
          onConfirmZoneForOrder={() => {
            setIsCartOpen(true);
          }}
        />

        {/* VIERNES DE COMEDOR SECRETO & NETWORKING */}
        <SpeakeasyBookingSection onReserveSeat={handleReserveSpeakeasySeat} />

        {/* SOBRE NOSOTROS (INSPIRACIÓN, FILOSOFÍA Y FUNDADORES) */}
        <AboutUsSection />
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="bg-[#0B0A09] border-t border-white/10 py-12 text-xs text-[#A8A29E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="text-xl font-serif-display font-semibold tracking-widest text-[#F5F2EB]">
              BIJAO
            </div>
            <p className="leading-relaxed">
              Cocina oculta de cocina tradicional colombiana en bocados pequeños
              como menú degustación y Comedor Secreto los viernes.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-[#F5F2EB]">
              Ubicación & Radio Express
            </div>
            <p>Chapinero Zona G, Bogotá D.C.</p>
            <p>Cobertura a domicilio de 3 a 5 km (Oficinas, Coworkings y Hogares)</p>
            <p>Lunes a Domingo: 11:30 AM – 9:30 PM</p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-[#F5F2EB]">
              Viernes de Comedor Secreto
            </div>
            <p>Reservas para grupos de 8 a 12 desconocidos</p>
            <p>Cocina abierta + Líder dinámico de mesa</p>
            <p>Viernes: 7:30 PM – 11:00 PM</p>
          </div>

          <div className="space-y-1.5">
            <div className="font-semibold text-[#F5F2EB]">
              Créditos & Fundadores
            </div>
            <p>Susan Roa · Juan Cardoso · Harold Ávila · Thomas Gomez</p>
            <p>Fundamentos de Mercadeo · Docente Andrea Villamizar</p>
            <p>Universidad ECCI</p>
          </div>
        </div>
      </footer>

      {/* DISH SENSORY DETAIL MODAL (Contiguous Purchase Module) */}
      {activeDishModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-3xl bg-[#161412] border border-white/15 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 relative aspect-4/3 md:aspect-auto bg-stone-900">
              <img
                src={activeDishModal.imageUrl}
                alt={activeDishModal.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#D49A3D]">
                    {activeDishModal.regionTag}
                  </span>
                  <button
                    onClick={() => setActiveDishModal(null)}
                    className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#F5F2EB] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-2xl font-serif-display font-semibold text-[#F5F2EB]">
                  {activeDishModal.name}
                </h3>

                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  {activeDishModal.fullDescription}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-semibold text-[#F5F2EB]">
                    Ingredientes Locales Seleccionados:
                  </div>
                  <ul className="text-xs text-[#A8A29E] space-y-1">
                    {activeDishModal.ingredients.map((ing) => (
                      <li key={ing}>· {ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-[#12100E] border border-white/10 text-xs text-[#A8A29E] space-y-1">
                  <div className="text-[#D49A3D] font-medium">
                    Aprovechamiento Exacto (Desperdicio 0) & Maridaje
                  </div>
                  <p>{activeDishModal.zeroWasteNote}</p>
                  <p className="text-[#F5F2EB] pt-1">
                    {activeDishModal.pairingNote}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#A8A29E]">
                    {activeDishModal.portionSize}
                  </div>
                  <div className="text-xl font-mono-tabular font-semibold text-[#D49A3D]">
                    {formatCOP(activeDishModal.priceCOP)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(activeDishModal);
                    setActiveDishModal(null);
                    setIsCartOpen(true);
                  }}
                  className="px-5 py-3 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir y Ver Carrito</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* SIMULATED CHECKOUT MODAL */}
      <SimulatedCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onClearCart={() => setCart([])}
      />
    </div>
  );
}

