import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle} from "react-icons/fa";
import { toast } from "react-toastify";
import clientService from "../services/clientService";

const ClientListPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      toast.error("Error al cargar los clientes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id, nombre, apellido) => {
    if (
      window.confirm(
        `¿Estás seguro de dar de baja al cliente ${nombre} ${apellido}?`,
      )
    ) {
      const toastId = toast.loading("Procesando baja lógica...");
      try {
        await clientService.delete(id);
        toast.update(toastId, {
          render: "Cliente dado de baja correctamente",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        fetchClients(); // Refrescar la lista
      } catch (error) {
        console.error(error);
        toast.update(toastId, {
          render: "Error al dar de baja el cliente",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Clientes
        </h1>
        <Link
          to="/clientes/nuevo"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-200"
        >
          <FaPlus /> Nuevo Cliente
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
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
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado (Activo)
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{c.email}</div>
                        <div className="text-sm text-gray-500">
                          {c.telefono || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {c.direccion || "No especificada"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {c.activo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            <FaCheckCircle className="text-green-500" /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            <FaTimesCircle className="text-red-500" /> Inactivo
                          </span>
                        )}
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
                          {c.activo && (
                            <button
                              onClick={() =>
                                handleDelete(c.idCliente, c.nombre, c.apellido)
                              }
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
      )}
    </div>
  );
};

export default ClientListPage;
