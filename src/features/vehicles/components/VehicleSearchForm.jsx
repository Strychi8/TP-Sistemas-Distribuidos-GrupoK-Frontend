import { FaCalendarAlt, FaSearch, FaFilter } from "react-icons/fa";

const VehicleSearchForm = ({
  inicio,
  setInicio,
  fin,
  setFin,
  showFilters,
  setShowFilters,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="inline mr-1" /> Fecha y Hora de Inicio *
          </label>
          <input
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="inline mr-1" /> Fecha y Hora de Fin *
          </label>
          <input
            type="datetime-local"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            required
            min={inicio}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium text-sm"
        >
          <FaFilter />{" "}
          {showFilters
            ? "Ocultar filtros avanzados"
            : "Mostrar filtros avanzados (Marca, Modelo, Tipo, Precio)"}
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition duration-200 flex items-center gap-2"
        >
          <FaSearch /> Buscar Disponibilidad
        </button>
      </div>
    </form>
  );
};

export default VehicleSearchForm;