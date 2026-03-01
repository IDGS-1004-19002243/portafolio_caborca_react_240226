// Servicio de formularios: envia datos al backend que dispara el correo SMTP
const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? 'https://localhost:7020/api'
        : 'https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api');

export const contactoService = {
    /**
     * Envía el formulario de contacto.
     * @param {{ nombre, correo, telefono, asunto, mensaje }} datos
     * @returns {{ mensaje: string }}
     */
    enviarContacto: async (datos) => {
        const res = await fetch(`${API_URL}/Contacto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: datos.nombre,
                correo: datos.correo,
                telefono: datos.telefono || '',
                asunto: datos.asunto || '',
                mensaje: datos.mensaje,
            }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.mensaje || 'Error al enviar el mensaje');
        return json;
    },

    /**
     * Envía la solicitud de distribuidor.
     * @param {{ nombreCompleto, correoElectronico, telefono, negocioNombre, ciudad, mensaje }} datos
     * @returns {{ mensaje: string }}
     */
    enviarSolicitudDistribuidor: async (datos) => {
        const res = await fetch(`${API_URL}/Contacto/Distribuidor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombreCompleto: datos.nombreCompleto,
                correoElectronico: datos.correoElectronico,
                telefono: datos.telefono || '',
                negocioNombre: datos.negocioNombre || datos.ciudad || '',
                ciudad: datos.ciudad || '',
                mensaje: datos.mensaje || '',
            }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.mensaje || 'Error al enviar la solicitud');
        return json;
    },
};
