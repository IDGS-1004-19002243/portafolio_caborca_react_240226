import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LogoImg from '../assets/logo-caborca.webp'
import { useLanguage } from '../context/LanguageContext'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'https://localhost:7020/api' : 'https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api');

const socialIcons = {
  instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
  tiktok: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" /></svg>,
  facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  whatsapp: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.506.709.31 1.262.496 1.694.633.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
};

const Footer = () => {
  const { language } = useLanguage();
  const [socials, setSocials] = useState({
    instagram: { url: 'https://instagram.com/caborcaboots', show: true },
    tiktok: { url: 'https://tiktok.com/@caborcaboots', show: true },
    facebook: { url: 'https://facebook.com/caborcaboots', show: true },
    whatsapp: { url: 'https://wa.me/525551234567', show: true }
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

  const labels = {
    desc: language === 'es'
      ? 'Artesanía mexicana de lujo. Cada bota es una obra maestra hecha a mano con pasión y precisión.'
      : 'Luxury Mexican craftsmanship. Each boot is a handmade masterpiece crafted with passion and precision.',
    quick: language === 'es' ? 'Navegación' : 'Navigation',
    inicio: language === 'es' ? 'Inicio' : 'Home',
    catalogoH: language === 'es' ? 'Botas Hombre' : 'Men\'s Boots',
    catalogoM: language === 'es' ? 'Botas Mujer' : 'Women\'s Boots',
    cont: language === 'es' ? 'Contacto' : 'Contact',
    more: language === 'es' ? 'La Marca' : 'The Brand',
    us: language === 'es' ? 'Nosotros' : 'About Us',
    env: language === 'es' ? 'Responsabilidad Ambiental' : 'Environmental Responsibility',
    dist: language === 'es' ? 'Distribuidores' : 'Distributors',
    rights: language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.',
  };

  const visibleSocialEntries = Object.entries(socials).filter(([, v]) => v && v.show);

  return (
    <footer className="bg-caborca-beige-suave border-t border-gray-300 pt-10 pb-0">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-12 mb-8 text-center md:text-left">
          <div>
            <img src={LogoImg} alt="Caborca Boots" className="h-20 mb-3 mx-auto md:mx-0 object-contain" />
            <p className="text-caborca-cafe text-xs leading-relaxed">{labels.desc}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-caborca-cafe text-sm">{labels.quick}</h4>
            <ul className="space-y-2 text-caborca-negro text-sm">
              <li><Link to="/" className="hover:text-caborca-cafe transition-colors">{labels.inicio}</Link></li>
              <li><Link to="/catalogo/hombre" className="hover:text-caborca-cafe transition-colors">{labels.catalogoH}</Link></li>
              <li><Link to="/catalogo/mujer" className="hover:text-caborca-cafe transition-colors">{labels.catalogoM}</Link></li>
              <li><Link to="/contacto" className="hover:text-caborca-cafe transition-colors">{labels.cont}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-caborca-cafe text-sm">{labels.more}</h4>
            <ul className="space-y-2 text-caborca-negro text-sm">
              <li><Link to="/nosotros" className="hover:text-caborca-cafe transition-colors">{labels.us}</Link></li>
              <li><Link to="/responsabilidad-ambiental" className="hover:text-caborca-cafe transition-colors">{labels.env}</Link></li>
              <li><Link to="/distribuidores" className="hover:text-caborca-cafe transition-colors">{labels.dist}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-caborca-cafe py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-white">
          <p>© 2025 Caborca Boots. {labels.rights}</p>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            {visibleSocialEntries.map(([key, data]) => {
              if (!data || !data.url) return null;
              const icon = socialIcons[key];
              if (!icon) return null;
              const href = key === 'email' ? (data.url.startsWith('mailto:') ? data.url : `mailto:${data.url}`) : data.url;
              return (
                <a key={key} href={href} target={key === 'email' ? '_self' : '_blank'} rel="noopener noreferrer"
                  className="text-white transition-all duration-300 hover:scale-110"
                  style={{ transition: 'color 0.3s, transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C8A97E'}
                  onMouseLeave={e => e.currentTarget.style.color = 'white'}
                >
                  {icon}
                </a>
              );
            })}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="ml-2 flex items-center justify-center w-8 h-8 rounded-full border border-white/40 text-white hover:bg-white/20 transition-colors"
              title={language === 'es' ? 'Volver arriba' : 'Back to top'}
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
