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

            <div className="container mx-auto px-4 text-center relative z-10">
                <h1 className="text-[12rem] md:text-[16rem] font-serif font-bold text-caborca-bronce leading-none select-none opacity-80 animate-pulse" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}>404</h1>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 -mt-10 md:-mt-16 text-white drop-shadow-lg tracking-wide uppercase">{t(content, 'titulo')}</h2>
                <div className="w-32 h-2 bg-caborca-bronce mx-auto mb-8 rounded-full shadow-lg"></div>
                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed font-bold drop-shadow-md whitespace-pre-wrap">{t(content, 'mensaje')}</p>
                <Link to="/" className="inline-flex items-center gap-3 bg-caborca-bronce !text-white font-bold tracking-widest text-base px-10 py-5 rounded-md shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:!text-white group uppercase">
                    <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span>{t(content, 'textoBoton')}</span>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
