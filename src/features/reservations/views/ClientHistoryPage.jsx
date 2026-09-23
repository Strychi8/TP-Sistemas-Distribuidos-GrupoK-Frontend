import { useQuery } from "@apollo/client/react";
import { GET_HISTORIAL_ALQUILERES } from "../services/reservationGraphQL";
import { useAuth } from "../../../context/AuthContext";

const ClientHistoryPage = () => {
  const { clientProfile, isClient, clientProfileLoading } = useAuth();
  const idCliente = clientProfile?.idCliente;

  const { loading, error, data } = useQuery(GET_HISTORIAL_ALQUILERES, {
    variables: { idCliente },
    skip: !idCliente,
    fetchPolicy: "cache-and-network",
  });

  if (clientProfileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isClient || !clientProfile) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <p className="text-gray-600">
          Cargando perfil de cliente o sesión no válida...
        </p>
      </div>
    );
  }

  const historial = data?.historialAlquileres || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Historial de Alquileres</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cliente:{" "}
            <span className="font-semibold text-gray-700">
              {clientProfile.nombre} {clientProfile.apellido}
            </span>{" "}
            (DNI: {clientProfile.dni})
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading && (
          <p className="p-4 text-center text-gray-500">Cargando historial...</p>
        )}

        {error && (
          <p className="p-4 text-red-500">
            Error al cargar el historial: {error.message}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Inicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Fin
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Días
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importe Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historial.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No se encontraron registros en el historial.
                    </td>
                  </tr>
                ) : (
                  historial.map((registro, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {registro.vehiculo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {registro.patente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registro.fechaInicio).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registro.fechaFinalizacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {registro.cantidadDias}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">
                        ${registro.importeTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            registro.estado === "FINALIZADA"
                              ? "bg-blue-100 text-blue-800"
                              : registro.estado === "CANCELADA"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {registro.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHistoryPage;
