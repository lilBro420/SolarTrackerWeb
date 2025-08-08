import React from 'react';
import Direccion from '../componentes/Direccion';
import Estado from '../componentes/Estado';
import Ultimos from '../componentes/Estado';
import SunPathChart from '../componentes/SunPathChart';
import MonthlySunPathChart from '../componentes/MonthlySunPathChart';
import '../styles/solarPanel.css';

function Inicio() {
  return (
    <div className="panel-container">
      <div className="header">
        <h1>Solar Tracker</h1>
        <p>Sistema Inteligente de Energía Renovable</p>
      </div>

      <div className="layout">
        {/* Lado Izquierdo: Energía */}
        <div className="left-charts">
          <div className="chart-box"><Direccion /></div>
          <div className="chart-box"><Estado /></div>
          <div className="chart-box"><Ultimos /></div>
        </div>

        {/* Lado Derecho: Trayectoria solar */}
        <div className="right-charts">
          <div className="chart-box"><SunPathChart /></div>
          <div className="chart-box"><MonthlySunPathChart /></div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
