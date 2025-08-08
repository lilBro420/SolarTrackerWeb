import React, { useState, useEffect } from 'react';

export default function Direccion() {
  const [ultimaDireccion, setUltimaDireccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Definimos la función asíncrona para obtener los datos del tracker.
    const fetchUltimaDireccion = async () => {
      setMessage('');
      setError(null);
      setLoading(true);
      try {
        // La URL de tu API para obtener los últimos movimientos.
        // Usamos un límite de 1 para obtener solo el último registro.
        const response = await fetch('https://solartrackerweb.onrender.com/api/panel-solar/ultimos-movimientos?limit=1');

        // Manejamos errores si la respuesta no es exitosa.
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de red: ${response.status}, mensaje: ${errorText}`);
        }

        // Parseamos la respuesta JSON.
        const data = await response.json();
        console.log("Datos de la dirección recibidos:", data);

        // Si no hay datos, mostramos un mensaje.
        if (!data || data.length === 0) {
          setMessage("No hay datos recientes del tracker disponibles.");
          setUltimaDireccion(null);
          return;
        }

        // El último movimiento es el primer elemento del array.
        setUltimaDireccion(data[0].direccion_cardinal);

      } catch (err) {
        // Capturamos cualquier error y lo guardamos en el estado de error.
        console.error("Error al cargar la dirección del tracker:", err);
        setError("Error: " + (err.message || "No se pudo cargar la dirección del tracker."));
      } finally {
        // Finalizamos la carga.
        setLoading(false);
      }
    };

    // Llamamos a la función para obtener los datos cuando el componente se monta.
    fetchUltimaDireccion();
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente.

  // Mostramos mensajes de carga, error o información si es necesario.
  if (loading) return <div className="p-4 text-center text-gray-700">Cargando la última dirección del tracker...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (message) return <div className="p-4 text-center text-yellow-500">{message}</div>;

  // Si hay datos, los mostramos.
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
