import React from 'react';
// Rutas de importación corregidas
import Direccion from './componentes/Direccion';
import Estado from './componentes/Estado';
import Ultimos from './componentes/Ultimos';
import SunPathChart from './componentes/SunPathChart';
import MonthlySunPathChart from './componentes/MonthlySunPathChart';
import BatteryChart from './componentes/BatteryChart'; 
import VoltageChart from './componentes/VoltageChart'; 
import './styles/solarPanel.css';

function Home() {
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

        {/* Lado Derecho: Trayectoria solar */}
        <div className="right-charts">
          <div className="chart-box"><MonthlySunPathChart /></div>
          <div className="chart-box"><SunPathChart /></div>
          {/* Aquí se agregaron los nuevos gráficos */}
          <div className="chart-box"><BatteryChart /></div>
          <div className="chart-box"><VoltageChart /></div>
        </div>
      </div>
    </div>
  );
}

export default Home;