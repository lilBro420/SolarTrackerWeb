import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficaMysql() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    axios.get('http://localhost:3001/api/data')
      .then((res) => {
        const labels = res.data.map(item => item.label);
        const values = res.data.map(item => item.value);
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Cantidad de alumnos',
              data: values,
              backgroundColor: 'rgba(144, 0, 240, 0.6)',
              borderColor: 'rgb(241, 20, 127)',
              borderWidth: 1,
            }
          ]
        });
      });
  }, []);

  return (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <h2>Gráfico de alumnos</h2>
      <Pie data={chartData} />
      <Bar data={chartData} />
    </div>
  );
}