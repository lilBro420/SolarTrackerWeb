import React, { useState } from 'react';
import '../styles/solarPanel.css'; 

function SalvarContrasena() {
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');

  const [correoVerificado, setCorreoVerificado] = useState(false);
  const [tokenValidado, setTokenValidado] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarToken = (token) => /^\d{4}$/.test(token);

  const manejarVerificacionCorreo = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!validarEmail(correo)) {
      setError('El formato del correo no es válido.');
      return;
    }

    setCargando(true);
    try {
      const verificar = await fetch('https://solartrackerweb.onrender.com/api/verificar-correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });

      const resVerificar = await verificar.json();

      if (!verificar.ok || !resVerificar.exists) {
        setError(' El correo no está registrado en nuestra base de datos.');
        return;
      }

      const tokenResp = await fetch('http://solartrackerweb.onrender.com/api/generar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      });

      if (tokenResp.ok) {
        setCorreoVerificado(true);
        setMensaje(' Se ha enviado un código de recuperación a tu correo.');
      } else {
        setError(' No se pudo generar el token.');
      }

    } catch (err) {
      setError(' Error al conectar con el servidor.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const manejarValidacionToken = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!validarToken(codigo)) {
      setError('El código debe tener exactamente 4 dígitos.');
      return;
    }

    setCargando(true);
    try {
      const validarTokenResp = await fetch('http://localhost:3000/api/verificar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: correo,
          token: codigo
        })
      });

      const resultado = await validarTokenResp.json();

      if (validarTokenResp.ok && resultado.valid) {
        setMensaje(' Token válido. Puedes cambiar tu contraseña.');
        setTokenValidado(true);
      } else {
        setError(' El código ingresado no es válido.');
      }

    } catch (err) {
      setError(' Error al validar el token.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioContrasena = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (nuevaContrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const resp = await fetch('http://localhost:3000/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: correo,
          token: codigo,
          newPassword: nuevaContrasena
        })
      });

      const resultado = await resp.json();
      if (resp.ok) {
        setMensaje(' Contraseña actualizada correctamente. ¡Ya puedes iniciar sesión!');
        setCorreo('');
        setCodigo('');
        setNuevaContrasena('');
        setCorreoVerificado(false);
        setTokenValidado(false);
      } else {
        setError(` ${resultado.error || 'No se pudo cambiar la contraseña.'}`);
      }

    } catch (err) {
      console.error(' Error al enviar nueva contraseña:', err);
      setError('Error de conexión al cambiar la contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-container"> 
      <h2>Recuperar Contraseña</h2>

      {!correoVerificado && (
        <form onSubmit={manejarVerificacionCorreo} className="form"> 
          <label htmlFor="correo">Correo electrónico:</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="ejemplo@correo.com"
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Procesando...' : 'Solicitar Código'}
          </button>
        </form>
      )}

      {correoVerificado && !tokenValidado && (
        <form onSubmit={manejarValidacionToken} className="form">
          <label htmlFor="codigo">Ingresa el código de recuperación:</label>
          <input
            type="text"
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            maxLength={4}
            placeholder="••••"
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Validando...' : 'Validar Código'}
          </button>
        </form>
      )}

      {tokenValidado && (
        <form onSubmit={manejarCambioContrasena} className="form">
          <label htmlFor="nueva">Nueva contraseña:</label>
          <input
            type="password"
            id="nueva"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      )}
      {mensaje && <p className="success-message">{mensaje}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SalvarContrasena;