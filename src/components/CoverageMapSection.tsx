// Source: Google Maps Platform Code Assist
import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  CheckCircle2,
  Compass,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react';

// Centro de Operaciones de la Cocina Oculta: Chapinero Zona G, Bogotá (Calle 69 con Carrera 5)
const KITCHEN_ZONA_G_CENTER: google.maps.LatLngLiteral = {
  lat: 4.6518,
  lng: -74.0555,
};

const EXPRESS_RADIUS_METERS = 3000; // 3 km
const EXTENDED_RADIUS_METERS = 5000; // 5 km

interface CoverageCirclesOverlayProps {
  show3km: boolean;
  show5km: boolean;
}

/**
 * Renders the 3 km and 5 km delivery coverage circles around Chapinero Zona G
 * using the underlying google.maps.Circle API attached to the active Map instance.
 */
const CoverageCirclesOverlay: React.FC<CoverageCirclesOverlayProps> = ({
  show3km,
  show5km,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const outer5kmCircle = new google.maps.Circle({
      map: show5km ? map : null,
      center: KITCHEN_ZONA_G_CENTER,
      radius: EXTENDED_RADIUS_METERS,
      strokeColor: '#D49A3D',
      strokeOpacity: 0.75,
      strokeWeight: 1.5,
      fillColor: '#D49A3D',
      fillOpacity: 0.08,
      clickable: false,
    });

    const inner3kmCircle = new google.maps.Circle({
      map: show3km ? map : null,
      center: KITCHEN_ZONA_G_CENTER,
      radius: EXPRESS_RADIUS_METERS,
      strokeColor: '#10B981',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#10B981',
      fillOpacity: 0.14,
      clickable: false,
    });

    return () => {
      outer5kmCircle.setMap(null);
      inner3kmCircle.setMap(null);
    };
  }, [map, show3km, show5km]);

  return null;
};

/**
 * Calculates the Haversine distance in kilometers between two LatLng coordinates.
 */
