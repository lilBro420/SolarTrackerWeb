import React from 'react';
import BatteryChart from '../componentes/BatteryChart';
import EnergyDayChart from '../componentes/EnergyDayChart';
import EnergyUseChart from '../componentes/EnergyUseChart';
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
          <div className="chart-box"><BatteryChart /></div>
          <div className="chart-box"><EnergyDayChart /></div>
          <div className="chart-box"><EnergyUseChart /></div>
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
