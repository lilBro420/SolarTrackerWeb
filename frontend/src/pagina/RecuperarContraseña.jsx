import React, { useState } from 'react';
import '../styles/solarPanel.css';

function RecuperarContraseña() {
  const [correo, setCorreo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Solicitud de recuperación enviada a:", correo);
  };

  return (
    <div className="form-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <button type="submit">Enviar Enlace</button>
      </form>
    </div>
  );
}

export default RecuperarContraseña;