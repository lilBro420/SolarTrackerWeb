import React, { useState, useEffect } from 'react';

// Se eliminan los imports de ChartJS ya que no se necesita la gráfica de barras.

export default function Direccion() {
  const [trackerData, setTrackerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Definimos la función asíncrona para obtener los datos del tracker.
    const fetchTrackerInfo = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        // La URL de tu API para obtener la información más reciente del tracker.
        const response = await fetch('https://solartrackerweb.onrender.com/api/tracker-info');

        // Manejamos errores si la respuesta no es exitosa.
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

        // Parseamos la respuesta JSON.
        const data = await response.json();
        console.log("Datos del tracker recibidos:", data);

        // Si no hay datos, mostramos un mensaje.
        if (!data || Object.keys(data).length === 0) {
          setMessage("No hay datos recientes del tracker disponibles.");
          setTrackerData(null);
          return;
        }

        // Actualizamos el estado con los datos recibidos.
        setTrackerData(data);

      } catch (err) {
        // Capturamos cualquier error y lo guardamos en el estado de error.
        console.error("Error al cargar datos del tracker:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos del tracker."));
      } finally {
        // Finalizamos la carga.
        setLoading(false);
      }
    };

    // Llamamos a la función para obtener los datos cuando el componente se monta.
    fetchTrackerInfo();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente.

  // Mostramos mensajes de carga, error o información si es necesario.
  if (loading) return <div className="p-4 text-center text-gray-700">Cargando dirección del tracker...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  // Si hay datos, los mostramos.
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-full md:max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Estado y Dirección del Tracker</h2>
      {trackerData && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold text-gray-700">
              Estado Actual: <span className={`font-bold ${trackerData.estado_actual === 'activo' ? 'text-green-600' : 'text-red-600'}`}>{trackerData.estado_actual}</span>
            </p>
          </div>
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold text-gray-700">
              Dirección Cardinal: <span className="font-bold text-blue-600">{trackerData.direccion_cardinal}</span>
            </p>
          </div>
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-500">
              Última Actualización: <span className="font-mono">{new Date(trackerData.ultima_actualizacion).toLocaleString()}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}