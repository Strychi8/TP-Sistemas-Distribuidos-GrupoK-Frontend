import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import clientService from "../services/clientService";
import ClientTable from "../components/ClientTable";

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
        <ClientTable clients={clients} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ClientListPage;
