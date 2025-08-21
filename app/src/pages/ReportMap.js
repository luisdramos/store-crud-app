import React, {useEffect, useState} from "react";
import MapView from "../components/MapView";
import { puntosVentaService } from "../services/puntosVentaService";

const ReportMap = () => {
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);

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