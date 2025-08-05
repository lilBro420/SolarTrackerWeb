import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function EnergyDayChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Energía Generada (Wh)',
        data: [],
        backgroundColor: '#dae1e7',
        borderColor: '#000',
        borderWidth: 0.1,
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
        console.log(`[EnergyDayChart] Solicitando datos para: ${today}`);
        const response = await fetch(`https://solartrackerweb.onrender.com/api/panel-solar/energia-diaria?date=${today}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("[EnergyDayChart] Datos recibidos:", data);
        if (data.length === 0) {
          setMessage("No hay datos de energía generada para hoy.");
          setChartData(prev => ({
            ...prev,
            labels: [],
            datasets: [{ ...prev.datasets[0], data: [] }]
          }));
          return;
        }

        const labels = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        const energiaData = new Array(labels.length).fill(0);
        data.forEach(item => {
          const hour = item.hora;
          const index = labels.indexOf(hour);
          if (index !== -1) {
            energiaData[index] = parseFloat(item.energia_wh || 0);
          }
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Energía Generada (Wh)',
              data: energiaData,
              backgroundColor: '#dae1e7',
              borderColor: '#000',
              borderWidth: 0.1,
            },
          ],
        });

      } catch (err) {
        console.error("[EnergyDayChart] Error al cargar datos:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos de energía generada hoy."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
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

  if (loading) return <div className="chart-loading">Cargando energía generada...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;
  if (message) return <div className="chart-info">{message}</div>;

  return (
    <div className="chart-container">
      <h2>Energía Generada Hoy</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}