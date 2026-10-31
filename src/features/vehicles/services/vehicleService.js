import api from '../../../config/api';

const mapVehiculo = (v) => {
  if (!v) return v;
  return {
    ...v,
    inhabilitado: Boolean(v.inhabilitado),
  };
};

const vehicleService = {
  // Listar todos los vehículos (mapea inhabilitado para Hito 3)
  getAll: async () => {
    const response = await api.get('/vehiculos');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapVehiculo);
  },

  // Listar solo activos
  getActive: async () => {
    const response = await api.get('/vehiculos/activos');
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapVehiculo);
  },

  // Buscar por ID
  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return mapVehiculo(response.data);
  },

  // Buscar por patente
  getByPatente: async (patente) => {
    const response = await api.get(`/vehiculos/patente/${patente}`);
    return mapVehiculo(response.data);
  },

  // Crear vehículo
  create: async (data) => {
    const response = await api.post('/vehiculos', data);
    return mapVehiculo(response.data);
  },

  // Actualizar vehículo
  update: async (id, data) => {
    const response = await api.put(`/vehiculos/${id}`, data);
    return mapVehiculo(response.data);
  },

  // Dar de baja (borrado lógico)
  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data; // Devuelve 204 No Content en el backend
  },
};

export default vehicleService;
