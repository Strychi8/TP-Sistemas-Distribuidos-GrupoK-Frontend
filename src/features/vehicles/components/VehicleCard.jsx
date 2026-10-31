const VehicleCard = ({ vehiculo, onReservar, showReserveButton }) => {
  const { tipoVehiculo, precioDiario, marca, modelo, patente, anio } = vehiculo;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 uppercase">
              {tipoVehiculo}
            </span>
            {vehiculo.inhabilitado && (
              <span
                title="Vehículo denunciado como robado (Verificación policial)"
                className="px-2 py-0.5 text-[11px] font-bold rounded bg-red-100 text-red-700 border border-red-300"
              >
                Inhabilitado
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-green-600">
            ${precioDiario} / día
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {marca} {modelo}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Patente: <span className="font-mono font-semibold">{patente}</span> •
          Año: {anio}
        </p>

        
      </div>

      {vehiculo.inhabilitado ? (
        <button
          disabled
          className="mt-4 w-full bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed text-center text-sm"
        >
          No disponible para reserva
        </button>
      ) : (
        showReserveButton && (
          <button
            onClick={() => onReservar(vehiculo)}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200 text-center"
          >
            Reservar
          </button>
        )
      )}
    </div>
  );
};

export default VehicleCard;