import { useState, useEffect, useMemo } from 'react';
import { contactoService } from '../api/contactoService';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';
import { useLanguage } from '../context/LanguageContext';

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
                font-family="'Patua One', Georgia, serif"
                font-size="7.5" font-weight="bold" fill="${color}" letter-spacing="0.5">CB</text>
        </svg>
      </div>`,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -(h + 2)],
  });
};

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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Distribuidores = () => {
  const { language, t } = useLanguage();
  const [formulario, setFormulario] = useState({ nombreCompleto: '', correoElectronico: '', telefono: '', ciudad: '', mensaje: '' });
  const [enviandoDist, setEnviandoDist] = useState(false);
  const [resultadoDist, setResultadoDist] = useState(null);
  const [tipoCompra, setTipoCompra] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.5, -102.3]);
  const [mapZoom, setMapZoom] = useState(5);
  const [allDistribuidores, setAllDistribuidores] = useState([]);

  const [hero, setHero] = useState({
    badge_ES: 'ÚNETE A NOSOTROS',
    badge_EN: 'JOIN US',
    titulo_ES: '¿Quieres ser distribuidor?',
    titulo_EN: 'Do you want to be a distributor?',
    subtitulo_ES: 'Únete a nuestra red de distribuidores y forma parte de la familia Caborca',
    subtitulo_EN: 'Join our network of distributors and become part of the Caborca family',
    imagen: 'https://blocks.astratic.com/img/general-img-landscape.png'
  });
  const [formDist, setFormDist] = useState({
    titulo_ES: '¿Quieres ser distribuidor?',
    titulo_EN: 'Do you want to be a distributor?',
    subtitulo_ES: 'Si estás interesado, déjanos tus datos y nuestro equipo se pondrá en contacto contigo.',
    subtitulo_EN: 'If you are interested, leave us your details and our team will contact you.',
    submitLabel_ES: 'ENVIAR SOLICITUD',
    submitLabel_EN: 'SEND REQUEST',
    responseTime_ES: 'Respuesta en 24-48 hrs',
    responseTime_EN: 'Response in 24-48 hrs',
    distribuidores: '+500',
    estados: '20+',
  });
  const [mapInfo, setMapInfo] = useState({
    mapTitle_ES: 'Encuéntranos en el mapa',
    mapTitle_EN: 'Find us on the map',
    mapText_ES: 'Visita nuestras tiendas y distribuidores autorizados en todo México.',
    mapText_EN: 'Visit our stores and authorized distributors throughout Mexico.',
  });

  useEffect(() => {
    textosService.getTextos('distribuidores')
      .then(data => {
        if (!data || Object.keys(data).length === 0) return;
        if (data.hero) setHero(prev => ({ ...prev, ...data.hero }));
        if (data.formulario || data.counters) {
          setFormDist(prev => ({
            ...prev,
            ...data.formulario,
            distribuidores: data.counters?.distribuidores || prev.distribuidores,
            estados: data.counters?.estados || prev.estados,
          }));
        }
        setMapInfo(prev => ({
          ...prev,
          mapTitle: data.mapTitle || prev.mapTitle,
          mapText: data.mapText || prev.mapText,
        }));
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/Settings/ConfiguracionGeneral`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Array.isArray(data.distribuidoresList) && data.distribuidoresList.length > 0) {
          const mapped = data.distribuidoresList
            .filter(d => !isNaN(parseFloat(d.lat)) && !isNaN(parseFloat(d.lng)))
            .map(d => ({
              id: d.id || null,
              nombre: d.negocioNombre || d.contactoNombre || 'Distribuidor',
              contactoNombre: d.contactoNombre || '',
              ciudad: d.ciudad || '',
              estado: d.estado || '',
              pais: d.pais || '',
              colonia: d.colonia || '',
              calle: d.calle || '',
              numeroExt: d.numeroExt || '',
              cp: d.cp || '',
              tipo: d.tipoVenta || d.tipo || 'tienda',
              lat: parseFloat(d.lat),
              lng: parseFloat(d.lng),
              logo: d.logo || null,
              telefono: d.telefono || d.contactoTelefono || '',
              email: d.email || '',
              sitioWeb: d.sitioWeb || '',
              clasificacion: d.clasificacion || 'nacional',
            }));
          if (mapped.length > 0) setAllDistribuidores(mapped);
        }
      })
      .catch(() => { });
  }, []);

  const regionesList = useMemo(() => {
    const seen = new Set();
    return allDistribuidores
      .filter(d => d.estado && !seen.has(d.estado) && seen.add(d.estado))
      .map(d => d.estado)
      .sort((a, b) => a.localeCompare(b, 'es'));
  }, [allDistribuidores]);



  const labels = {
    nombre: language === 'es' ? 'Nombre completo' : 'Full name',
    nombrePlaceholder: language === 'es' ? 'Tu nombre' : 'Your name',
    correo: language === 'es' ? 'Correo electrónico' : 'Email address',
    telefono: language === 'es' ? 'Teléfono' : 'Phone',
    ciudad: language === 'es' ? 'Ciudad' : 'City',
    mensaje: language === 'es' ? 'Mensaje' : 'Message',
    mensajePlaceholder: language === 'es' ? 'Cuéntanos sobre tu negocio...' : 'Tell us about your business...',
    enviando: language === 'es' ? 'ENVIANDO...' : 'SENDING...',
    exito: language === 'es' ? '¡Solicitud enviada! Nos pondremos en contacto contigo pronto.' : 'Request sent! We will contact you soon.',
    distribuidoresLabel: language === 'es' ? 'Distribuidores' : 'Distributors',
    estadosLabel: language === 'es' ? 'Estados' : 'States',
    tipoCompra: language === 'es' ? 'Tipo de compra' : 'Purchase type',
    todosTipos: language === 'es' ? 'Todos los tipos' : 'All types',
    tiendaFisica: language === 'es' ? 'Tienda física' : 'Physical store',
    enLinea: language === 'es' ? 'En línea' : 'Online',
    ambos: language === 'es' ? 'Física y en línea' : 'Physical and online',
    region: language === 'es' ? 'Estado / Región' : 'State / Region',
    seleccionaRegion: language === 'es' ? 'Selecciona una región' : 'Select a region',
    usarUbicacion: language === 'es' ? 'Usar mi ubicación' : 'Use my location',
    ubicacionObteniendo: language === 'es' ? 'Obteniendo ubicación...' : 'Getting location...',
    ubicacionError: language === 'es' ? '✗ No se pudo obtener la ubicación' : '✗ Could not get location',
    encontrados: language === 'es' ? 'distribuidores encontrados' : 'distributors found',
    tiendaMini: language === 'es' ? '🏪 Tienda' : '🏪 Store',
    onlineMini: language === 'es' ? '🌐 Online' : '🌐 Online',
    ambosMini: language === 'es' ? '🏪🌐 Ambas' : '🏪🌐 Both',
    intlMini: language === 'es' ? '🌍 Intl.' : '🌍 Intl.',
  };

  const manejarUbicarme = () => {
    setMensajeUbicacion(labels.ubicacionObteniendo);
    if (!navigator.geolocation) {
      setMensajeUbicacion(language === 'es' ? '✗ Geolocalización no soportada' : '✗ Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: uLat, longitude: uLng } = pos.coords;
        setMensajeUbicacion('✓');
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
      () => setMensajeUbicacion(labels.ubicacionError)
    );
  };

  const manejarAplicarFiltros = () => {
    let filtrados = allDistribuidores;
    if (tipoCompra) filtrados = filtrados.filter(d => {
      const t = d.tipo;
      if (t === 'ambas' || t === 'ambos') return true;
      return t === tipoCompra;
    });
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
        <section className="relative bg-gray-50">
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img src={hero.imagen} alt="Caborca" className="w-full h-screen object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4 pt-20">
              <div>
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6 shadow-sm">
                  <span className="text-sm md:text-base font-bold tracking-widest uppercase text-white">{t(hero, 'badge')}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white">{t(hero, 'titulo')}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{t(hero, 'subtitulo')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLICITUD */}
        <section className="py-16 bg-caborca-beige-suave">
          <div className="container mx-auto px-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-serif text-caborca-cafe font-bold mb-4">{t(formDist, 'titulo')}</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t(formDist, 'subtitulo')}</p>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                setEnviandoDist(true);
                try {
                  await contactoService.enviarSolicitudDistribuidor(formulario);
                  setResultadoDist({ tipo: 'exito', mensaje: labels.exito });
                  setFormulario({ nombreCompleto: '', correoElectronico: '', telefono: '', ciudad: '', mensaje: '' });
                } catch (err) {
                  setResultadoDist({ tipo: 'error', mensaje: err.message });
                } finally { setEnviandoDist(false); }
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.nombre}</label>
                    <input type="text" value={formulario.nombreCompleto} onChange={e => setFormulario({ ...formulario, nombreCompleto: e.target.value })} placeholder={labels.nombrePlaceholder} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caborca-cafe outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.correo}</label>
                    <input type="email" value={formulario.correoElectronico} onChange={e => setFormulario({ ...formulario, correoElectronico: e.target.value })} placeholder="email@ejemplo.com" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caborca-cafe outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.telefono}</label>
                    <input type="tel" value={formulario.telefono} onChange={e => setFormulario({ ...formulario, telefono: e.target.value })} placeholder="(123) 456-7890" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caborca-cafe outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.ciudad}</label>
                    <input type="text" value={formulario.ciudad} onChange={e => setFormulario({ ...formulario, ciudad: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caborca-cafe outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.mensaje}</label>
                    <textarea value={formulario.mensaje} onChange={e => setFormulario({ ...formulario, mensaje: e.target.value })} placeholder={labels.mensajePlaceholder} rows="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-caborca-cafe outline-none resize-none" />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-col gap-4">
                    {resultadoDist && (
                      <div className={`px-4 py-2 rounded-lg text-sm font-bold ${resultadoDist.tipo === 'exito' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {resultadoDist.mensaje}
                      </div>
                    )}
                    <button type="submit" disabled={enviandoDist} className="bg-caborca-cafe text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50">
                      {enviandoDist ? labels.enviando : t(formDist, 'submitLabel')}
                    </button>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-caborca-cafe">{formDist.distribuidores}</div>
                      <div className="text-xs text-gray-400 uppercase font-bold">{labels.distribuidoresLabel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-caborca-cafe">{formDist.estados}</div>
                      <div className="text-xs text-gray-400 uppercase font-bold">{labels.estadosLabel}</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* MAPA */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif text-caborca-cafe font-bold mb-4">{t(mapInfo, 'mapTitle')}</h2>
              <p className="text-lg text-gray-600">{t(mapInfo, 'mapText')}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.tipoCompra}</label>
                <select value={tipoCompra} onChange={e => setTipoCompra(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg outline-none">
                  <option value="">{labels.todosTipos}</option>
                  <option value="tienda">{labels.tiendaFisica}</option>
                  <option value="online">{labels.enLinea}</option>
                  <option value="ambas">{labels.ambos}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-caborca-cafe mb-2">{labels.region}</label>
                <select value={estadoFiltro} onChange={e => setEstadoFiltro(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg outline-none">
                  <option value="">{labels.seleccionaRegion}</option>
                  {regionesList.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={manejarUbicarme} className="bg-white border-2 border-caborca-cafe text-caborca-cafe p-3 rounded-lg font-bold hover:bg-caborca-cafe hover:text-white transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {mensajeUbicacion || labels.usarUbicacion}
              </button>
              <div className="flex gap-2">
                <button onClick={manejarLimpiarFiltros} className="flex-1 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button onClick={manejarAplicarFiltros} className="flex-1 bg-caborca-cafe text-white p-3 rounded-lg hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
            </div>

            {resultados.length > 0 && (
              <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resultados.map((store, i) => (
                  <div key={i} onClick={() => seleccionarTienda(store)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedStore === store ? 'border-caborca-cafe bg-white shadow-lg' : 'border-transparent bg-white/50 hover:border-gray-300'}`}>
                    <div className="flex gap-4 items-center mb-2">
                      {store.logo && <img src={store.logo} alt="logo" className="w-10 h-10 object-contain rounded bg-white p-1" />}
                      <p className="font-bold text-caborca-cafe truncate">{store.nombre}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2 truncate">{store.ciudad}, {store.estado}</p>
                    <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-bold uppercase">
                      {store.tipo === 'tienda' ? labels.tiendaMini : store.tipo === 'online' ? labels.onlineMini : labels.ambosMini}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="h-[600px] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false} dragging={!L.Browser.mobile} attributionControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FlyToMarker center={mapCenter} zoom={mapZoom} />
                {displayedMarkers.map((store, i) => (
                  <Marker key={i} position={[store.lat, store.lng]} icon={createMapPin(selectedStore === store)} eventHandlers={{ click: () => seleccionarTienda(store) }}>
                    <Popup minWidth={250}>
                      <div className="p-2">
                        <p className="font-bold text-lg mb-1">{store.nombre}</p>
                        <p className="text-sm text-gray-600 mb-3">{[store.calle, store.colonia, store.ciudad].filter(Boolean).join(', ')}</p>
                        <div className="flex flex-col gap-2">
                          {store.telefono && <a href={`tel:${store.telefono}`} className="text-sm text-caborca-cafe font-bold flex items-center gap-2">📞 {store.telefono}</a>}
                          {store.sitioWeb && <a href={store.sitioWeb} target="_blank" rel="noreferrer" className="text-sm text-caborca-cafe font-bold flex items-center gap-2">🌐 {store.sitioWeb.replace(/^https?:\/\//, '')}</a>}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
};

export default Distribuidores;
