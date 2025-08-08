import React, { useState, useEffect } from 'react';

// Este componente muestra el estado actual del tracker y las horas asociadas.
// Se asume que Tailwind CSS está disponible para el estilo.
export default function Estado() {
  const [estadoData, setEstadoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Función asíncrona para obtener el estado actual del tracker.
    const fetchEstadoActual = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        // Usamos la URL de tu API para el estado actual.
        const response = await fetch('https://solartrackerweb.onrender.com/api/tracker-estado-actual');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

        const data = await response.json();
        console.log("Datos del estado actual recibidos:", data);

        if (!data || Object.keys(data).length === 0) {
          setMessage("No se encontró un estado registrado.");
          setEstadoData(null);
          return;
        }

        setEstadoData(data);
      } catch (err) {
        console.error("Error al cargar el estado actual:", err);
        setError("Error: " + (err.message || "No se pudo cargar el estado actual del tracker."));
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función de obtención de datos.
    fetchEstadoActual();
  }, []);

  // Manejo de estados de carga, error y mensajes.
  if (loading) return <div className="p-4 text-center text-gray-700">Cargando estado actual...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  // Renderizamos los datos si están disponibles.
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Estado Actual del Tracker</h2>
      {estadoData && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold text-gray-700">
              Estado: <span className={`font-bold ${estadoData.estado === 'activo' ? 'text-green-600' : (estadoData.estado === 'inactivo' ? 'text-red-600' : 'text-yellow-600')}`}>{estadoData.estado}</span>
            </p>
          </div>
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold text-gray-700">
              Inicio del estado: <span className="font-mono">{new Date(estadoData.inicio).toLocaleString()}</span>
            </p>
          </div>
          {estadoData.fin && (
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-lg font-semibold text-gray-700">
                Fin del estado: <span className="font-mono">{new Date(estadoData.fin).toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}