import api from "../../../config/api";

const mapReserva = (r) => {
  if (!r) return r;
  return {
    ...r,
    resultadoMantenimiento: r.resultadoMantenimiento || null,
  };
};

const reservationService = {
  // Alta de Reserva
  create: async (data) => {
    const response = await api.post("/reservas", data);
    return mapReserva(response.data);
  },

  // Consultar Reserva por ID (incluye resultadoMantenimiento de Hito 3)
  getById: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return mapReserva(response.data);
  },

  // Cancelar Reserva (Baja lógica)
  cancel: async (id) => {
    const response = await api.put(`/reservas/${id}/cancelar`);
    return mapReserva(response.data);
  },
};

export default reservationService;