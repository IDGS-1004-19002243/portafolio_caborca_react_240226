import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import homeService from '../api/homeService';
import { useLanguage } from '../context/LanguageContext';

const DetalleProducto = () => {
  const { catalogo, id } = useParams();
  const { language, t } = useLanguage();
  const [producto, setProducto] = useState(null);
  const [imagenPrincipal, setImagenPrincipal] = useState('https://blocks.astratic.com/img/general-img-landscape.png');
  const [imagenSeleccionadaIndex, setImagenSeleccionadaIndex] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    Promise.all([
      homeService.getCatalogoHombre().catch(() => null),
      homeService.getCatalogoMujer().catch(() => null)
    ]).then(([dataHombre, dataMujer]) => {
      let all = [];

      // Extract products from Hombre
      if (dataHombre) {
        const p = Array.isArray(dataHombre) ? dataHombre : (dataHombre.productos || []);
        all = all.concat(p.map(x => ({ ...x, catalogoPadre: 'hombre' })));
      }

      // Extract products from Mujer
      if (dataMujer) {
        const p = Array.isArray(dataMujer) ? dataMujer : (dataMujer.productos || []);
        all = all.concat(p.map(x => ({ ...x, catalogoPadre: 'mujer' })));
      }

      // Handle both cases: matching just ID vs matching catalogue + ID
      let found = null;
      if (catalogo) {
        found = all.find(p => String(p.id) === String(id) && p.catalogoPadre === catalogo);
      }

      if (!found) {
        // Fallback for legacy URL backwards compatibility
        found = all.find(p => String(p.id) === String(id));
      }
      if (found) {
        setProducto(found);
        if (found.imagenes && found.imagenes.length > 0) {
          setImagenPrincipal(found.imagenes[0]);
        } else if (found.imagen) {
          setImagenPrincipal(found.imagen);
        }


      }
      setLoading(false);
    });
  }, [id]);

  const breadcrumbs = useMemo(() => {
    if (!producto) return [];
    return [
      { name: language === 'es' ? 'Inicio' : 'Home', path: '/' },
      { name: language === 'es' ? `Botas ${producto.catalogoPadre === 'mujer' ? 'Dama' : 'Caballero'}` : `${producto.catalogoPadre === 'mujer' ? 'Women' : 'Men'}'s Boots`, path: `/catalogo/${producto.catalogoPadre}` },
      { name: t(producto, 'nombre'), active: true }
    ];
  }, [producto, language, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-caborca-cafe font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#5C4A3A]"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white text-caborca-cafe font-sans">
        <Encabezado />
        <div className="pt-32 text-center h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl text-caborca-cafe font-serif mb-4">
            {language === 'es' ? 'Producto No Encontrado' : 'Product Not Found'}
          </h1>
          <Link to="/" className="bg-caborca-cafe text-white px-6 py-2 rounded-lg">
            {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
        </div>
        <PieDePagina />
      </div>
    );
  }

  const imagenes = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : [producto.imagen || 'https://blocks.astratic.com/img/general-img-landscape.png'];

  return (
    <div>
      <Encabezado />

      {/* BREADCRUMB */}
      <section className="pt-28 pb-2 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-caborca-cafe flex items-center gap-2">
              {breadcrumbs.map((bc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {bc.path ? (
                    <Link to={bc.path} className="font-medium hover:underline text-caborca-cafe font-semibold text-xs sm:text-sm">{bc.name}</Link>
                  ) : (
                    <span className="text-caborca-cafe font-bold text-xs sm:text-sm truncate max-w-[150px]">{bc.name}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <svg className="w-4 h-4 text-caborca-cafe opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* DETALLE DEL PRODUCTO */}
      <section className="pt-8 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">

              {/* GALERÍA DE IMÁGENES */}
              <div className="h-fit">
                {/* Imagen Principal con Zoom */}
                <div
                  className="mb-6 rounded-xl overflow-hidden relative group cursor-zoom-in bg-gray-50"
                  onMouseMove={(e) => {
                    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - left) / width) * 100;
                    const y = ((e.clientY - top) / height) * 100;
                    e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                    e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
                  }}
                >
                  <img
                    src={imagenPrincipal}
                    alt={t(producto, 'nombre')}
                    className="w-full aspect-square object-contain transition-transform duration-200 ease-out sm:group-hover:scale-150"
                    style={{
                      transformOrigin: 'var(--zoom-x, 50%) var(--zoom-y, 50%)'
                    }}
                  />
                </div>

                {/* Miniaturas */}
                <div className="grid grid-cols-4 gap-3">
                  {imagenes.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setImagenPrincipal(img);
                        setImagenSeleccionadaIndex(idx);
                      }}
                      className={`cursor-pointer rounded-lg overflow-hidden transition ${imagenSeleccionadaIndex === idx
                        ? 'border-2 border-caborca-cafe'
                        : 'border border-transparent hover:border-gray-200 bg-gray-50'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Vista ${idx + 1}`}
                        className="w-full aspect-square object-contain hover:opacity-75 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* INFORMACIÓN DEL PRODUCTO */}
              <div>
                <div className="mb-4">
                  {producto.badge && (
                    <span className="bg-caborca-beige-fuerte text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mr-2">
                      {producto.badge}
                    </span>
                  )}
                  {producto.destacado && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      {language === 'es' ? 'Destacado' : 'Featured'}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-caborca-beige-fuerte font-bold mb-2">
                  {t(producto, 'nombre')}
                </h1>

                <p className="text-sm text-gray-500 mb-4 font-medium uppercase">
                  {producto.sku ? `SKU: ${producto.sku}` : `CAT: ${producto.categoria || ''}`}
                </p>

                <div className="text-gray-600 mb-8 leading-relaxed space-y-4 text-base sm:text-lg">
                  <p>
                    {t(producto, 'descripcion')}
                  </p>
                </div>

                <div className="mb-10">
                  <h3 className="text-sm font-bold text-caborca-beige-fuerte uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                    {language === 'es' ? 'FICHA TÉCNICA' : 'TECHNICAL SPECIFICATIONS'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
                    {producto.materiales && producto.materiales.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{language === 'es' ? 'Materiales' : 'Materials'}</span>
                        <span className="font-bold text-caborca-cafe text-base capitalize">{producto.materiales.join(', ')}</span>
                      </div>
                    )}
                    {producto.materialCorte && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{language === 'es' ? 'Material en Corte' : 'Cut Material'}</span>
                        <span className="font-bold text-caborca-cafe text-base">{producto.materialCorte}</span>
                      </div>
                    )}
                    {producto.suela && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{language === 'es' ? 'Suela' : 'Sole'}</span>
                        <span className="font-bold text-caborca-cafe text-base">{producto.suela}</span>
                      </div>
                    )}
                    {producto.construccion && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{language === 'es' ? 'Construcción' : 'Construction'}</span>
                        <span className="font-bold text-caborca-cafe text-base">{producto.construccion}</span>
                      </div>
                    )}
                    {producto.horma && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">{language === 'es' ? 'Horma' : 'Last'}</span>
                        <span className="font-bold text-caborca-cafe text-base">{producto.horma}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link
                      to="/contacto"
                      className="w-full flex items-center justify-center gap-2 bg-caborca-beige-fuerte text-white px-8 py-4 rounded-lg font-bold tracking-wider hover:bg-caborca-cafe transition shadow-md text-sm sm:text-base group text-center"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {language === 'es' ? 'Obtener más información con nosotros' : 'Request more information from us'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <PieDePagina />
    </div>
  );
};

export default DetalleProducto;
