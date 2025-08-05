import '../styles/solarPanel.css';
import React from 'react';

const equipo = [
    {
    nombre: "Miguel Cardenas",
    rol: "Project Manager",
    descripcion: "Líder del proyecto Solar Tracker, coordinando el equipo y asegurando la entrega de soluciones energéticas sostenibles."
  },
    {
    nombre: "Roman Acosta",
    rol: "Programador Backend",
    descripcion: "Encargado de la lógica del servidor, gestión de bases de datos y APIs para el sistema Solar Tracker."
  },
  {
    nombre: "Braulio Ramirez",
    rol: "Desarrollador Full Stack",
    descripcion: "Encargado de integrar sensores, gráficas en tiempo real y optimizar la plataforma con React, Chart.js y MongoDB."
  },
  {
    nombre: "Martin Gutiérrez",
    rol: "Diseñador Mobile",
    descripcion: "Especialista en interfaces intuitivas y animaciones responsivas que potencian la experiencia del usuario."
  },
  {
    nombre: "Edy Parra",
    rol: "Ingeniero de Hardware",
    descripcion: "Responsable del diseño físico del sistema Solar Tracker y la calibración de sensores solares."
  }
];

function Equipo() {
  return (
    <div className="equipo-container">
      <h2>Nuestro Equipo</h2>
      <div className="tarjetas-equipo">
        {equipo.map((persona, index) => (
          <div key={index} className="tarjeta">
            <h3>{persona.nombre}</h3>
            <p className="rol">{persona.rol}</p>
            <p>{persona.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Equipo;