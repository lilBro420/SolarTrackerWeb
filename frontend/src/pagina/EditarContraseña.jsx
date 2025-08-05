import React, { useState } from 'react';
import '../styles/solarPanel.css';

function EditarContraseña() {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario) return setError('Usuario no autenticado');

    try {
      const response = await fetch('http://solartrackerweb.onrender.com/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: usuario.idUsuario,
          currentPassword: actual,
          newPassword: nueva
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.message);
        setActual('');
        setNueva('');
      } else {
        setError(data.error || 'Error al cambiar la contraseña.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          required
        />
        <button type="submit">Actualizar</button>
        {mensaje && <p className="success-message">{mensaje}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default EditarContraseña;