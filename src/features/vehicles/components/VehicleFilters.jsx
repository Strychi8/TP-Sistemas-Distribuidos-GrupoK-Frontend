const VehicleFilters = ({ filters, setFilters }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Tipo de Vehículo
        </label>
        <select
          value={filters.tipoVehiculo}
          onChange={(e) => handleChange("tipoVehiculo", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
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
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Marca
        </label>
        <input
          type="text"
          placeholder="Ej. Toyota, Ford"
          value={filters.marca}
          onChange={(e) => handleChange("marca", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Modelo
        </label>
        <input
          type="text"
          placeholder="Ej. Corolla, Ranger"
          value={filters.modelo}
          onChange={(e) => handleChange("modelo", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Precio Mín.
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.precioMin}
            onChange={(e) => handleChange("precioMin", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Precio Máx.
          </label>
          <input
            type="number"
            placeholder="100000"
            value={filters.precioMax}
            onChange={(e) => handleChange("precioMax", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;