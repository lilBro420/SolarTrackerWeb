import React, { useState, useEffect } from 'react';

export default function Direccion() {
  const [trackerData, setTrackerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    
    const fetchTrackerInfo = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
    
        const response = await fetch('https://solartrackerweb.onrender.com/api/tracker-info');

       
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

  
        const data = await response.json();
        console.log("Datos del tracker recibidos:", data);

     
        if (!data || Object.keys(data).length === 0) {
          setMessage("No hay datos recientes del tracker disponibles.");
          setTrackerData(null);
          return;
        }
        setTrackerData(data);

      } catch (err) {

        console.error("Error al cargar datos del tracker:", err);
        setError("Error: " + (err.message || "No se pudieron cargar los datos del tracker."));
      } finally {
        // Finalizamos la carga.
        setLoading(false);
      }
    };

    
    fetchTrackerInfo();
  }, []); 


  if (loading) return <div className="p-4 text-center text-gray-700">Cargando estado del tracker...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-full md:max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Estado Actual del Tracker</h2>
      {trackerData && (
        <div className="p-3 bg-gray-100 rounded-md">
          <p className="text-lg font-semibold text-gray-700">
            Estado Actual: <span className={`font-bold ${trackerData.estado_actual === 'activo' ? 'text-green-600' : 'text-red-600'}`}>{trackerData.estado_actual}</span>
          </p>
        </div>
      )}
    </div>
  );
}