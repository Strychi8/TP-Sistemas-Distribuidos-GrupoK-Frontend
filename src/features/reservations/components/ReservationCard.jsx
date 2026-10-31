import dayjs from "dayjs";

const ReservationCard = ({ reserva, onCancel, showClient = false }) => {
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

  const getMantenimientoBadge = () => {
    const res = (reserva.resultadoMantenimiento || "").toUpperCase();
    if (res === "REALIZADO") {
      return (
        <span
          title="Mantenimiento preventivo completado"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Realizado
        </span>
      );
    }
    if (res === "NO_REALIZADO") {
      return (
        <span
          title="Mantenimiento preventivo no realizado"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-300 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          No Realizado
        </span>
      );
    }
    return (
      <span
        title="Procesando mantenimiento preventivo de forma asíncrona"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-300 shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
        En Revisión
      </span>
    );
  };

  return (
    <tr>
      {showClient && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {reserva.cliente?.nombre} {reserva.cliente?.apellido}
          </div>
          <div className="text-sm text-gray-500">{reserva.cliente?.dni}</div>
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {reserva.vehiculo?.marca} {reserva.vehiculo?.modelo}
        </div>
        <div className="text-sm text-gray-500">
          {reserva.vehiculo?.patente} - {reserva.vehiculo?.tipoVehiculo}
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
          className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClasses()}`}
        >
          {reserva.estado}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-center">
        {getMantenimientoBadge()}
      </td>

      {onCancel && (
        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          {reserva.estado === "CONFIRMADA" && (
            <button
              onClick={() => onCancel(reserva)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded transition-colors"
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