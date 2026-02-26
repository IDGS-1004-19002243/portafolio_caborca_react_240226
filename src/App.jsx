import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages (usar `Inicio` como root)
import Inicio from './paginas/Inicio';
import CatalogoHombre from './paginas/CatalogoHombre';
import CatalogoMujer from './paginas/CatalogoMujer';
import Nosotros from './paginas/Nosotros';
import ResponsabilidadAmbiental from './paginas/ResponsabilidadAmbiental';
import Distribuidores from './paginas/Distribuidores';
import Contacto from './paginas/Contacto';
import DetalleProducto from './paginas/DetalleProducto';
import NotFound from './paginas/NotFound';
import EnConstruccion from './paginas/EnConstruccion';

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "https://localhost:7020/api" : "https://cms-api-caborca-gkfbcdffbqfpesfg.centralus-01.azurewebsites.net/api");
        const response = await fetch(`${API_URL}/Settings/Mantenimiento`);
        const data = await response.json();
        if (data && data.activo) {
          setIsMaintenance(true);
        }
      } catch (error) {
        console.error('Error verificando modo mantenimiento:', error);
      } finally {
        setLoadingConfig(false);
      }
    };
    checkMaintenance();
  }, []);

  if (loadingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#5C4A3A]"></div>
      </div>
    );
  }

  if (isMaintenance) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<EnConstruccion />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Inicio />} />

        {/* Rutas de catálogo */}
        <Route path="/catalogo/hombre" element={<CatalogoHombre />} />
        <Route path="/catalogo/mujer" element={<CatalogoMujer />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />

        {/* Rutas de empresa */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/responsabilidad-ambiental" element={<ResponsabilidadAmbiental />} />
        <Route path="/distribuidores" element={<Distribuidores />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Rutas legacy (mantener temporalmente) */}
        <Route path="/catalogo-hombre" element={<Navigate to="/catalogo/hombre" replace />} />
        <Route path="/catalogo-mujer" element={<Navigate to="/catalogo/mujer" replace />} />
        <Route path="/detalle-producto" element={<DetalleProducto />} />

        {/* Páginas de estado */}
        <Route path="/mantenimiento" element={<EnConstruccion />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
