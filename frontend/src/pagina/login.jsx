import React, { useState } from 'react';
import '../styles/solarPanel.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loginData, setLoginData] = useState({ correo: '', contrasena: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!loginData.correo || !loginData.contrasena) {
      setError('Por favor, ingresa tu correo y contraseña.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://solartrackerweb.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: loginData.correo,
          contrasena: loginData.contrasena,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar estado de autenticación
        localStorage.setItem('usuarioAutenticado', 'true');

        // Guardar los datos del usuario si los necesitas más adelante
        localStorage.setItem('user', JSON.stringify({
          idUsuario: data.idUsuario,
          nombre: data.nombre,
          correo: data.correo
        }));

        setSuccess(data.message || 'Inicio de sesión exitoso.');
        console.log('Login exitoso:', data);

        // Redirigir al panel
        navigate('/home');
      } else {
        setError(data.error || 'Ocurrió un error al iniciar sesión.');
        console.error('Error de login:', data.error);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('No se pudo conectar al servidor. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={loginData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={loginData.contrasena}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p>¿No tienes cuenta? <a href="/registro">Regístrate aquí</a></p>
        <p><a href="/salvar-contrasena">¿Olvidaste tu contraseña?</a></p>
      </form>
    </div>
  );
}

export default Login;