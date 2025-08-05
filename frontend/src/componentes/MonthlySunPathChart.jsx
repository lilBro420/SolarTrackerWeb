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

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// URL base del backend en Render
const RENDER_API_URL = 'https://solartrackerweb.onrender.com';

// Mapeo de direcciones largas a abreviaciones
const DIRECCION_TRADUCCION = {
  'Norte': 'N',
  'Noreste': 'NE',
  'Este': 'E',
  'Sureste': 'SE',
  'Sur': 'S',
  'Suroeste': 'SW',
  'Oeste': 'W',
  'Noroeste': 'NW',
};

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
        console.log(' Solicitando datos de dirección cardinal...');
        const response = await fetch(`${RENDER_API_URL}/api/panel-solar/ultimos-movimientos?limit=5`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
          throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log(' Datos recibidos desde la API:', data);

        const labels = data.map(item => {
          const date = new Date(item.fecha_hora);
          return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        });

        const directionData = data.map(item => {
          const original = item.direccion_cardinal?.trim();
          return DIRECCION_TRADUCCION[original] || 'N/A';
        });

        console.log(' Etiquetas (fechas):', labels);
        console.log(' Direcciones cardinales:', directionData);

        setChartData({
          labels,
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
        console.error(" Eror al querer obtener datos:", err);
        setError(`Error: No se pudieron cargar los datos de dirección en tiempo real. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const options = {
    animation: { duration: 0 },
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
        labels: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
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
