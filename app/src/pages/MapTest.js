import React, { useEffect, useState, useMemo } from "react";
import MapView from "../components/MapView";
import FloatingMenu from "../components/FloatingMenu";
import { puntosVentaServiceMock } from "../services/puntosVentaService.mock";
import { puntosVentaMuestra } from "../services/test/datosMuestra";

import FloatingPieChart from "../components/FloatingPieChart";
import { useMiniVentasData } from "../components/hooks/useMiniVentasData";
import { puntosVentaService } from "../services/puntosVentaService";

import Modal, { FIELD_TYPES } from "../components/Modal";


const MapaPrueba = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);
  const ventasData = useMiniVentasData(puntos);

   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const puntoVentaFields =  useMemo (() => [
        {
          name: "descripcion",
          label: "Descripción",
          type: "text",
          required: true,
          placeholder: "Descripción del punto de venta"
        },  
        {
          name: "zona",
          label: "Zona",
          type: FIELD_TYPES.SELECT,
          required: true,
          options: [
            { value: "norte", label: "Norte" },
            { value: "sur", label: "Sur" },
            { value: "este", label: "Este" },
            { value: "oeste", label: "Oeste" },
            { value: "centro", label: "Centro" }
          ]
        }  ,
        {
          name: "latitud",
          label: "Latitud",
          type: "number",
          required: true,
          placeholder: "Latitud (ej. 19.4326)"
        },
        {
          name: "longitud",
          label: "Longitud",
          type: "number",
          required: true,
          placeholder: "Longitud (ej. -99.1332)"
        }
      ], []);
      const puntoVentaDeleteFields = useMemo(() => [
        {
          name: "descripcion",
          label: "Descripción",
          type: FIELD_TYPES.SELECT,
          required: true,
          options: puntos.map(punto => ({
            value: punto.id,
            label: punto.descripcion
          }))
        }],[puntos]);
      const puntoVentaUpdateFields = useMemo(() => [
        {
          name: "descripcion",
          label: "Descripción",
          type: FIELD_TYPES.SELECT,
          required: true,
          options: puntos.map(punto => ({
            value: punto.id,
            label: punto.descripcion
          }))
        },
        {
          name: "zona",
          label: "Zona",
          type: FIELD_TYPES.SELECT,
          required: true,
          options: [
            { value: "norte", label: "Norte" },
            { value: "sur", label: "Sur" },
            { value: "este", label: "Este" },
            { value: "oeste", label: "Oeste" },
            { value: "centro", label: "Centro" }
          ]
        },
        {
          name: "latitud",
          label: "Latitud", 
          type: "number",
          required: true,
          placeholder: "Latitud (ej. 19.4326)"
        },
        {
          name: "longitud",
          label: "Longitud",
          type: "number",
          required: true,
          placeholder: "Longitud (ej. -99.1332)"
        }
      ], [puntos]);

      const handleAddPoint = () => setIsAddModalOpen(true);
  const handleDeletePoint = () => setIsDeleteModalOpen(true);
  const handleEditPoint = () => setIsEditModalOpen(true);

  const handleSubmit = (formData) => {
      console.log('Datos del formulario:', formData);
      try {
        if (isAddModalOpen) {
          puntosVentaService.create(formData)
            .then(() => {
              setPuntos([...puntos, formData]);
              setIsAddModalOpen(false);
            });
        }
        if (isDeleteModalOpen) {
          puntosVentaService.delete(formData.descripcion) 
            .then(() => {
              setPuntos(puntos.filter(punto => punto.id !== formData.descripcion));
              setIsDeleteModalOpen(false);
            });
            window.location.reload();
        }
        if (isEditModalOpen) {  
          puntosVentaService.update(formData.descripcion, formData)
            .then(() => {
              setPuntos(puntos.map(punto => 
                punto.id === formData.descripcion ? {...punto, ...formData} : punto
              ));
              setIsEditModalOpen(false);
            });
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Error al procesar la solicitud. Inténtalo de nuevo.');
      }    
    };

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

        <FloatingPieChart data={ventasData} className="floating-pie-chart"/>

        <div className="estadisticas">
          <p><strong>Total puntos:</strong> {puntos.length}</p>
          <p><strong>Ventas totales:</strong> ${puntos.reduce((sum, p) => sum + (p.venta || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      <FloatingMenu
        onAddPoint={handleAddPoint}
        onDeletePoint={handleDeletePoint}
        onEditPoint={handleEditPoint}
      />  

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}        
        title="Agregar Nuevo Punto de Venta"
        fields={puntoVentaFields}
        initialData={{}}
        submitText="Agregar"
        cancelText="Cancelar"
        size="medium"
        
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleSubmit}
        title="Eliminar Punto de Venta"
        fields={puntoVentaDeleteFields}
        initialData={{}}
        submitText="Eliminar"
        cancelText="Cancelar"
        size="medium"
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        title="Editar Punto de Venta"
        fields={puntoVentaUpdateFields}
        initialData={{}}
        submitText="Actualizar"
        cancelText="Cancelar"
        size="medium"
      />

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