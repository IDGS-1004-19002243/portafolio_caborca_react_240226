import { useState, useEffect } from 'react';
import Encabezado from '../componentes/Encabezado';
import PieDePagina from '../componentes/PieDePagina';
import { textosService } from '../api/textosService';
import { contactoService } from '../api/contactoService';
import { useLanguage } from '../context/LanguageContext';

const Contacto = () => {
  const { language, t } = useLanguage();
  const [formulario, setFormulario] = useState({
    nombreCompleto: '', correoElectronico: '', telefono: '', asunto: '', mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

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
                  <span className="text-sm md:text-base font-medium tracking-widest uppercase text-white">{t(hero, 'badge')}</span>
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
                    <div>
                      <h3 className="font-bold text-caborca-cafe text-sm mb-1">{t(card, 'title')}</h3>
                      {(language === 'es' ? (card.lines_ES || card.lines) : (card.lines_EN || card.lines_ES || card.lines))?.map((line, i) => (
                        <p key={i} className={`text-sm ${i === 0 ? 'text-caborca-cafe' : 'text-gray-500 text-xs mt-1'}`}>{line}</p>
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
