import React, { useState, useEffect } from 'react';

// Componente que muestra únicamente la última dirección cardinal del tracker.
// Se asume que Tailwind CSS está disponible para el estilo.
export default function Direccion() {
  const [ultimaDireccion, setUltimaDireccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Función asíncrona para obtener los datos de la dirección.
    const fetchUltimaDireccion = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        // La URL de tu API para obtener la dirección más reciente.
        // Asumimos que esta API ahora devuelve un objeto limpio,
        // por ejemplo: { "direccion_cardinal": "Norte" }
        const response = await fetch('https://solartrackerweb.onrender.com/api/panel-solar/ultimo-movimiento');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

        const data = await response.json();
        console.log("Datos de la dirección recibidos:", data);

        // Verificamos que los datos y la propiedad `direccion_cardinal` existan.
        // No necesitamos la lógica para limpiar la cadena de texto, ya que el backend
        // se encarga de ello.
        if (!data || !data.direccion_cardinal) {
          setMessage("No hay datos recientes del tracker disponibles.");
          setUltimaDireccion(null);
          return;
        }
        
        // Accedemos directamente a la propiedad para obtener la dirección.
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

  // Mostramos mensajes de carga, error o información.
  if (loading) return <div className="p-4 text-center text-gray-700">Cargando la última dirección del tracker...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  // Renderizamos la dirección si está disponible.
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
