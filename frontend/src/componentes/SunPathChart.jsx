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

export default function SunPathChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Energía Generada (Wh)',
        data: [],
        backgroundColor: 'rgba(98, 255, 0, 0.2)',
        borderColor: '#62ff00',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: '#62ff00',
      },
      {
        label: 'Consumo Energético (Wh)',
        data: [],
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
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

  useEffect(() => {
    const fetchData = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10);
        console.log(`[SunPathChart] Solicitando datos combinados para: ${today}`);

        const energyResponse = await fetch(`https://solartrackerweb.onrender.com/api/panel-solar/energia-diaria?date=${today}`);
        if (!energyResponse.ok) throw new Error(`HTTP error! status: ${energyResponse.status} (Energía)`);
        const energyData = await energyResponse.json();
        console.log("[SunPathChart] Datos de energía generada recibidos:", energyData);

        const consumptionResponse = await fetch(`https://solartrackerweb.onrender.com/api/panel-solar/consumo-diario?date=${today}`);
        if (!consumptionResponse.ok) throw new Error(`HTTP error! status: ${consumptionResponse.status} (Consumo)`);
        const consumptionData = await consumptionResponse.json();
        console.log("[SunPathChart] Datos de consumo energético recibidos:", consumptionData);

        if (energyData.length === 0 && consumptionData.length === 0) {
          setMessage("No hay datos de energía generada ni consumida para hoy.");
          setChartData(prev => ({
            ...prev,
            labels: [],
            datasets: [
              { ...prev.datasets[0], data: [] },
              { ...prev.datasets[1], data: [] }
            ]
          }));
          return;
        }

        const allHours = [];
        for (let i = 0; i < 24; i++) {
          allHours.push(`${i.toString().padStart(2, '0')}:00`);
        }

        const generatedValues = new Array(allHours.length).fill(0);
        const consumedValues = new Array(allHours.length).fill(0);

        energyData.forEach(item => {
          const index = allHours.indexOf(item.hora);
          if (index !== -1) {
            generatedValues[index] = parseFloat(item.energia_wh || 0);
          }
        });

        consumptionData.forEach(item => {
          const index = allHours.indexOf(item.hora);
          if (index !== -1) {
            consumedValues[index] = parseFloat(item.consumo_wh || 0);
          }
        });

        setChartData({
          labels: allHours,
          datasets: [
            {
              label: 'Energía Generada (Wh)',
              data: generatedValues,
              backgroundColor: 'rgba(98, 255, 0, 0.2)',
              borderColor: '#62ff00',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#62ff00',
            },
            {
              label: 'Consumo Energético (Wh)',
              data: consumedValues,
              backgroundColor: 'rgba(255, 153, 0, 0.2)',
              borderColor: '#ff9900',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#ff9900',
            },
          ],
        });

      } catch (err) {
        console.error("[SunPathChart] Error al cargar datos combinados:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos de energía diaria combinados."));
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
          label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} Wh`,
        },
      },
      title: {
        display: true,
        text: 'Energía Diaria Generada vs. Consumida',
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Vatios-hora (Wh)',
          color: '#000',
        },
        ticks: { color: '#000' },
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

  if (loading) return <div className="chart-loading">Cargando datos diarios combinados...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;
  if (message) return <div className="chart-info">{message}</div>;

  return (
    <div style={{ height: '310px', minHeight: '180px' }}>
      <h2>Energía Diaria Generada vs. Consumida</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}