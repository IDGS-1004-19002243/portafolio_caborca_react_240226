import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { textosService } from '../api/textosService';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
    const { t } = useLanguage();
    const [content, setContent] = useState({
        titulo_ES: '¡Esa ruta no existe, vaquero!',
        titulo_EN: 'That route doesn\'t exist, cowboy!',
        mensaje_ES: 'Parece que te has alejado demasiado del camino.\nNo te preocupes, endereza las riendas y vuelve con nosotros.',
        mensaje_EN: 'It seems you\'ve strayed too far from the path.\nDon\'t worry, straighten the reins and come back to us.',
        textoBoton_ES: 'Volver al pueblito',
        textoBoton_EN: 'Back to town',
        imagenFondo: 'https://blocks.astratic.com/img/general-img-landscape.png'
    });

    useEffect(() => {
        textosService.getTextos('notfound')
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    setContent(prev => ({ ...prev, ...data }));
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={content.imagenFondo} alt="404" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10 flex flex-col items-center justify-center min-h-[60vh] mt-10">
                {/* 404 de fondo */}
                <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center select-none pointer-events-none -mt-40 md:-mt-48 z-0">
                    <h1 className="text-[14rem] sm:text-[20rem] md:text-[26rem] lg:text-[32rem] font-serif font-bold text-[#b58e5a] leading-none opacity-90 drop-shadow-2xl brightness-90">
                        404
                    </h1>
                </div>

                {/* Contenido frontal */}
                <div className="relative z-10 mt-12 md:mt-24">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-serif font-bold mb-8 text-white tracking-widest uppercase" style={{ textShadow: '4px 4px 6px rgba(0,0,0,0.8)' }}>
                        {t(content, 'titulo')}
                    </h2>

                    <div className="w-24 md:w-32 h-1.5 md:h-2 bg-[#b58e5a] mx-auto mb-10 shadow-lg"></div>

                    <p className="text-xl md:text-[1.6rem] text-white max-w-3xl mx-auto mb-14 leading-relaxed font-serif font-medium whitespace-pre-wrap" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        {t(content, 'mensaje')}
                    </p>

                    <Link to="/" className="inline-flex items-center gap-3 bg-[#b58e5a] text-white font-bold tracking-widest text-sm md:text-base px-10 py-4 shadow-xl hover:bg-[#99764a] transition-colors uppercase group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span>{t(content, 'textoBoton')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
