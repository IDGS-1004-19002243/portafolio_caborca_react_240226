import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { textosService } from '../api/textosService';
import { useLanguage } from '../context/LanguageContext';

const defaultContent = {
    titulo_ES: '¡Esa ruta no existe, vaquero!',
    titulo_EN: 'That route doesn\'t exist, cowboy!',
    mensaje_ES: 'Parece que te has alejado demasiado del camino.\nNo te preocupes, endereza las riendas y vuelve con nosotros.',
    mensaje_EN: 'It seems you\'ve strayed too far from the path.\nDon\'t worry, straighten the reins and come back to us.',
    textoBoton_ES: 'Volver al pueblito',
    textoBoton_EN: 'Back to town',
    imagenFondo: 'https://blocks.astratic.com/img/general-img-landscape.png'
};

const NotFound = () => {
    const { t } = useLanguage();
    const [content, setContent] = useState(defaultContent);

    useEffect(() => {
        textosService.getTextos('notfound')
            .then(data => {
                if (data && Object.keys(data).length > 0) {
                    const merged = { ...defaultContent };
                    for (const key in data) {
                        if (data[key] && typeof data[key] === 'object' && Object.keys(data[key]).length > 0) {
                            merged[key] = { ...merged[key], ...data[key] };
                        } else if (data[key] && typeof data[key] !== 'object') {
                            merged[key] = data[key];
                        }
                    }
                    setContent(merged);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden bg-[#0B0D11]">

            {/* The giant 404 in the background */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
                <h1
                    className="text-[14rem] sm:text-[20rem] md:text-[26rem] lg:text-[32rem] font-serif font-black leading-none uppercase tracking-tighter"
                    style={{
                        color: '#A07E52',
                        textShadow: '4px 4px 0px rgba(0,0,0,1)'
                    }}
                >
                    404
                </h1>
            </div>

            {/* The Foreground Content overlays exactly over the 404 middle */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full mt-8 md:mt-12">

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] font-serif font-black mb-6 lg:mb-8 text-white tracking-widest uppercase"
                    style={{
                        textShadow: '0 4px 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)'
                    }}>
                    {t(content, 'titulo')}
                </h2>

                {/* Section Separator Line */}
                <div className="w-24 md:w-32 lg:w-40 h-1.5 md:h-2 bg-[#A07E52] shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-8 lg:mb-12"></div>

                {/* Multiline description */}
                <p className="text-base sm:text-lg md:text-2xl text-white max-w-3xl mx-auto mb-10 lg:mb-14 leading-relaxed font-serif font-bold whitespace-pre-wrap"
                    style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)' }}>
                    {t(content, 'mensaje')}
                </p>

                {/* Return Button */}
                <Link to="/" className="inline-flex items-center gap-3 bg-[#A07E52] text-white font-bold tracking-widest text-sm md:text-lg px-8 py-3 shadow-[0_4px_10px_rgba(0,0,0,0.6)] hover:bg-[#8F6F46] transition-colors uppercase group">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>{t(content, 'textoBoton')}</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
