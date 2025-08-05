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

export default function MonthlySunPathChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Inclinación Longitudinal Promedio (°)',
        data: [],
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffcc00',
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://solartrackerweb.onrender.com/api/reportes/inclinacion-semanal');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.sort((a, b) => new Date(a.fecha_inicio_semana) - new Date(b.fecha_inicio_semana));

        const labels = data.map(item => {
          const date = new Date(item.fecha_inicio_semana);
          return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        });
        const inclinacionData = data.map(item => parseFloat(item.inclinacion_longitudinal_promedio));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Inclinación Longitudinal Promedio (°)',
              data: inclinacionData,
              borderColor: '#ffcc00',
              backgroundColor: 'rgba(255, 204, 0, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#ffcc00',
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching inclinacion-semanal data:", err);
        setError("No se pudieron cargar los datos de inclinación semanal.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      legend: {
        labels: { color: '#000' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}°`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#000' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#000' },
        title: {
          display: true,
          text: 'Ángulo (°)',
          color: '#000',
        },
      },
    },
  };

  if (loading) return <div className="chart-loading">Cargando inclinación semanal...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;

  return (
    <div className="chart-container">
      <h2>Inclinación Longitudinal Promedio Semanal</h2> 
      <Line data={chartData} options={options} />
    </div>
  );
}