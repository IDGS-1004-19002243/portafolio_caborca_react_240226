import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import homeService from '../api/homeService';
import { useLanguage } from '../context/LanguageContext';

const CatalogoHombre = () => {
  const { language, t } = useLanguage();
  const [ordenarPor, setOrdenarPor] = useState('');
  const [estilo, setEstilo] = useState('');
  const [listaProductos, setListaProductos] = useState([]);
  const [contenido, setContenido] = useState(null);

  useEffect(() => {
    homeService.getCatalogoHombre().then(data => {
      if (data && data.productos) {
        setListaProductos(data.productos);
      }
      if (data && data.contenido) {
        setContenido(data.contenido);
      }
    }).catch(console.error);
  }, []);

  const productosFiltrados = useMemo(() => {
    let lista = [...listaProductos];
    if (estilo) {
      lista = lista.filter(p =>
        (p.categoria || p.estilo || '').toLowerCase().includes(estilo.toLowerCase())
      );
    }
    if (ordenarPor === 'nombre') {
      lista.sort((a, b) => (t(a, 'nombre') || '').localeCompare(t(b, 'nombre') || ''));
    } else if (ordenarPor === 'nuevo') {
      lista.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    return lista;
  }, [listaProductos, estilo, ordenarPor, t]);

  const labels = {
    titulo: language === 'es' ? 'Botas para Hombre' : "Men's Boots",
    subtitulo: language === 'es' ? 'Artesanía mexicana de alta calidad, diseñada para el hombre distinguido' : 'High-quality Mexican craftsmanship, designed for the distinguished man',
    encontrados: language === 'es' ? 'productos encontrados' : 'products found',
    ordenar: language === 'es' ? 'Ordenar por' : 'Sort by',
    nombreAZ: language === 'es' ? 'Nombre A-Z' : 'Name A-Z',
    recientes: language === 'es' ? 'Más Recientes' : 'Newest',
    estilo: language === 'es' ? 'Estilo' : 'Style',
    verDetalles: language === 'es' ? 'VER DETALLES' : 'VIEW DETAILS',
    proximamente: language === 'es' ? 'Próximamente más modelos disponibles' : 'More models coming soon'
  };

  return (
    <div className="text-caborca-cafe font-sans" style={{ backgroundColor: '#F7F4F0' }}>
      <Encabezado />

      <main>
        {/* HERO SECTION */}
        <section className="pt-24 sm:pt-32 pb-10 sm:pb-14" style={{ backgroundColor: '#F0EBE3' }}>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 sm:mb-6 text-caborca-cafe">
              {t(contenido, 'titulo') || labels.titulo}
            </h1>
            <div className="w-20 sm:w-24 h-1 bg-caborca-cafe mx-auto mb-4 sm:mb-6"></div>
            <p className="text-caborca-cafe text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t(contenido, 'subtitulo') || labels.subtitulo}
            </p>
          </div>
        </section>

        {/* FILTROS */}
        <section className="py-4 sm:py-5 border-b border-caborca-beige-bronce" style={{ backgroundColor: '#F0EBE3' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
              <p className="text-caborca-cafe font-semibold text-sm sm:text-base">
                <span>{productosFiltrados.length}</span> {labels.encontrados}
              </p>
              <div className="flex gap-3 sm:gap-4 flex-wrap w-full sm:w-auto">
                <select
                  value={ordenarPor}
                  onChange={e => setOrdenarPor(e.target.value)}
                  className="border border-caborca-beige-fuerte rounded-lg py-2 px-3 sm:px-4 focus:border-caborca-cafe focus:outline-none text-sm flex-1 sm:flex-initial bg-white text-caborca-cafe"
                >
                  <option value="">{labels.ordenar}</option>
                  <option value="nombre">{labels.nombreAZ}</option>
                  <option value="nuevo">{labels.recientes}</option>
                </select>
                <select
                  value={estilo}
                  onChange={e => setEstilo(e.target.value)}
                  className="border border-caborca-beige-fuerte rounded-lg py-2 px-4 focus:border-caborca-cafe focus:outline-none text-sm bg-white text-caborca-cafe"
                >
                  <option value="">{labels.estilo}</option>
                  <option value="vaquero">Vaquero</option>
                  <option value="clasico">Clásico</option>
                  <option value="casual">Casual</option>
                  <option value="work">Trabajo</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* CATÁLOGO DE PRODUCTOS */}
        <section className="py-16" style={{ backgroundColor: '#F7F4F0' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <div key={producto.id} className="group relative">
                      <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[3/4] bg-gray-100">
                        <img
                          src={(producto.imagenes && producto.imagenes[0]) || producto.imagen || "https://blocks.astratic.com/img/general-img-portrait.png"}
                          alt={t(producto, 'nombre')}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {t(producto, 'badge') && (
                          <div className="absolute top-4 right-4 bg-caborca-cafe text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wider z-10 uppercase">
                            {t(producto, 'badge')}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Link to={`/producto/hombre/${producto.id}`} className="bg-white text-caborca-cafe px-8 py-3 rounded-full font-bold tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100 shadow-xl">
                            {labels.verDetalles}
                          </Link>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-xl font-serif font-bold text-caborca-cafe mb-1">
                          <Link to={`/producto/hombre/${producto.id}`}>{t(producto, 'nombre')}</Link>
                        </h3>
                        <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">
                          {producto.sku ? `SKU: ${producto.sku}` : (producto.categoria || '')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 text-center py-20 text-gray-400">
                    <p className="text-xl">{labels.proximamente}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PieDePagina />
    </div>
  );
};

export default CatalogoHombre;
