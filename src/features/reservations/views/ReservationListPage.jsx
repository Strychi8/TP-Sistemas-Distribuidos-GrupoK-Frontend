import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import { GET_RESERVAS } from "../services/reservationGraphQL";
import ReservationCard from "../components/ReservationCard";

const INITIAL_FILTERS = {
  idCliente: "",
  idVehiculo: "",
  tipoVehiculo: "",
  estado: "",
  fechaDesde: "",
  fechaHasta: "",
};

const ReservationListPage = () => {
  const [filtros, setFiltros] = useState(INITIAL_FILTERS);
  const [filtroAplicado, setFiltroAplicado] = useState(null);

  const { loading, error, data } = useQuery(GET_RESERVAS, {
    variables: {
      filtro: filtroAplicado,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aplicarFiltros = () => {
    const cleanedFiltros = {};

    if (filtros.idCliente) {
      cleanedFiltros.idCliente = filtros.idCliente;
    }

    if (filtros.idVehiculo) {
      cleanedFiltros.idVehiculo = filtros.idVehiculo;
    }

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

    setFiltroAplicado(
      Object.keys(cleanedFiltros).length > 0 ? cleanedFiltros : null,
    );
  };

  const limpiarFiltros = () => {
    setFiltros(INITIAL_FILTERS);
    setFiltroAplicado(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="idCliente" className="block text-sm font-medium text-gray-700">
            ID Cliente
          </label>

          <input
            id="idCliente"
            type="text"
            name="idCliente"
            value={filtros.idCliente}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label htmlFor="idVehiculo" className="block text-sm font-medium text-gray-700">
            ID Vehículo
          </label>

          <input
            id="idVehiculo"
            type="text"
            name="idVehiculo"
            value={filtros.idVehiculo}
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

        <div className="md:col-span-3 flex justify-end space-x-2">
          <button
            onClick={limpiarFiltros}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Limpiar
          </button>

          <button
            onClick={aplicarFiltros}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Resultados */}
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

                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.reservas.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No hay reservas para mostrar.
                  </td>
                </tr>
              ) : (
                data.reservas.map((reserva) => (
                  <ReservationCard 
                    key={reserva.idReserva} 
                    reserva={reserva} 
                    showClient={true}
                    showDays={false}
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

export default ReservationListPage;
