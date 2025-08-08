import React from 'react';
import Direccion from '../componentes/Direccion';
import Estado from '../componentes/Estado';
import Ultimos from '../componentes/Ultimos';
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
        {/* Lado Izquierdo: energía */}
        <div className="left-charts">
          <div className="chart-box"><Direccion /></div>
          <div className="chart-box"><Estado /></div>
          <div className="chart-box"><Ultimos /></div>
        </div>

        {/* Lado Derecho: Trayectoria solar pa */}
        <div className="right-charts">
         {/* aqui van las demas graficas*/}
        </div>
      </div>
    </div>
  );
}

export default Inicio;
