import api from '../../../config/api';

const vehicleService = {
  // Listar todos los vehículos
  getAll: async () => {
    const response = await api.get('/vehiculos');
    return response.data;
  },

  // Listar solo activos
  getActive: async () => {
    const response = await api.get('/vehiculos/activos');
    return response.data;
  },

  // Buscar por ID
  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data;
  },

  // Buscar por patente
  getByPatente: async (patente) => {
    const response = await api.get(`/vehiculos/patente/${patente}`);
    return response.data;
  },

  // Crear vehículo
  create: async (data) => {
    const response = await api.post('/vehiculos', data);
    return response.data;
  },

  // Actualizar vehículo
  update: async (id, data) => {
    const response = await api.put(`/vehiculos/${id}`, data);
    return response.data;
  },

  // Dar de baja (borrado lógico)
  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data; // Devuelve 204 No Content en el backend
  },
};

export default vehicleService;
