import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../styles/solarPanel.css';

function Registro() {
  // useNavigate nos permite navegar programáticamente
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', correo: '', contrasena: '' }); // Cambiado 'contraseña' a 'contrasena' para que coincida con el backend
  const [message, setMessage] = useState(''); // Para mostrar mensajes al usuario (éxito/error)
  const [isError, setIsError] = useState(false); // Para indicar si el mensaje es de error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpiar mensajes anteriores
    setIsError(false);

    try {
      const response = await fetch('http://localhost:3000/api/registro', { // Asegúrate que esta URL coincida con tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Registro exitoso.');
        setIsError(false);
        // Redirige al usuario a la página de login después de un breve retraso
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirige después de 2 segundos para que el usuario vea el mensaje
      } else {
        setMessage(data.error || 'Error en el registro.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMessage('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
      setIsError(true);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input type="email" name="correo" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} required />
        {/* Asegúrate de que 'name' sea 'contrasena' para coincidir con el backend */}
        <input type="password" name="contrasena" placeholder="Contraseña" value={form.contrasena} onChange={handleChange} required />
        
        <button type="submit">Registrarse</button>
        
        {message && (
          <p className={isError ? 'error-message' : 'success-message'}>
            {message}
          </p>
        )}

        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
      </form>
    </div>
  );
}

export default Registro;