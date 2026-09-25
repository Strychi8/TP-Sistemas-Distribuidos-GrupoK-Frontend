import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import vehicleService from '../services/vehicleService';
import ConfirmModal from '../../../components/ConfirmModal';
import VehicleTable from '../components/VehicleTable';

const VehicleListPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error) {
      toast.error('Error al cargar los vehículos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchVehicles();
  }, []);

  const handleDeleteClick = (idVehiculo, patente) => {
    setVehicleToDelete({ idVehiculo, patente });
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await vehicleService.delete(vehicleToDelete.idVehiculo);
      toast.success('Vehículo dado de baja correctamente');
      fetchVehicles(); // Refrescar la lista
    } catch (error) {
      toast.error('Error al dar de baja el vehículo');
      console.error(error);
    } finally {
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Flota de Vehículos</h1>
        <Link
          to="/vehiculos/nuevo"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-200"
        >
          <FaPlus /> Nuevo Vehículo
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <VehicleTable vehicles={vehicles} onDelete={handleDeleteClick} />
      )}

      {/* Modal de Confirmación de Baja */}
      <ConfirmModal
        isOpen={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        title="Dar de Baja Vehículo"
      >
        {vehicleToDelete && (
          <div>
            <p className="text-gray-600 text-[15px] mb-6">
              ¿Está seguro de que desea dar de baja al vehículo con patente{" "}
              <span className="font-semibold text-gray-900">
                {vehicleToDelete.patente}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setVehicleToDelete(null)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all"
              >
                Sí, dar de baja
              </button>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
};

export default VehicleListPage;
