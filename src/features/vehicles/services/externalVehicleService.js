// Servicio para la gestión de vehículos de propietarios externos (Hito 3)
// Actualmente opera en MODO SIMULADO con persistencia en localStorage para permitir
// el desarrollo del frontend sin necesidad de levantar Gateway, Kafka ni microservicios.

const STORAGE_KEY = 'rentar_mock_external_vehicles';

const SEED_VEHICLES = [
  {
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
    fechaRegistro: '2026-10-18T10:30:00.000Z',
    motivoRechazo: null,
  },
  {
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
    fechaRegistro: '2026-10-15T14:20:00.000Z',
    motivoRechazo: null,
  },
  {
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
    fechaRegistro: '2026-10-12T09:15:00.000Z',
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
  // Cuando el Backend esté listo: return (await api.get('/vehiculos/externos/mis-vehiculos')).data;
  getAllByCliente: async (clienteId = 1) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const vehicles = getStoredVehicles();
    return vehicles.filter((v) => v.clienteId === clienteId);
  },

  // Obtiene un vehículo externo por ID
  // Cuando el Backend esté listo: return (await api.get(`/vehiculos/externos/${id}`)).data;
  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const vehicles = getStoredVehicles();
    const found = vehicles.find((v) => v.id === Number(id));
    if (!found) throw new Error('Vehículo no encontrado');
    return found;
  },

  // Registra un nuevo vehículo de propietario externo (inicia en PENDIENTE)
  // Cuando el Backend esté listo: return (await api.post('/vehiculos/externos', payload)).data;
  create: async (vehicleData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const vehicles = getStoredVehicles();

    // Verificamos si la patente ya existe en la lista simulada
    const patenteNormalizada = vehicleData.patente.trim().toUpperCase();
    const existe = vehicles.some(
      (v) => v.patente.toUpperCase() === patenteNormalizada
    );
    if (existe) {
      const error = new Error('Ya existe una solicitud registrada para esta patente');
      error.response = { data: { message: error.message } };
      throw error;
    }

    const newVehicle = {
      id: Date.now(),
      clienteId: vehicleData.clienteId || 1,
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
      fechaRegistro: new Date().toISOString(),
      motivoRechazo: null,
    };

    vehicles.unshift(newVehicle);
    saveStoredVehicles(vehicles);
    return newVehicle;
  },

  // Función utilitaria para probar la llegada de eventos Kafka desde el frontend
  simulateKafkaResolution: async (id, { validacionPatente, validacionTitularidad }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const vehicles = getStoredVehicles();
    const index = vehicles.findIndex((v) => v.id === Number(id));
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
