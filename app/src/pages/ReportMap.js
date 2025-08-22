import React, {useEffect, useMemo, useState} from "react";
import MapView from "../components/MapView";
import FloatingMenu from "../components/FloatingMenu";
import { puntosVentaService } from "../services/puntosVentaService";
import Modal, { FIELD_TYPES } from "../components/Modal";

const ReportMap = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(null);  
  
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
    const fetchPuntos = async () => {
      try {
        const data = await puntosVentaService.getAll();
        setPuntos(data);
        } catch (error) {
        console.error('Error fetching puntos:', error);
        } finally {
        setLoading(false);
        }
    };
    fetchPuntos();
  }, []);

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <div className="report-map-container">    
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

      <MapView
        center={[19.64585088577751, -99.1967378959387]} // Cuautitlan Izcalli 
        zoom={14}
        puntos={puntos}
        scrollWheelZoom={true}
        />
    </div>
  );

}

export default ReportMap;