// API del Portafolio: Solo lectура (GET), sin autenticación.
const API_URL = "https://localhost:7020/api";

const homeService = {
    getHomeContent: async () => {
        const response = await fetch(`${API_URL}/Home`, {
            cache: 'no-store',    // Siempre pedir datos frescos al servidor
            headers: { 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) throw new Error('Error al cargar contenido');
        return response.json();
    }
};

export default homeService;
