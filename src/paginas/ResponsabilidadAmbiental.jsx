import { useState, useEffect } from 'react';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';

const ResponsabilidadAmbiental = () => {
  const defaultContent = {
    hero: {
      badge: 'COMPROMISO CON EL FUTURO',
      title: 'Responsabilidad Ambiental',
      subtitle: 'Nuestro compromiso con el planeta y las futuras generaciones a través de prácticas sostenibles',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    compania: {
      title: 'Compañía\nresponsable',
      p1: 'Como empresa, elegimos conscientemente preocuparnos por mejorar el mundo social, económico y ambiental que nos rodea.',
      p2: 'También basamos nuestras decisiones en ideales éticos y valores humanos.',
      highlight: 'Hemos asumido la tarea de crear programas estratégicos para dar un destino a todos los elementos y materiales.',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    energia: {
      title: 'Consumo de\nelectricidad',
      p1: 'Para reducir el impacto del calentamiento global, hemos instalado un sistema de paneles de energía solar.',
      p2: 'La energía solar no genera residuos ni contaminación del agua.',
      stat1: '0%', stat1Label: 'Emisiones CO₂',
      stat2: '100%', stat2Label: 'Energía Limpia',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    video: {
      title: 'Nuestro compromiso en acción',
      description: 'Descubre cómo transformamos nuestros valores en acciones concretas cada día',
      videoUrl: 'https://www.youtube.com/embed/3nT5QS6h-tY'
    },
    pieles: {
      title: 'Pieles libres de\nmetales pesados',
      p1: 'Tenemos nuestro propio analizador de metales X-MET7500.',
      p2: 'Realizamos inspecciones diarias en todas las pieles que recibimos de nuestros proveedores.',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    shambhala: {
      title: 'Un lugar para renacer',
      subtitle: 'Un ecosistema biodiverso donde la naturaleza y la producción sostenible se encuentran en perfecta armonía',
      missionTitle: 'Nuestra Misión',
      missionText: 'Shambhala es un proyecto que nació con el objetivo de convertirse en parte de los pulmones del planeta Tierra.',
      granjaTitle: 'Granja Biodinámica',
      granjaText: 'Esta granja biodinámica es uno de nuestros mayores logros.',
      educTitle: 'Educación Ambiental',
      educText: 'Realizamos talleres y charlas sobre ecología, reciclaje y concienciación.',
      statNumber: '148', statLabel: 'ACRES DE ESPACIO\nAgroecológico',
      statDesc: 'Un ciclo natural donde los desechos orgánicos enriquecen el suelo.',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png',
      thumb1: 'https://blocks.astratic.com/img/general-img-landscape.png',
      thumb2: 'https://blocks.astratic.com/img/general-img-landscape.png'
    }
  };

  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    textosService.getTextos('responsabilidad')
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setContent(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => console.warn('Responsabilidad: usando datos por defecto'));
  }, []);

  const renderTitle = (raw) => raw?.split('\n').map((line, i) => <span key={i}>{line}{i < raw.split('\n').length - 1 && <br />}</span>);

  return (
    <div className="bg-white text-caborca-cafe font-sans">
      <Encabezado />

      <main>
        {/* HERO IMAGE SECTION */}
        <section className="relative pt-[95px] bg-gray-50">
          {/* Espacio para imagen principal */}
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img src={content.hero.image} alt="Responsabilidad Ambiental Caborca Boots" className="w-full h-[600px] object-cover"
              onError={e => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }} />
            {/* Overlay con texto centrado */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6">
                  <p className="text-sm md:text-base font-medium tracking-widest uppercase text-white">{content.hero.badge}</p>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif mb-6">{content.hero.title}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{content.hero.subtitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPAÑÍA RESPONSABLE */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-caborca-beige-fuerte rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-caborca-beige-fuerte font-bold tracking-wider text-sm uppercase">Empresa Socialmente Responsable</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-serif text-caborca-beige-fuerte font-bold leading-tight">
                    {renderTitle(content.compania.title)}
                  </h2>
                  <div className="w-24 h-1 bg-caborca-beige-fuerte"></div>
                  <div className="space-y-4 text-caborca-negro/80 leading-relaxed">
                    <p>{content.compania.p1}</p>
                    <p>{content.compania.p2}</p>
                    <p className="font-medium text-caborca-beige-fuerte font-bold">{content.compania.highlight}</p>
                  </div>

                </div>

                <div className="relative">
                  <div className="absolute -top-8 -left-8 w-full h-full bg-caborca-cafe/5 rounded-2xl"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src={content.compania.image} alt="Responsabilidad Ambiental"
                      className="w-full h-[500px] object-cover"
                      onError={e => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }} />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-caborca-beige-fuerte mb-1">ESR</div>
                      <div className="text-xs text-caborca-beige-fuerte uppercase tracking-wide">Certificación</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONSUMO DE ELECTRICIDAD */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="absolute -top-8 -right-8 w-full h-full bg-yellow-400/10 rounded-2xl"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src="https://blocks.astratic.com/img/general-img-landscape.png" alt="Paneles Solares" className="w-full h-[500px] object-cover" />
                  </div>
                  {/* Solar icon decoration */}
                  <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-6 order-1 lg:order-2">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                    </div>
                    <span className="text-caborca-beige-fuerte font-bold tracking-wider text-sm uppercase">Energía Limpia</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-serif text-caborca-beige-fuerte font-bold leading-tight">
                    {renderTitle(content.energia.title)}
                  </h2>
                  <div className="w-24 h-1 bg-yellow-400"></div>
                  <div className="space-y-4 text-caborca-negro/80 leading-relaxed">
                    <p>{content.energia.p1}</p>
                    <p className="font-medium text-caborca-beige-fuerte font-bold">{content.energia.p2}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <div className="text-3xl font-bold text-yellow-500 mb-2">{content.energia.stat1}</div>
                      <div className="text-sm text-caborca-negro/70">{content.energia.stat1Label}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                      <div className="text-3xl font-bold text-yellow-500 mb-2">{content.energia.stat2}</div>
                      <div className="text-sm text-caborca-negro/70">{content.energia.stat2Label}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO SECTION */}
        <section className="py-16 bg-caborca-beige-fuerte relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                  <span className="text-white/80 font-bold tracking-wider text-sm uppercase">Nuestro Compromiso</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">
                  {content.video.title}
                </h2>
                <div className="w-32 h-1 bg-white mx-auto mb-4"></div>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  {content.video.description}
                </p>
              </div>

              <div className="relative group">
                {/* Video container with hover effect */}
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <iframe width="100%" height="100%" src={content.video.videoUrl}
                    title="Responsabilidad Ambiental Caborca Boots" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="w-full h-full"></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PIELES LIBRES DE METALES PESADOS */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-caborca-beige-fuerte font-bold tracking-wider text-sm uppercase">Tecnología Avanzada</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-serif text-caborca-beige-fuerte font-bold leading-tight">
                    {renderTitle(content.pieles.title)}
                  </h2>
                  <div className="w-24 h-1 bg-green-500"></div>
                  <div className="space-y-4 text-caborca-negro/80 leading-relaxed">
                    <p>{content.pieles.p1}</p>
                    <p className="font-medium text-caborca-beige-fuerte">{content.pieles.p2}</p>
                  </div>

                  {/* Toxins list */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-caborca-bronce mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Sustancias eliminadas
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-caborca-negro/70">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Plomo
                      </div>
                      <div className="flex items-center gap-2 text-sm text-caborca-negro/70">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Arsénico
                      </div>
                      <div className="flex items-center gap-2 text-sm text-caborca-negro/70">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Cadmio
                      </div>
                      <div className="flex items-center gap-2 text-sm text-caborca-negro/70">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Cloroformo
                      </div>
                      <div className="flex items-center gap-2 text-sm text-caborca-negro/70">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Cromo hexavalente
                      </div>
                      <div className="flex items-center gap-2 text-sm text-caborca-negro/70">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Mercurio
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-8 -right-8 w-full h-full bg-green-500/5 rounded-2xl"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src="https://blocks.astratic.com/img/general-img-landscape.png" alt="Analizador de Metales" className="w-full h-[500px] object-cover" />
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-caborca-beige-fuerte text-sm">100%</div>
                        <div className="text-xs text-caborca-negro/60">Libre de tóxicos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHAMBHALA - UN LUGAR PARA RENACER */}
        <section className="py-24 bg-gradient-to-br from-green-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-green-700 font-semibold tracking-wider text-sm uppercase">Proyecto Agroecológico</span>
                </div>

                <h2 className="text-5xl md:text-6xl font-serif mb-6 text-caborca-beige-fuerte font-bold leading-tight">
                  {content.shambhala.title}
                </h2>
                <div className="w-32 h-1 bg-green-600 mx-auto mb-6"></div>
                <p className="text-3xl font-serif text-green-700 mb-4">Shambhala</p>
                <p className="text-caborca-negro/70 text-lg max-w-3xl mx-auto">
                  {content.shambhala.subtitle}
                </p>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left Column: Info Cards */}
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-caborca-bronce font-bold">{content.shambhala.missionTitle}</h3>
                        <p className="text-caborca-negro/80 leading-relaxed text-sm">{content.shambhala.missionText}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-caborca-bronce font-bold">{content.shambhala.granjaTitle}</h3>
                        <p className="text-caborca-negro/80 leading-relaxed text-sm">{content.shambhala.granjaText}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-caborca-bronce font-bold">{content.shambhala.educTitle}</h3>
                        <p className="text-caborca-negro/80 leading-relaxed text-sm">{content.shambhala.educText}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-2xl shadow-xl text-white">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-5xl font-bold">{content.shambhala.statNumber}</div>
                      <div>
                        {content.shambhala.statLabel.split('\n').map((l, i) => (
                          <div key={i} className={i === 0 ? 'text-sm uppercase tracking-wide opacity-90' : 'text-lg font-semibold'}>{l}</div>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{content.shambhala.statDesc}</p>
                  </div>
                </div>

                {/* Right Column: Gallery */}
                <div className="space-y-3">
                  {/* Main Image */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src={content.shambhala.image} alt="Shambhala Principal" className="w-full aspect-[16/10] object-cover"
                      onError={e => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }} />
                  </div>

                  {/* Grid of 2 images */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                      <img src="https://blocks.astratic.com/img/general-img-landscape.png" alt="Shambhala 1" className="w-full aspect-square object-cover" />
                    </div>
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                      <img src="https://blocks.astratic.com/img/general-img-landscape.png" alt="Shambhala 2" className="w-full aspect-square object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PieDePagina />
    </div >
  );
};

export default ResponsabilidadAmbiental;
