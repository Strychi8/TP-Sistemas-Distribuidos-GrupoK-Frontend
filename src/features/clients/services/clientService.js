import api from "../../../config/api";

const clientService = {
  // Obtener todos los clientes (activos e inactivos)
  getAll: async () => {
    const response = await api.get("/clientes");
    return response.data;
  },

  // Obtener únicamente clientes activos
  getActive: async () => {
    const response = await api.get("/clientes/activos");
    return response.data;
  },

  // Obtener un cliente por su ID
  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  // Obtener el perfil del cliente logueado
  getMyProfile: async () => {
    const response = await api.get("/clientes/perfil");
    return response.data;
  },

  // Crear un nuevo cliente
  create: async (data) => {
    const response = await api.post("/clientes", data);
    return response.data;
  },

  // Actualizar un cliente existente
  update: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  // Baja lógica de un cliente (pasa a inactivo)
  delete: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },
};

export default clientService;
