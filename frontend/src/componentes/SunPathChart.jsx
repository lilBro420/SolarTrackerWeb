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
 * Componente de React para mostrar un gráfico del voltaje de la batería a lo largo del tiempo.
 * Se asume que existe un endpoint de backend en `/api/bateria/historial-voltaje` que devuelve
 * los datos de voltaje y fecha/hora.
 */
export default function VoltageChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Voltaje (V)',
        data: [],
        backgroundColor: 'rgba(255, 153, 0, 0.2)', // Color naranja para voltaje
        borderColor: '#ff9900',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#ff9900',
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
        // Asumimos un endpoint para obtener el historial diario de la batería
        // En tu backend, necesitarías un endpoint que devuelva un array de objetos como:
        // [{ voltaje: 1.5, fecha_hora: '2023-10-27T10:00:00Z' }, ...]
        const response = await fetch(`https://solartrackerweb.onrender.com/api/bateria/historial-voltaje`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const historicalData = await response.json();
        console.log("[VoltageChart] Datos de voltaje recibidos:", historicalData);

        if (historicalData.length === 0) {
          setMessage("No hay datos de voltaje disponibles para graficar.");
          setChartData(prev => ({
            ...prev,
            labels: [],
            datasets: [{ ...prev.datasets[0], data: [] }]
          }));
          return;
        }

        // Extraer etiquetas (fecha y hora) y valores de voltaje
        const labels = historicalData.map(item => {
          const date = new Date(item.fecha_hora);
          return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        });

        const dataPoints = historicalData.map(item => parseFloat(item.voltaje));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Voltaje (V)',
              data: dataPoints,
              backgroundColor: 'rgba(255, 153, 0, 0.2)',
              borderColor: '#ff9900',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#ff9900',
            },
          ],
        });

      } catch (err) {
        console.error("[VoltageChart] Error al cargar datos de voltaje:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos de voltaje de la batería."));
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
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(3)} V`,
        },
      },
      title: {
        display: true,
        text: 'Historial del Voltaje de Batería',
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Voltaje (V)',
          color: '#000',
        },
        ticks: { color: '#000', min: 0, max: 2.5 }, // Ajustado para un rango de voltaje típico de batería
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

  if (loading) return <div className="chart-loading">Cargando datos de voltaje de la batería...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;
  if (message) return <div className="chart-info">{message}</div>;

  return (
    <div style={{ height: '310px', minHeight: '180px' }}>
      <h2>Historial de Voltaje</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}