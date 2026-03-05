import { useState, useEffect, useRef, useMemo } from 'react';
import homeService from '../api/homeService';
import { useLanguage } from '../context/LanguageContext';

// Datos por defecto (fallback si la API no responde)
const SLIDES_DEFAULT = [
  { titulo_ES: "Colección Premium", titulo_EN: "Premium Collection", subtitulo_ES: "BOTAS DE LUJO HECHAS A MANO", subtitulo_EN: "HANDMADE LUXE BOOTS", imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png", textoBoton_ES: "Descubre Más", textoBoton_EN: "Discover More" },
  { titulo_ES: "Elegancia Mexicana", titulo_EN: "Mexican Elegance", subtitulo_ES: "TRADICIÓN Y ESTILO", subtitulo_EN: "TRADITION AND STYLE", imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png", textoBoton_ES: "Descubre Más", textoBoton_EN: "Discover More" },
  { titulo_ES: "Botas Caborca", titulo_EN: "Caborca Boots", subtitulo_ES: "SOMOS LO QUE HACEMOS", subtitulo_EN: "WE ARE WHAT WE DO", imagenUrl: "https://blocks.astratic.com/img/general-img-landscape.png", textoBoton_ES: "Descubre Más", textoBoton_EN: "Discover More" }
];

const Carrusel = () => {
  const { t } = useLanguage();
  const [diapositivaActual, setDiapositivaActual] = useState(0);
  const [rawSlides, setRawSlides] = useState(SLIDES_DEFAULT);
  const intervalRef = useRef(null);

  // Cargar datos de la API
  useEffect(() => {
    homeService.getHomeContent()
      .then(data => {
        if (data?.carousel?.length > 0) {
          setRawSlides(data.carousel.sort((a, b) => a.orden - b.orden));
        }
      })
      .catch(() => {
        console.warn('API no disponible, usando datos por defecto del carrusel.');
      });
  }, []);

  const diapositivas = useMemo(() => {
    return rawSlides.map(s => ({
      titulo: t(s, 'titulo'),
      subtitulo: t(s, 'subtitulo'),
      imagen: s.imagenUrl || "https://blocks.astratic.com/img/general-img-landscape.png",
      textoBoton: t(s, 'textoBoton'),
      link: s.linkBoton || '#'
    }));
  }, [rawSlides, t]);

  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setDiapositivaActual((prev) => (prev + 1) % diapositivas.length);
      }, 5000);
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [diapositivas.length]);

  // Parallax removed

  const handleDotClick = (indice) => {
    setDiapositivaActual(indice);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setDiapositivaActual((prev) => (prev + 1) % diapositivas.length);
    }, 5000);
  };

  return (
    <div className="carousel-container">
      {diapositivas.map((diapositiva, indice) => (
        <div key={indice} className={`carousel-slide ${indice === diapositivaActual ? 'active' : ''}`}>
          <div
            className="parallax-layer"
            style={{
              backgroundImage: `url('${diapositiva.imagen}')`,
            }}
          ></div>
          <div className="carousel-overlay"></div>
          <div className="carousel-content">
            <h1 className="carousel-title font-serif">{diapositiva.titulo}</h1>
            <p className="carousel-subtitle font-sans tracking-wider">{diapositiva.subtitulo}</p>
            <button className="carousel-btn">{diapositiva.textoBoton}</button>
          </div>
        </div>
      ))}

      <div className="carousel-dots">
        {diapositivas.map((_, indice) => (
          <span
            key={indice}
            className={`carousel-dot ${indice === diapositivaActual ? 'active' : ''}`}
            onClick={() => handleDotClick(indice)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;
