import { Routes, Route, Navigate } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/vehiculos" replace />} />
      
      {/* Rutas 404 - Not Found */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
          <p className="text-xl text-gray-600">Página no encontrada</p>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;