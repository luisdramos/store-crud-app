import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import { puntosVentaServiceMock } from "../services/puntosVentaService.mock";
import { puntosVentaMuestra } from "./test/datosMuestra";
import "../styles/Map.css";


const MapaPrueba = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);

  useEffect(() => {
    const cargarPuntos = async () => {
      try {
        const datos = await puntosVentaServiceMock.getAll();
        setPuntos(datos);
      } catch (error) {
        console.error('Error cargando puntos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPuntos();
  }, []);

  const handleMarkerClick = (punto) => {
    setPuntoSeleccionado(punto);
    console.log('Punto seleccionado:', punto);
  };

  const filtrarPorZona = async (zona) => {
    setLoading(true);
    try {
      const datosFiltrados = await puntosVentaServiceMock.getByZona(zona);
      setPuntos(datosFiltrados);
    } catch (error) {
      console.error('Error filtrando:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando puntos de venta...</p>
      </div>
    );
  }

  return (
    <div className="mapa-prueba-container">
      <div className="controles">
        <h2>Mapa de Puntos de Venta (Datos de Prueba)</h2>
        
        <div className="filtros">
          <button onClick={() => filtrarPorZona('Zona Norte')}>Zona Norte</button>
          <button onClick={() => filtrarPorZona('Zona Sur')}>Zona Sur</button>
          <button onClick={() => filtrarPorZona('Zona Centro')}>Zona Centro</button>
          <button onClick={() => filtrarPorZona('Zona Oeste')}>Zona Oeste</button>
          <button onClick={() => setPuntos(puntosVentaMuestra)}>Todos</button>
        </div>

        <div className="estadisticas">
          <p><strong>Total puntos:</strong> {puntos.length}</p>
          <p><strong>Ventas totales:</strong> ${puntos.reduce((sum, p) => sum + (p.venta || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mapa-container">
        <MapView
          puntos={puntos}
          onMarkerClick={handleMarkerClick}
          scrollWheelZoom={true}
          style={{ height: '600px' }}
          className="mapa-principal"
        />
      </div>

      {puntoSeleccionado && (
        <div className="detalle-punto">
          <h3>Punto Seleccionado</h3>
          <p><strong>ID:</strong> {puntoSeleccionado.id}</p>
          <p><strong>Descripción:</strong> {puntoSeleccionado.descripcion}</p>
          <p><strong>Zona:</strong> {puntoSeleccionado.zona}</p>
          <p><strong>Ventas:</strong> ${puntoSeleccionado.venta?.toLocaleString()}</p>
          <p><strong>Dirección:</strong> {puntoSeleccionado.direccion}</p>
          <p><strong>Teléfono:</strong> {puntoSeleccionado.telefono}</p>
        </div>
      )}
    </div>
  );
};

export default MapaPrueba;