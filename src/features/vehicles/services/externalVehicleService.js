import api from '../../../config/api';

// Servicio para la gestión de vehículos de propietarios externos (Hito 3).
// Conecta exclusivamente con el API Gateway (/api/vehiculos/externos).
// La identidad del cliente se deriva del token JWT inyectado por el interceptor de Axios.

export const externalVehicleService = {
  // Obtiene las solicitudes de vehículos externos del cliente autenticado
  listarVehiculos: async () => {
    const response = await api.get('/vehiculos/externos');
    return Array.isArray(response.data) ? response.data : [];
  },

  // Registra un nuevo vehículo de propietario externo (inicia en PENDIENTE)
  postularVehiculo: async (vehicleData) => {
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
  },
};

export default externalVehicleService;
