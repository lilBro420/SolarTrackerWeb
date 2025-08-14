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

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

/**
 * Componente de React para mostrar un gráfico del porcentaje de la batería a lo largo del tiempo.
 * Se asume que existe un endpoint de backend en `/api/bateria/porcentaje` que devuelve
 * los datos de porcentaje y fecha/hora.
 */
export default function Porcentaje() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Porcentaje de Carga (%)',
        data: [],
        backgroundColor: 'rgba(98, 255, 0, 0.2)',
        borderColor: '#62ff00',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#62ff00',
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Efecto para cargar los datos del gráfico al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(`https://solartrackerweb.onrender.com/api/bateria/porcentaje`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const historicalData = await response.json();
        console.log("[Porcentaje] Datos de batería recibidos:", historicalData);

        if (historicalData.length === 0) {
          setMessage("No hay datos de batería disponibles para graficar.");
          setChartData(prev => ({
            ...prev,
            labels: [],
            datasets: [{ ...prev.datasets[0], data: [] }]
          }));
          return;
        }

        // Extraer etiquetas (fecha y hora) y valores de porcentaje
        const labels = historicalData.map(item => {
          const date = new Date(item.fecha_hora);
          return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        });

        const dataPoints = historicalData.map(item => parseFloat(item.porcentaje));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Porcentaje de Carga (%)',
              data: dataPoints,
              backgroundColor: 'rgba(98, 255, 0, 0.2)',
              borderColor: '#62ff00',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#62ff00',
            },
          ],
        });

      } catch (err) {
        console.error("[Porcentaje] Error al cargar datos de la batería:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos de la batería."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#000' },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} %`,
        },
      },
      title: {
        display: true,
        text: 'Historial del Porcentaje de Batería',
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Porcentaje (%)',
          color: '#000',
        },
        ticks: { color: '#000', max: 100, min: 0 },
      },
      x: {
        title: {
          display: true,
          text: 'Hora del Día',
          color: '#000',
        },
        ticks: { color: '#000' },
      },
    },
  };

  if (loading) return <div className="chart-loading">Cargando datos de la batería...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;
  if (message) return <div className="chart-info">{message}</div>;

  return (
    <div style={{ height: '310px', minHeight: '180px' }}>
      <h2>Historial de Porcentaje</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}