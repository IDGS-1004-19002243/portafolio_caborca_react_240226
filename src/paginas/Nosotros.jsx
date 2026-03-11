import { useState, useEffect, useMemo } from 'react';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';
import { useLanguage } from '../context/LanguageContext';

const defaultContent = {
  hero: { badge_ES: 'NUESTRA HISTORIA', badge_EN: 'OUR HISTORY', title_ES: 'Quiénes Somos', title_EN: 'Who We Are', subtitle_ES: '45 años de tradición, pasión y maestría artesanal', subtitle_EN: '45 years of tradition, passion and artisan mastery', imagen: 'https://blocks.astratic.com/img/general-img-landscape.png' },
  origen: { badge_ES: 'NUESTRO ORIGEN', badge_EN: 'OUR ORIGIN', title_ES: 'El inicio de una aventura', title_EN: 'The start of an adventure', paragraphs_ES: ["Nuestra aventura inicia más o menos hace 45 años en el ocaso de una de las décadas más emocionantes del siglo pasado. Al igual que algunos de los movimientos culturales más importantes de la historia, <strong>Botas Caborca</strong>, también nació en los 70's.", "Para probar suerte dentro del mundo zapatero, Luis Torres Muñoz y sus dos hijos Luis y José Manuel montaron un pequeño taller de bota en León, Guanajuato.", "Iniciaron pequeños, sólo eran 6 trabajadores y fabricaban 12 pares al día. A la empresa le pusieron Botas Caborca en honor a un pequeño pueblo del norte de México, iniciando operaciones en <strong>Abril de 1978</strong>."], paragraphs_EN: ["Our adventure begins roughly 45 years ago at the sunset of one of the most exciting decades of the last century. Like some of the most important cultural movements in history, <strong>Caborca Boots</strong> was also born in the 70's.", "To try their luck in the shoemaking world, Luis Torres Muñoz and his two sons Luis and José Manuel set up a small boot workshop in León, Guanajuato.", "They started small, with only 6 workers and manufacturing 12 pairs a day. They named the company Caborca Boots after a small town in northern Mexico, starting operations in <strong>April 1978</strong>."], imagen: 'https://blocks.astratic.com/img/general-img-landscape.png' },
  crecimiento: { badge_ES: 'CRECIMIENTO', badge_EN: 'GROWTH', title_ES: 'De lo local a lo global', title_EN: 'From local to global', paragraphs_ES: ['Durante algunos años se dedicaron a fabricar la tradicional bota vaquera hecha a mano y se concentraron en vender solamente dentro del territorio mexicano.', '<strong>El año de 1986 fue histórico</strong> porque fue el año en que se empezaron a exportar los primeros pares a Estados Unidos.', 'Año con año la empresa se fue haciendo más fuerte y comenzó a exportar a otras partes del mundo como Canadá, Japón e Italia.'], paragraphs_EN: ['For several years they dedicated themselves to manufacturing the traditional handmade cowboy boot and concentrated on selling only within Mexican territory.', '<strong>The year 1986 was historic</strong> because it was the year they began exporting the first pairs to the United States.', 'Year after year the company grew stronger and began exporting to other parts of the world such as Canada, Japan, and Italy.'], imagen: 'https://blocks.astratic.com/img/general-img-landscape.png' },
  caborcaHoy: { title_ES: 'Caborca Group Hoy', title_EN: 'Caborca Group Today', subtitle_ES: 'Números que reflejan nuestro compromiso y crecimiento', subtitle_EN: 'Numbers that reflect our commitment and growth', stats: [{ label_ES: 'AÑOS DE HISTORIA', label_EN: 'YEARS OF HISTORY', value: '45' }, { label_ES: 'MARCAS PROPIAS', label_EN: 'OWN BRANDS', value: '5' }, { label_ES: 'COLABORADORES', label_EN: 'WORKERS', value: '800+' }, { label_ES: 'PARES SEMANALES', label_EN: 'WEEKLY PAIRS', value: '8,000' }], paragraph_ES: 'En la actualidad Caborca Group cuenta con <strong>4 plantas manufactureras</strong> cubriendo un área total de <strong>30,000 metros cuadrados</strong>.', paragraph_EN: 'Today Caborca Group has <strong>4 manufacturing plants</strong> covering a total area of <strong>30,000 square meters</strong>.' },
  artesania: { badge_ES: 'NUESTRO ARTE', badge_EN: 'OUR ART', title_ES: 'Artesanía con legado', title_EN: 'Artisanship with Legacy', subtitle_ES: 'Es un arte que requiere maestría y experiencia', subtitle_EN: 'It is an art that requires mastery and experience', paragraphs_ES: ['Estamos orgullosos y realmente privilegiados de ser maestros en la artesanía de las botas vaqueras.', 'En Grupo Caborca, hemos logrado unir dos mundos: el tradicional y el moderno.'], paragraphs_EN: ['We are proud and truly privileged to be masters of western boot craftsmanship.', 'In Caborca Group, we have achieved joining two worlds: traditional and modern.'], imagen: 'https://blocks.astratic.com/img/general-img-landscape.png' },
  proceso: { badge_ES: 'NUESTRO PROCESO', badge_EN: 'OUR PROCESS', title_ES: 'Pasión por el detalle', title_EN: 'Passion for Detail', paragraphs_ES: ['Todo lo que hacemos en Grupo Caborca lo hacemos con pasión.', 'Nuestras botas pasan por un proceso de más de 200 pasos.'], paragraphs_EN: ['Everything we do at Caborca Group we do with passion.', 'Our boots go through a process of more than 200 steps.'], stat: '+200', statLabel_ES: 'Pasos en el proceso', statLabel_EN: 'Steps in the process', imagen: 'https://blocks.astratic.com/img/general-img-landscape.png' },
  legado: { title_ES: 'Nuestro Legado', title_EN: 'Our Legacy', paragraphs_ES: ['Generaciones de trabajo duro han forjado este legado.'], paragraphs_EN: ['Generations of hard work have forged this legacy.'], tagline_ES: 'En cada par de botas dejamos el alma.', tagline_EN: 'In every pair of boots we leave our soul.' }
};

