import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';

// Fix Leaflet default marker icons broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Pin clásico con monograma CB — sin dependencias externas
const createMapPin = (selected = false) => {
  const color = selected ? '#1a6b36' : '#7C5C3E';
  const w = selected ? 32 : 26;
  const h = selected ? 44 : 36;
  return L.divIcon({
    html: `
      <div class="map-pin${selected ? ' selected' : ''}">
        <svg viewBox="0 0 32 46" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">
          <ellipse cx="16" cy="44" rx="7" ry="2.2" fill="rgba(0,0,0,0.18)"/>
          <path d="M16 2C9.4 2 4 7.4 4 14c0 9.5 12 30 12 30S28 23.5 28 14C28 7.4 22.6 2 16 2z"
                fill="${color}" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M16 2C9.4 2 4 7.4 4 14c0 9.5 12 30 12 30S28 23.5 28 14C28 7.4 22.6 2 16 2z"
                fill="url(#pinShine${selected ? 'S' : 'N'})"/>
          <defs>
            <radialGradient id="pinShine${selected ? 'S' : 'N'}" cx="35%" cy="30%" r="55%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
              <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
            </radialGradient>
          </defs>
          <circle cx="16" cy="14" r="8" fill="white"/>
          <text x="16" y="18" text-anchor="middle"
                font-family="Georgia, 'Playfair Display', serif"
                font-size="7.5" font-weight="bold" fill="${color}" letter-spacing="0.5">CB</text>
        </svg>
      </div>`,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -(h + 2)],
  });
};

// Component to fly map to coordinates
const FlyToMarker = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV
  ? 'https://localhost:7020/api'
  : 'https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api');

