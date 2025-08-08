import React, { useState, useEffect } from 'react';

// Se eliminan los imports de chart.js ya que se mostrará en formato de lista.

export default function UltimosMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Definimos la función asíncrona para obtener los últimos movimientos.
    const fetchMovimientos = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        // Usamos la API para los últimos movimientos con un límite de 10.
        const response = await fetch('https://solartrackerweb.onrender.com/api/panel-solar/ultimos-movimientos?limit=10');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

        const data = await response.json();
        console.log("Datos de movimientos recibidos:", data);

        if (!data || data.length === 0) {
          setMessage("No hay movimientos recientes del tracker disponibles.");
          setMovimientos([]);
          return;
        }

        setMovimientos(data);
      } catch (err) {
        console.error("Error al cargar los últimos movimientos:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos de movimientos."));
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función de obtención de datos.
    fetchMovimientos();
  }, []);

  // Manejo de estados de carga, error y mensajes.
  if (loading) return <div className="p-4 text-center text-gray-700">Cargando últimos movimientos...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  // Renderizamos los datos si están disponibles en una lista.
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-full md:max-w-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Últimos 10 Movimientos del Tracker</h2>
      <ul className="divide-y divide-gray-200">
        {movimientos.map((movimiento, index) => (
          <li key={index} className="py-3 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-700">Dirección: {movimiento.direccion_cardinal}</span>
              <span className="text-sm text-gray-500">
                Fecha y Hora: {new Date(movimiento.fecha_hora).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