function calculateDistanceKm(
  a: google.maps.LatLngLiteral,
  b: google.maps.LatLngLiteral
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

interface AddressSearchBoxProps {
  onSelectLocation: (
    location: google.maps.LatLngLiteral,
    label: string
  ) => void;
}

/**
 * Modern Places API (New) Autocomplete using AutocompleteSuggestion.fetchAutocompleteSuggestions
 * and Place.fetchFields with session token lifecycle management.
 */
const AddressSearchBox: React.FC<AddressSearchBoxProps> = ({
  onSelectLocation,
}) => {
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!placesLib) return;

    const trimmed = inputValue.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      return;
    }

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    setIsLoading(true);
    const request: google.maps.places.AutocompleteRequest = {
      input: trimmed,
      sessionToken: sessionTokenRef.current,
      locationBias: {
        center: KITCHEN_ZONA_G_CENTER,
        radius: EXTENDED_RADIUS_METERS,
      },
      includedRegionCodes: ['co'],
    };

    AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      .then((res) => {
        setSuggestions(res.suggestions || []);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        console.error('AutocompleteSuggestion error:', err);
        const msg = String(err);
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setIsLoading(false);
      });
  }, [placesLib, inputValue]);

  const handleSelectSuggestion = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!placesLib || !suggestion.placePrediction) return;

    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });

      if (place.location) {
        const coords: google.maps.LatLngLiteral = {
          lat: place.location.lat(),
          lng: place.location.lng(),
        };
        const label =
          place.formattedAddress ||
          place.displayName ||
          suggestion.placePrediction.text.text;

        onSelectLocation(coords, label);
        setInputValue(label);
        setSuggestions([]);
        sessionTokenRef.current = null;

        if (map) {
          map.panTo(coords);
          map.setZoom(14);
        }
      }
    } catch (err: unknown) {
      console.error('Place.fetchFields error:', err);
      const msg = String(err);
      if (
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('OVER_QUERY_LIMIT') ||
        msg.includes('429')
      ) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
    }
  };

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-[#A8A29E] mb-1.5">
        Busca tu dirección en Bogotá o haz clic directamente en el mapa
      </label>
      <div className="relative">
        <Search className="w-4 h-4 text-[#D49A3D] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ej: Calle 72 # 10-07, Parque de la 93, Quinta Camacho..."
          className="w-full bg-[#12100E] border border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#F5F2EB] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#D49A3D]"
        />
      </div>

      {isLoading && (
        <div className="text-[11px] text-[#A8A29E] mt-1">
          Consultando direcciones en Bogotá...
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 mt-1.5 bg-[#1B1815] border border-white/15 rounded-xl shadow-2xl overflow-hidden divide-y divide-white/10 max-h-56 overflow-y-auto">
          {suggestions.map((suggestion, idx) => {
            const text = suggestion.placePrediction?.text?.text || '';
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => void handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#F5F2EB] hover:bg-[#26221D] transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D49A3D] shrink-0" />
                  <span className="truncate">{text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

interface CoverageMapSectionProps {
  onConfirmZoneForOrder?: (zoneSummary: string) => void;
}

export const CoverageMapSection: React.FC<CoverageMapSectionProps> = ({
  onConfirmZoneForOrder,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const [show3km, setShow3km] = useState(true);
  const [show5km, setShow5km] = useState(true);
  const [kitchenInfoOpen, setKitchenInfoOpen] = useState(true);

  // Default customer verification point: Corporate office in Chapinero (2.1 km away)
  const [customerLocation, setCustomerLocation] =
    useState<google.maps.LatLngLiteral>({
      lat: 4.6662,
      lng: -74.0532,
    });
  const [customerLabel, setCustomerLabel] = useState<string>(
    'Punto seleccionado en Chapinero / Chicó (Haz clic en el mapa o busca tu dirección)'
  );

  const distanceKm = calculateDistanceKm(
    KITCHEN_ZONA_G_CENTER,
    customerLocation
  );
  const isWithin3km = distanceKm <= 3.0;
  const isWithin5km = distanceKm <= 5.0;

  const handleMapClick = (e: { detail?: { latLng?: google.maps.LatLngLiteral | null } }) => {
    const clickedLatLng = e.detail?.latLng;
    if (!clickedLatLng) return;
    setCustomerLocation({
      lat: clickedLatLng.lat,
      lng: clickedLatLng.lng,
    });
    setCustomerLabel(
      `Ubicación marcada en mapa (${clickedLatLng.lat.toFixed(4)}, ${clickedLatLng.lng.toFixed(4)})`
    );
  };

  return (
    <section
      id="mapa-cobertura"
      className="py-20 border-t border-white/10 bg-[#12110E]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#D49A3D]">
              <span>Georreferenciación de Segmento 1</span>
              <span aria-hidden="true">·</span>
              <span>Chapinero Zona G</span>
              <span aria-hidden="true">·</span>
              <span>Radio 3 a 5 km</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-display font-semibold text-[#F5F2EB] text-balance">
              Verifica tu Cobertura de Entrega (3–5 km)
            </h2>
            <p className="text-sm text-[#A8A29E] max-w-2xl leading-relaxed">
              Nuestra cocina oculta opera desde el corazón de{' '}
              <strong className="text-[#F5F2EB] font-medium">
                Chapinero Zona G
              </strong>{' '}
              para garantizar que cada bocado de autor llegue con temperatura y
              textura intactas a oficinas, espacios de coworking y apartamentos
              residenciales consolidados.
            </p>
          </div>

          {/* Interactive Ring Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShow3km((v) => !v)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                show3km
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-[#171512] border-white/10 text-[#A8A29E]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Anillo Prioritario 3 km (20–25 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setShow5km((v) => !v)}
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                show5km
                  ? 'bg-amber-950/60 border-[#D49A3D]/70 text-[#D49A3D]'
                  : 'bg-[#171512] border-white/10 text-[#A8A29E]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#D49A3D] inline-block" />
              <span>Anillo Extendido 5 km (25–35 min)</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Control & Verification Card / Right Interactive Google Map */}
        <APIProvider apiKey={apiKey} language="es" region="CO">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Verification Panel */}
            <div className="lg:col-span-5 bg-[#181613] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="space-y-1 border-b border-white/10 pb-4">
                <div className="text-xs text-[#D49A3D]">
                  Validador de Domicilio Express
                </div>
                <h3 className="text-2xl font-serif-display font-semibold text-[#F5F2EB]">
                  ¿Estás dentro del rango?
                </h3>
                <p className="text-xs text-[#A8A29E]">
                  Escribe la dirección de tu oficina, coworking o apartamento, o
                  toca cualquier punto en el mapa para calcular la distancia
                  exacta a nuestra cocina en Zona G.
                </p>
              </div>

              {/* Places API (New) Autocomplete Search */}
              <AddressSearchBox
                onSelectLocation={(coords, label) => {
                  setCustomerLocation(coords);
                  setCustomerLabel(label);
                }}
              />

              {/* Live Distance & Eligibility Status Card */}
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  isWithin3km
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : isWithin5km
                    ? 'bg-amber-950/30 border-[#D49A3D]/50'
                    : 'bg-rose-950/30 border-rose-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isWithin5km ? (
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 ${
                          isWithin3km ? 'text-emerald-400' : 'text-[#D49A3D]'
                        }`}
                      />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-[#F5F2EB]">
                        {isWithin3km
                          ? 'Cobertura Express Inmediata (Radio 0 – 3 km)'
                          : isWithin5km
                          ? 'Cobertura Extendida Activa (Radio 3 – 5 km)'
                          : 'Fuera del Radio de Domicilio Express (> 5 km)'}
                      </div>
                      <div className="text-[11px] text-[#A8A29E] mt-0.5 line-clamp-2">
                        {customerLabel}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-mono-tabular font-semibold text-[#F5F2EB]">
                      {distanceKm.toFixed(2)} km
                    </div>
                    <div className="text-[10px] text-[#A8A29E]">
                      desde Zona G
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#A8A29E] leading-relaxed pt-2 border-t border-white/10">
                  {isWithin3km
                    ? '¡Excelente! Tu ubicación recibe pedidos de lunes a domingo en 20 a 25 minutos con temperatura perfecta para almuerzos ejecutivos o cenas en casa.'
                    : isWithin5km
                    ? 'Estás dentro de nuestro segundo anillo de cobertura (3 a 5 km). Tiempo estimado de entrega: 25 a 35 minutos en empaque térmico biodegradable.'
                    : 'Tu dirección supera los 5 km de cobertura diaria de nuestra Dark Kitchen. Sin embargo, recuerda que toda la ciudad está invitada cada viernes a nuestro Comedor Secreto presencial en Zona G.'}
                </p>

                {isWithin5km && onConfirmZoneForOrder && (
                  <button
                    type="button"
                    onClick={() =>
                      onConfirmZoneForOrder(
                        `${customerLabel} (${distanceKm.toFixed(2)} km de Zona G)`
                      )
                    }
                    className="w-full py-2.5 px-4 rounded-lg bg-[#D49A3D] hover:bg-[#c2892f] text-[#0F0E0C] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Usar esta ubicación para mi pedido</span>
                  </button>
                )}
              </div>

              {/* Reference specs from the segmentation matrix */}
              <div className="space-y-2 text-xs text-[#A8A29E] pt-2 border-t border-white/10">
                <div className="font-semibold text-[#F5F2EB]">
                  Criterio Geográfico del Documento:
                </div>
                <p>
                  · <strong className="text-[#F5F2EB]">Lunes a Domingo:</strong>{' '}
                  Áreas corporativas, oficinas, espacios de coworking y zonas
                  residenciales consolidadas de nivel medio-alto/alto a 3–5 km
                  de Chapinero Zona G.
                </p>
                <p>
                  · <strong className="text-[#F5F2EB]">Viernes Secreto:</strong>{' '}
                  Comensales de toda Bogotá dispuestos a desplazarse a nuestra
                  cocina abierta en Zona G.
                </p>
              </div>
            </div>

            {/* Right Interactive Map Container (Explicit height required per CF2) */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/15 bg-[#161412] shadow-2xl">
              <div className="px-5 py-3 bg-[#1A1714] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#F5F2EB]">
                  <Compass className="w-4 h-4 text-[#D49A3D]" />
                  <span>
                    Haz clic en cualquier calle o edificio del mapa para medir
                    la distancia
                  </span>
                </div>
                <span className="font-mono-tabular text-[#D49A3D]">
                  Centro: Calle 69 # 5-24 (Zona G)
                </span>
              </div>

              <div className="w-full h-[500px] relative">
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={KITCHEN_ZONA_G_CENTER}
                  defaultZoom={13}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  onClick={handleMapClick}
                  internalUsageAttributionIds={[
                    'gmp_mcp_codeassist_v1_aistudio',
                  ]}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* 3km and 5km Coverage Circles */}
                  <CoverageCirclesOverlay show3km={show3km} show5km={show5km} />

                  {/* Origin Marker: BIJAO Dark Kitchen & Comedor Secreto */}
                  <AdvancedMarker
                    position={KITCHEN_ZONA_G_CENTER}
                    onClick={() => setKitchenInfoOpen(true)}
                    title="BIJAO — Cocina Oculta & Comedor Secreto (Chapinero Zona G)"
                  >
                    <Pin
                      background="#D49A3D"
                      borderColor="#0F0E0C"
                      glyphColor="#0F0E0C"
                      scale={1.25}
                    />
                  </AdvancedMarker>

                  {kitchenInfoOpen && (
                    <InfoWindow
                      position={KITCHEN_ZONA_G_CENTER}
                      pixelOffset={[0, -38]}
                      onCloseClick={() => setKitchenInfoOpen(false)}
                      maxWidth={240}
                    >
                      <div className="text-stone-900 p-1 space-y-1">
                        <div className="text-xs font-bold text-stone-950">
                          BIJAO · Cocina Central
                        </div>
                        <p className="text-[11px] text-stone-700 leading-snug">
                          Chapinero Zona G, Bogotá. Punto cero del radio de
                          entrega de 3 a 5 km y sede del Comedor Secreto los
                          viernes.
                        </p>
                      </div>
                    </InfoWindow>
                  )}

                  {/* Selected Customer Verification Marker */}
                  <AdvancedMarker
                    position={customerLocation}
                    title="Tu ubicación seleccionada"
                  >
                    <Pin
                      background={
                        isWithin3km
                          ? '#10B981'
                          : isWithin5km
                          ? '#F59E0B'
                          : '#EF4444'
                      }
                      borderColor="#0F0E0C"
                      glyphColor="#0F0E0C"
                      scale={1.1}
                    />
                  </AdvancedMarker>
                </Map>
              </div>
            </div>
          </div>
        </APIProvider>
      </div>
    </section>
  );
};
