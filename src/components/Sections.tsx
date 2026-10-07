import React from 'react';
import {
  Clock,
  Flame,
  Leaf,
  MapPin,
  Plus,
  ShoppingBag,
  Sparkles,
  Users,
  Utensils,
} from 'lucide-react';
import {
  DishCategory,
  DishItem,
  FOUNDERS,
  HERO_IMAGE,
  MENU_ITEMS,
  SPEAKEASY_FRIDAY_SLOTS,
  SPEAKEASY_IMAGE,
  SpeakeasyFridaySlot,
  formatCOP,
} from '../data/menuData';

interface SpeakeasyBookingSectionProps {
  onReserveSeat: (slot: SpeakeasyFridaySlot, guests: number, guestNotes: string) => void;
}

export const SpeakeasyBookingSection: React.FC<SpeakeasyBookingSectionProps> = ({
  onReserveSeat,
}) => {
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>(
    SPEAKEASY_FRIDAY_SLOTS[0].id
  );
  const [guestsCount, setGuestsCount] = React.useState<number>(1);
  const [profileTag, setProfileTag] = React.useState<string>(
    'Creativo / Emprendedor'
  );
  const [reservationConfirmed, setReservationConfirmed] = React.useState(false);

  const activeSlot =
    SPEAKEASY_FRIDAY_SLOTS.find((s) => s.id === selectedSlotId) ||
    SPEAKEASY_FRIDAY_SLOTS[0];
  const remainingSeats = activeSlot.totalSeats - activeSlot.bookedSeats;

  const handleAddReservationToOrder = (e: React.FormEvent) => {
    e.preventDefault();
    onReserveSeat(activeSlot, guestsCount, `Perfil: ${profileTag}`);
    setReservationConfirmed(true);
    setTimeout(() => setReservationConfirmed(false), 3500);
  };

  return (
    <section
      id="comedor-secreto"
      className="py-20 border-t border-white/10 bg-[#141210]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left column: Narrative & Open Kitchen Experience */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-wider text-[#D49A3D]">
              <span>Experiencia Exclusiva de Viernes</span>
              <span aria-hidden="true">·</span>
              <span>8 a 12 Desconocidos</span>
              <span aria-hidden="true">·</span>
              <span>Cocina Abierta</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif-display font-semibold text-[#F5F2EB] leading-tight text-balance">
              Viernes de Comedor Secreto & Networking Gastronómico
            </h2>

            <p className="text-[#A8A29E] text-base leading-relaxed max-w-2xl">
              Mientras de lunes a domingo operamos como cocina oculta express en
              Chapinero Zona G, cada viernes abrimos las puertas de nuestro
              taller culinario para una única mesa de{' '}
              <strong className="text-[#F5F2EB] font-medium">
                8 a 12 personas desconocidas entre sí
              </strong>
              . Diseñado para mentes curiosas, creativos, emprendedores y
              viajeros como <em>Santiago</em> que buscan salir de la rutina y
              generar conexiones reales.
            </p>

            {/* Relative image container with contrast scrim */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-stone-900 aspect-video">
              <img
                src={SPEAKEASY_IMAGE}
                alt="Mesa comunal del Comedor Secreto los viernes frente a la cocina abierta"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6">
                <div className="text-xs text-[#D49A3D] mb-1">
                  Dos pilares de cada viernes en Chapinero Zona G
                </div>
                <p className="text-sm sm:text-base text-[#F5F2EB] font-medium max-w-xl">
                  “Busco vivir algo distinto, conocer gente nueva y salir de mi
                  rutina frente a una cocina abierta donde cada bocado cuenta
                  una historia de Colombia.”
                </p>
              </div>
            </div>

            {/* 2 Core Elements from the document */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-xl bg-[#1A1815] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-tabular text-[#D49A3D]">
                    01. Cocina Abierta en Vivo
                  </span>
                  <Flame className="w-4 h-4 text-[#D49A3D]" />
                </div>
                <h3 className="text-lg font-serif-display font-semibold text-[#F5F2EB] mb-1">
                  Desarrollo de Preparaciones
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed">
                  Observa de cerca el manejo técnico del producto local, el
                  ahumado al carbón de coco, los curados andinos y nuestra
                  filosofía de Desperdicio 0 directamente con los chefs.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#1A1815] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-tabular text-[#D49A3D]">
                    02. Líder Dinámico de Mesa
                  </span>
                  <Users className="w-4 h-4 text-[#D49A3D]" />
                </div>
                <h3 className="text-lg font-serif-display font-semibold text-[#F5F2EB] mb-1">
                  Conversación Curada & Alianzas
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed">
                  Un anfitrión guía la velada alrededor de un tema específico,
                  rompiendo el hielo entre desconocidos para propiciar nuevas
                  amistades, networking y relaciones públicas.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Interactive Friday Seat Reservation */}
          <div className="lg:col-span-5 bg-[#1A1815] border border-white/10 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs text-[#D49A3D] mb-1">
                Cupos Limitados · Frecuencia Mensual Recomendada
              </div>
              <h3 className="text-2xl font-serif-display font-semibold text-[#F5F2EB]">
                Reserva tu Silla del Viernes
              </h3>
              <p className="text-xs text-[#A8A29E] mt-1">
                Incluye Menú Degustación de 6 Bocados Regionales + 3 Bebidas
                Artesanales de Autor + Dinámica de Mesa.
              </p>
            </div>

            <form onSubmit={handleAddReservationToOrder} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#A8A29E] mb-2">
                  1. Selecciona la Fecha del Viernes
                </label>
                <div className="space-y-2.5">
                  {SPEAKEASY_FRIDAY_SLOTS.map((slot) => {
                    const isSelected = slot.id === selectedSlotId;
                    const available = slot.totalSeats - slot.bookedSeats;
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => {
                          setSelectedSlotId(slot.id);
                          if (guestsCount > available) {
                            setGuestsCount(Math.max(1, available));
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                            : 'bg-[#12110F] border-white/10 text-[#A8A29E] hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#F5F2EB]">
                            {slot.dateLabel}
                          </span>
                          <span className="text-xs font-mono-tabular text-[#D49A3D]">
                            {available} de {slot.totalSeats} cupos libres
                          </span>
                        </div>
                        <p className="text-xs text-[#A8A29E] mt-1 line-clamp-2">
                          Tema: {slot.conversationTopic}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A8A29E] mb-1.5">
                    2. Comensales (Máx {remainingSeats})
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-[#12110F] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D] tabular-nums"
                  >
                    {[1, 2, 3, 4]
                      .filter((n) => n <= remainingSeats)
                      .map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Comensal (Individual)' : 'Comensales'}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A8A29E] mb-1.5">
                    3. Tu Perfil en la Mesa
                  </label>
                  <select
                    value={profileTag}
                    onChange={(e) => setProfileTag(e.target.value)}
                    className="w-full bg-[#12110F] border border-white/15 rounded-lg px-3 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D]"
                  >
                    <option value="Creativo / Emprendedor">
                      Creativo / Emprendedor
                    </option>
                    <option value="Profesional / Ejecutivo">
                      Profesional / Ejecutivo
                    </option>
                    <option value="Extranjero / Recién llegado">
                      Extranjero / Turista
                    </option>
                    <option value="Curioso Gastronómico">
                      Curioso Sociocultural
                    </option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#12110F] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Anfitrión de mesa</span>
                  <span className="text-[#F5F2EB]">{activeSlot.tableLeader}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                  <span>Valor por persona (Todo incluido)</span>
                  <span className="font-mono-tabular text-[#F5F2EB]">
                    {formatCOP(activeSlot.pricePerPersonCOP)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-[#F5F2EB] pt-1.5 border-t border-white/10">
                  <span>Total Reserva ({guestsCount} cupos)</span>
                  <span className="font-mono-tabular text-[#D49A3D]">
                    {formatCOP(activeSlot.pricePerPersonCOP * guestsCount)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] font-semibold text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Reserva de Viernes al Carrito</span>
              </button>

              {reservationConfirmed && (
                <p className="text-xs text-emerald-400 text-center">
                  Reserva añadida a tu bolsa de compra. Puedes completar el pago
                  en el carrito.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutUsSection: React.FC = () => {
  return (
    <section
      id="sobre-nosotros"
      className="py-20 border-t border-white/10 bg-[#0F0E0C]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        {/* Header & Inspiration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#D49A3D]">
              <span>Sobre Nosotros</span>
              <span aria-hidden="true">·</span>
              <span>Chapinero Zona G, Bogotá</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-display font-semibold text-[#F5F2EB] leading-tight text-balance">
              Tradición Colombiana en Bocados Pequeños y Desperdicio Cero
            </h2>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              Proyecto gastronómico concebido y fundamentado en la Universidad
              ECCI bajo la mentoría académica de la docente{' '}
              <span className="text-[#F5F2EB]">Andrea Villamizar</span>.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-5 text-[#A8A29E] text-base leading-relaxed">
            <p>
              <strong className="text-[#F5F2EB] font-medium">
                La Inspiración detrás del Negocio:
              </strong>{' '}
              Observamos dos realidades urbanas en Bogotá. Por un lado, miles de
              profesionales y ejecutivos en las oficinas, apartamentos y
              coworkings de Chapinero (Zona G) frustrados con opciones de
              domicilio genéricas que carecen de identidad y calidad. Por otro
              lado, jóvenes creativos, emprendedores y recién llegados a la
              ciudad buscando espacios auténticos para combatir la rutina y
              conectar con nuevas personas alrededor de la mesa.
            </p>
            <p>
              Así nació{' '}
              <strong className="text-[#F5F2EB] font-medium">
                BIJAO
              </strong>
              : un modelo dual que opera de lunes a domingo como una cocina
              oculta de alta eficiencia en un radio de 3 a 5 km, y que cada
              viernes se transforma en un Comedor Secreto de cocina abierta para
              8 a 12 desconocidos.
            </p>
          </div>
        </div>

        {/* 3 Culinary Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div className="p-6 rounded-xl bg-[#161412] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-[#D49A3D]">
                01. Filosofía Culinaria
              </span>
              <Utensils className="w-4 h-4 text-[#D49A3D]" />
            </div>
            <h3 className="text-xl font-serif-display font-semibold text-[#F5F2EB]">
              Bocados de Autor & Regiones
            </h3>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              Reinterpretamos platillos típicos colombianos en porciones
              reducidas tipo menú degustación, con una elección amplia y muy
              estricta de ingredientes locales del Pacífico, los Andes y la
              Sabana.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#161412] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-[#D49A3D]">
                02. Sostenibilidad Exacta
              </span>
              <Leaf className="w-4 h-4 text-[#D49A3D]" />
            </div>
            <h3 className="text-xl font-serif-display font-semibold text-[#F5F2EB]">
              Estrategia de Desperdicio 0
            </h3>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              Manejamos un aprovechamiento del producto con exactitud milimétrica.
              Nuestras bebidas artesanales se elaboran a base de los mismos
              ingredientes propios de cada plato (como el néctar de chontaduro,
              el agua de coco ahumada y la guasca).
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#161412] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-[#D49A3D]">
                03. Mercado Dual Validado
              </span>
              <Sparkles className="w-4 h-4 text-[#D49A3D]" />
            </div>
            <h3 className="text-xl font-serif-display font-semibold text-[#F5F2EB]">
              Practicidad Diaria & Efecto Voz a Voz
            </h3>
            <p className="text-sm text-[#A8A29E] leading-relaxed">
              Respondemos a la necesidad de calidad sin esfuerzo entre semana
              (frecuencia de 2 a 4 pedidos semanales) y al deseo de conexión
              social los viernes, donde cada comensal invita a sus amigos a
              vivir la experiencia.
            </p>
          </div>
        </div>

        {/* Founders / Chefs Grid */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs text-[#D49A3D] mb-1">
                Equipo Fundador & Culinario
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif-display font-semibold text-[#F5F2EB]">
                Los Creadores Detrás de los Fogones
              </h3>
            </div>
            <p className="text-xs text-[#A8A29E] max-w-md">
              Cuatro fundadores que integran gastronomía regional colombiana,
              ingeniería de desperdicio cero, operaciones de Dark Kitchen y
              curaduría de experiencias sociales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOUNDERS.map((founder, idx) => (
              <div
                key={founder.name}
                className="p-6 rounded-xl bg-[#161412] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                    <span className="font-mono-tabular text-[#D49A3D]">
                      0{idx + 1}. Fundador
                    </span>
                    <span>Bogotá, COL</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif-display font-semibold text-[#F5F2EB]">
                      {founder.name}
                    </h4>
                    <p className="text-xs text-[#D49A3D] mt-0.5">
                      {founder.role}
                    </p>
                  </div>
                  <p className="text-xs text-[#A8A29E] leading-relaxed">
                    {founder.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-[11px] text-[#A8A29E]">
                    Sello en la cocina:
                  </div>
                  <p className="text-xs text-[#F5F2EB] mt-0.5">
                    {founder.signatureContribution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
