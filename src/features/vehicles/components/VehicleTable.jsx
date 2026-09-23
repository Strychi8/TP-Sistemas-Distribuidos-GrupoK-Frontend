import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VehicleTable = ({ vehicles, onDelete }) => {
  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disponible</span>;
      case 'RESERVADO':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Reservado</span>;
      case 'EN_ALQUILER':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">En Alquiler</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{estado}</span>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Diario</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  No hay vehículos registrados en el sistema.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.idVehiculo} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900 font-bold">{v.patente}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{v.marca} {v.modelo}</div>
                    <div className="text-sm text-gray-500">{v.anio} • {v.color}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.tipoVehiculo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${v.precioDiario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(v.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {v.activo ? (
                      <FaCheckCircle className="text-green-500 inline text-xl" title="Activo" />
                    ) : (
                      <FaTimesCircle className="text-red-500 inline text-xl" title="Inactivo" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/vehiculos/editar/${v.idVehiculo}`}
                        className="text-blue-600 hover:text-blue-900 p-1 bg-blue-50 rounded hover:bg-blue-100 transition"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </Link>
                      {v.activo && (
                        <button
                          onClick={() => onDelete(v.idVehiculo, v.patente)}
                          className="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded hover:bg-red-100 transition"
                          title="Dar de baja"
                        >
                          <FaTrash size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;