// Static fallback demo distributors
const DEMO_DISTRIBUIDORES = [
  { nombre: 'AZ Boot Boutique', estado: 'arizona', ciudad: 'Phoenix', tipo: 'ambos', lat: 33.4484, lng: -112.0740 },
  { nombre: 'Texas Boot Company', estado: 'texas', ciudad: 'Houston', tipo: 'tienda', lat: 29.7604, lng: -95.3698 },
  { nombre: "Allens Boots", estado: 'texas', ciudad: 'Austin', tipo: 'ambos', lat: 30.2672, lng: -97.7431 },
  { nombre: "Cavender's", estado: 'texas', ciudad: 'San Antonio', tipo: 'tienda', lat: 29.4241, lng: -98.4936 },
  { nombre: 'Lost Creek', estado: 'california', ciudad: 'Los Angeles', tipo: 'online', lat: 34.0522, lng: -118.2437 },
  { nombre: 'Melbelle', estado: 'cdmx', ciudad: 'Ciudad de México', tipo: 'ambos', lat: 19.4326, lng: -99.1332 },
  { nombre: 'Boot Barn Jalisco', estado: 'jalisco', ciudad: 'Guadalajara', tipo: 'tienda', lat: 20.6597, lng: -103.3496 },
  { nombre: 'Botas del Norte', estado: 'nuevo-leon', ciudad: 'Monterrey', tipo: 'ambos', lat: 25.6866, lng: -100.3161 },
  { nombre: 'Caborca Sonora Store', estado: 'sonora', ciudad: 'Hermosillo', tipo: 'tienda', lat: 29.0729, lng: -110.9559 },
  { nombre: 'Chihuahua Boots', estado: 'chihuahua', ciudad: 'Chihuahua', tipo: 'tienda', lat: 28.6353, lng: -106.0889 },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Distribuidores = () => {
  const [formulario, setFormulario] = useState({ nombreCompleto: '', correoElectronico: '', telefono: '', ciudad: '', mensaje: '' });
  const [tipoCompra, setTipoCompra] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.5, -102.3]); // Mexico centrado
  const [mapZoom, setMapZoom] = useState(5);
  const [allDistribuidores, setAllDistribuidores] = useState(DEMO_DISTRIBUIDORES);

  const [hero, setHero] = useState({
    badge: 'ÚNETE A NOSOTROS',
    titulo: '¿Quieres ser distribuidor?',
    subtitulo: 'Únete a nuestra red de distribuidores y forma parte de la familia Caborca',
    imagen: 'https://blocks.astratic.com/img/general-img-landscape.png'
  });
  const [formDist, setFormDist] = useState({
    titulo: '¿Quieres ser distribuidor?',
    subtitulo: 'Si estás interesado, déjanos tus datos y nuestro equipo se pondrá en contacto contigo.',
    submitLabel: 'ENVIAR SOLICITUD',
    responseTime: 'Respuesta en 24-48 hrs',
    distribuidores: '+500',
    estados: '20+',
  });
  const [mapInfo, setMapInfo] = useState({
    mapTitle: 'Encuéntranos en el mapa',
    mapText: 'Visita nuestras tiendas y distribuidores autorizados en todo México.',
  });

  // Load CMS text content
  useEffect(() => {
    textosService.getTextos('distribuidores')
      .then(data => {
        if (!data || Object.keys(data).length === 0) return;
        if (data.hero) setHero(prev => ({ ...prev, ...data.hero }));
        if (data.formulario || data.counters) {
          setFormDist(prev => ({
            titulo: data.formulario?.titulo || prev.titulo,
            subtitulo: data.formulario?.subtitulo || prev.subtitulo,
            submitLabel: data.formulario?.submitLabel || prev.submitLabel,
            responseTime: data.formulario?.responseTime || prev.responseTime,
            distribuidores: data.counters?.distribuidores || prev.distribuidores,
            estados: data.counters?.estados || prev.estados,
          }));
        }
        setMapInfo(prev => ({
          mapTitle: data.mapTitle || prev.mapTitle,
          mapText: data.mapText || prev.mapText,
        }));
      })
      .catch(() => { });
  }, []);

  // Load real distributors from ConfiguracionGeneral
  useEffect(() => {
    fetch(`${API_URL}/Settings/ConfiguracionGeneral`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Array.isArray(data.distribuidoresList) && data.distribuidoresList.length > 0) {
          const mapped = data.distribuidoresList
            .filter(d => d.lat && d.lng)
            .map(d => ({
              nombre: d.negocioNombre || d.contactoNombre || 'Distribuidor',
              ciudad: d.ciudad || '',
              estado: (d.estado || '').toLowerCase().replace(/\s+/g, '-'),
              tipo: d.tipo || 'tienda',
              lat: parseFloat(d.lat),
              lng: parseFloat(d.lng),
              logo: d.logo || null,
              telefono: d.contactoTelefono || '',
            }));
          if (mapped.length > 0) setAllDistribuidores(mapped);
        }
      })
      .catch(() => { });
  }, []);

  const manejarUbicarme = () => {
    setMensajeUbicacion('Obteniendo ubicación...');
    if (!navigator.geolocation) {
      setMensajeUbicacion('✗ Geolocalización no soportada');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: uLat, longitude: uLng } = pos.coords;
        setMensajeUbicacion('✓ Ubicación obtenida');
        const sorted = [...allDistribuidores]
          .map(s => ({ ...s, distance: calculateDistance(uLat, uLng, s.lat, s.lng) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);
        setResultados(sorted);
        if (sorted[0]) {
          setSelectedStore(sorted[0]);
          setMapCenter([sorted[0].lat, sorted[0].lng]);
          setMapZoom(12);
        }
      },
      () => setMensajeUbicacion('✗ No se pudo obtener la ubicación')
    );
  };

  const manejarAplicarFiltros = () => {
    let filtrados = allDistribuidores;
    if (tipoCompra) filtrados = filtrados.filter(d => d.tipo === tipoCompra || d.tipo === 'ambos');
    if (estadoFiltro) filtrados = filtrados.filter(d => d.estado === estadoFiltro);
    setResultados(filtrados);
    if (filtrados[0]) {
      setSelectedStore(filtrados[0]);
      setMapCenter([filtrados[0].lat, filtrados[0].lng]);
      setMapZoom(10);
    }
  };

  const manejarLimpiarFiltros = () => {
    setTipoCompra(''); setEstadoFiltro('');
    setResultados([]); setMensajeUbicacion('');
    setSelectedStore(null);
    setMapCenter([23.5, -102.3]); setMapZoom(5);
  };

  const seleccionarTienda = (store) => {
    setSelectedStore(store);
    setMapCenter([store.lat, store.lng]);
    setMapZoom(14);
  };

  const displayedMarkers = resultados.length > 0 ? resultados : allDistribuidores;

  return (
    <div className="bg-white text-caborca-cafe font-sans">
      <Encabezado />

      <main>
        {/* HERO */}
        <section className="relative pt-[95px] bg-gray-50">
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img
              src={hero.imagen} alt="Distribuidores Caborca Boots"
              className="w-full h-[600px] object-cover"
              onError={e => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6">
                  <p className="text-sm md:text-base font-medium tracking-widest uppercase text-white">{hero.badge}</p>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif mb-6">{hero.titulo}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{hero.subtitulo}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULARIO SOLICITUD */}
        <section className="py-16 bg-caborca-beige-suave">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-serif text-caborca-beige-fuerte font-bold mb-2">{formDist.titulo}</h3>
                  <p className="text-lg text-caborca-cafe/90 max-w-3xl mx-auto">{formDist.subtitulo}</p>
                </div>
                <br />
                <form onSubmit={e => { e.preventDefault(); alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.'); }} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { label: 'Nombre completo', name: 'nombreCompleto', type: 'text', placeholder: 'Tu nombre' },
                      { label: 'Correo electrónico', name: 'correoElectronico', type: 'email', placeholder: 'correo@ejemplo.com' },
                      { label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: '(123) 456-7890' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">{f.label}</label>
                        <input type={f.type} name={f.name} value={formulario[f.name]}
                          onChange={e => setFormulario(p => ({ ...p, [e.target.name]: e.target.value }))}
                          placeholder={f.placeholder} required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe" />
                      </div>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">Ciudad</label>
                      <input type="text" name="ciudad" value={formulario.ciudad}
                        onChange={e => setFormulario(p => ({ ...p, ciudad: e.target.value }))}
                        placeholder="Tu ciudad" required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">Mensaje</label>
                      <textarea rows="1" name="mensaje" value={formulario.mensaje}
                        onChange={e => setFormulario(p => ({ ...p, mensaje: e.target.value }))}
                        placeholder="Cuéntanos sobre tu negocio..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe resize-none" />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                    <button type="submit" className="bg-caborca-beige-fuerte text-white px-8 py-3 rounded-lg font-bold hover:bg-caborca-cafe transition-colors">
                      {formDist.submitLabel}
                    </button>
                    <div className="flex items-center gap-3 text-caborca-bronce/70">
                      <svg className="w-5 h-5 text-caborca-bronce" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-sm text-caborca-bronce">{formDist.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-caborca-bronce">{formDist.distribuidores}</div>
                        <div className="text-xs text-caborca-bronce/60">Distribuidores</div>
                      </div>
                      <div className="w-16 h-16 bg-caborca-bronce rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-caborca-bronce">{formDist.estados}</div>
                        <div className="text-xs text-caborca-bronce/60">Estados</div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* MAPA REACT-LEAFLET */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif mb-3 text-caborca-beige-fuerte font-bold text-center">{mapInfo.mapTitle}</h2>
            <p className="text-center mb-8 text-caborca-cafe font-bold">{mapInfo.mapText}</p>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tipo */}
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-caborca-beige-fuerte mb-2">Tipo de compra</label>
                  <select value={tipoCompra} onChange={e => setTipoCompra(e.target.value)}
                    className="border-2 border-gray-300 rounded py-2 px-4 focus:border-caborca-cafe focus:outline-none">
                    <option value="">Todos los tipos</option>
                    <option value="tienda">Tienda física</option>
                    <option value="online">En línea</option>
                    <option value="ambos">Física y en línea</option>
                  </select>
                </div>
                {/* Estado */}
                <div className="flex flex-col">
                  <label className="block text-sm font-bold text-caborca-beige-fuerte mb-2">Estado / Región</label>
                  <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)}
                    className="border-2 border-gray-300 rounded py-2 px-4 focus:border-caborca-cafe focus:outline-none">
                    <option value="">Selecciona una región</option>
                    <option value="cdmx">Ciudad de México</option>
                    <option value="jalisco">Jalisco</option>
                    <option value="nuevo-leon">Nuevo León</option>
                    <option value="sonora">Sonora</option>
                    <option value="chihuahua">Chihuahua</option>
                    <option value="texas">Texas, USA</option>
                    <option value="arizona">Arizona, USA</option>
                    <option value="california">California, USA</option>
                  </select>
                </div>
                {/* Ubicarme */}
                <div className="flex flex-col justify-end">
                  <button onClick={manejarUbicarme}
                    className="bg-caborca-beige-fuerte text-white py-2 px-4 rounded hover:bg-caborca-cafe transition-colors w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Usar mi ubicación
                  </button>
                  {mensajeUbicacion && (
                    <p className={`text-xs mt-1 ${mensajeUbicacion.includes('✓') ? 'text-green-600' : 'text-red-500'}`}>{mensajeUbicacion}</p>
                  )}
                </div>
                {/* Acciones */}
                <div className="flex flex-col justify-end">
                  <div className="flex gap-2">
                    <button onClick={manejarLimpiarFiltros}
                      className="bg-gray-200 text-caborca-beige-fuerte py-2 px-3 rounded hover:bg-gray-300 transition-colors flex-1" title="Limpiar">
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button onClick={manejarAplicarFiltros}
                      className="bg-caborca-beige-fuerte text-white py-2 px-3 rounded hover:bg-caborca-cafe transition-colors flex-1" title="Buscar">
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Resultados */}
              {resultados.length > 0 && (
                <div className="mt-6 border-t-2 border-gray-200 pt-4">
                  <p className="text-xs font-bold text-caborca-beige-fuerte mb-3">
                    {resultados.length} distribuidor{resultados.length > 1 ? 'es' : ''} encontrado{resultados.length > 1 ? 's' : ''}:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {resultados.map((store, idx) => (
                      <div key={idx}
                        onClick={() => seleccionarTienda(store)}
                        className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${selectedStore === store ? 'border-caborca-cafe bg-caborca-cafe/5' : 'border-gray-200 bg-gray-50 hover:border-caborca-cafe/50'}`}>
                        <p className="font-semibold text-caborca-cafe text-sm truncate">{store.nombre}</p>
                        <p className="text-xs text-caborca-beige-fuerte mb-1">{store.ciudad}</p>
                        <span className="text-xs px-2 py-0.5 bg-caborca-beige-fuerte text-white rounded">
                          {store.tipo === 'tienda' ? 'Tienda' : store.tipo === 'online' ? 'En línea' : 'Física y Online'}
                        </span>
                        {store.distance && (
                          <p className="text-xs text-gray-400 mt-1">{store.distance.toFixed(0)} km</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MAPA */}
            <div style={{ isolation: 'isolate', position: 'relative' }}
              className="rounded-xl overflow-hidden shadow-2xl max-w-7xl mx-auto">
              <div style={{ height: '520px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyToMarker center={mapCenter} zoom={mapZoom} />

                  {displayedMarkers.map((store, idx) => (
                    <Marker
                      key={idx}
                      position={[store.lat, store.lng]}
                      icon={createMapPin(selectedStore === store)}
                      eventHandlers={{ click: () => seleccionarTienda(store) }}
                    >
                      <Popup>
                        <div className="min-w-[160px]">
                          <p className="font-bold text-caborca-cafe text-sm">{store.nombre}</p>
                          <p className="text-xs text-gray-500">{store.ciudad}</p>
                          <span className="inline-block mt-1 text-xs bg-caborca-beige-fuerte text-white px-2 py-0.5 rounded">
                            {store.tipo === 'tienda' ? 'Tienda física' : store.tipo === 'online' ? 'En línea' : 'Física y Online'}
                          </span>
                          {store.telefono && (
                            <p className="text-xs text-gray-500 mt-1">📞 {store.telefono}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">Mapa © OpenStreetMap contributors</p>
          </div>
        </section>
      </main>

      <PieDePagina />
    </div>
  );
};

export default Distribuidores;
