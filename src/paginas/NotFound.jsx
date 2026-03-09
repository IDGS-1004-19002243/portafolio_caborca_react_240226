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
    // eslint-disable-next-line no-unused-vars
    const { language } = useLanguage();
    // eslint-disable-next-line no-unused-vars
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
        <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden" style={{ backgroundColor: '#0B0D11' }}>

            {/* 404 Central Display Area matching image design */}
            <div className="relative z-10 w-full max-w-5xl mx-auto flex justify-center items-center mt-8">
                {/* The 404 Text */}
                <div className="relative flex justify-center items-center">
                    <h1
                        className="text-[12rem] sm:text-[18rem] md:text-[24rem] lg:text-[28rem] font-serif font-black leading-none uppercase select-none tracking-tighter"
                        style={{
                            color: '#A07E52', // matching the exact brown from the image
                            textShadow: '4px 4px 0px rgba(0,0,0,1), 8px 8px 16px rgba(0,0,0,0.4)',
                            WebkitTextStroke: '2px rgba(160, 126, 82, 0.4)' // slight stroke to make it pop
                        }}
                    >
                        404
                    </h1>

                    {/* Overlay elements positioned exactly over the '0' */}
                    <div className="absolute inset-0 flex flex-col justify-end items-center pb-[18%] md:pb-[14%]">

                        {/* Horizontal Line overlapping the zero */}
                        <div className="w-[80px] sm:w-[120px] md:w-[160px] h-2 sm:h-3 md:h-4 lg:h-5 bg-[#A07E52] shadow-2xl z-20 mb-1 lg:mb-2 translate-y-1/2"></div>

                        {/* Return Button inside the bottom of the zero */}
                        <Link
                            to="/"
                            className="bg-[#A07E52] hover:bg-[#8F6F46] transition-colors flex items-center justify-center py-2 sm:py-3 md:py-4 px-6 sm:px-8 md:px-12 z-30 shadow-2xl mt-4 sm:mt-6 md:mt-10"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
