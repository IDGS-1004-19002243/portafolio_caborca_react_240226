// API del Portafolio: Solo lectура (GET), sin autenticación.
const API_URL = "https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api";

export const textosService = {
    getTextos: async (pagina) => {
        try {
            const response = await fetch(`${API_URL}/cms/content/${pagina}`);
            if (!response.ok) throw new Error(`Error al cargar textos de ${pagina}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching textos for ${pagina}:`, error);
            throw error;
        }
    }
};
