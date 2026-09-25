import { Routes, Route, Navigate } from 'react-router-dom';
import VehicleListPage from '../features/vehicles/views/VehicleListPage';
import VehicleFormPage from '../features/vehicles/views/VehicleFormPage';
import ClientListPage from '../features/clients/views/ClientListPage';
import ClientFormPage from '../features/clients/views/ClientFormPage';
import ReservationListPage from '../features/reservations/views/ReservationListPage';
import VehicleCatalogPage from '../features/vehicles/views/VehicleCatalogPage';
import ClientReservationsPage from '../features/reservations/views/ClientReservationsPage';
import ClientHistoryPage from '../features/reservations/views/ClientHistoryPage';
import LoginPage from '../features/auth/views/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import ErrorView from '../components/ErrorView';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta de Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas de errores */}
      <Route path="/error/403" element={<ErrorView status={403} />} />
      <Route path="/error/401" element={<ErrorView status={401} />} />
      <Route path="/error/500" element={<ErrorView status={500} />} />

      {/* Rutas de protegidas del administrador */}
      <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
        {/* Rutas de vehiculo del administrador */}
        <Route path="/vehiculos" element={<VehicleListPage />} />
        <Route path="/vehiculos/nuevo" element={<VehicleFormPage />} />
        <Route path="/vehiculos/editar/:id" element={<VehicleFormPage />} />
        {/* Rutas de cliente del administrador */}
        <Route path="/clientes" element={<ClientListPage />} />
        <Route path="/clientes/nuevo" element={<ClientFormPage />} />
        <Route path="/clientes/editar/:id" element={<ClientFormPage />} />
        <Route path="/reservas" element={<ReservationListPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
        {/* Ruta de catalogo de cliente */}
        <Route path="/catalogo" element={<VehicleCatalogPage />} />
        {/* Ruta de reservas de cliente */}
        <Route path="/mis-reservas" element={<ClientReservationsPage />} />
        {/* Ruta de historial de cliente */}
        <Route path="/historial" element={<ClientHistoryPage />} />
      </Route>

      {/* Rutas 404 - Not Found */}
      <Route path="*" element={<ErrorView status={404} />} />
    </Routes>
  );
};

export default AppRoutes;