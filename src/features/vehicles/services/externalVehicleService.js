import api from '../../../config/api';

// Servicio para la gestión de vehículos de propietarios externos (Hito 3)
// Conecta con el API Gateway (/api/vehiculos/externos) y soporta fallback a demo local.

const STORAGE_KEY = 'rentar_mock_external_vehicles';

const SEED_VEHICLES = [
  {
    idVehiculoExterno: 501,
    id: 501,
    clienteId: 1,
    patente: 'AF452ZZ',
    marca: 'Volkswagen',
    modelo: 'Nivus Highline',
    anio: 2023,
    color: 'Gris Platino',
    tipoVehiculo: 'SUV',
    precioDiario: 52000,
    estado: 'PENDIENTE',
    validacionPatente: 'PENDIENTE',
    validacionTitularidad: 'PENDIENTE',
    fechaCreacion: '2026-10-18T10:30:00.000Z',
    motivoRechazo: null,
  },
  {
    idVehiculoExterno: 502,
    id: 502,
    clienteId: 1,
    patente: 'AD345XY',
    marca: 'Toyota',
    modelo: 'Corolla XEI',
    anio: 2022,
    color: 'Blanco Perlado',
    tipoVehiculo: 'SEDAN',
    precioDiario: 45000,
    estado: 'APROBADO',
    validacionPatente: 'VALIDADO',
    validacionTitularidad: 'VALIDADO',
    fechaCreacion: '2026-10-15T14:20:00.000Z',
    motivoRechazo: null,
  },
  {
    idVehiculoExterno: 503,
    id: 503,
    clienteId: 1,
    patente: 'AC987LK',
    marca: 'Ford',
    modelo: 'Ranger XLT',
    anio: 2021,
    color: 'Negro Ebony',
    tipoVehiculo: 'PICKUP',
    precioDiario: 75000,
    estado: 'RECHAZADO',
    validacionPatente: 'VALIDADO',
    validacionTitularidad: 'RECHAZADO',
    fechaCreacion: '2026-10-12T09:15:00.000Z',
    motivoRechazo:
      'El DNI del solicitante no coincide con el titular registrado en la Dirección Nacional de la Propiedad del Automotor.',
  },
];

const getStoredVehicles = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VEHICLES));
    return SEED_VEHICLES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SEED_VEHICLES;
  }
};

const saveStoredVehicles = (vehicles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
};

