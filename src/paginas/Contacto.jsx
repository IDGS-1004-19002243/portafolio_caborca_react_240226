import { useState, useEffect } from 'react';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';
import { contactoService } from '../api/contactoService';
import { useLanguage } from '../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'https://localhost:7020/api' : 'https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api');

const socialIconsSVG = {
  instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
  tiktok: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" /></svg>,
  facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.082 0 12 0 12s0 3.918.498 5.814a3.016 3.016 0 002.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.918 24 12 24 12s0-3.918-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
};

const Contacto = () => {
  const { language, t } = useLanguage();
  const [formulario, setFormulario] = useState({
    nombreCompleto: '', correoElectronico: '', telefono: '', asunto: '', mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [socials, setSocials] = useState(null);

  const [hero, setHero] = useState({
    badge_ES: 'ESTAMOS AQUÍ PARA TI',
    badge_EN: 'WE ARE HERE FOR YOU',
    titulo_ES: 'Contacto',
    titulo_EN: 'Contact',
    subtitulo_ES: 'Nos encantaría saber de ti. Completa el formulario y nos pondremos en contacto contigo',
    subtitulo_EN: 'We would love to hear from you. Fill out the form and we will get in touch with you',
    imagen: 'https://blocks.astratic.com/img/general-img-landscape.png'
  });

  const [cards, setCards] = useState([
    { id: 'telefono', title_ES: 'Teléfono', title_EN: 'Phone', lines_ES: ['+52 (555) 123-4567', 'Lun - Vie: 9:00 AM - 6:00 PM'], lines_EN: ['+52 (555) 123-4567', 'Mon - Fri: 9:00 AM - 6:00 PM'] },
    { id: 'email', title_ES: 'Correo Electrónico', title_EN: 'Email', lines_ES: ['contacto@caborcaboots.com', 'Respuesta en 24-48 hrs'], lines_EN: ['contacto@caborcaboots.com', 'Response in 24-48 hrs'] },
    { id: 'ubicacion', title_ES: 'Ubicación', title_EN: 'Location', lines_ES: ['León, Guanajuato, México', 'Capital del calzado mexicano'], lines_EN: ['León, Guanajuato, Mexico', 'The Mexican footwear capital'] },
    { id: 'social', title_ES: 'Síguenos', title_EN: 'Follow Us', lines_ES: ['@caborca'], lines_EN: ['@caborca'] }
  ]);

  const [formPreview, setFormPreview] = useState({
    titulo_ES: 'Envíanos un mensaje',
    titulo_EN: 'Send us a message',
    descripcion_ES: 'Completa el formulario y nos pondremos en contacto contigo',
    descripcion_EN: 'Complete the form and we will get in touch with you'
  });

  useEffect(() => {
    fetch(`${API_URL}/Settings/ConfiguracionGeneral`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data.redesSociales) {
          setSocials(data.redesSociales);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    textosService.getTextos('contacto')
      .then(data => {
        if (!data || Object.keys(data).length === 0) return;
        if (data.hero) setHero(prev => ({ ...prev, ...data.hero }));
        if (data.cards) setCards(data.cards);
        if (data.formPreview) setFormPreview(prev => ({ ...prev, ...data.formPreview }));
      })
      .catch(() => console.warn('Contacto: usando datos por defecto'));
  }, []);

  const labels = {
    ayuda: language === 'es' ? '¿Cómo podemos ayudarte?' : 'How can we help you?',
    equipo: language === 'es' ? 'Nuestro equipo está listo para responder todas tus preguntas.' : 'Our team is ready to answer all your questions.',
    nombre: language === 'es' ? 'Nombre Completo' : 'Full Name',
    nombrePlaceholder: language === 'es' ? 'Tu nombre' : 'Your name',
    correo: language === 'es' ? 'Correo Electrónico' : 'Email address',
    telefono: language === 'es' ? 'Teléfono' : 'Phone',
    asunto: language === 'es' ? 'Asunto' : 'Subject',
    asuntoPlaceholder: language === 'es' ? '¿En qué podemos ayudarte?' : 'How can we help you?',
    mensaje: language === 'es' ? 'Mensaje' : 'Message',
    mensajePlaceholder: language === 'es' ? 'Cuéntanos cómo podemos ayudarte...' : 'Tell us how we can help you...',
    enviarMensaje: language === 'es' ? 'ENVIAR MENSAJE' : 'SEND MESSAGE',
    enviando: language === 'es' ? 'ENVIANDO...' : 'SENDING...',
    exito: language === 'es' ? '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.' : 'Message sent! We will contact you soon.',
    error: language === 'es' ? 'No se pudo enviar el mensaje. Intenta de nuevo.' : 'Could not send message. Please try again.'
  };

  const manejarCambioFormulario = (evento) => {
    const { name, value } = evento.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setResultado(null);
    try {
      await contactoService.enviarContacto({
        nombre: formulario.nombreCompleto,
        correo: formulario.correoElectronico,
        telefono: formulario.telefono,
        asunto: formulario.asunto,
        mensaje: formulario.mensaje,
      });
      setResultado({ tipo: 'exito', mensaje: labels.exito });
      setFormulario({ nombreCompleto: '', correoElectronico: '', telefono: '', asunto: '', mensaje: '' });
    } catch (err) {
      setResultado({ tipo: 'error', mensaje: err.message || labels.error });
    } finally {
      setEnviando(false);
    }
  };

  const iconoPorCard = (id) => {
    if (id === 'telefono') return (
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    );
    if (id === 'email') return (
      <>
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </>
    );
    if (id === 'ubicacion') return (
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    );
    return (
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    );
  };

  return (
    <div className="bg-white text-caborca-cafe font-sans">
      <Encabezado />
      <main>
        {/* HERO */}
        <section className="relative bg-gray-40">
          <div className="relative w-full overflow-hidden shadow-2xl">
            <img src={hero.imagen} alt="Contacto Caborca Boots" className="w-full h-screen object-cover"
              onError={e => { e.target.src = 'https://blocks.astratic.com/img/general-img-landscape.png'; }} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pt-20">
              <div className="text-center text-white px-4">
                <div className="inline-block bg-caborca-beige-fuerte px-6 py-2 rounded-lg mb-6">
                  <span className="text-sm md:text-base font-bold tracking-widest uppercase text-white">{t(hero, 'badge')}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif mb-6">{t(hero, 'titulo')}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">{t(hero, 'subtitulo')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO SECTION */}
        <section className="py-10 sm:py-14" style={{ backgroundColor: '#ECE7DF' }}>
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-caborca-beige-fuerte font-bold mb-3">
                  {labels.ayuda}
                </h2>
                <p className="text-caborca-cafe font-semibold text-sm leading-relaxed max-w-2xl mx-auto">
                  {labels.equipo}
                </p>
              </div>

              {/* Cards dinámicas */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cards.map((card) => (
                  <div key={card.id} className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-caborca-bronce rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {iconoPorCard(card.id)}
                      </svg>
                    </div>
                    <div className="w-full">
                      <h3 className="font-bold text-caborca-cafe text-sm mb-2">{t(card, 'title')}</h3>
                      {card.id === 'social' && socials 
                        ? <div className="flex flex-wrap gap-3 mt-2">
                             {Object.entries(socials)
                              .filter(([key, data]) => data && data.show && key !== 'whatsapp' && key !== 'email')
                              .map(([key, data]) => {
                                 const fallbackUrl = '#';
                                 const rawUrl = data.url || fallbackUrl;
                                 const iconSVG = socialIconsSVG[key];
                                 if (!iconSVG) return null;
                                 
                                 return (
                                   <a key={key} href={rawUrl} target="_blank" rel="noopener noreferrer" className="text-caborca-cafe hover:text-caborca-bronce transition-colors p-1" title={`Ver ${key}`}>
                                     {iconSVG}
                                   </a>
                                 );
                              })}
                           </div>
                        : (language === 'es' ? (card.lines_ES || card.lines) : (card.lines_EN || card.lines_ES || card.lines))?.map((line, i) => (
                        <p key={i} className={`text-sm ${i === 0 ? 'text-caborca-cafe' : 'text-gray-500 text-xs mt-1'}`}>
                          {card.id === 'email' && i === 0 && socials?.email?.url ? socials.email.url : line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-serif text-caborca-beige-fuerte font-bold mb-2">{t(formPreview, 'titulo')}</h3>
                <p className="text-sm text-caborca-cafe font-semibold">{t(formPreview, 'descripcion')}</p>
              </div>
              <form onSubmit={manejarEnvioFormulario} className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-caborca-beige-fuerte mb-2">{labels.nombre}</label>
                    <input type="text" name="nombreCompleto" value={formulario.nombreCompleto} onChange={manejarCambioFormulario}
                      placeholder={labels.nombrePlaceholder} className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-caborca-beige-fuerte mb-2">{labels.correo}</label>
                    <input type="email" name="correoElectronico" value={formulario.correoElectronico} onChange={manejarCambioFormulario}
                      placeholder="correo@ejemplo.com" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-caborca-beige-fuerte mb-2">{labels.telefono}</label>
                    <input type="tel" name="telefono" value={formulario.telefono} onChange={manejarCambioFormulario}
                      placeholder="+52 (555) 123-4567" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" required />
                  </div>
                </div>
                {/* Asunto */}
                <div>
                  <label className="block text-xs font-semibold text-caborca-beige-fuerte mb-2">{labels.asunto}</label>
                  <input type="text" name="asunto" value={formulario.asunto} onChange={manejarCambioFormulario}
                    placeholder={labels.asuntoPlaceholder} className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-caborca-beige-fuerte mb-2">{labels.mensaje}</label>
                  <textarea name="mensaje" value={formulario.mensaje} onChange={manejarCambioFormulario}
                    placeholder={labels.mensajePlaceholder} rows="5"
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-beige-fuerte focus:ring-2 focus:ring-caborca-beige-fuerte/20 transition-all resize-none" required />
                </div>
                <div className="text-center pt-2 space-y-4">
                  {/* Banner de resultado */}
                  {resultado && (
                    <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${resultado.tipo === 'exito'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                      }`}>
                      {resultado.tipo === 'exito' ? '✓ ' : '✗ '}{resultado.mensaje}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={enviando}
                    className="bg-caborca-beige-fuerte text-white font-bold tracking-wider text-sm px-12 py-4 rounded-lg shadow-lg hover:bg-caborca-negro transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {enviando ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        {labels.enviando}
                      </>
                    ) : labels.enviarMensaje}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <PieDePagina />
    </div>
  );
};

export default Contacto;
