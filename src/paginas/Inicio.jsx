import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Encabezado from '../componentes/Encabezado';
import Carrusel from '../componentes/Carrusel';
import PieDePagina from '../componentes/PieDePagina';
import homeService from '../api/homeService';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'https://localhost:7020/api' : 'https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api');

const Inicio = () => {
    const [activeFilter, setActiveFilter] = useState('todos');

    // ── Estados dinámicos del CMS ──────────────────────────────────────────────
    const [distribuidores, setDistribuidores] = useState({
        titulo: "Distribuidores Autorizados",
        subtitulo: "Encuentra nuestras colecciones exclusivas",
        textoBoton: "VER TODOS LOS DISTRIBUIDORES",
        linkBoton: "/distribuidores",
        logos: []  // logos dinámicos
    });
    const [sustentabilidad, setSustentabilidad] = useState({
        titulo: "Sustentabilidad",
        descripcion: "Nos comprometemos con el medio ambiente, utilizando procesos responsables y materiales sostenibles en cada etapa de producción.",
        textoBoton: "Conoce más",
        linkBoton: "/responsabilidad-ambiental",
        imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png",
        badge: "COMPROMISO AMBIENTAL",
        tituloDerecho: "Nuestro compromiso con el planeta",
        notaCertificacion: "Certificado por prácticas sustentables"
    });
    const [formDistribuidor, setFormDistribuidor] = useState({
        titulo: "¿Quieres ser distribuidor?",
        descripcion: "Únete a nuestra red de distribuidores y forma parte de la familia Caborca.",
        textoBoton: "ENVIAR SOLICITUD",
        notaTiempo: "Respuesta en 24-48 hrs",
        statDistribuidores: "+500",
        statEstados: "20+"
    });
    const [arteCreacion, setArteCreacion] = useState({
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
    });
    const [dondeComprar, setDondeComprar] = useState({
        titulo: "¿Dónde comprar?",
        descripcion: "Encuentra nuestras tiendas y distribuidores autorizados en todo el mundo.",
        textoBoton: "VER TODOS LOS DISTRIBUIDORES",
        linkBoton: "/distribuidores",
        mapaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120615.72236587609!2d-99.2840989!3d19.432608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0026db097507%3A0x54061076265ee841!2sCiudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx",
        nota: "Conoce la ubicación y contacto de todos nuestros distribuidores autorizados"
    });
    const [productosDestacados, setProductosDestacados] = useState({
        titulo: "Conoce nuestros nuevos estilos"
    });

    // ── Logos de distribuidores desde ConfiguracionGeneral ─────────────────────
    const [logosConfig, setLogosConfig] = useState([]);

    // Cargar logos de distribuidores de la configuración general
    useEffect(() => {
        fetch(`${API_URL}/Settings/ConfiguracionGeneral`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && Array.isArray(data.distribuidoresList) && data.distribuidoresList.length > 0) {
                    setLogosConfig(data.distribuidoresList);
                }
            })
            .catch(() => { });
    }, []);

    // Cargar datos dinámicos de la API
    useEffect(() => {
        homeService.getHomeContent()
            .then(data => {
                // 1. Logos Distribuidores
                if (data?.distribuidoresLogos?.titulo_ES) {
                    setDistribuidores({
                        titulo: data.distribuidoresLogos.titulo_ES,
                        subtitulo: data.distribuidoresLogos.subtitulo_ES || "Encuentra nuestras colecciones exclusivas",
                        textoBoton: data.distribuidoresLogos.textoBoton_ES || "VER TODOS LOS DISTRIBUIDORES",
                        linkBoton: "/distribuidores",
                        logos: data.distribuidoresLogos.logos || []
                    });
                }
                // 2. Sustentabilidad
                if (data?.sustentabilidad) {
                    setSustentabilidad(prev => ({
                        titulo: data.sustentabilidad.titulo_ES || prev.titulo,
                        descripcion: data.sustentabilidad.descripcion_ES || prev.descripcion,
                        textoBoton: data.sustentabilidad.textoBoton_ES || prev.textoBoton,
                        linkBoton: data.sustentabilidad.linkBoton || prev.linkBoton,
                        imagenUrl: data.sustentabilidad.imagenUrl || prev.imagenUrl,
                        badge: data.sustentabilidad.badge_ES || prev.badge,
                        tituloDerecho: data.sustentabilidad.tituloDerecho_ES || prev.tituloDerecho,
                        notaCertificacion: data.sustentabilidad.notaCertificacion_ES || prev.notaCertificacion,
                        features: data.sustentabilidad.features?.length > 0
                            ? data.sustentabilidad.features.map(f => ({ titulo: f.titulo_ES, descripcion: f.descripcion_ES }))
                            : prev.features || []
                    }));
                }
                // 3. Formulario Distribuidor
                if (data?.formDistribuidor) {
                    setFormDistribuidor(prev => ({
                        titulo: data.formDistribuidor.titulo_ES || prev.titulo,
                        descripcion: data.formDistribuidor.descripcion_ES || prev.descripcion,
                        textoBoton: data.formDistribuidor.textoBoton_ES || prev.textoBoton,
                        notaTiempo: data.formDistribuidor.notaTiempo_ES || prev.notaTiempo,
                        statDistribuidores: data.formDistribuidor.statDistribuidores || prev.statDistribuidores,
                        statEstados: data.formDistribuidor.statEstados || prev.statEstados
                    }));
                }
                // 4. Arte de la Creación
                if (data?.arteCreacion?.titulo_ES) {
                    setArteCreacion(prev => ({
                        badge: data.arteCreacion.badge_ES || prev.badge,
                        titulo: data.arteCreacion.titulo_ES,
                        anosExperiencia: data.arteCreacion.anosExperiencia || prev.anosExperiencia,
                        features: data.arteCreacion.features?.length > 0
                            ? data.arteCreacion.features.map(f => ({ titulo: f.titulo_ES, descripcion: f.descripcion_ES }))
                            : prev.features,
                        boton: data.arteCreacion.boton_ES || prev.boton,
                        nota: data.arteCreacion.nota_ES || prev.nota,
                        imagenUrl: data.arteCreacion.imagenUrl || prev.imagenUrl
                    }));
                }
                // 5. Productos Destacados
                if (data?.productosDestacados?.titulo_ES) {
                    setProductosDestacados(prev => ({
                        titulo: data.productosDestacados.titulo_ES || prev.titulo
                    }));
                }
                // 6. Donde Comprar
                if (data?.dondeComprar?.titulo_ES) {
                    setDondeComprar(prev => ({
                        titulo: data.dondeComprar.titulo_ES || prev.titulo,
                        descripcion: data.dondeComprar.descripcion_ES || prev.descripcion,
                        textoBoton: data.dondeComprar.textoBoton_ES || prev.textoBoton,
                        mapaUrl: data.dondeComprar.mapaUrl || prev.mapaUrl,
                        nota: data.dondeComprar.nota_ES || prev.nota
                    }));
                }
            })
            .catch(() => {
                console.warn('API no disponible, usando textos por defecto.');
            });
    }, []);

    // Logos estáticos de respaldo (se usan si la API no tiene logos todavía)
    const logosEstaticos = [
        { id: 1, name: "El Palacio de Hierro", category: "premium", logo: "https://blocks.astratic.com/img/general-img-landscape.png" },
        { id: 2, name: "Liverpool", category: "nacionales", logo: "https://blocks.astratic.com/img/general-img-landscape.png" },
        { id: 3, name: "Boot Barn", category: "internacionales", logo: "https://blocks.astratic.com/img/general-img-landscape.png" },
        { id: 4, name: "Cavender's", category: "internacionales", logo: "https://blocks.astratic.com/img/general-img-landscape.png" },
        { id: 5, name: "Sears", category: "nacionales", logo: "https://blocks.astratic.com/img/general-img-landscape.png" },
        { id: 6, name: "Botas Caborca Store", category: "premium", logo: "https://blocks.astratic.com/img/general-img-landscape.png" }
    ];

    // Logos: prioridad ConfiguracionGeneral → distribuidoresLogos del Home → estáticos
    const distribuidoresLogos = (() => {
        if (logosConfig.length > 0) {
            return logosConfig
                .filter(l => l.logo)
                .map((l, idx) => ({
                    id: l.id || idx,
                    name: l.negocioNombre || l.contactoNombre || 'Distribuidor',
                    category: l.clasificacion || 'todos',
                    logo: l.logo
                }));
        }
        if (distribuidores.logos.length > 0) {
            return distribuidores.logos.map((l, i) => ({ id: l.id, name: `Distribuidor ${i + 1}`, category: 'todos', logo: l.imagenUrl }));
        }
        return logosEstaticos;
    })();

    const filteredDistributors = activeFilter === 'todos'
        ? distribuidoresLogos
        : distribuidoresLogos.filter(d => d.category === activeFilter);

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
                            {productosDestacados.titulo}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
                            {/* Product 1: Diseño Exclusivo */}
                            <div className="text-center group">
                                <div className="bg-gray-100 overflow-hidden h-64 sm:h-80">
                                    <img
                                        src="https://blocks.astratic.com/img/general-img-landscape.png"
                                        alt="Diseño Exclusivo"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">DISEÑO EXCLUSIVO</h3>
                            </div>
                            {/* Product 2: Diseño Exclusivo */}
                            <div className="text-center group">
                                <div className="bg-gray-100 overflow-hidden h-64 sm:h-80">
                                    <img
                                        src="https://blocks.astratic.com/img/general-img-landscape.png"
                                        alt="Diseño Exclusivo"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">DISEÑO EXCLUSIVO</h3>
                            </div>
                            {/* Product 3: Diseño Exclusivo */}
                            <div className="text-center group">
                                <div className="bg-gray-100 overflow-hidden h-64 sm:h-80">
                                    <img
                                        src="https://blocks.astratic.com/img/general-img-landscape.png"
                                        alt="Diseño Exclusivo"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">DISEÑO EXCLUSIVO</h3>
                            </div>
                            {/* Product 4: Edición Limitada */}
                            <div className="text-center group">
                                <div className="bg-gray-100 overflow-hidden h-64 sm:h-80">
                                    <img
                                        src="https://blocks.astratic.com/img/general-img-landscape.png"
                                        alt="Edición Limitada"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm font-bold tracking-wide text-caborca-beige-fuerte">EDICIÓN LIMITADA</h3>
                            </div>
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
                                        <p className="text-3xl font-bold text-caborca-bronce">{arteCreacion.anosExperiencia}+</p>
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
                                { id: 'premium', label: 'Premium' },
                                { id: 'nacionales', label: 'Nacionales' },
                                { id: 'internacionales', label: 'Internacionales' }
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
                                {(filteredDistributors.length > 5 ? [...filteredDistributors, ...filteredDistributors] : filteredDistributors).map((distribuidor, index) => (
                                    <div
                                        key={`${distribuidor.id}-${index}`}
                                        className="shrink-0 w-40 h-20 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 flex items-center justify-center"
                                    >
                                        <img
                                            src={distribuidor.logo}
                                            alt={distribuidor.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botón Ver Todos */}
                        <div className="text-center mt-12">
                            <Link
                                to={distribuidores.linkBoton}
                                className="inline-block bg-caborca-beige-fuerte text-white font-bold tracking-widest text-xs px-10 py-4 rounded-lg hover:bg-caborca-beige-fuerte transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                        <div className="w-full">
                            <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '400px' }}>
                                <iframe
                                    src={dondeComprar.mapaUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120615.72236587609!2d-99.2840989!3d19.432608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce0026db097507%3A0x54061076265ee841!2sCiudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                            {/* CTA to distributors page */}
                            <div className="text-center mt-6">
                                <Link to={dondeComprar.linkBoton} className="inline-flex items-center gap-2 bg-caborca-beige-fuerte text-white font-bold tracking-wider text-sm px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L10 4.414l6.293 6.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span>{dondeComprar.textoBoton}</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <p className="text-caborca-beige-fuerte text-xs mt-3">
                                    {dondeComprar.nota}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. SUSTAINABILITY BANNER SECTION */}
                <section className="relative overflow-hidden">
                    <div className="grid md:grid-cols-2">
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
                                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3 leading-tight text-white">
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
                                <h3 className="text-2xl md:text-4xl font-serif text-caborca-beige-fuerte font-bold mb-6">
                                    {sustentabilidad.tituloDerecho}
                                </h3>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {(sustentabilidad.features && sustentabilidad.features.length > 0) ? (
                                        sustentabilidad.features.map((feature, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                                <div className="text-caborca-beige-fuerte mb-2">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-caborca-beige-fuerte">{feature.titulo}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No hay características definidas</p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <Link to={sustentabilidad.linkBoton} className="inline-flex items-center gap-2 bg-caborca-beige-fuerte text-white font-bold tracking-wider text-sm px-8 py-4 rounded-lg transition-all duration-300 shadow-lg group">
                                        <span>{sustentabilidad.textoBoton}</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
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
                                <h2 className="text-2xl sm:text-3xl font-serif mb-2 text-caborca-beige-fuerte font-bold">{formDistribuidor.titulo}</h2>
                                <p className="text-caborca-cafe font-semibold text-sm sm:text-base">{formDistribuidor.descripcion}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <form className="space-y-3">
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1 font-bold">Nombre completo</label>
                                            <input type="text" placeholder="Tu nombre" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1 font-bold">Correo electrónico</label>
                                            <input type="email" placeholder="correo@ejemplo.com" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-beige-fuerte mb-1">Teléfono</label>
                                            <input type="tel" placeholder="(123) 456-7890" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1 font-bold">Ciudad</label>
                                            <input type="text" placeholder="Tu ciudad" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-caborca-cafe mb-1 font-bold">Mensaje</label>
                                            <textarea placeholder="Cuéntanos sobre tu negocio..." rows="2" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-caborca-beige-fuerte focus:ring-1 focus:ring-caborca-beige-fuerte transition-colors resize-none" required></textarea>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 items-center pt-2">
                                        <div className="flex items-center gap-4">
                                            <button type="submit" className="bg-caborca-beige-fuerte text-white font-bold tracking-wider text-xs px-8 py-3 rounded transition-colors shadow-md hover:shadow-lg">
                                                {formDistribuidor.textoBoton}
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
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                    </svg>
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
        </div>
    );
};

export default Inicio;

