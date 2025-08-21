import { puntosVentaMuestra } from "../components/test/datosMuestra";

export const puntosVentaServiceMock = {
  // Simular obtención de todos los puntos
  getAll: async () => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return puntosVentaMuestra;
  },

  // Simular obtención por ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return puntosVentaMuestra.find(punto => punto.id === id);
  },

  // Simular filtrado por zona
  getByZona: async (zona) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return puntosVentaMuestra.filter(punto => punto.zona === zona);
  },

  // Simular creación de nuevo punto
  create: async (nuevoPunto) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const nuevoId = Math.max(...puntosVentaMuestra.map(p => p.id)) + 1;
    const puntoCreado = { ...nuevoPunto, id: nuevoId };
    puntosVentaMuestra.push(puntoCreado);
    return puntoCreado;
  }
};