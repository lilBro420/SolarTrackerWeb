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

export default function EnergyUseChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Consumo Energético (Wh)',
        data: [],
        borderColor: '#ff9900',
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        console.log(`[EnergyUseChart] Solicitando datos para: ${today}`);
        const response = await fetch(`https://solartrackerweb.onrender.com/api/panel-solar/consumo-diario?date=${today}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("[EnergyUseChart] Datos recibidos:", data);

        if (data.length === 0) {
          setMessage("No hay datos de energía consumida para hoy.");
          setChartData(prev => ({
            ...prev,
            labels: [],
            datasets: [{ ...prev.datasets[0], data: [] }]
          }));
          return;
        }

        const labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
        const consumoData = new Array(labels.length).fill(0);

        data.forEach(item => {
          const hour = item.hora;
          const index = labels.indexOf(hour);
          if (index !== -1) {
            consumoData[index] = parseFloat(item.consumo_wh || 0);
          }
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Consumo Energético (Wh)',
              data: consumoData,
              borderColor: '#ff9900',
              backgroundColor: 'rgba(255, 153, 0, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        });

      } catch (err) {
        console.error("[EnergyUseChart] Error al cargar datos:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos de energía consumida."));
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
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} Wh`,
        },
      },
    },
    scales: {
      x: { ticks: { color: '#000' } },
      y: {
        beginAtZero: true,
        ticks: { color: '#000' },
        title: {
          display: true,
          text: 'Wh',
          color: '#000',
        },
      },
    },
  };

  if (loading) return <div className="chart-loading">Cargando energía consumida...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;
  if (message) return <div className="chart-info">{message}</div>;

  return (
    <div className="chart-container">
      <h2>Energía Consumida Hoy</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}