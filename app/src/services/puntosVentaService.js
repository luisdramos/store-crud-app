import api from "./api";

export const puntosVentaService = {
  getAll: async () => {
    const response = await api.get('/PuntosVenta');
    return response.data;
  },

   create: async (puntoVentaData) => {
    const response = await api.post('/PuntosVenta', puntoVentaData);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/PuntosVenta/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/PuntosVenta/${id}`);
    return response.data;
  },

  update: async (id, puntoVentaData) => {
    const response = await api.put(`/PuntosVenta/${id}`, puntoVentaData);
    return response.data;
  },

  getVentasByPunto: async (puntoVentaId) => {
    const response = await api.get(`/Ventas/PuntoVenta/${puntoVentaId}`);
    return response.data;
  }
};