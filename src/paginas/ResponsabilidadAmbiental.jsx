import { useState, useEffect } from 'react';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';
import { useLanguage } from '../context/LanguageContext';

const ResponsabilidadAmbiental = () => {
  const { language, t } = useLanguage();
  const defaultContent = {
    hero: {
      badge_ES: 'COMPROMISO CON EL FUTURO',
      badge_EN: 'COMMITMENT TO THE FUTURE',
      title_ES: 'Responsabilidad Ambiental',
      title_EN: 'Environmental Responsibility',
      subtitle_ES: 'Nuestro compromiso con el planeta y las futuras generaciones a través de prácticas sostenibles',
      subtitle_EN: 'Our commitment to the planet and future generations through sustainable practices',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    compania: {
      title_ES: 'Compañía\nresponsable',
      title_EN: 'Responsible\nCompany',
      p1_ES: 'Como empresa, elegimos conscientemente preocuparnos por mejorar el mundo social, económico y ambiental que nos rodea.',
      p1_EN: 'As a company, we consciously choose to care about improving the social, economic, and environmental world around us.',
      p2_ES: 'También basamos nuestras decisiones en ideales éticos y valores humanos.',
      p2_EN: 'We also base our decisions on ethical ideals and human values.',
      highlight_ES: 'Hemos asumido la tarea de crear programas estratégicos para dar un destino a todos los elementos y materiales.',
      highlight_EN: 'We have taken on the task of creating strategic programs to provide a destination for all elements and materials.',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    energia: {
      title_ES: 'Consumo de\nelectricidad',
      title_EN: 'Electricity\nConsumption',
      p1_ES: 'Para reducir el impacto del calentamiento global, hemos instalado un sistema de paneles de energía solar.',
      p1_EN: 'To reduce the impact of global warming, we have installed a solar energy panel system.',
      p2_ES: 'La energía solar no genera residuos ni contaminación del agua.',
      p2_EN: 'Solar energy does not generate waste or water pollution.',
      stat1: '0%', stat1Label_ES: 'Emisiones CO₂', stat1Label_EN: 'CO₂ Emissions',
      stat2: '100%', stat2Label_ES: 'Energía Limpia', stat2Label_EN: 'Clean Energy',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    video: {
      title_ES: 'Nuestro compromiso en acción',
      title_EN: 'Our Commitment in Action',
      description_ES: 'Descubre cómo transformamos nuestros valores en acciones concretas cada día',
      description_EN: 'Discover how we transform our values into concrete actions every day',
      videoUrl: 'https://www.youtube.com/embed/3nT5QS6h-tY'
    },
    pieles: {
      title_ES: 'Pieles libres de\nmetales pesados',
      title_EN: 'Heavy Metal\nFree Leathers',
      p1_ES: 'Tenemos nuestro propio analizador de metales X-MET7500.',
      p1_EN: 'We have our own X-MET7500 metal analyzer.',
      p2_ES: 'Realizamos inspecciones diarias en todas las pieles que recibimos de nuestros proveedores.',
      p2_EN: 'We perform daily inspections on all the leathers we receive from our suppliers.',
      sustanciasText_ES: 'Plomo, Arsénico, Cadmio, Cloroformo, Cromo hexavalente, Mercurio',
      sustanciasText_EN: 'Lead, Arsenic, Cadmium, Chloroform, Hexavalent Chromium, Mercury',
      image: 'https://blocks.astratic.com/img/general-img-landscape.png'
    },
    shambhala: {
      title_ES: 'Un lugar para renacer',
      title_EN: 'A Place to Rebirth',
      subtitle_ES: 'Un ecosistema biodiverso donde la naturaleza y la producción sostenible se encuentran en perfecta armonía',
      subtitle_EN: 'A biodiverse ecosystem where nature and sustainable production meet in perfect harmony',
      missionTitle_ES: 'Nuestra Misión',
      missionTitle_EN: 'Our Mission',
      missionText_ES: 'Shambhala es un proyecto que nació con el objetivo de convertirse en parte de los pulmones del planeta Tierra.',
      missionText_EN: 'Shambhala is a project born with the goal of becoming part of the Earth\'s lungs.',
      granjaTitle_ES: 'Granja Biodinámica',
      granjaTitle_EN: 'Biodynamic Farm',
      granjaText_ES: 'Esta granja biodinámica es uno de nuestros mayores logros.',
      granjaText_EN: 'This biodynamic farm is one of our greatest achievements.',
      educTitle_ES: 'Educación Ambiental',
      educTitle_EN: 'Environmental Education',
      educText_ES: 'Realizamos talleres y charlas sobre ecología, reciclaje y concienciación.',
      educText_EN: 'We conduct workshops and talks on ecology, recycling, and awareness.',
      statNumber: '148',
      statLabel_ES: 'ACRES DE ESPACIO\nAgroecológico',
      statLabel_EN: 'ACRES OF SPACE\nAgroecological',
      statDesc_ES: 'Un ciclo natural donde los desechos orgánicos enriquecen el suelo.',
      statDesc_EN: 'A natural cycle where organic waste enriches the soil.',
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

  const labels = {
    esr: language === 'es' ? 'Empresa Socialmente Responsable' : 'Socially Responsible Company',
    cert: language === 'es' ? 'Certificación' : 'Certification',
    cleanEnergy: language === 'es' ? 'Energía Limpia' : 'Clean Energy',
    commitment: language === 'es' ? 'Nuestro Compromiso' : 'Our Commitment',
    tech: language === 'es' ? 'Tecnología Avanzada' : 'Advanced Technology',
    toxins: language === 'es' ? 'Sustancias eliminadas' : 'Eliminated substances',
    free: language === 'es' ? 'Libre de tóxicos' : 'Toxic free',
    agro: language === 'es' ? 'Proyecto Agroecológico' : 'Agroecological Project',
  };

  return (
    <div className="bg-white text-caborca-cafe font-sans">
      <Encabezado />
      <main>
        {/* HERO IMAGE SECTION */}
        <section className="relative bg-gray-50">
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img src={content.hero.image} alt="Caborca" className="w-full h-[600px] object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4 pt-20">
              <div>
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6">
                  <p className="text-sm md:text-base font-medium tracking-widest uppercase text-white">{t(content.hero, 'badge')}</p>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white">{t(content.hero, 'title')}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{t(content.hero, 'subtitle')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPAÑÍA RESPONSABLE */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-caborca-beige-fuerte rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-caborca-beige-fuerte font-bold tracking-wider text-sm uppercase">{labels.esr}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-caborca-beige-fuerte font-bold leading-tight">
                  {renderTitle(t(content.compania, 'title'))}
                </h2>
                <div className="w-24 h-1 bg-caborca-beige-fuerte"></div>
                <div className="space-y-4 text-caborca-negro/80 leading-relaxed font-medium">
                  <p>{t(content.compania, 'p1')}</p>
                  <p>{t(content.compania, 'p2')}</p>
                  <p className="text-caborca-beige-fuerte">{t(content.compania, 'highlight')}</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-full h-full bg-caborca-cafe/5 rounded-2xl"></div>
                <img src={content.compania.image} alt="..." className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-[500px] object-cover" />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 text-center">
                  <div className="text-3xl font-bold text-caborca-beige-fuerte mb-1">ESR</div>
                  <div className="text-xs text-caborca-beige-fuerte uppercase tracking-wide font-bold">{labels.cert}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONSUMO DE ELECTRICIDAD */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <img src={content.energia.image} alt="..." className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-[500px] object-cover" />
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>
                  </div>
                  <span className="text-caborca-cafe font-bold tracking-wider text-sm uppercase">{labels.cleanEnergy}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-caborca-cafe font-bold leading-tight">{renderTitle(t(content.energia, 'title'))}</h2>
                <div className="w-24 h-1 bg-yellow-400"></div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{t(content.energia, 'p1')}</p>
                  <p className="text-caborca-cafe">{t(content.energia, 'p2')}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">{content.energia.stat1}</div>
                    <div className="text-sm text-gray-500 font-bold uppercase">{t(content.energia, 'stat1Label')}</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">{content.energia.stat2}</div>
                    <div className="text-sm text-gray-500 font-bold uppercase">{t(content.energia, 'stat2Label')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PIELES */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-serif text-caborca-cafe font-bold leading-tight">{renderTitle(t(content.pieles, 'title'))}</h2>
                <div className="w-24 h-1 bg-green-500"></div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>{t(content.pieles, 'p1')}</p>
                  <p className="text-caborca-cafe">{t(content.pieles, 'p2')}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-caborca-cafe mb-4">{labels.toxins}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500 font-bold">
                    {t(content.pieles, 'sustanciasText')?.split(',').map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        {s.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <img src={content.pieles.image} alt="..." className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-[500px] object-cover" />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                  <div><div className="font-bold text-caborca-cafe">100%</div><div className="text-xs text-gray-400 font-bold uppercase">{labels.free}</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHAMBHALA */}
        <section className="py-24 bg-green-50">
          <div className="container mx-auto px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-caborca-cafe font-bold mb-4">{t(content.shambhala, 'title')}</h2>
              <p className="text-3xl font-serif text-green-700 font-bold mb-6">Shambhala</p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t(content.shambhala, 'subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-6">
                {[
                  { t: 'missionTitle', p: 'missionText' },
                  { t: 'granjaTitle', p: 'granjaText' },
                  { t: 'educTitle', p: 'educText' }
                ].map((k, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-green-100">
                    <h3 className="font-serif text-xl text-caborca-cafe font-bold mb-2">{t(content.shambhala, k.t)}</h3>
                    <p className="text-gray-600">{t(content.shambhala, k.p)}</p>
                  </div>
                ))}
                <div className="bg-green-700 p-8 rounded-2xl shadow-xl text-white flex items-center gap-6">
                  <div className="text-4xl md:text-5xl font-bold">{content.shambhala.statNumber}</div>
                  <div>
                    <div className="text-lg font-bold uppercase leading-tight">{renderTitle(t(content.shambhala, 'statLabel'))}</div>
                    <p className="text-white/80 text-sm mt-2">{t(content.shambhala, 'statDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <img src={content.shambhala.image} alt="..." className="rounded-2xl shadow-2xl w-full aspect-video object-cover" />
                <div className="grid grid-cols-2 gap-4">
                  <img src={content.shambhala.thumb1} alt="..." className="rounded-xl shadow-lg w-full aspect-square object-cover" />
                  <img src={content.shambhala.thumb2} alt="..." className="rounded-xl shadow-lg w-full aspect-square object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
};

export default ResponsabilidadAmbiental;
