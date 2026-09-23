import dayjs from "dayjs";

const ReservationCard = ({ reserva, onCancel, showClient = false, showDays = true }) => {
  const getEstadoClasses = () => {
    switch (reserva.estado) {
      case "CONFIRMADA":
        return "bg-green-100 text-green-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      case "FINALIZADA":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr>
      {showClient && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {reserva.cliente.nombre} {reserva.cliente.apellido}
          </div>
          <div className="text-sm text-gray-500">{reserva.cliente.dni}</div>
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {reserva.vehiculo.marca} {reserva.vehiculo.modelo}
        </div>
        <div className="text-sm text-gray-500">
          {reserva.vehiculo.patente} - {reserva.vehiculo.tipoVehiculo}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          Desde: {dayjs(reserva.fechaInicio).format("DD/MM/YYYY")}
        </div>
        <div className="text-sm text-gray-500">
          Hasta: {dayjs(reserva.fechaFin).format("DD/MM/YYYY")}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${reserva.precioDiario}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        ${reserva.importeTotal}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses()}`}
        >
          {reserva.estado}
        </span>
      </td>

      {onCancel && (
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          {reserva.estado === "CONFIRMADA" && (
            <button
              onClick={() => onCancel(reserva)}
              className="bg-[#1F2937] hover:bg-gray-700 text-white font-bold py-1.5 px-3 rounded transition-colors"
            >
              Cancelar
            </button>
          )}
        </td>
      )}
    </tr>
  );
};

export default ReservationCard;