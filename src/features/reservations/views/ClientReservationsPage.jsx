import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_RESERVAS } from "../services/reservationGraphQL";
import reservationService from "../services/reservationService";
import { toast } from "react-toastify";
import ReservationCard from "../components/ReservationCard";
import { useAuth } from "../../../context/AuthContext";
import ConfirmModal from "../../../components/ConfirmModal";

const ClientReservationsPage = () => {
  const { clientProfile, isClient, clientProfileLoading } = useAuth();
  const idCliente = clientProfile?.idCliente;

  const [estadoFiltro, setEstadoFiltro] = useState("TODAS");
  const [reservaToCancel, setReservaToCancel] = useState(null);

  const filtroObj = idCliente ? { idCliente } : {};
  if (estadoFiltro !== "TODAS") {
    filtroObj.estado = estadoFiltro;
  }

  const { loading, error, data, refetch } = useQuery(GET_RESERVAS, {
    variables: {
      filtro: Object.keys(filtroObj).length > 0 ? filtroObj : null,
    },
    skip: !idCliente,
  });

  const handleCancelClick = (reserva) => {
    setReservaToCancel(reserva);
  };

  const confirmCancel = async () => {
    if (!reservaToCancel) return;
    try {
      await reservationService.cancel(reservaToCancel.idReserva);
      toast.success("Reserva cancelada exitosamente.");
      refetch();
    } catch (error) {
      toast.error(
        "Error al cancelar la reserva: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setReservaToCancel(null);
    }
  };

  // Mientras el perfil de cliente está siendo cargado, mostramos un spinner
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

  const reservasFiltradas = data?.reservas || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mis Reservas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cliente:{" "}
            <span className="font-semibold text-gray-700">
              {clientProfile.nombre} {clientProfile.apellido}
            </span>{" "}
            (DNI: {clientProfile.dni})
          </p>
        </div>

        {/* Filtros por Estado */}
        <div className="flex flex-wrap gap-2">
          {["TODAS", "CONFIRMADA", "CANCELADA", "FINALIZADA"].map((estado) => (
            <button
              key={estado}
              onClick={() => setEstadoFiltro(estado)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                estadoFiltro === estado
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {estado === "TODAS" ? "Todas" : estado}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading && (
          <p className="p-4 text-center text-gray-500">Cargando reservas...</p>
        )}

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
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Días
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio D. / Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {reservasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No se encontraron reservas con el filtro seleccionado (
                    {estadoFiltro}).
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((reserva) => (
                  <ReservationCard
                    key={reserva.idReserva}
                    reserva={reserva}
                    onCancel={handleCancelClick}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Confirmación de Cancelación */}
      <ConfirmModal
        isOpen={!!reservaToCancel}
        onClose={() => setReservaToCancel(null)}
        title="Cancelar Reserva"
      >
        {reservaToCancel && (
          <div>
            <p className="text-gray-600 text-[15px] mb-6">
              ¿Está seguro de que desea cancelar la reserva del vehículo{" "}
              <span className="font-semibold text-gray-900">
                {reservaToCancel.vehiculo.marca} {reservaToCancel.vehiculo.modelo}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setReservaToCancel(null)}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={confirmCancel}
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all"
              >
                Sí, cancelar reserva
              </button>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
};

export default ClientReservationsPage;