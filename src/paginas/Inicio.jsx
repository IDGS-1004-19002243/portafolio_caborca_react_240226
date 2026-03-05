import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Encabezado from '../componentes/Encabezado';
import Carrusel from '../componentes/Carrusel';
import PieDePagina from '../componentes/PieDePagina';
import homeService from '../api/homeService';
import { contactoService } from '../api/contactoService';
import { useLanguage } from '../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'https://localhost:7020/api' : 'https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api');

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Pin CB — mismo que Distribuidores.jsx
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
                fill="url(#shine${selected ? 'S' : 'N'})"/>
          <defs>
            <radialGradient id="shine${selected ? 'S' : 'N'}" cx="35%" cy="30%" r="55%">
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

// Distribuidores demo (se reemplazan con datos reales de la API)
const DEMO_MARKERS = [
    { nombre: 'AZ Boot Boutique', ciudad: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
    { nombre: 'Texas Boot Company', ciudad: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
    { nombre: 'Melbelle', ciudad: 'Ciudad de México', lat: 19.4326, lng: -99.1332 },
    { nombre: 'Boot Barn Jalisco', ciudad: 'Guadalajara', lat: 20.6597, lng: -103.3496 },
    { nombre: 'Botas del Norte', ciudad: 'Monterrey', lat: 25.6866, lng: -100.3161 },
    { nombre: 'Caborca Sonora Store', ciudad: 'Hermosillo', lat: 29.0729, lng: -110.9559 },
];

const Inicio = () => {
    const { t } = useLanguage();
    const [activeFilter, setActiveFilter] = useState('todos');
    const [formInicio, setFormInicio] = useState({ nombreCompleto: '', correoElectronico: '', telefono: '', ciudad: '', mensaje: '' });
    const [enviandoInicio, setEnviandoInicio] = useState(false);
    const [resultadoInicio, setResultadoInicio] = useState(null);

    // ── Estados dinámicos del CMS ──────────────────────────────────────────────
    const [rawContent, setRawContent] = useState(null);
    const [configGeneral, setConfigGeneral] = useState(null);

    // Cargar logos de distribuidores de la configuración general
    useEffect(() => {
        fetch(`${API_URL}/Settings/ConfiguracionGeneral`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data) setConfigGeneral(data);
            })
            .catch(() => { });
    }, []);

    // Cargar datos dinámicos de la API
    useEffect(() => {
        homeService.getHomeContent()
            .then(data => {
                if (data) setRawContent(data);
            })
            .catch(() => {
                console.warn('API no disponible, usando textos por defecto.');
            });
    }, []);

    // ── Mapeo de Contenido según Idioma ──────────────────────────────────────
    const distribuidores = useMemo(() => {
        if (!rawContent?.distribuidoresLogos || (!rawContent.distribuidoresLogos.titulo && !rawContent.distribuidoresLogos.titulo_ES)) return {
            titulo: "Distribuidores Autorizados",
            subtitulo: "Encuentra nuestras colecciones exclusivas",
            textoBoton: "VER TODOS LOS DISTRIBUIDORES",
            linkBoton: "/distribuidores",
            logos: []
        };
        return {
            titulo: t(rawContent.distribuidoresLogos, 'titulo'),
            subtitulo: t(rawContent.distribuidoresLogos, 'subtitulo') || "Encuentra nuestras colecciones exclusivas",
            textoBoton: t(rawContent.distribuidoresLogos, 'textoBoton') || "VER TODOS LOS DISTRIBUIDORES",
            linkBoton: "/distribuidores",
            logos: [
                { imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png" },
                { imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png" },
                { imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png" },
                { imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png" }
            ]
        };
    }, [rawContent, t]);

    const sustentabilidad = useMemo(() => {
        if (!rawContent?.sustentabilidad || (!rawContent.sustentabilidad.titulo && !rawContent.sustentabilidad.titulo_ES)) return {
            titulo: "Sustentabilidad",
            descripcion: "Nos comprometemos con el medio ambiente, utilizando procesos responsables y materiales sostenibles en cada etapa de producción.",
            textoBoton: "Conoce más",
            linkBoton: "/responsabilidad-ambiental",
            imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png",
            badge: "COMPROMISO AMBIENTAL",
            tituloDerecho: "Nuestro compromiso con el planeta",
            notaCertificacion: "Certificado por prácticas sustentables",
            features: [
                { titulo: "Materiales Sostenibles", descripcion: "Seleccionamos las mejores pieles de proveedores responsables con el medio ambiente." },
                { titulo: "Reciclaje Responsable", descripcion: "Implementamos procesos de reciclaje en cada etapa de producción." },
                { titulo: "Reducción de Huella", descripcion: "Optimizamos el consumo de agua y energía en la manufactura de cada par de botas." },
                { titulo: "Producción Ética", descripcion: "Garantizamos condiciones laborales justas y responsables en toda nuestra cadena." }
            ]
        };
        const data = rawContent.sustentabilidad;
        return {
            titulo: t(data, 'titulo'),
            descripcion: t(data, 'descripcion'),
            textoBoton: t(data, 'textoBoton'),
            linkBoton: data.linkBoton || "/responsabilidad-ambiental",
            imagenUrl: data.imagenUrl || "https://blocks.astratic.com/img/general-img-landscape.png",
            badge: t(data, 'badge'),
            tituloDerecho: t(data, 'tituloDerecho'),
            notaCertificacion: t(data, 'notaCertificacion'),
            features: data.features?.length > 0
                ? data.features.map(f => ({ titulo: t(f, 'titulo'), descripcion: t(f, 'descripcion') }))
                : []
        };
    }, [rawContent, t]);

    const formDistribuidor = useMemo(() => {
        if (!rawContent?.formDistribuidor || (!rawContent.formDistribuidor.titulo && !rawContent.formDistribuidor.titulo_ES)) return {
            titulo: "¿Quieres ser distribuidor?",
            descripcion: "Únete a nuestra red de distribuidores y forma parte de la familia Caborca.",
            textoBoton: "ENVIAR SOLICITUD",
            notaTiempo: "Respuesta en 24-48 hrs",
            statDistribuidores: "+500",
            statEstados: "20+"
        };
        const data = rawContent.formDistribuidor;
        return {
            titulo: t(data, 'titulo'),
            descripcion: t(data, 'descripcion'),
            textoBoton: t(data, 'textoBoton'),
            notaTiempo: t(data, 'notaTiempo'),
            statDistribuidores: data.statDistribuidores || "+500",
            statEstados: data.statEstados || "20+"
        };
    }, [rawContent, t]);

    const arteCreacion = useMemo(() => {
        if (!rawContent?.arteCreacion || (!rawContent.arteCreacion.titulo && !rawContent.arteCreacion.titulo_ES)) return {
            badge: "ARTESANÍA MEXICANA",
            titulo: "El arte de la creación",
            anosExperiencia: 40,
            features: [
                { titulo: "Maestros Talabarteros", descripcion: "Cada par es creado con pasión y dedicación por artesanos con décadas de experiencia." },
                { titulo: "Materiales Premium", descripcion: "Utilizamos los mejores materiales y técnicas tradicionales para garantizar calidad excepcional." },
                { titulo: "Excelencia Garantizada", descripcion: "Nuestro compromiso con la excelencia nos ha convertido en líderes en calzado vaquero de lujo." }
            ],
            boton: "CONOCE NUESTRA HISTORIA",
            nota: "Calidad certificada",
            imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png"
        };
        const data = rawContent.arteCreacion;
        return {
            badge: t(data, 'badge'),
            titulo: t(data, 'titulo'),
            anosExperiencia: data.anosExperiencia || 40,
            features: data.features?.length > 0
                ? data.features.map(f => ({ titulo: t(f, 'titulo'), descripcion: t(f, 'descripcion') }))
                : [],
            boton: t(data, 'boton'),
            nota: t(data, 'nota'),
            imagenUrl: data.imagenUrl || "https://blocks.astratic.com/img/general-img-landscape.png"
        };
    }, [rawContent, t]);

    const dondeComprar = useMemo(() => {
        if (!rawContent?.dondeComprar || (!rawContent.dondeComprar.titulo && !rawContent.dondeComprar.titulo_ES)) return {
            titulo: "¿Dónde comprar?",
            descripcion: "Encuentra nuestras tiendas y distribuidores autorizados en todo el mundo.",
            textoBoton: "VER TODOS LOS DISTRIBUIDORES",
            linkBoton: "/distribuidores",
            mapaUrl: "",
            nota: "Conoce la ubicación y contacto de todos nuestros distribuidores autorizados"
        };
        const data = rawContent.dondeComprar;
        return {
            titulo: t(data, 'titulo'),
            descripcion: t(data, 'descripcion'),
            textoBoton: t(data, 'textoBoton'),
            linkBoton: "/distribuidores",
            mapaUrl: data.mapaUrl || "",
            nota: t(data, 'nota')
        };
    }, [rawContent, t]);

    const productosDestacadosTitulo = useMemo(() => {
        return t(rawContent?.productosDestacados, 'titulo') || "Conoce nuestros nuevos estilos";
    }, [rawContent, t]);

    const [productosCatalogoDestacados, setProductosCatalogoDestacados] = useState([]);

    useEffect(() => {
        Promise.all([
            homeService.getCatalogoHombre().catch(() => null),
            homeService.getCatalogoMujer().catch(() => null)
        ]).then(([dataHombre, dataMujer]) => {
            let all = [];
            if (dataHombre) {
                const p = Array.isArray(dataHombre) ? dataHombre : (dataHombre.productos || []);
                all = all.concat(p.map(x => ({ ...x, catalogoPadre: 'hombre' })));
            }
            if (dataMujer) {
                const p = Array.isArray(dataMujer) ? dataMujer : (dataMujer.productos || []);
                all = all.concat(p.map(x => ({ ...x, catalogoPadre: 'mujer' })));
            }
            setProductosCatalogoDestacados(all.filter(p => p.destacado).slice(0, 4));
        });
    }, []);

    const filteredDistributors = useMemo(() => {
        const logosConfig = configGeneral?.distribuidoresList || [];
        let items = [];
        if (logosConfig.length > 0) {
            items = logosConfig.map((l, i) => ({
                id: l.id || i,
                name: l.negocioNombre || 'Distribuidor',
                category: l.clasificacion || 'todos',
                logo: l.logo,
                sitioWeb: l.sitioWeb,
                destacado: l.destacado
            }));
        } else if (distribuidores.logos?.length > 0) {
            items = distribuidores.logos.map((l, i) => ({ id: i, name: 'Distribuidor', category: 'todos', logo: l.imagenUrl }));
        }

        if (items.length === 0) return [];

        if (activeFilter === 'todos') return items;
        if (activeFilter === 'destacados') return items.filter(d => d.destacado);
        return items.filter(d => d.category === activeFilter);
    }, [configGeneral, distribuidores, activeFilter]);

    return (
        <div className="min-h-screen">
            {/* Admin controls removed for portfolio-only build */}
            {/* Carrusel con header integrado */}
            <div className="relative h-screen">
                <Encabezado />
                <Carrusel />
            </div>

            <main className="relative z-10 bg-white">
                {/* 4. FEATURED PRODUCTS SECTION */}
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center text-2xl sm:text-3xl font-serif font-bold mb-8 sm:mb-10 text-caborca-beige-fuerte">
                            {productosDestacadosTitulo}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
                            {productosCatalogoDestacados.length > 0 ? (
                                productosCatalogoDestacados.map((producto, idx) => (
                                    <Link key={idx} to={`/producto/${producto.catalogoPadre || 'catalogo'}/${producto.id}`} className="block text-center group cursor-pointer">
                                        <div className="bg-gray-100 overflow-hidden aspect-square w-full relative">
                                            <img
                                                src={(producto.imagenes && producto.imagenes[0]) || producto.imagen || "https://blocks.astratic.com/img/general-img-landscape.png"}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {t(producto, 'badge') && (
                                                <span className="absolute top-2 right-2 bg-caborca-cafe text-white text-xs px-2 py-1 font-bold">{t(producto, 'badge')}</span>
                                            )}
                                        </div>
                                        <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte uppercase">{t(producto, 'nombre')}</h3>
                                        {producto.sku && <p className="text-xs text-gray-400 mt-1">{producto.sku}</p>}
                                    </Link>
                                ))
                            ) : (
                                <>
                                    {/* Fallback estático cuando no hay destacados */}
                                    <div className="text-center group">
                                        <div className="bg-gray-100 overflow-hidden aspect-square w-full">
                                            <img
                                                src="https://blocks.astratic.com/img/general-img-landscape.png"
                                                alt="Diseño Exclusivo"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">DISEÑO EXCLUSIVO</h3>
                                    </div>
                                    <div className="text-center group">
                                        <div className="bg-gray-100 overflow-hidden aspect-square w-full">
                                            <img
                                                src="https://blocks.astratic.com/img/general-img-landscape.png"
                                                alt="Diseño Exclusivo"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">DISEÑO EXCLUSIVO</h3>
                                    </div>
                                    <div className="text-center group">
                                        <div className="bg-gray-100 overflow-hidden aspect-square w-full">
                                            <img
                                                src="https://blocks.astratic.com/img/general-img-landscape.png"
                                                alt="Diseño Exclusivo"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">DISEÑO EXCLUSIVO</h3>
                                    </div>
                                    <div className="text-center group">
                                        <div className="bg-gray-100 overflow-hidden aspect-square w-full">
                                            <img
                                                src="https://blocks.astratic.com/img/general-img-landscape.png"
                                                alt="Edición Limitada"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">EDICIÓN LIMITADA</h3>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* 5. ABOUT US SECTION */}
                <section className="py-12 sm:py-16 bg-caborca-beige-home" style={{ backgroundColor: '#ECE7DF' }}>
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
                            {/* Imagen */}
                            <div className="order-2 md:order-1 relative group">
                                <div className="relative overflow-hidden rounded-lg shadow-2xl">
                                    <img
                                        src={arteCreacion.imagenUrl}
                                        onError={(e) => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }}
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-caborca-cafe/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                {/* Badge decorativo */}
                                <div className="absolute -bottom-4 -right-4 bg-gray-200 rounded-full p-6 shadow-xl hidden md:block">
                                    <div className="text-center">
                                        <h2 className="text-3xl md:text-5xl font-serif text-caborca-cafe mb-4 text-center">{arteCreacion.anosExperiencia}+</h2>
                                        <p className="text-xs font-semibold tracking-wider text-caborca-bronce">AÑOS</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="flex flex-col justify-center order-1 md:order-2">
                                <div className="mb-4">
                                    <span className="inline-block bg-caborca-cafe text-white text-xs font-bold tracking-widest px-4 py-2 rounded-full">
                                        {arteCreacion.badge}
                                    </span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 text-caborca-beige-fuerte leading-tight font-bold">
                                    {arteCreacion.titulo}
                                </h2>

                                {/* Features List dinámicas */}
                                <div className="space-y-4 mb-8">
                                    {arteCreacion.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="shrink-0 w-10 h-10 bg-caborca-bronce rounded-full flex items-center justify-center mt-1">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-caborca-beige-fuerte mb-1">{feature.titulo}</h4>
                                                <p className="text-caborca-beige-fuerte text-sm leading-relaxed">{feature.descripcion}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4 items-center">
                                    <a href="#" className="inline-flex items-center gap-2 bg-caborca-beige-fuerte text-white font-bold tracking-widest text-xs sm:text-sm px-6 sm:px-8 py-3 rounded-lg shadow-lg group">
                                        <span>{arteCreacion.boton}</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                    <div className="flex items-center gap-2 text-caborca-bronce text-sm">
                                        <svg className="w-5 h-5 text-caborca-bronce" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="font-semibold">{arteCreacion.nota}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5.5 DISTRIBUTOR BANNER SECTION */}
                {/* 5.5 DISTRIBUTOR BANNER SECTION */}
                <section className="py-12 bg-gray-50 border-b border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-caborca-cafe mb-2">{distribuidores.titulo}</h2>
                            <p className="text-sm text-gray-500 font-medium max-w-2xl mx-auto">
                                {distribuidores.subtitulo}
                            </p>
                        </div>

                        {/* Filtros Minimalistas */}
                        <div className="flex justify-center gap-6 mb-8 text-sm font-medium tracking-wide">
                            {[
                                { id: 'todos', label: 'Todos' },
                                { id: 'destacados', label: 'Destacados' },
                                { id: 'nacional', label: 'Nacionales' },
                                { id: 'internacional', label: 'Internacionales' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`pb-1 border-b-2 transition-colors duration-300 ${activeFilter === filter.id
                                        ? 'text-caborca-cafe border-caborca-cafe'
                                        : 'text-gray-400 border-transparent hover:text-caborca-cafe'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Carousel Automático / Centrado */}
                        <div className="w-full overflow-hidden relative group">
                            <div className={`flex items-center gap-16 ${filteredDistributors.length > 5 ? 'w-max animate-scroll' : 'justify-center w-full flex-wrap'}`}>
                                {(filteredDistributors.length > 5 ? [...filteredDistributors, ...filteredDistributors] : filteredDistributors).map((distribuidor, index) => {
                                    const CardWrapper = distribuidor.sitioWeb ? 'a' : 'div';
                                    const linkProps = distribuidor.sitioWeb ? {
                                        href: distribuidor.sitioWeb.startsWith('http') ? distribuidor.sitioWeb : `https://${distribuidor.sitioWeb}`,
                                        target: "_blank",
                                        rel: "noopener noreferrer"
                                    } : {};

                                    return (
                                        <CardWrapper
                                            key={`${distribuidor.id}-${index}`}
                                            {...linkProps}
                                            className={`shrink-0 w-52 h-28 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 flex items-center justify-center ${distribuidor.sitioWeb ? 'cursor-pointer' : ''}`}
                                        >
                                            <img
                                                src={distribuidor.logo}
                                                alt={distribuidor.name}
                                                className="h-full w-full object-contain scale-110"
                                            />
                                        </CardWrapper>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botón Ver Todos */}
                        <div className="text-center mt-12">
                            <Link
                                to={distribuidores.linkBoton}
                                className="inline-block bg-caborca-beige-fuerte text-white font-bold tracking-widest text-xs px-10 py-4 rounded-lg shadow-lg"
                            >
                                {distribuidores.textoBoton}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 6. MAP SECTION - DÓNDE COMPRAR */}
                <section className="py-12 sm:py-16 bg-caborca-beige-bronce">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-serif mb-3 text-caborca-beige-fuerte font-bold">
                                {dondeComprar.titulo}
                            </h2>
                            <p className="text-caborca-cafe font-bold text-sm sm:text-base">
                                {dondeComprar.descripcion}
                            </p>
                        </div>
                    </div>
                    {/* Mapa borde a borde sin bordes redondeados */}
                    <div style={{ isolation: 'isolate', position: 'relative' }}>
                        <div className="overflow-hidden" style={{ height: '400px' }}>
                            <MapContainer center={[23.6345, -102.5528]} zoom={4} className="h-full w-full min-h-[400px]" scrollWheelZoom={false} dragging={!L.Browser.mobile}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {/* Pines de distribuidores */}
                                {(configGeneral?.distribuidoresList?.filter(d => !isNaN(parseFloat(d.lat)) && !isNaN(parseFloat(d.lng))).length > 0
                                    ? configGeneral.distribuidoresList.filter(d => !isNaN(parseFloat(d.lat)) && !isNaN(parseFloat(d.lng)))
                                    : DEMO_MARKERS
                                ).map((d, idx) => (
                                    <Marker
                                        key={idx}
                                        position={[parseFloat(d.lat), parseFloat(d.lng)]}
                                        icon={createMapPin()}
                                    >
                                        <Popup>
                                            <div className="w-full sm:w-auto min-w-[140px]">
                                                <p className="font-bold text-sm" style={{ color: '#7C5C3E' }}>
                                                    {d.negocioNombre || d.nombre || 'Distribuidor'}
                                                </p>
                                                <p className="text-xs text-gray-500">{d.ciudad || ''}</p>
                                                <Link
                                                    to="/distribuidores"
                                                    className="text-xs font-semibold mt-1 inline-block"
                                                    style={{ color: '#7C5C3E' }}
                                                >
                                                    Ver detalles →
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                    {/* CTA */}
                    <div className="container mx-auto px-4">
                        <div className="text-center mt-6">
                            <Link to={dondeComprar.linkBoton} className="inline-flex items-center gap-2 bg-caborca-beige-fuerte text-white font-bold tracking-wider text-sm px-8 py-3 rounded-lg shadow-md">
                                <span>{dondeComprar.textoBoton}</span>
                            </Link>
                            <p className="text-caborca-beige-fuerte text-xs mt-3">
                                {dondeComprar.nota}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 7. SUSTAINABILITY BANNER SECTION */}
                <section className="relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
                        {/* Left Side - Image */}
                        <div className="relative h-[400px] md:h-[500px]">
                            <img
                                src={sustentabilidad.imagenUrl}
                                alt="Sustentabilidad Caborca"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#332B1E]/90 to-[#332B1E]/30"></div>
                            <div className="absolute inset-0 flex items-center justify-center md:justify-start px-8 md:px-12">
                                <div className="text-caborca-beige-fuerte max-w-md">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-caborca-beige-fuerte rounded-full flex items-center justify-center" style={{ color: '#fff' }}>
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-white tracking-wider">{sustentabilidad.badge}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-serif mb-3 leading-tight text-white">
                                        {sustentabilidad.titulo}
                                    </h2>
                                    <p className="text-base md:text-lg mb-6 text-gray-200 leading-relaxed">
                                        {sustentabilidad.descripcion}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="bg-caborca-beige-home p-8 md:p-12 flex flex-col justify-center" style={{ backgroundColor: '#ECE7DF' }}>
                            <div className="max-w-lg mx-auto">
                                <h3 className="text-xl sm:text-2xl md:text-4xl font-serif text-caborca-beige-fuerte font-bold mb-6">
                                    {sustentabilidad.tituloDerecho}
                                </h3>

                                {/* Features Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    {(sustentabilidad.features && sustentabilidad.features.length > 0) ? (
                                        sustentabilidad.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white p-5 rounded-lg border border-gray-100"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span
                                                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                        style={{ backgroundColor: '#9B8674' }}
                                                    >
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    <p className="text-sm font-semibold text-caborca-beige-fuerte leading-snug pt-1">{feature.titulo}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No hay características definidas</p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <Link to={sustentabilidad.linkBoton} className="inline-flex items-center gap-2 bg-caborca-beige-fuerte text-white font-bold tracking-wider text-sm px-8 py-4 rounded-lg shadow-lg">
                                        <span>{sustentabilidad.textoBoton}</span>
                                    </Link>
                                    <div className="flex items-center gap-2 text-caborca-cafe text-sm">
                                        <svg className="w-5 h-5 text-caborca-bronce" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium text-caborca-bronce">{sustentabilidad.notaCertificacion}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. DISTRIBUTOR FORM SECTION */}
                <section className="py-8 sm:py-10 bg-caborca-beige-home">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-5">
                                <h2 className="text-4xl md:text-6xl font-serif mb-4 text-caborca-cafe font-bold">{sustentabilidad.tituloDerecho || sustentabilidad.titulo}</h2>
                                <p className="text-caborca-cafe font-semibold text-sm sm:text-base">{formDistribuidor.descripcion}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <form className="space-y-3" onSubmit={async e => {
                                    e.preventDefault();
                                    setEnviandoInicio(true);
                                    setResultadoInicio(null);
                                    try {
                                        await contactoService.enviarSolicitudDistribuidor(formInicio);
                                        setResultadoInicio({ tipo: 'exito', mensaje: '¡Solicitud enviada! Nos pondremos en contacto contigo pronto.' });
                                        setFormInicio({ nombreCompleto: '', correoElectronico: '', telefono: '', ciudad: '', mensaje: '' });
                                    } catch (err) {
                                        setResultadoInicio({ tipo: 'error', mensaje: err.message || 'No se pudo enviar. Intenta de nuevo.' });
                                    } finally {
                                        setEnviandoInicio(false);
                                    }
                                }}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1">Nombre completo</label>
                                            <input type="text" value={formInicio.nombreCompleto} onChange={e => setFormInicio(p => ({ ...p, nombreCompleto: e.target.value }))} placeholder="Tu nombre" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1">Correo electrónico</label>
                                            <input type="email" value={formInicio.correoElectronico} onChange={e => setFormInicio(p => ({ ...p, correoElectronico: e.target.value }))} placeholder="correo@ejemplo.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-beige-fuerte mb-1">Teléfono</label>
                                            <input type="tel" value={formInicio.telefono} onChange={e => setFormInicio(p => ({ ...p, telefono: e.target.value }))} placeholder="(123) 456-7890" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1">Ciudad</label>
                                            <input type="text" value={formInicio.ciudad} onChange={e => setFormInicio(p => ({ ...p, ciudad: e.target.value }))} placeholder="Tu ciudad" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1">Mensaje</label>
                                            <textarea value={formInicio.mensaje} onChange={e => setFormInicio(p => ({ ...p, mensaje: e.target.value }))} placeholder="Cuéntanos sobre tu negocio..." rows="2" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors resize-none"></textarea>
                                        </div>
                                    </div>
                                    {resultadoInicio && (
                                        <div className={`px-3 py-2 rounded text-sm font-semibold ${resultadoInicio.tipo === 'exito' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                                            {resultadoInicio.tipo === 'exito' ? '✓ ' : '✗ '}{resultadoInicio.mensaje}
                                        </div>
                                    )}
                                    <div className="grid md:grid-cols-2 gap-4 items-center pt-2">
                                        <div className="flex items-center gap-4">
                                            <button type="submit" disabled={enviandoInicio} className="bg-caborca-beige-fuerte text-white font-bold tracking-wider text-xs px-8 py-3 rounded shadow-md disabled:opacity-60 flex items-center gap-2">
                                                {enviandoInicio ? (<><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>ENVIANDO...</>) : formDistribuidor.textoBoton}
                                            </button>
                                            <div className="hidden sm:flex items-center gap-2 text-caborca-bronce text-xs">
                                                <svg className="w-5 h-5 text-caborca-bronce" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                                <span className="font-bold">{formDistribuidor.notaTiempo}</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex justify-end items-center">
                                            <div className="flex items-center gap-3 text-caborca-bronce">
                                                <div className="text-right">
                                                    <p className="text-xs font-semibold">{formDistribuidor.statDistribuidores}</p>
                                                    <p className="text-xs text-gray-600">Distribuidores</p>
                                                </div>
                                                <div className="w-16 h-16 bg-caborca-bronce rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold">{formDistribuidor.statEstados}</p>
                                                    <p className="text-xs text-gray-600">Estados</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <PieDePagina />
        </div >
    );
};

export default Inicio;
