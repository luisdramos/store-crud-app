import React from "react";
import 'leaflet/dist/leaflet.css';

import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { useMap } from 'react-leaflet/hooks';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import "../styles/Map.css";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


const position = [51.505, -0.09]
const MapView = ({
  center = [19.4326, -99.1332], // Ciudad de México por defecto
  zoom = 13,
  puntos = [],
  onMarkerClick,
  scrollWheelZoom = false,
  className = '',
  style = { height: '400px', width: '100%' }
}) => {
  // Si no se pasan puntos, no renderizar markers
  if (puntos.length === 0) {
    return (
      <div className={`map-view ${className}`} style={style}>
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />  
          <Marker position={position}>
            <Popup>
              No hay puntos disponibles.
            </Popup>  
          </Marker>
        </MapContainer>
      </div>
    );
  }
  // Renderizar los markers
  const handleMarkerClick = (punto) => {
    if (onMarkerClick) {
      onMarkerClick(punto);
    }
  };

  const mapCenter = puntos.length > 0 ? [puntos[0].latitud, puntos[0].longitud] : center;

  return (
    <div className={`map-view ${className}`} style={style}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          puntos.map((punto) => (
            <Marker
              key={punto.id}
              position={[punto.latitud, punto.longitud]}
              eventHandlers={{
                click: () => handleMarkerClick(punto)
              }}
            >
              <Popup> 
                <div>
                  <strong>Descripción:</strong> {punto.descripcion || 'N/A'}<br />
                  <strong>Zona:</strong> {punto.zona || 'N/A'}<br />                  
                  {/* Renderizar otras propiedades dinámicamente */}
                  {Object.keys(punto).map((key) => {
                    if (!['id', 'latitud', 'longitud', 'descripcion', 'zona', 'venta'].includes(key)) {
                      return (
                        <div key={key}>
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {punto[key] || 'N/A'}<br />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </Popup>
            </Marker>
          ))
        }
      </MapContainer>
    </div>
    );  
  }

export default  MapView