export const externalVehicleService = {
  // Obtiene los vehículos externos postulados por el cliente actual
  getAllByCliente: async (clienteId) => {
    try {
      const response = await api.get('/vehiculos/externos');
      if (response && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      }
      return [];
    } catch (apiError) {
      // Si el backend no está disponible por red, fallback a mock local para no interrumpir el flujo visual
      if (apiError.code === 'ERR_NETWORK' || !apiError.response) {
        console.warn('API Gateway no accesible, recurriendo a demo local:', apiError.message);
        const vehicles = getStoredVehicles();
        return clienteId ? vehicles.filter((v) => v.clienteId === clienteId) : vehicles;
      }
      if (apiError.response?.data?.message || apiError.response?.data?.error) {
        throw new Error(apiError.response.data.message || apiError.response.data.error);
      }
      throw apiError;
    }
  },

  // Obtiene un vehículo externo por ID
  getById: async (id) => {
    const vehicles = getStoredVehicles();
    const found = vehicles.find((v) => (v.idVehiculoExterno || v.id) === Number(id));
    if (!found) throw new Error('Vehículo no encontrado');
    return found;
  },

  // Registra un nuevo vehículo de propietario externo (inicia en PENDIENTE)
  create: async (vehicleData) => {
    try {
      const payload = {
        patente: vehicleData.patente.toUpperCase().trim(),
        marca: vehicleData.marca.trim(),
        modelo: vehicleData.modelo.trim(),
        anio: parseInt(vehicleData.anio, 10),
        color: vehicleData.color.trim(),
        tipoVehiculo: vehicleData.tipoVehiculo,
        precioDiario: parseFloat(vehicleData.precioDiario),
      };

      const response = await api.post('/vehiculos/externos', payload);
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          throw new Error(data.message || data.error || 'La patente ya se encuentra registrada en el sistema.');
        }
        if (status === 400) {
          throw new Error(data.message || data.error || 'Datos de vehículo inválidos o cliente inactivo.');
        }
        if (status === 401 || status === 403) {
          throw new Error(data.message || 'No autorizado para realizar esta acción.');
        }
        throw new Error(data.message || data.error || 'Error al registrar vehículo externo.');
      }

      // Si fue error de red/servidor apagado, guardar en localStorage para demo
      if (error.code === 'ERR_NETWORK' || !error.response) {
        console.warn('Servidor inaccesible. Guardando en modo demo local.');
        const vehicles = getStoredVehicles();
        const patenteNormalizada = vehicleData.patente.trim().toUpperCase();
        const existe = vehicles.some(
          (v) => v.patente.toUpperCase() === patenteNormalizada
        );
        if (existe) {
          const dupErr = new Error('Ya existe una solicitud registrada para esta patente');
          dupErr.response = { data: { message: dupErr.message } };
          throw dupErr;
        }

        const newVehicle = {
          idVehiculoExterno: Date.now(),
          id: Date.now(),
          clienteId: 1,
          patente: patenteNormalizada,
          marca: vehicleData.marca.trim(),
          modelo: vehicleData.modelo.trim(),
          anio: parseInt(vehicleData.anio, 10),
          color: vehicleData.color.trim(),
          tipoVehiculo: vehicleData.tipoVehiculo,
          precioDiario: parseFloat(vehicleData.precioDiario),
          estado: 'PENDIENTE',
          validacionPatente: 'PENDIENTE',
          validacionTitularidad: 'PENDIENTE',
          fechaCreacion: new Date().toISOString(),
          motivoRechazo: null,
        };

        vehicles.unshift(newVehicle);
        saveStoredVehicles(vehicles);
        return newVehicle;
      }

      throw error;
    }
  },

  // Función utilitaria para probar la llegada de eventos Kafka desde el frontend
  simulateKafkaResolution: async (id, { validacionPatente, validacionTitularidad }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const vehicles = getStoredVehicles();
    const index = vehicles.findIndex((v) => (v.idVehiculoExterno || v.id) === Number(id));
    if (index === -1) throw new Error('Vehículo no encontrado');

    const v = vehicles[index];
    const patVal = validacionPatente || v.validacionPatente;
    const titVal = validacionTitularidad || v.validacionTitularidad;

    let nuevoEstado = 'PENDIENTE';
    let motivo = null;

    if (patVal === 'RECHAZADO' || titVal === 'RECHAZADO') {
      nuevoEstado = 'RECHAZADO';
      if (patVal === 'RECHAZADO' && titVal === 'RECHAZADO') {
        motivo = 'Vehículo con pedido de secuestro/robo y titularidad no coincidente.';
      } else if (patVal === 'RECHAZADO') {
        motivo = 'La patente se encuentra denunciada como robada en el registro policial.';
      } else {
        motivo = 'El solicitante no figura como titular del vehículo en el registro de la propiedad automotor.';
      }
    } else if (patVal === 'VALIDADO' && titVal === 'VALIDADO') {
      nuevoEstado = 'APROBADO';
    }

    const updated = {
      ...v,
      validacionPatente: patVal,
      validacionTitularidad: titVal,
      estado: nuevoEstado,
      motivoRechazo: motivo,
    };

    vehicles[index] = updated;
    saveStoredVehicles(vehicles);
    return updated;
  },

  // Restaura los datos mock originales
  resetMockData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_VEHICLES));
    return SEED_VEHICLES;
  },
};

export default externalVehicleService;
