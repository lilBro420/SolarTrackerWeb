import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BatteryChart() {
  const [chartData, setChartData] = useState({
    labels: ['Activo', 'Inactivo / Mantenimiento'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#62ff00', '#f0f0f0'],
        borderWidth: 1,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://solartrackerweb.onrender.com/api/reportes/estado-panel');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || (data.horas_activo === 0 && data.horas_inactivo === 0 && data.horas_mantenimiento === 0)) {
            setChartData({
                labels: ['Sin Datos'],
                datasets: [{
                    data: [100],
                    backgroundColor: ['#cccccc'],
                    borderWidth: 1,
                }]
            });
            return;
        }

        const activo = data.horas_activo;
        const inactivoMantenimiento = data.horas_inactivo + data.horas_mantenimiento;
        const total = activo + inactivoMantenimiento;
        setChartData({
          labels: ['Activo', 'Inactivo / Mantenimiento'],
          datasets: [
            {
              data: [activo, inactivoMantenimiento],
              backgroundColor: ['#62ff00', '#f0f0f0'],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching estado-panel data:", err);
        setError("No se pudieron cargar los datos del estado del panel.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#000' },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed; 
            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} horas (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };

  if (loading) return <div className="chart-loading">Cargando estado del panel...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;

  return (
    <div className="chart-container">
      <h2>Estado Operacional del Panel</h2> 
      <Doughnut data={chartData} options={options} />
    </div>
  );
}