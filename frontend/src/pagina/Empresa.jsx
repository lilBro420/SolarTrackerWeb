import React from 'react';
import '../styles/solarPanel.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function Empresa() {
  return (
    <div className="empresa-container">
      <h2>Nosotros</h2>
      <p>
        Somos una empresa dedicada al desarrollo de soluciones energéticas sostenibles.
        Nuestro proyecto <strong>Solar Tracker</strong> utiliza sensores para analizar la trayectoria del sol y optimizar la eficiencia en paneles solares.
      </p>

      <h2>Ubicación</h2>
      <div className="map-wrapper">
        <MapContainer center={[32.4372185, -114.7174613]} zoom={13} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <Marker position={[32.4372185, -114.7174613]}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="Solar Tracker Icon"
              className="marker-icon"
              style={{ width: '30px', height: '30px' }}
              draggable={false}
              icon={L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
              })}
            />
            <Popup>
              Sede Solar Tracker<br />San Luis Río Colorado, Sonora
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default Empresa;
