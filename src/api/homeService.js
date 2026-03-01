// API del Portafolio: Solo lectura (GET), sin autenticación.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "https://localhost:7020/api" : "https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api");

const homeService = {
    getHomeContent: async () => {
        const response = await fetch(`${API_URL}/Home`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) throw new Error('Error al cargar contenido');
        return response.json();
    },
    getCatalogoHombre: async () => {
        const response = await fetch(`${API_URL}/Settings/CatalogoHombre`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error loading CatalogoHombre');
        return response.json();
    },
    getCatalogoMujer: async () => {
        const response = await fetch(`${API_URL}/Settings/CatalogoMujer`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error loading CatalogoMujer');
        return response.json();
    }
};

export default homeService;
