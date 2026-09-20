import api from "../../../config/api";

const reservationService = {
  // Alta de Reserva
  create: async (data) => {
    const response = await api.post("/reservas", data);
    return response.data;
  },

  // Consultar Reserva por ID
  getById: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  // Cancelar Reserva (Baja lógica)
  cancel: async (id) => {
    const response = await api.put(`/reservas/${id}/cancelar`);
    return response.data;
  },
};

export default reservationService;