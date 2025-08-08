import React, { useState, useEffect } from 'react';

// Este componente muestra la última dirección cardinal del tracker.
// Se asume que Tailwind CSS está disponible para el estilo.
export default function Direccion() {
  const [ultimaDireccion, setUltimaDireccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Definimos la función asíncrona para obtener los datos.
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

        let direccion = null;
        if (Array.isArray(data) && data.length > 0) {
          direccion = data[0]?.direccion_cardinal;
        } else if (data && data.direccion_cardinal) {
          direccion = data.direccion_cardinal;
        }

        if (!direccion) {
          setMessage("No hay datos recientes del tracker disponibles.");
          setUltimaDireccion(null);
          return;
        }
        
        // Asumimos que la hora y la dirección están separadas por un ' - '.
        // Separamos la cadena y tomamos solo la primera parte.
        const direccionSinHora = direccion.split(' - ')[0];

        // Si se encuentra la dirección, la establecemos en el estado.
        setUltimaDireccion(direccionSinHora);

      } catch (err) {
        console.error("Error al cargar la dirección del tracker:", err);
        setError("Error: " + (err.message || "No se pudo cargar la dirección del tracker."));
      } finally {
        setLoading(false);
      }
    };

    fetchUltimaDireccion();
  }, []);

  // Mostramos mensajes de carga, error o información si es necesario.
  if (loading) return <div className="p-4 text-center text-gray-700">Cargando la última dirección del tracker...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  // Si hay datos, los mostramos.
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Última Dirección del Tracker</h2>
      {ultimaDireccion && (
        <div className="p-3 bg-gray-100 rounded-md text-center flex-grow flex items-center justify-center">
          <p className="text-4xl font-bold text-blue-600">
            {ultimaDireccion}
          </p>
        </div>
      )}
    </div>
  );
}