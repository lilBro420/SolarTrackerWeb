import React, { useState, useEffect } from 'react';

export default function Direccion() {
  const [ultimaDireccion, setUltimaDireccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUltimaDireccion = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        const response = await fetch('https://solartrackerweb.onrender.com/api/panel-solar/ultimo-movimiento');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

        const data = await response.json();
        console.log("Datos de la dirección recibidos:", data);

        // Aquí está la corrección: `data` es un objeto, no un array.
        if (!data || !data.direccion_cardinal) {
          setMessage("No hay datos recientes del tracker disponibles.");
          setUltimaDireccion(null);
          return;
        }
        
        // Accedemos directamente a la propiedad del objeto
        setUltimaDireccion(data.direccion_cardinal);

      } catch (err) {
        console.error("Error al cargar la dirección del tracker:", err);
        setError("Error: " + (err.message || "No se pudo cargar la dirección del tracker."));
      } finally {
        setLoading(false);
      }
    };

    fetchUltimaDireccion();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-700">Cargando la última dirección del tracker...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 w-full md:max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Última Dirección del Tracker</h2>
      {ultimaDireccion && (
        <div className="p-3 bg-gray-100 rounded-md text-center">
          <p className="text-4xl font-bold text-blue-600">
            {ultimaDireccion}
          </p>
        </div>
      )}
    </div>
  );
}