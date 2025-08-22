import { useMemo } from "react";

export const useMiniVentasData = (puntos) => {
  return useMemo(() => {
    if (!puntos || puntos.length === 0) return [];

    // Agrupar ventas por zona
    const ventasPorZona = puntos.reduce((acc, punto) => {
      if (!punto.zona || !punto.venta) return acc;
      
      const zona = punto.zona;
      const venta = parseFloat(punto.venta) || 0;
      
      if (!acc[zona]) {
        acc[zona] = 0;
      }
      
      acc[zona] += venta;
      return acc;
    }, {});

    // Convertir a array y ordenar
    return Object.entries(ventasPorZona)
      .map(([name, value]) => ({
        name: name.length > 10 ? name.substring(0, 10) + '...' : name,
        value: Math.round(value * 100) / 100
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Solo las 6 zonas principales

  }, [puntos]);
};