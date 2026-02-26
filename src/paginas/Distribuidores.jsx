import { useState, useEffect } from 'react';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';

const Distribuidores = () => {
  const [formulario, setFormulario] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    telefono: '',
    ciudad: '',
    mensaje: ''
  });

  const [tipoCompra, setTipoCompra] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensajeUbicacion, setMensajeUbicacion] = useState('');
  const [mapSrc, setMapSrc] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120615.72236587609!2d-99.2840989!3d19.432608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0026db097507%3A0x54061076265ee841!2sCiudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx");
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
    mapTitle: 'Encúentranos en el mapa',
    mapText: 'Visita nuestras tiendas y distribuidores autorizados en todo México.'
  });

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
            estados: data.counters?.estados || prev.estados
          }));
        }
        setMapInfo(prev => ({
          mapTitle: data.mapTitle || prev.mapTitle,
          mapText: data.mapText || prev.mapText
        }));
      })
      .catch(() => console.warn('Distribuidores: usando datos por defecto'));
  }, []);
  // Datos de distribuidores
  const distribuidoresData = [
    { nombre: "AZ Boot Bootique", estado: "arizona", ciudad: "Phoenix", tipo: "ambos", lat: 33.4484, lng: -112.0740 },
    { nombre: "Texas Boot Company", estado: "texas", ciudad: "Houston", tipo: "tienda", lat: 29.7604, lng: -95.3698 },
    { nombre: "Allens Boots", estado: "texas", ciudad: "Austin", tipo: "ambos", lat: 30.2672, lng: -97.7431 },
    { nombre: "Cavender's", estado: "texas", ciudad: "San Antonio", tipo: "tienda", lat: 29.4241, lng: -98.4936 },
    { nombre: "Lost Creek", estado: "california", ciudad: "Los Angeles", tipo: "online", lat: 34.0522, lng: -118.2437 },
    { nombre: "Melbelle", estado: "cdmx", ciudad: "Ciudad de México", tipo: "ambos", lat: 19.4326, lng: -99.1332 },
    { nombre: "Boot Barn Jalisco", estado: "jalisco", ciudad: "Guadalajara", tipo: "tienda", lat: 20.6597, lng: -103.3496 },
    { nombre: "Botas del Norte", estado: "nuevo-leon", ciudad: "Monterrey", tipo: "ambos", lat: 25.6866, lng: -100.3161 },
    { nombre: "Caborca Sonora Store", estado: "sonora", ciudad: "Hermosillo", tipo: "tienda", lat: 29.0729, lng: -110.9559 },
    { nombre: "Chihuahua Boots", estado: "chihuahua", ciudad: "Chihuahua", tipo: "tienda", lat: 28.6353, lng: -106.0889 }
  ];

  const manejarCambioFormulario = (evento) => {
    const { name, value } = evento.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvioFormulario = (evento) => {
    evento.preventDefault();
    console.log('Formulario enviado:', formulario);
    alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
  };

  const manejarLimpiarFiltros = () => {
    setTipoCompra('');
    setEstadoFiltro('');
    setResultados([]);
    setMensajeUbicacion('');
    setMapSrc("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120615.72236587609!2d-99.2840989!3d19.432608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0026db097507%3A0x54061076265ee841!2sCiudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx");
  };

  const manejarAplicarFiltros = () => {
    let filtrados = distribuidoresData;

    if (tipoCompra) {
      filtrados = filtrados.filter(d => d.tipo === tipoCompra || d.tipo === 'ambos');
    }

    if (estadoFiltro) {
      filtrados = filtrados.filter(d => d.estado === estadoFiltro);
    }

    setResultados(filtrados);

    if (filtrados.length > 0) {
      actualizarMapa(filtrados[0]);
    }
  };

  const actualizarMapa = (store) => {
    setMapSrc(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${store.lng}!3d${store.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx`);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const manejarUbicarme = () => {
    setMensajeUbicacion('Obteniendo ubicación...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          const userLat = posicion.coords.latitude;
          const userLng = posicion.coords.longitude;

          setMensajeUbicacion('✓ Ubicación obtenida');

          const storesWithDistance = distribuidoresData.map(store => ({
            ...store,
            distance: calculateDistance(userLat, userLng, store.lat, store.lng)
          })).sort((a, b) => a.distance - b.distance);

          const nearby = storesWithDistance.slice(0, 5);
          setResultados(nearby);

          if (nearby.length > 0) {
            actualizarMapa(nearby[0]);
          }
        },
        (error) => {
          console.error('Error:', error);
          setMensajeUbicacion('✗ No se pudo obtener la ubicación');
        }
      );
    } else {
      setMensajeUbicacion('✗ Geolocalización no soportada');
    }
  };

  return (
    <div className="bg-white text-caborca-cafe font-sans">
      <Encabezado />

      <main>
        {/* HERO IMAGE SECTION */}
        <section className="relative pt-[95px] bg-gray-50">
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img
              src={hero.imagen}
              alt="Distribuidores Caborca Boots"
              className="w-full h-[600px] object-cover"
              onError={e => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6">
                  <p className="text-sm md:text-base font-medium tracking-widest uppercase text-white">
                    {hero.badge}
                  </p>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif mb-6">{hero.titulo}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  {hero.subtitulo}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULARIO DISTRIBUIDOR */}
        <section className="py-16 bg-caborca-beige-suave">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-serif text-caborca-beige-fuerte font-bold mb-2">
                    {formDist.titulo}
                  </h3>
                  <p className="text-lg md:text-xl text-caborca-cafe/90 max-w-3xl mx-auto">
                    {formDist.subtitulo}
                  </p>
                </div>
                <br />
                <form onSubmit={manejarEnvioFormulario} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="nombreCompleto"
                        value={formulario.nombreCompleto}
                        onChange={manejarCambioFormulario}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        name="correoElectronico"
                        value={formulario.correoElectronico}
                        onChange={manejarCambioFormulario}
                        placeholder="correo@ejemplo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={manejarCambioFormulario}
                        placeholder="(123) 456-7890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formulario.ciudad}
                        onChange={manejarCambioFormulario}
                        placeholder="Tu ciudad"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-caborca-beige-fuerte mb-2">
                        Mensaje
                      </label>
                      <textarea
                        rows="1"
                        name="mensaje"
                        value={formulario.mensaje}
                        onChange={manejarCambioFormulario}
                        placeholder="Cuéntanos sobre tu negocio..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caborca-cafe focus:border-transparent resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                    <button type="submit" className="bg-caborca-beige-fuerte text-white px-8 py-3 rounded-lg font-bold">
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

        {/* MAP SECTION */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-serif mb-8 text-caborca-beige-fuerte font-bold text-center">
              {mapInfo.mapTitle}
            </h2>
            <p className="text-center mb-8 text-caborca-cafe font-bold">
              {mapInfo.mapText}
            </p>

            {/* Filtros de Búsqueda */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Filtro por Tipo de Compra */}
                <div className="flex flex-col">
                  <label htmlFor="purchaseType" className="block text-sm font-bold text-caborca-beige-fuerte mb-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Tipo de compra
                  </label>
                  <select
                    id="purchaseType"
                    value={tipoCompra}
                    onChange={(e) => setTipoCompra(e.target.value)}
                    className="border-2 border-gray-300 rounded py-2 px-4 focus:border-caborca-cafe focus:outline-none transition-colors w-full"
                  >
                    <option value="">Todos los tipos</option>
                    <option value="tienda">Tienda física</option>
                    <option value="online">Compra en línea</option>
                    <option value="ambos">Tienda física y en línea</option>
                  </select>
                </div>

                {/* Filtro por Estado/Ciudad */}
                <div className="flex flex-col">
                  <label htmlFor="stateFilter" className="block text-sm font-bold text-caborca-beige-fuerte mb-2">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Ubicación por Estado
                  </label>
                  <select
                    id="stateFilter"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="border-2 border-gray-300 rounded py-2 px-4 focus:border-caborca-cafe focus:outline-none transition-colors w-full"
                  >
                    <option value="">Selecciona un estado</option>
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

                {/* Botón Usar mi ubicación */}
                <div className="flex flex-col justify-end">
                  <button
                    onClick={manejarUbicarme}
                    className="bg-caborca-beige-fuerte text-white py-2 px-4 rounded hover:bg-caborca-cafe/80 transition-colors whitespace-nowrap w-full"
                    title="Usar mi ubicación"
                  >
                    <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Usar mi ubicación
                  </button>
                  {mensajeUbicacion && (
                    <p className={`text-xs mt-1 ${mensajeUbicacion.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
                      {mensajeUbicacion}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col justify-end">
                  <div className="flex gap-2">
                    <button
                      onClick={manejarLimpiarFiltros}
                      className="bg-gray-200 text-caborca-beige-fuerte py-2 px-3 rounded hover:bg-gray-300 transition-colors flex-1"
                      title="Limpiar filtros"
                    >
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      onClick={manejarAplicarFiltros}
                      className="bg-caborca-beige-fuerte text-white py-2 px-3 rounded hover:bg-caborca-cafe/80 transition-colors flex-1"
                      title="Buscar distribuidores"
                    >
                      <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {resultados.length > 0 && (
                <div className="mt-6">
                  <div className="border-t-2 border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-caborca-beige-fuerte font-boldmb-3">Distribuidores encontrados:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {resultados.map((store, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                          onClick={() => actualizarMapa(store)}
                        >
                          <p className="font-semibold text-caborca-cafe text-sm">{store.nombre}</p>
                          <p className="text-xs text-caborca-beige-fuerte mb-1">{store.ciudad}</p>
                          <span className="text-xs px-2 py-0.5 bg-caborca-beige-fuerte text-white rounded inline-block">
                            {store.tipo === 'tienda' ? 'Tienda física' : store.tipo === 'online' ? 'En línea' : 'Física y Online'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-xl max-w-7xl mx-auto" style={{ height: '500px' }}>
              <iframe
                id="mapFrame"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Mapa de distribuidores"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      <PieDePagina />
    </div>
  );
};

export default Distribuidores;
