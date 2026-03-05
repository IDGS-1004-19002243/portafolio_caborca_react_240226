import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { language, setLanguage } = useLanguage()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navigateToLang = (e, lang) => {
    e.preventDefault();
    setLanguage(lang);
  };

  const navLinks = [
    { name: { es: 'BOTAS', en: 'BOOTS' }, isDropdown: true },
    { name: { es: 'NOSOTROS', en: 'ABOUT US' }, path: '/nosotros' },
    { name: { es: 'RESPONSABILIDAD AMBIENTAL', en: 'ENVIRONMENTAL RESPONSIBILITY' }, path: '/responsabilidad-ambiental' },
    { name: { es: 'DISTRIBUIDORES', en: 'DISTRIBUTORS' }, path: '/distribuidores' },
    { name: { es: 'CONTACTO', en: 'CONTACT' }, path: '/contacto' }
  ];

  const isVisible = hovered || mobileMenuOpen;

  return (
    <>
      <header
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: isVisible ? '#1C1509' : 'rgba(51, 43, 30, 0.55)',
          boxShadow: isVisible ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="container mx-auto px-4 sm:px-6 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center ml-0 sm:ml-8 lg:ml-32">
            <Link to="/">
              <img
                src="https://i0.wp.com/caborcaboots.com/wp-content/uploads/2023/07/Logo-Caborca-B_Mesa-de-trabajo-1-e1755802893697.png?resize=1536%2C534&ssl=1"
                alt="Caborca"
                className="h-10 sm:h-12"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-grow justify-center items-center gap-4 xl:gap-8 text-xs xl:text-sm font-medium tracking-wider">
            {/* Dropdown Botas */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-white">
                {language === 'es' ? 'BOTAS' : 'BOOTS'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-caborca-cafe shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/catalogo/hombre" className="block px-4 py-3 text-white">{language === 'es' ? 'HOMBRE' : 'MEN'}</Link>
                <Link to="/catalogo/mujer" className="block px-4 py-3 text-white">{language === 'es' ? 'MUJER' : 'WOMEN'}</Link>
              </div>
            </div>
            {navLinks.filter(l => !l.isDropdown).map(link => (
              <Link key={link.path} to={link.path} className="text-white uppercase">
                {link.name[language]}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Language Selector with Flags */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={(e) => navigateToLang(e, 'es')}
              className={`hover:opacity-75 transition-opacity ${language === 'es' ? 'ring-2 ring-white rounded-full' : 'opacity-60'}`}
              title="Español"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 480" className="w-8 h-6 rounded-full border border-gray-100">
                <rect width="840" height="480" fill="#fff" />
                <rect width="280" height="480" fill="#006847" />
                <rect width="280" height="480" x="560" fill="#ce1126" />
                <g transform="translate(420, 240)">
                  <ellipse cx="0" cy="0" rx="45" ry="50" fill="#8b4513" stroke="#654321" strokeWidth="2" />
                  <path d="M -25,-15 Q 0,-35 25,-15 L 20,10 Q 0,25 -20,10 Z" fill="#8b6914" />
                  <circle cx="0" cy="-5" r="8" fill="#d4af37" />
                  <path d="M -15,15 L -10,25 L -5,15 M 5,15 L 10,25 L 15,15" stroke="#2d5016" strokeWidth="2" fill="none" />
                </g>
              </svg>
            </button>
            <button
              onClick={(e) => navigateToLang(e, 'en')}
              className={`hover:opacity-75 transition-opacity ${language === 'en' ? 'ring-2 ring-white rounded-full' : 'opacity-60'}`}
              title="English"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="w-8 h-6 rounded-full border border-gray-100">
                <rect width="7410" height="3900" fill="#b22234" />
                <path d="M 0,450 h 7410 m 0,600 H 0 m 0,600 h 7410 m 0,600 H 0 m 0,600 h 7410 m 0,600 H 0" stroke="#fff" strokeWidth="300" />
                <rect width="2964" height="2100" fill="#3c3b6e" />
                <g fill="#fff">
                  <path d="M 247,90 l 0,210 M 142,140 h 210" />
                </g>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-caborca-cafe border-t border-gray-600">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <div>
                  <button
                    className="mobile-dropdown-btn w-full text-left text-white font-medium tracking-wider flex justify-between items-center py-2"
                    onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  >
                    {language === 'es' ? 'BOTAS' : 'BOOTS'}
                    <svg
                      className="w-4 h-4 transition-transform"
                      style={{ transform: mobileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileDropdownOpen && (
                    <div className="mobile-dropdown-content pl-4 pt-2 space-y-2">
                      <Link to="/catalogo/hombre" className="block text-white py-1 uppercase" onClick={toggleMobileMenu}>{language === 'es' ? 'HOMBRE' : 'MEN'}</Link>
                      <Link to="/catalogo/mujer" className="block text-white py-1 uppercase" onClick={toggleMobileMenu}>{language === 'es' ? 'MUJER' : 'WOMEN'}</Link>
                    </div>
                  )}
                </div>
                {navLinks.filter(l => !l.isDropdown).map(link => (
                  <Link key={link.path} to={link.path} className="text-white font-medium tracking-wider py-2 uppercase" onClick={toggleMobileMenu}>
                    {link.name[language]}
                  </Link>
                ))}

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button onClick={(e) => navigateToLang(e, 'es')} className={`hover:opacity-75 transition-opacity ${language === 'es' ? 'ring-1 ring-white p-0.5 rounded' : 'opacity-60'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 480" className="w-8 h-5 rounded">
                      <rect width="840" height="480" fill="#fff" />
                      <rect width="280" height="480" fill="#006847" />
                      <rect width="280" height="480" x="560" fill="#ce1126" />
                    </svg>
                  </button>
                  <button onClick={(e) => navigateToLang(e, 'en')} className={`hover:opacity-75 transition-opacity ${language === 'en' ? 'ring-1 ring-white p-0.5 rounded' : 'opacity-60'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" className="w-8 h-5 rounded">
                      <rect width="7410" height="3900" fill="#b22234" />
                      <path d="M 0,450 h 7410 m 0,600 H 0 m 0,600 h 7410 m 0,600 H 0 m 0,600 h 7410 m 0,600 H 0" stroke="#fff" strokeWidth="300" />
                      <rect width="2964" height="2100" fill="#3c3b6e" />
                    </svg>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
