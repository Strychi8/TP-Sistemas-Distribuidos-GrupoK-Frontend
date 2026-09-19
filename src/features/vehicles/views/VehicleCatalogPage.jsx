import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_VEHICULOS_DISPONIBLES } from "../services/vehicleGraphQL";
import { FaCar } from "react-icons/fa";
import { toast } from "react-toastify";

// Importación de los nuevos subcomponentes
import VehicleSearchForm from "./VehicleSearchForm";
import VehicleFilters from "./VehicleFilters";
import VehicleCard from "./VehicleCard";

const VehicleCatalogPage = () => {
  const navigate = useNavigate();
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Agrupación de filtros en un único estado para limpiar el código
  const [filters, setFilters] = useState({
    tipoVehiculo: "",
    marca: "",
    modelo: "",
    precioMin: "",
    precioMax: "",
  });

  const [getVehiculosDisponibles, { loading, data }] = useLazyQuery(
    GET_VEHICULOS_DISPONIBLES,
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inicio || !fin) {
      toast.warning(
        "Las fechas y horas de inicio y fin son obligatorias para buscar disponibilidad.",
      );
      return;
    }

    // Construcción del objeto de filtro GraphQL dinámicamente
    const filtroInput = {};
    if (filters.tipoVehiculo) filtroInput.tipoVehiculo = filters.tipoVehiculo;
    if (filters.marca) filtroInput.marca = filters.marca;
    if (filters.modelo) filtroInput.modelo = filters.modelo;
    if (filters.precioMin)
      filtroInput.precioMin = parseFloat(filters.precioMin);
    if (filters.precioMax)
      filtroInput.precioMax = parseFloat(filters.precioMax);

    getVehiculosDisponibles({
      variables: {
        inicio: new Date(inicio).toISOString(),
        fin: new Date(fin).toISOString(),
        filtro: Object.keys(filtroInput).length > 0 ? filtroInput : null,
      },
    });
  };

  const handleReservar = (vehiculo) => {
    sessionStorage.setItem(
      "reserva_temp",
      JSON.stringify({ vehiculo, inicio, fin }),
    );
    toast.success(
      `Vehículo ${vehiculo.marca} ${vehiculo.modelo} seleccionado.`,
    );
    navigate("/reservas");
  };

  const vehiculos = data?.vehiculosDisponibles || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaCar className="text-blue-600" /> Catálogo y Disponibilidad
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6 p-6">
        <VehicleSearchForm
          inicio={inicio}
          setInicio={setInicio}
          fin={fin}
          setFin={setFin}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onSubmit={handleSearch}
        />
        {showFilters && (
          <VehicleFilters filters={filters} setFilters={setFilters} />
        )}
      </div>

      {/* Control de estados de la UI (Carga, Vacío o Resultados) */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehiculos.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-lg shadow text-center text-gray-500">
              Seleccione fechas de inicio y fin y presione buscar para ver
              vehículos disponibles.
            </div>
          ) : (
            vehiculos.map((v) => (
              <VehicleCard
                key={v.idVehiculo}
                vehiculo={v}
                onReservar={handleReservar}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCatalogPage;