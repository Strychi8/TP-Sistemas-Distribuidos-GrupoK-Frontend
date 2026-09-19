import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ClientTable = ({ clients, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo Electrónico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Nacimiento
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No hay clientes registrados en el sistema.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr
                  key={c.idCliente}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {c.nombre} {c.apellido}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                    {c.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {c.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {c.telefono || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {c.fechaNacimiento || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/clientes/editar/${c.idCliente}`}
                        className="text-blue-600 hover:text-blue-900 p-1 bg-blue-50 rounded hover:bg-blue-100 transition"
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() =>
                          onDelete(c.idCliente, c.nombre, c.apellido)
                        }
                        className="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded hover:bg-red-100 transition"
                        title="Dar de baja"
                      >
                        <FaTrash size={18} />
                      </button>
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

export default ClientTable;