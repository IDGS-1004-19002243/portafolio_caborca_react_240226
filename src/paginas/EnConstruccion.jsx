import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { textosService } from '../api/textosService';
import { useLanguage } from '../context/LanguageContext';

const EnConstruccion = () => {
    const { t } = useLanguage();
    const [content, setContent] = useState({
        titulo_ES: 'Página en Construcción',
        titulo_EN: 'Page Under Construction',
        subtitulo_ES: 'ESTAMOS PREPARANDO ALGO INCREÍBLE',
        subtitulo_EN: 'WE ARE PREPARING SOMETHING AMAZING',
        mensaje_ES: 'Estamos trabajando arduamente para traerte una experiencia renovada.',
        mensaje_EN: 'We are working hard to bring you a renewed experience.',
        imagenFondo: 'https://blocks.astratic.com/img/general-img-landscape.png'
    });

    useEffect(() => {
        textosService.getTextos('mantenimiento')
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
                <img src={content.imagenFondo} alt="Maintenance" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-2xl tracking-tight uppercase">{t(content, 'titulo')}</h1>
                <p className="text-caborca-bronce font-bold text-xl md:text-2xl mb-8 uppercase tracking-[0.2em] shadow-black drop-shadow-md">{t(content, 'subtitulo')}</p>
                <div className="w-32 h-2 bg-caborca-bronce mx-auto mb-10 rounded-full shadow-lg opacity-80"></div>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed font-bold drop-shadow-md whitespace-pre-wrap">{t(content, 'mensaje')}</p>
            </div>
        </div>
    );
};

export default EnConstruccion;
