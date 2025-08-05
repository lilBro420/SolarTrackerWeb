import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/solarPanel.css';

function Perfil() {
  const datosUsuario = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="form-container">
      <h2>Tu Perfil</h2>
      {datosUsuario ? (
        <>
          <p><strong>Nombre:</strong> {datosUsuario.nombre}</p>
          <p><strong>Correo:</strong> {datosUsuario.correo}</p>
        </>
      ) : (
        <p>No se encontraron datos del usuario. ¿Iniciaste sesión?</p>
      )}

      <Link to="/editar-nombre">Cambiar Nombre</Link><br />
      <Link to="/editar-contraseña">Cambiar Contraseña</Link>
    </div>
  );
}

export default Perfil;