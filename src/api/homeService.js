// API del Portafolio: Solo lectура (GET), sin autenticación.
const API_URL = "https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api";

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
