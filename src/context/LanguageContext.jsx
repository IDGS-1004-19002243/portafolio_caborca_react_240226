import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('caborca_pref_lang');
        return saved || 'es';
    });

    useEffect(() => {
        localStorage.setItem('caborca_pref_lang', language);
    }, [language]);

    const t = (obj, field) => {
        if (!obj) return '';

        // Si el objeto tiene directamente las llaves es/en
        if (obj[field] && typeof obj[field] === 'object') {
            return obj[field][language] || obj[field]['es'] || '';
        }

        // Si el objeto tiene campos con sufijos _ES / _EN (Formato de la API)
        const suffix = language.toUpperCase();
        const value = obj[`${field}_${suffix}`] || obj[`${field}_ES`];

        if (value !== undefined) return value;

        // Fallback al campo original si no hay sufijos
        return obj[field] || '';
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
