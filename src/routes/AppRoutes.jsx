import { Routes, Route, Navigate } from 'react-router-dom';
import VehicleListPage from '../features/vehicles/views/VehicleListPage';
import VehicleFormPage from '../features/vehicles/views/VehicleFormPage';
import ClientListPage from '../features/clients/views/ClientListPage';
import ClientFormPage from '../features/clients/views/ClientFormPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/vehiculos" replace />} />

      {/* Rutas de Vehículos */}
      <Route path="/vehiculos" element={<VehicleListPage />} />
      <Route path="/vehiculos/nuevo" element={<VehicleFormPage />} />
      <Route path="/vehiculos/editar/:id" element={<VehicleFormPage />} />

      {/* Rutas de Clientes */}
      <Route path="/clientes" element={<ClientListPage />} />
      <Route path="/clientes/nuevo" element={<ClientFormPage />} />
      <Route path="/clientes/editar/:id" element={<ClientFormPage />} />

      {/* Rutas 404 - Not Found */}
      <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
            <p className="text-xl text-gray-600">Página no encontrada</p>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;