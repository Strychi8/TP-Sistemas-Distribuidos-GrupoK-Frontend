import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { GET_RESERVAS } from "../services/reservationGraphQL";
import reservationService from "../services/reservationService";
import { toast } from "react-toastify";
import ReservationCard from "../components/ReservationCard";

const ClientReservationsPage = () => {
  const navigate = useNavigate();
  const [idCliente, setIdCliente] = useState(null);

  useEffect(() => {
    // Simulacion de login para el Hito 1
    const idStr = window.prompt("Simulación de sesión: Ingrese su ID de Cliente para ver sus reservas:");
    if (!idStr) {
      toast.info("Debe ingresar un ID de cliente para ver sus reservas.");
      navigate("/");
      return;
    }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      toast.error("El ID de Cliente debe ser numérico.");
      navigate("/");
      return;
    }
    setIdCliente(id);
  }, [navigate]);

  const { loading, error, data, refetch } = useQuery(GET_RESERVAS, {
    variables: {
      filtro: idCliente ? { idCliente } : null,
    },
    skip: !idCliente,
  });

  const handleCancel = async (idReserva) => {
    try {
      await reservationService.cancel(idReserva);
      toast.success("Reserva cancelada exitosamente.");
      refetch();
    } catch (error) {
      toast.error("Error al cancelar la reserva: " + (error.response?.data?.message || error.message));
    }
  };

  if (!idCliente) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mis Reservas</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading && <p className="p-4">Cargando reservas...</p>}

        {error && (
          <p className="p-4 text-red-500">
            Error al cargar las reservas: {error.message}
          </p>
        )}

        {!loading && !error && data?.reservas && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio D. / Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.reservas.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No tienes reservas registradas.
                  </td>
                </tr>
              ) : (
                data.reservas.map((reserva) => (
                  <ReservationCard 
                    key={reserva.idReserva} 
                    reserva={reserva} 
                    onCancel={handleCancel}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientReservationsPage;
