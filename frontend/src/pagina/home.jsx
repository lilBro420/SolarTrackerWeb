import React from 'react';
// Importaciones de tus nuevos componentes de gráficos de batería
import Direccion from '../componentes/Direccion';
import Estado from '../componentes/Estado';
import Ultimos from '../componentes/Ultimos';
import Porcentaje from '../componentes/Porcentaje';
import Voltaje from '../componentes/Voltaje';
import '../styles/solarPanel.css';

function Home() {
  return (
    <div className="panel-container">
      <div className="header">
        <h1>Solar Tracker</h1>
        <p>Sistema Inteligente de Energía Renovable</p>
      </div>

      <div className="layout">
        <div className="left-charts">
          <div className="chart-box"><Direccion /></div>
          <div className="chart-box"><Estado /></div>
          {<div className="chart-box"><Ultimos /></div>}
        </div>

        {/* Lado Derecho: gráficos de la batería (porcentaje y voltaje) */}
        <div className="right-charts">
          <div className="chart-box"><Direccion /></div>
          <div className="chart-box"><Porcentaje /></div>
          <div className="chart-box"><Voltaje /></div>
          
        </div>
      </div>
    </div>
  );
}

export default Home;
