import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// Define la URL base de tu API en Render
const RENDER_API_URL = 'https://solartrackerweb.onrender.com';

export default function RealtimeDirectionChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Dirección Cardinal',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#007bff',
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('📡 Solicitando datos de dirección cardinal...');
        const response = await fetch(`${RENDER_API_URL}/api/panel-solar/ultimos-movimientos?limit=5`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
          throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Datos recibidos desde la API:', data);

        const labels = data.map(item => {
          const date = new Date(item.fecha_hora);
          const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return timeStr;
        });

        const directionData = data.map(item => item.direccion_cardinal);
        console.log('📊 Etiquetas (fechas):', labels);
        console.log('📍 Direcciones cardinales:', directionData);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Dirección Cardinal',
              data: directionData,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#007bff',
            },
          ],
        });
      } catch (err) {
        console.error("❌ Error al obtener datos:", err);
        setError(`Error: No se pudieron cargar los datos de dirección en tiempo real. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Ejecutar al montar

    const intervalId = setInterval(fetchData, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  const options = {
    animation: {
      duration: 0
    },
    elements: {
      point: {
        radius: 5,
        hitRadius: 10,
        hoverRadius: 7,
      },
    },
    plugins: {
      legend: {
        labels: { color: '#000' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000' },
        title: {
          display: true,
          text: 'Hora de Lectura',
          color: '#000',
        },
      },
      y: {
        type: 'category',
        labels: [
          'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
        ],
        ticks: { color: '#000' },
        title: {
          display: true,
          text: 'Dirección Cardinal',
          color: '#000',
        },
      },
    },
  };

  if (loading) return <div className="chart-loading">Cargando datos de dirección en tiempo real...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;

  return (
    <div className="chart-container" style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '10px' }}>
      <h2>Dirección Cardinal Instantánea del Panel Solar</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
