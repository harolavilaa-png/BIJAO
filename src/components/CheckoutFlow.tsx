import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
  X,
} from 'lucide-react';
import {
  CartItem,
  DELIVERY_ZONES_CHAPINERO,
  DishItem,
  formatCOP,
} from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.dish.priceCOP * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 95000 || subtotal === 0 ? 0 : 6500;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#141210] border-l border-white/10 h-full flex flex-col justify-between text-[#F5F2EB]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D49A3D]" />
            <h2 className="text-xl font-serif-display font-semibold">
              Tu Pedido de Autor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A8A29E] hover:text-[#F5F2EB] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery threshold notice */}
        <div className="px-6 py-2.5 bg-[#1C1916] border-b border-white/10 text-xs text-[#A8A29E] flex items-center justify-between">
          <span>Radio Express 3–5 km (Chapinero Zona G)</span>
          <span className="font-mono-tabular text-[#D49A3D]">
            {subtotal >= 95000
              ? 'Envío Gratis Activo'
              : `Envío gratis desde ${formatCOP(95000)}`}
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#A8A29E]/50 mx-auto" />
              <p className="text-base font-medium text-[#F5F2EB]">
                Tu bolsa está vacía
              </p>
              <p className="text-xs text-[#A8A29E] max-w-xs mx-auto leading-relaxed">
                Explora nuestros bocados regionales del Pacífico, los Andes y la
                Sabana o reserva tu cupo en el Comedor Secreto de los viernes.
              </p>
            </div>
          ) : (
            items.map(({ dish, quantity, notes }) => (
              <div
                key={dish.id}
                className="p-4 rounded-xl bg-[#1B1916] border border-white/10 flex gap-3.5 items-start"
              >
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-[#F5F2EB] leading-snug">
                      {dish.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(dish.id)}
                      className="text-[#A8A29E] hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      aria-label={`Eliminar ${dish.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#A8A29E] mt-0.5">
                    {dish.portionSize}
                  </p>
                  {notes && (
                    <p className="text-[11px] text-[#D49A3D] mt-1">{notes}</p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-[#12100E] border border-white/10 rounded-lg px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(dish.id, -1)}
                        className="p-1 text-[#A8A29E] hover:text-[#F5F2EB] cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono-tabular px-1.5">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(dish.id, 1)}
                        className="p-1 text-[#A8A29E] hover:text-[#F5F2EB] cursor-pointer"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-mono-tabular font-medium text-[#F5F2EB]">
                      {formatCOP(dish.priceCOP * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#181613] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#A8A29E]">
                <span>Subtotal bocados & experiencias</span>
                <span className="font-mono-tabular">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#A8A29E]">
                <span>Domicilio Express (Chapinero 3–5 km)</span>
                <span className="font-mono-tabular">
                  {deliveryFee === 0 ? 'Gratis' : formatCOP(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#F5F2EB] pt-2 border-t border-white/10">
                <span>Total a Pagar</span>
                <span className="font-mono-tabular text-[#D49A3D]">
                  {formatCOP(total)}
                </span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceder al Pago Seguro</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface SimulatedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onClearCart: () => void;
}

export const SimulatedCheckoutModal: React.FC<SimulatedCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = React.useState('Mariana Valenzuela');
  const [customerEmail, setCustomerEmail] = React.useState(
    'mariana.ejecutiva@oficinazonag.co'
  );
  const [customerPhone, setCustomerPhone] = React.useState('315 842 9104');
  const [deliveryZone, setDeliveryZone] = React.useState(
    DELIVERY_ZONES_CHAPINERO[0]
  );
  const [addressDetail, setAddressDetail] = React.useState(
    'Calle 69 # 5-24 · Edificio Corporativo Zona G, Piso 6 (Coworking)'
  );
  const [orderModality, setOrderModality] = React.useState<
    'domicilio-express' | 'compartir-oficina' | 'comedor-secreto'
  >('domicilio-express');
  const [paymentMethod, setPaymentMethod] = React.useState<
    'pse' | 'tarjeta' | 'contraentrega'
  >('tarjeta');
  const [cardNumber, setCardNumber] = React.useState('4532 •••• •••• 8841');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [orderCompletedId, setOrderCompletedId] = React.useState<string | null>(
    null
  );
  const [confirmedSnapshot, setConfirmedSnapshot] = React.useState<{
    items: CartItem[];
    total: number;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.dish.priceCOP * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 95000 || subtotal === 0 ? 0 : 6500;
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !addressDetail.trim()) {
      setErrorMessage(
        'Por favor completa tu nombre, teléfono de contacto y dirección en Chapinero / Bogotá.'
      );
      return;
    }
    setErrorMessage('');
    const generatedId = `BIJAO-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedSnapshot({ items: [...items], total });
    setOrderCompletedId(generatedId);
    onClearCart();
  };

  const handleResetAndClose = () => {
    setOrderCompletedId(null);
    setConfirmedSnapshot(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#141210] border border-white/15 rounded-2xl overflow-hidden text-[#F5F2EB] my-8">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1A1714]">
          <button
            onClick={handleResetAndClose}
            className="flex items-center gap-2 text-xs text-[#A8A29E] hover:text-[#F5F2EB] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda</span>
          </button>
          <span className="text-xs font-mono-tabular text-[#D49A3D]">
            Pasarela de Pago Simulada · BIJAO Bogotá
          </span>
        </div>

        {orderCompletedId && confirmedSnapshot ? (
          /* Post-Order Confirmation View */
          <div className="p-8 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pedido Confirmado & En Preparación al Instante</span>
                </div>
                <h2 className="text-3xl font-serif-display font-semibold text-[#F5F2EB]">
                  Orden #{orderCompletedId} Recibida en Cocina
                </h2>
                <p className="text-sm text-[#A8A29E]">
                  Gracias, <span className="text-[#F5F2EB]">{customerName}</span>
                  . Nuestra partida en Chapinero Zona G ya está emplazando tus
                  bocados bajo protocolo de Desperdicio 0.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1B1916] border border-white/10 text-right shrink-0">
                <div className="text-xs text-[#A8A29E]">Tiempo Estimado</div>
                <div className="text-xl font-mono-tabular font-semibold text-[#D49A3D]">
                  22 – 28 min
                </div>
                <div className="text-[11px] text-[#A8A29E]">
                  Radio 3–5 km Chapinero
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#1A1815] border border-white/10 space-y-3">
                <h3 className="text-sm font-semibold text-[#F5F2EB]">
                  Detalles de Entrega / Reserva
                </h3>
                <div className="space-y-1.5 text-xs text-[#A8A29E]">
                  <p>
                    <strong className="text-[#F5F2EB]">Destinatario:</strong>{' '}
                    {customerName} ({customerPhone})
                  </p>
                  <p>
                    <strong className="text-[#F5F2EB]">Zona:</strong>{' '}
                    {deliveryZone}
                  </p>
                  <p>
                    <strong className="text-[#F5F2EB]">Dirección:</strong>{' '}
                    {addressDetail}
                  </p>
                  <p>
                    <strong className="text-[#F5F2EB]">Modalidad:</strong>{' '}
                    {orderModality === 'domicilio-express'
                      ? 'Almuerzo / Cena Express Individual'
                      : orderModality === 'compartir-oficina'
                      ? 'Para Compartir en Oficina / Coworking / Hogar'
                      : 'Reserva Presencial Viernes de Comedor Secreto'}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#1A1815] border border-white/10 space-y-3">
                <h3 className="text-sm font-semibold text-[#F5F2EB]">
                  Resumen de Bocados & Maridaje
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {confirmedSnapshot.items.map((item) => (
                    <div
                      key={item.dish.id}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-[#A8A29E]">
                        {item.quantity}x {item.dish.name}
                      </span>
                      <span className="font-mono-tabular text-[#F5F2EB]">
                        {formatCOP(item.dish.priceCOP * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-semibold">
                  <span>Total Pagado</span>
                  <span className="font-mono-tabular text-[#D49A3D]">
                    {formatCOP(confirmedSnapshot.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-3 rounded-lg bg-[#D49A3D] text-[#0F0E0C] font-semibold text-sm hover:bg-[#c2892f] transition-colors cursor-pointer"
              >
                Finalizar y Volver al Menú
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form
            onSubmit={handleConfirmOrder}
            className="grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Left Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-white/10">
              <div>
                <h2 className="text-2xl font-serif-display font-semibold text-[#F5F2EB]">
                  Finalizar Pedido en Línea
                </h2>
                <p className="text-xs text-[#A8A29E] mt-1">
                  Entrega directa desde nuestra cocina oculta en Chapinero Zona
                  G (Radio de 3 a 5 km) o confirmación de cupo para los viernes.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
                  {errorMessage}
                </div>
              )}

              {/* Modality selector */}
              <div>
                <label className="block text-xs font-medium text-[#A8A29E] mb-2">
                  Propósito de tu Pedido (Segmentación Dual)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOrderModality('domicilio-express')}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      orderModality === 'domicilio-express'
                        ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                        : 'bg-[#12100E] border-white/10 text-[#A8A29E]'
                    }`}
                  >
                    <div className="font-semibold text-[#F5F2EB]">
                      Express Oficina / Casa
                    </div>
                    <div className="text-[11px] mt-0.5">
                      Calidad sin esfuerzo (25–30 min)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderModality('compartir-oficina')}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      orderModality === 'compartir-oficina'
                        ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                        : 'bg-[#12100E] border-white/10 text-[#A8A29E]'
                    }`}
                  >
                    <div className="font-semibold text-[#F5F2EB]">
                      Para Compartir
                    </div>
                    <div className="text-[11px] mt-0.5">
                      Con colegas o familia (Empaque grupal)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderModality('comedor-secreto')}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      orderModality === 'comedor-secreto'
                        ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                        : 'bg-[#12100E] border-white/10 text-[#A8A29E]'
                    }`}
                  >
                    <div className="font-semibold text-[#F5F2EB]">
                      Viernes Secreto
                    </div>
                    <div className="text-[11px] mt-0.5">
                      Experiencia presencial 8-12 personas
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#A8A29E] mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A8A29E] mb-1">
                    Celular / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D] tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#A8A29E] mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#A8A29E] mb-1">
                    Zona de Cobertura (Chapinero 3–5 km)
                  </label>
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D]"
                  >
                    {DELIVERY_ZONES_CHAPINERO.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#A8A29E] mb-1">
                  Dirección Exacta (Oficina, Coworking o Apartamento)
                </label>
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D49A3D]"
                  required
                />
              </div>

              {/* Simulated Payment Method */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="block text-xs font-medium text-[#A8A29E]">
                  Método de Pago Simulado
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'tarjeta'
                        ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                        : 'bg-[#12100E] border-white/10 text-[#A8A29E]'
                    }`}
                  >
                    Tarjeta Crédito / Débito
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pse')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'pse'
                        ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                        : 'bg-[#12100E] border-white/10 text-[#A8A29E]'
                    }`}
                  >
                    PSE / Nequi / Daviplata
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('contraentrega')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'contraentrega'
                        ? 'bg-[#25211C] border-[#D49A3D] text-[#F5F2EB]'
                        : 'bg-[#12100E] border-white/10 text-[#A8A29E]'
                    }`}
                  >
                    Datafono al Recibir
                  </button>
                </div>

                {paymentMethod === 'tarjeta' && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-[#A8A29E] mb-1">
                        Número de Tarjeta (Simulado)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono-tabular text-[#F5F2EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#A8A29E] mb-1">
                        CVV / Exp
                      </label>
                      <input
                        type="text"
                        defaultValue="09/29 · 842"
                        className="w-full bg-[#12100E] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono-tabular text-[#F5F2EB]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#181613] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-serif-display font-semibold text-[#F5F2EB]">
                  Resumen de la Orden ({items.reduce((a, b) => a + b.quantity, 0)}{' '}
                  ítems)
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map(({ dish, quantity, notes }) => (
                    <div
                      key={dish.id}
                      className="flex items-start justify-between gap-3 pb-3 border-b border-white/10 text-xs"
                    >
                      <div>
                        <div className="font-medium text-[#F5F2EB]">
                          {quantity}x {dish.name}
                        </div>
                        <div className="text-[#A8A29E]">{dish.regionTag}</div>
                        {notes && (
                          <div className="text-[#D49A3D] mt-0.5">{notes}</div>
                        )}
                      </div>
                      <span className="font-mono-tabular text-[#F5F2EB] shrink-0">
                        {formatCOP(dish.priceCOP * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-lg bg-[#12100E] border border-white/10 text-xs text-[#A8A29E] space-y-1">
                  <div className="text-[#D49A3D] font-medium">
                    Compromiso Desperdicio 0
                  </div>
                  <p>
                    Cada porción está calibrada al gramo con ingredientes
                    locales de regiones colombianas. Incluye empaque
                    biodegradable sin costo adicional.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#A8A29E]">
                    <span>Subtotal</span>
                    <span className="font-mono-tabular">
                      {formatCOP(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A8A29E]">
                    <span>Domicilio Express Chapinero</span>
                    <span className="font-mono-tabular">
                      {deliveryFee === 0 ? 'Gratis' : formatCOP(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#F5F2EB] pt-2 border-t border-white/10">
                    <span>Total a Pagar</span>
                    <span className="font-mono-tabular text-[#D49A3D]">
                      {formatCOP(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar y Simular Pago ({formatCOP(total)})</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