const Nosotros = () => {
  const { language, t } = useLanguage();

  const [rawContent, setRawContent] = useState(defaultContent);

  useEffect(() => {
    textosService.getTextos('nosotros')
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          const merged = { ...defaultContent };
          for (const key in data) {
            if (data[key] && typeof data[key] === 'object' && Object.keys(data[key]).length > 0) {
              const validData = {};
              for (const innerKey in data[key]) {
                if (data[key][innerKey] !== "" && data[key][innerKey] !== null) {
                  validData[innerKey] = data[key][innerKey];
                }
              }
              merged[key] = { ...merged[key], ...validData };
            } else if (data[key] && data[key] !== "") {
              merged[key] = data[key];
            }
          }
          setRawContent(merged);
        }
      })
      .catch(() => console.warn('Usando textos por defecto.'));
  }, []);

  const content = useMemo(() => {
    const getTranslatedParagraphs = (obj, key) => {
      if (!obj) return [];
      return language === 'es' ? (obj[`${key}_ES`] || obj[key] || []) : (obj[`${key}_EN`] || obj[`${key}_ES`] || obj[key] || []);
    };

    return {
      hero: {
        badge: t(rawContent.hero, 'badge'),
        title: t(rawContent.hero, 'title'),
        subtitle: t(rawContent.hero, 'subtitle'),
        imagen: rawContent.hero?.imagen
      },
      origen: {
        badge: t(rawContent.origen, 'badge'),
        title: t(rawContent.origen, 'title'),
        paragraphs: getTranslatedParagraphs(rawContent.origen, 'paragraphs'),
        imagen: rawContent.origen?.imagen
      },
      crecimiento: {
        badge: t(rawContent.crecimiento, 'badge'),
        title: t(rawContent.crecimiento, 'title'),
        paragraphs: getTranslatedParagraphs(rawContent.crecimiento, 'paragraphs'),
        imagen: rawContent.crecimiento?.imagen
      },
      caborcaHoy: {
        title: t(rawContent.caborcaHoy, 'title'),
        subtitle: t(rawContent.caborcaHoy, 'subtitle'),
        stats: rawContent.caborcaHoy?.stats?.map(s => ({
          value: s.value,
          label: t(s, 'label')
        })),
        paragraph: t(rawContent.caborcaHoy, 'paragraph')
      },
      artesania: {
        badge: t(rawContent.artesania, 'badge'),
        title: t(rawContent.artesania, 'title'),
        subtitle: t(rawContent.artesania, 'subtitle'),
        paragraphs: getTranslatedParagraphs(rawContent.artesania, 'paragraphs'),
        imagen: rawContent.artesania?.imagen
      },
      proceso: {
        badge: t(rawContent.proceso, 'badge'),
        title: t(rawContent.proceso, 'title'),
        paragraphs: getTranslatedParagraphs(rawContent.proceso, 'paragraphs'),
        stat: rawContent.proceso?.stat,
        statLabel: t(rawContent.proceso, 'statLabel'),
        imagen: rawContent.proceso?.imagen
      },
      legado: {
        title: t(rawContent.legado, 'title'),
        paragraphs: getTranslatedParagraphs(rawContent.legado, 'paragraphs'),
        tagline: t(rawContent.legado, 'tagline')
      }
    };
  }, [rawContent, language, t]);

  const renderParagraphs = (paragraphs) => {
    if (!paragraphs) return null;
    const items = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
    return items.map((p, i) => (
      <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
    ));
  };

  return (
    <div className="bg-white text-caborca-cafe font-sans">
      <Encabezado />

      <main>
        {/* HERO SECTION */}
        <section className="relative bg-gray-50">
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img src={content.hero?.imagen || 'https://blocks.astratic.com/img/general-img-landscape.png'} alt="Nosotros Caborca" className="w-full h-screen object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4 pt-20">
              <div>
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6">
                  <span className="text-sm md:text-base font-bold tracking-widest uppercase text-white">{content.hero?.badge}</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-serif mb-6 text-white">{content.hero?.title}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{content.hero?.subtitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ORIGEN */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div>
                <div className="inline-block bg-caborca-beige-suave px-6 py-2 rounded-full mb-6">
                  <span className="text-caborca-cafe text-sm font-semibold tracking-wider uppercase">{content.origen?.badge}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-caborca-cafe font-bold">{content.origen?.title}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  {renderParagraphs(content.origen?.paragraphs)}
                </div>
              </div>
              <div className="relative">
                <img src={content.origen?.imagen || 'https://blocks.astratic.com/img/general-img-landscape.png'} alt="Origen" className="rounded-2xl shadow-2xl w-full aspect-[3/2] object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* CRECIMIENTO */}
        <section className="py-20 bg-caborca-beige-suave">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <img src={content.crecimiento?.imagen || 'https://blocks.astratic.com/img/general-img-landscape.png'} alt="Crecimiento" className="rounded-2xl shadow-2xl w-full aspect-[3/2] object-cover" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-block bg-white px-4 py-2 rounded-full mb-6 text-caborca-cafe font-bold text-sm tracking-wider uppercase">
                  {content.crecimiento?.badge}
                </div>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-caborca-cafe font-bold">{content.crecimiento?.title}</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                  {renderParagraphs(content.crecimiento?.paragraphs)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <section className="py-20 bg-caborca-cafe text-white">
          <div className="container mx-auto px-4 max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 font-bold">{content.caborcaHoy?.title}</h2>
            <p className="text-white/80 text-xl mb-12">{content.caborcaHoy?.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
              {content.caborcaHoy?.stats?.map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/90 max-w-3xl mx-auto leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: content.caborcaHoy?.paragraph }} />
          </div>
        </section>

        {/* ARTESANIA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <div className="inline-block bg-caborca-beige-suave px-6 py-2 rounded-full mb-6 uppercase font-bold text-sm text-caborca-cafe">
                {content.artesania?.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-caborca-cafe font-bold">{content.artesania?.title}</h2>
              <h3 className="text-2xl font-serif mb-6 text-caborca-beige-fuerte opacity-80">{content.artesania?.subtitle}</h3>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                {renderParagraphs(content.artesania?.paragraphs)}
              </div>
            </div>
            <div>
              <img src={content.artesania?.imagen || 'https://blocks.astratic.com/img/general-img-landscape.png'} alt="Artesanía" className="rounded-2xl shadow-xl w-full aspect-[3/2] object-cover" />
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img src={content.proceso?.imagen || 'https://blocks.astratic.com/img/general-img-landscape.png'} alt="Proceso" className="rounded-2xl shadow-xl w-full aspect-[3/2] object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block bg-caborca-beige-suave px-6 py-2 rounded-full mb-6 uppercase font-bold text-sm text-caborca-cafe">
                {content.proceso?.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-caborca-cafe font-bold">{content.proceso?.title}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg mb-8">
                {renderParagraphs(content.proceso?.paragraphs)}
              </div>
              <div className="bg-caborca-cafe text-white p-8 rounded-xl flex items-center gap-6">
                <div className="text-5xl md:text-6xl font-bold">{content.proceso?.stat}</div>
                <div className="text-xl font-bold opacity-80 leading-tight uppercase">{content.proceso?.statLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* LEGADO */}
        <section className="py-24 bg-caborca-negro text-white text-center">
          <div className="container mx-auto px-4 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif mb-10 font-bold">{content.legado?.title}</h2>
            <div className="space-y-8 text-xl text-gray-300 leading-relaxed italic">
              {renderParagraphs(content.legado?.paragraphs)}
              <p className="text-3xl font-serif text-white not-italic mt-12 font-bold">{content.legado?.tagline}</p>
            </div>
          </div>
        </section>
      </main>

      <PieDePagina />
    </div>
  );
};

export default Nosotros;
