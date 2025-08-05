import React, { useState } from 'react';
import '../styles/solarPanel.css';

function EditarNombre() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario) return setError('Usuario no autenticado');

    try {
      const response = await fetch('http://solartrackerweb.onrender.com/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: usuario.idUsuario,
          nombre,
          correo: usuario.correo // Usamos el mismo correo
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.message);
        // Actualizamos el nombre en localStorage
        localStorage.setItem('user', JSON.stringify({ ...usuario, nombre }));
      } else {
        setError(data.error || 'Error al actualizar el nombre.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cambiar Nombre</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nuevo nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">Actualizar</button>
        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default EditarNombre;