import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/client/react';
import {
  GET_VEHICULOS,
  GET_VEHICULOS_DISPONIBLES,
} from "../services/vehicleGraphQL";
import { FaCar } from "react-icons/fa";
import { toast } from "react-toastify";

// Importación de los nuevos subcomponentes
import VehicleSearchForm from "../components/VehicleSearchForm";
import VehicleFilters from "../components/VehicleFilters";
import VehicleCard from "../components/VehicleCard";
import reservationService from "../../reservations/services/reservationService";


// 2. Función auxiliar para formatear la fecha al estándar local de los inputs
const obtenerFechaFormateada = (diasDeDiferencia = 0) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasDeDiferencia);
  // Sumamos 1 hora a la hora actual para garantizar que la fecha de inicio siempre sea considerada 'futura' (por la validación de @Future del backend)
  fecha.setHours(fecha.getHours() + 1, 0, 0, 0); 
  
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${anio}-${mes}-${dia}T${horas}:${minutos}`;
};

const VehicleCatalogPage = () => {
  const navigate = useNavigate();
  
  // 3. Inicializamos las fechas por defecto (Hoy e Inicio y Mañana Fin)
  const [inicio, setInicio] = useState(obtenerFechaFormateada(0));
  const [fin, setFin] = useState(obtenerFechaFormateada(365)); 
  const [showFilters, setShowFilters] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  
  const [filters, setFilters] = useState({
    tipoVehiculo: '',
    marca: '',
    modelo: '',
    precioMin: '',
    precioMax: ''
  });

  // Carga inicial automática de todos los vehiculos
  const { loading: loadingAll, data: dataAll } = useQuery(GET_VEHICULOS);

  // Consulta perezosa para cuando apliquen los filtros por fechas o avanzados
  const [getVehiculosDisponibles, { loading: loadingFiltered, data: dataFiltered }] = useLazyQuery(GET_VEHICULOS_DISPONIBLES);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inicio || !fin) {
      toast.warning('Las fechas y horas de inicio y fin son obligatorias para buscar disponibilidad.');
      return;
    }

    if (new Date(inicio) >= new Date(fin)) {
      toast.error("La fecha y hora de fin debe ser posterior a la fecha de inicio.",);
      return;
    }

    const filtroInput = {};
    if (filters.tipoVehiculo) filtroInput.tipoVehiculo = filters.tipoVehiculo;
    if (filters.marca) filtroInput.marca = filters.marca;
    if (filters.modelo) filtroInput.modelo = filters.modelo;
    if (filters.precioMin) filtroInput.precioMin = parseFloat(filters.precioMin);
    if (filters.precioMax) filtroInput.precioMax = parseFloat(filters.precioMax);

    // Se cambia al modo filtrado
    setIsFiltered(true);
    const fechaInicioFormateada = `${inicio}:00`;
    const fechaFinFormateada = `${fin}:00`;
    getVehiculosDisponibles({
      variables: {
        inicio: fechaInicioFormateada,
        fin: fechaFinFormateada,
        filtro: Object.keys(filtroInput).length > 0 ? filtroInput : null,
      },
    });
  };

  const handleClearFilters = () => {
    setInicio(obtenerFechaFormateada(0));
    setFin(obtenerFechaFormateada(365));
    setFilters({
      tipoVehiculo: "",
      marca: "",
      modelo: "",
      precioMin: "",
      precioMax: "",
    });
    // Se vuelve a leer del query general inicial
    setIsFiltered(false);
    setShowFilters(false);
    toast.info("Se restableció el catálogo completo.");
  }

  const handleReservar = async (vehiculo) => {
    const idClienteStr = window.prompt("Simulación de sesión: Ingrese su ID de Cliente para confirmar la reserva:");
    if (!idClienteStr) {
      toast.info("Reserva cancelada (No se ingresó ID de Cliente).");
      return;
    }
    
    const idCliente = parseInt(idClienteStr, 10);
    
    if (isNaN(idCliente)) {
      toast.error("El ID de Cliente debe ser un número.");
      return;
    }

    try {
      await reservationService.create({
        idCliente: idCliente,
        idVehiculo: vehiculo.idVehiculo,
        fechaInicio: `${inicio}:00`,
        fechaFin: `${fin}:00`
      });
      toast.success(`Vehículo ${vehiculo.marca} ${vehiculo.modelo} reservado con éxito.`);
      navigate('/mis-reservas');
    } catch (error) {
      toast.error("Error al generar la reserva: " + (error.response?.data?.message || error.message));
    }
  };

  // Se seleccionan según el estado de isFiltered
  const vehiculos = isFiltered
    ? dataFiltered?.vehiculosDisponibles || []
    : dataAll?.vehiculos || [];
  const loading = loadingAll || loadingFiltered;

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
          onClear={handleClearFilters}
          isFiltered={isFiltered}
        />
        {showFilters && (
          <VehicleFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(vehiculos.length === 0) ? (
            <div className="col-span-full bg-white p-8 rounded-lg shadow text-center text-gray-500">
              No hay vehículos disponibles para el rango de fechas seleccionado.
            </div>
          ) : (
            vehiculos.map((v) => (
              <VehicleCard 
                key={v.idVehiculo} 
                vehiculo={v} 
                onReservar={handleReservar} 
                showReserveButton={isFiltered}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleCatalogPage;