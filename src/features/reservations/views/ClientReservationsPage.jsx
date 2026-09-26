import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_RESERVAS } from "../services/reservationGraphQL";
import reservationService from "../services/reservationService";
import { toast } from "react-toastify";
import ReservationCard from "../components/ReservationCard";
import { useAuth } from "../../../context/AuthContext";
import ConfirmModal from "../../../components/ConfirmModal";
import { FaSearch } from "react-icons/fa";

const INITIAL_FILTERS = {
  vehiculo: "",
  tipoVehiculo: "",
  estado: "",
  fechaDesde: "",
  fechaHasta: "",
};

const ClientReservationsPage = () => {
  const { clientProfile, isClient, clientProfileLoading } = useAuth();
  const idCliente = clientProfile?.idCliente;

  const [filtros, setFiltros] = useState(INITIAL_FILTERS);
  const [filtroAplicado, setFiltroAplicado] = useState(null);
  const [vehiculoFiltroAplicado, setVehiculoFiltroAplicado] = useState("");
  
  const [reservaToCancel, setReservaToCancel] = useState(null);

  const filtroVariables = { ...filtroAplicado };
  if (idCliente && !filtroVariables.idCliente) {
    filtroVariables.idCliente = idCliente;
  }

  const { loading, error, data, refetch } = useQuery(GET_RESERVAS, {
    variables: {
      filtro: Object.keys(filtroVariables).length > 0 ? filtroVariables : null,
    },
    skip: !idCliente,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aplicarFiltros = () => {
    const cleanedFiltros = { idCliente };

    if (filtros.tipoVehiculo) {
      cleanedFiltros.tipoVehiculo = filtros.tipoVehiculo;
    }
    if (filtros.estado) {
      cleanedFiltros.estado = filtros.estado;
    }
    if (filtros.fechaDesde) {
      cleanedFiltros.fechaDesde = `${filtros.fechaDesde}T00:00:00`;
    }
    if (filtros.fechaHasta) {
      cleanedFiltros.fechaHasta = `${filtros.fechaHasta}T23:59:59`;
    }

    setFiltroAplicado(cleanedFiltros);
    setVehiculoFiltroAplicado(filtros.vehiculo.toLowerCase());
  };

  const limpiarFiltros = () => {
    setFiltros(INITIAL_FILTERS);
    setFiltroAplicado({ idCliente });
    setVehiculoFiltroAplicado("");
  };

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

  let reservasFiltradas = data?.reservas || [];

  if (vehiculoFiltroAplicado) {
    reservasFiltradas = reservasFiltradas.filter((r) => {
      const vehiculoStr = `${r.vehiculo.marca} ${r.vehiculo.modelo}`.toLowerCase();
      return vehiculoStr.includes(vehiculoFiltroAplicado);
    });
  }

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
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehiculo" className="block text-sm font-medium text-gray-700">
            Vehículo (Marca o Modelo)
          </label>
          <input
            id="vehiculo"
            type="text"
            name="vehiculo"
            value={filtros.vehiculo}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700">
            Tipo de Vehículo
          </label>
          <select
            id="tipoVehiculo"
            name="tipoVehiculo"
            value={filtros.tipoVehiculo}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">Todos</option>
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="PICKUP">Pickup</option>
            <option value="COUPE">Coupe</option>
            <option value="HATCHBACK">Hatchback</option>
          </select>
        </div>

        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={filtros.estado}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="">Todos</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700">
              Fecha Desde
            </label>
            <input
              id="fechaDesde"
              type="date"
              name="fechaDesde"
              value={filtros.fechaDesde}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700">
              Fecha Hasta
            </label>
            <input
              id="fechaHasta"
              type="date"
              name="fechaHasta"
              value={filtros.fechaHasta}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
          <button
            onClick={limpiarFiltros}
            className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Limpiar
          </button>
          <button
            onClick={aplicarFiltros}
            className="bg-[#1F2937] text-white font-bold px-4 py-2 rounded shadow hover:bg-[#2d3f56] transition flex items-center gap-2"
          >
            <FaSearch /> Buscar
          </button>
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
                  Precio Diario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe Total
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
                    No se encontraron reservas con los filtros seleccionados.
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