require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const nodemailer = require('nodemailer'); // 

const app = express();
app.use(cors());
app.use(express.json());

// ---variables de entorno se cargaron bien ---
console.log(' Configuración de entorno:');
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '******' : 'NO CONFIGURADO', 
  DB_DATABASE: process.env.DB_DATABASE,
  PORT: process.env.PORT || 3000,
  EMAIL_USER: process.env.EMAIL_USER ? 'CONFIGURADO' : 'NO CONFIGURADO', 
  EMAIL_PASS: process.env.EMAIL_PASS ? '******' : 'NO CONFIGURADO', 
});

// ---pool de conexión ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//mandar al login
app.get('/', (req, res) => {
  res.redirect('https://solartrackerwebfront.onrender.com/');
});

// --- Verificar conexión inicial ---
pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Error de conexión a MySQL:', err);
    return;
  }
  console.log(' Conectado a la base de datos en Hostinger');
  connection.release();
});


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    
    rejectUnauthorized: false
  }
});


// --- FUNCIONES DE VALIDACION ---
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password.length >= 6;
const isValidName = (name) => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
  return typeof name === 'string' && name.length >= 2 && name.length <= 100 && nameRegex.test(name);
};


// --- LOGIN ---
app.post('/api/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos' });
  }
  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'Formato de correo inválido.' });
  }

  const sql = 'SELECT idUsuario, nombre, correo, contrasena FROM usuario WHERE correo = ? LIMIT 1';
  pool.query(sql, [correo], async (err, results) => {
    if (err) {
      console.error(' Error en consulta SQL:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const user = results[0];
    const storedHash = user.contrasena;
    if (!storedHash || !storedHash.startsWith('$2')) {
      return res.status(500).json({ error: 'Error de configuración de contraseña en el servidor.' });
    }

    try {
      const isMatch = await bcrypt.compare(contrasena, storedHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
      }

      // Login exitoso
      res.json({
        message: 'Login exitoso',
        idUsuario: user.idUsuario,
        nombre: user.nombre,
        correo: user.correo
      });

    } catch (bcryptErr) {
      console.error(' Error en bcrypt:', bcryptErr);
      return res.status(500).json({ error: 'Error interno de autenticación.' });
    }
  });
});

// --- REGISTRO ---
app.post('/api/register', (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Por favor, llena todos los campos.' });
  }

  if (!isValidName(nombre)) {
    return res.status(400).json({ error: 'El nombre contiene caracteres inválidos o es muy corto/largo.' });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'Formato de correo inválido.' });
  }

  if (!isValidPassword(contrasena)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  const cleanNombre = validator.escape(nombre);

  const checkSql = 'SELECT * FROM usuario WHERE correo = ? LIMIT 1';
  pool.query(checkSql, [correo], async (err, results) => {
    if (err) {
      console.error(' Error en consulta de verificación de correo:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'Correo ya registrado' });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);

      const insertSql = 'INSERT INTO usuario (nombre, correo, contrasena) VALUES (?, ?, ?)';
      pool.query(insertSql, [cleanNombre, correo, hashedPassword], (insertErr) => {
        if (insertErr) {
          console.error(' Error al insertar nuevo usuario:', insertErr);
          return res.status(500).json({ error: 'Error del servidor' });
        }
        res.status(201).json({ message: 'Usuario registrado correctamente' });
      });
    } catch (bcryptErr) {
      console.error(' Error al hashear contraseña:', bcryptErr);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
});
// Actualización de Perfilt
// --- ACTUALIZAR PERFIL ---
app.post('/api/update-profile', (req, res) => {
  const { idUsuario, nombre, correo } = req.body;

  if (!idUsuario || !nombre || !correo) {
    return res.status(400).json({ error: 'Faltan campos para actualizar el perfil' });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'Formato de correo inválido.' });
  }
  if (!isValidName(nombre)) {
      return res.status(400).json({ error: 'El nombre contiene caracteres inválidos o es muy corto/largo.' });
  }

  const sql = 'UPDATE usuario SET nombre = ?, correo = ? WHERE idUsuario = ?';
  pool.query(sql, [nombre, correo, idUsuario], (err, result) => {
    if (err) {
      console.error(' Error al actualizar perfil:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'El correo electrónico ya está en uso por otro usuario.' });
      }
      return res.status(500).json({ error: 'Error del servidor al actualizar el perfil' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o no se realizaron cambios' });
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  });
});

 //Cambio de Contraseña
// --- CAMBIO DE CONTRASEÑA usando correo + token ---
app.post('/api/change-password', (req, res) => {
  const { correo, token, newPassword } = req.body;

  console.log('📧 Correo recibido para cambio de contraseña:', correo);
  console.log('🔐 Token recibido para cambio de contraseña:', token);
  // No loguear la nueva contraseña directamente por seguridad
  // console.log('🆕 Nueva contraseña:', newPassword);

  if (!correo || !token || !newPassword) {
    console.warn('⚠️ Faltan datos en la solicitud de cambio de contraseña.');
    return res.status(400).json({ error: 'Faltan campos para cambiar la contraseña.' });
  }

  if (!isValidPassword(newPassword)) {
    console.warn('⚠️ Contraseña nueva inválida (menos de 6 caracteres).');
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  // Verificar que el token sea válido y no haya caducado para ese correo
  const sqlToken = 'SELECT token, token_expira FROM usuario WHERE correo = ? LIMIT 1';
  pool.query(sqlToken, [correo], async (err, results) => {
    if (err) {
      console.error(' Error al consultar token para cambio de contraseña:', err);
      return res.status(500).json({ error: 'Error del servidor.' });
    }

    if (results.length === 0) {
      console.warn(' Usuario no encontrado al intentar cambiar contraseña.');
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const storedToken = String(results[0].token).trim();
    const tokenExpira = new Date(results[0].token_expira);
    const ahora = new Date();

    if (ahora > tokenExpira) {
      console.warn('⏳ Token caducado para el correo proporcionado.');
      // Opcional: limpiar el token caducado de la DB aquí si se desea
      return res.status(401).json({ error: 'El token ha expirado.' });
    }

    if (storedToken !== String(token).trim()) {
      console.warn(' Token inválido o no coincide para el correo proporcionado.');
      return res.status(401).json({ error: 'Token inválido.' });
    }

    // Token válido y no caducado, procedemos a cambiar la contraseña
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Limpiar el token después de un uso exitoso para seguridad
      const updateSql = 'UPDATE usuario SET contrasena = ?, token = NULL, token_expira = NULL WHERE correo = ?';
      pool.query(updateSql, [hashedNewPassword, correo], (updateErr, result) => {
        if (updateErr) {
          console.error(' Error al actualizar contraseña:', updateErr);
          return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }

        if (result.affectedRows === 0) {
          console.warn(' Usuario no encontrado al actualizar la contraseña después de validación.');
          return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        console.log(' Contraseña actualizada exitosamente y token limpiado.');
        res.json({ message: 'Contraseña actualizada correctamente.' });
      });
    } catch (bcryptErr) {
      console.error(' Error interno al generar hash para nueva contraseña:', bcryptErr);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
});



/// Consulta de Datos del Panel Solar por Fecha
// --- CONSULTA POR FECHA ---
app.get('/api/panel-solar/by-date', (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Falta el parámetro de fecha (ej. ?date=YYYY-MM-DD)' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
  }

  const sql = `
    SELECT idPanel, energia, consumo, estado, fecha_hora
    FROM panelSolar
    WHERE DATE(fecha_hora) = ? AND TIME(fecha_hora) >= '06:00:00'
    ORDER BY fecha_hora ASC;
  `;

  pool.query(sql, [date], (err, results) => {
    if (err) {
      console.error(' Error al obtener datos del panel solar por fecha:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener datos del panel solar.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos disponibles para la fecha solicitada.' });
    }

    res.json(results);
  });
});

// --- REPORTES SEMANALES ---
app.get('/api/reportes-semanales', (req, res) => {
  const sql = `
    SELECT
      fecha_inicio_semana,
      promedio_energia_diaria_kWh,
      promedio_consumo_diaria_kWh
    FROM reportes
    ORDER BY fecha_inicio_semana DESC
    LIMIT 7;
  `;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error(' Error al consultar reportes semanales:', err);
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }

    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});

//GRAFICAS
// --- Uno ---
app.get('/api/tracker-info', (req, res) => {
  const query = `
    SELECT
      fecha_hora,
      direccion_cardinal
    FROM Solar_Tracker
    ORDER BY fecha_hora DESC
    LIMIT 1;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener datos del tracker:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener la información del tracker.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos del tracker disponibles.' });
    }

    const lastRecord = results[0];
    const lastTimestamp = new Date(lastRecord.fecha_hora);
    const currentTime = new Date();
    const minutesDiff = (currentTime - lastTimestamp) / (1000 * 60);

    let estado = 'inactivo';
    if (minutesDiff < 2) { // Si el último registro tiene menos de 15 minutos, está activo
      estado = 'activo';
    }

    res.json({
      estado_actual: estado,
      direccion_cardinal: lastRecord.direccion_cardinal,
      ultima_actualizacion: lastRecord.fecha_hora
    });
  });
});

// --- Dos ---
app.get('/api/tracker-horas-por-dia', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const query = `
    SELECT 
      estado,
      SUM(TIMESTAMPDIFF(SECOND, fecha_hora_inicio, IFNULL(fecha_hora_fin, NOW()))) AS total_segundos
    FROM tracker_status
    WHERE DATE(fecha_hora_inicio) = ?
    GROUP BY estado;
  `;

  pool.query(query, [today], (err, results) => {
    if (err) {
      console.error('Error al calcular las horas:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener las horas de estado.' });
    }
    
    const horas = { activo: 0, inactivo: 0, mantenimiento: 0 };
    results.forEach(row => {
      horas[row.estado] = (row.total_segundos / 3600).toFixed(2); // Convertir segundos a horas
    });

    res.json(horas);
  });
});

// --- Últimos movimientos del tracker ---

app.get('/api/panel-solar/ultimos-movimientos', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  if (isNaN(limit) || limit <= 0 || limit > 100) {
    return res.status(400).json({ error: 'El parámetro "limit" debe ser un número positivo y menor o igual a 100.' });
  }

  const sql = `
    SELECT
      fecha_hora,
      direccion_cardinal
    FROM Solar_Tracker
    ORDER BY fecha_hora DESC
    LIMIT ?;
  `;

  pool.query(sql, [limit], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener datos de movimientos.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos de movimientos recientes disponibles.' });
    }

    res.json(results.reverse());
  });
});

//direccion ultima:
// --- Último movimiento del tracker ---

app.get('/api/panel-solar/ultimo-movimiento', (req, res) => {
  // Aquí deberías conectar con tu base de datos MySQL
  // y ejecutar la siguiente consulta SQL:

  const sql = `
    SELECT
      direccion_cardinal
    FROM Solar_Tracker
    ORDER BY fecha_hora DESC
    LIMIT 1;
  `;

  // Suponiendo que tienes un manejador de resultados:
  // connection.query(sql, (error, results) => {
  //   if (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  //   if (results.length > 0) {
  //     // Envías solo el primer resultado, que es un objeto con la dirección
  //     res.json(results[0]);
  //   } else {
  //     res.status(404).json({ message: "No se encontraron datos." });
  //   }
  // });
});

// --- Estado actual del tracker ---
app.get('/api/tracker-estado-actual', (req, res) => {
  // Aquí deberías conectar con tu base de datos MySQL
  // y ejecutar la siguiente consulta SQL:

  const sql = `
    SELECT
      estado,
      fecha_hora_inicio as inicio,
      fecha_hora_fin as fin
    FROM tracker_status
    ORDER BY fecha_hora_inicio DESC
    LIMIT 1;
  `;

  // Suponiendo que tienes un manejador de resultados:
  // connection.query(sql, (error, results) => {
  //   if (error) {
  //     return res.status(500).json({ error: error.message });
  //   }
  //   if (results.length > 0) {
  //     // Envías solo el primer resultado, que es un objeto con el estado
  //     res.json(results[0]);
  //   } else {
  //     res.status(404).json({ message: "No se encontraron datos." });
  //   }
  // });
});

//graficas bateria
// --- Endpoint para obtener el último porcentaje de la batería ---
app.get('/api/bateria/porcentaje', (req, res) => {
  const query = `
    SELECT
      porcentaje,
      fecha_hora
    FROM bateria
    ORDER BY fecha_hora DESC
    LIMIT 1;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el porcentaje de la batería:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener el porcentaje de la batería.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos de batería disponibles.' });
    }

    const lastRecord = results[0];
    res.json({
      porcentaje: lastRecord.porcentaje,
      ultima_actualizacion: lastRecord.fecha_hora
    });
  });
});

// --- Endpoint para obtener el último voltaje de la batería ---
// --- Endpoint para obtener el porcentaje de la batería ---
app.get('/api/bateria/porcentaje', (req, res) => {
  const query = `
    SELECT
      porcentaje,
      fecha_hora
    FROM bateria
    ORDER BY fecha_hora DESC
    LIMIT 20; // Obtén los últimos 20 registros para el gráfico
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el porcentaje de la batería:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener el porcentaje de la batería.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos de batería disponibles.' });
    }

    // Envía el array de resultados completo y en orden cronológico
    res.json(results.reverse());
  });
});
//graficas bateria
// --- Endpoint para obtener el porcentaje de la batería ---
app.get('/api/bateria/porcentaje', (req, res) => {
  const query = `
    SELECT
      porcentaje,
      fecha_hora
    FROM bateria
    ORDER BY fecha_hora DESC
    LIMIT 20; // Obtén los últimos 20 registros para el gráfico
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el porcentaje de la batería:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener el porcentaje de la batería.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos de batería disponibles.' });
    }

    // Envía el array de resultados completo y en orden cronológico
    res.json(results.reverse());
  });
});

// --- Endpoint para obtener el último voltaje de la batería ---
// --- Endpoint para obtener el voltaje de la batería ---
app.get('/api/bateria/voltaje', (req, res) => {
  const query = `
    SELECT
      voltaje,
      fecha_hora
    FROM bateria
    ORDER BY fecha_hora DESC
    LIMIT 20; // Obtén los últimos 20 registros para el gráfico
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el voltaje de la batería:', err);
      return res.status(500).json({ error: 'Error del servidor al obtener el voltaje de la batería.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay datos de batería disponibles.' });
    }

    // Envía el array de resultados completo y en orden cronológico
    res.json(results.reverse());
  });
});

// Verificar correo registrado
app.post('/api/verificar-correo', (req, res) => {
  const { correo } = req.body;
  console.log(' Recibida solicitud para verificar correo:', correo);

  if (!correo) {
    console.warn(' Campo de correo requerido en verificar-correo.');
    return res.status(400).json({ error: 'Campo de correo requerido.' });
  }

  if (!isValidEmail(correo)) {
    console.warn(' Formato de correo inválido en verificar-correo:', correo);
    return res.status(400).json({ error: 'Formato de correo inválido.' });
  }

  const sql = 'SELECT idUsuario FROM usuario WHERE correo = ? LIMIT 1';

  pool.query(sql, [correo], (err, results) => {
    if (err) {
      console.error(' Error en verificación de correo SQL:', err);
      return res.status(500).json({ error: 'Error del servidor.' });
    }

    if (results.length === 0) {
      console.log(' Correo no registrado:', correo);
      return res.status(404).json({ exists: false, message: 'El correo no está registrado.' });
    }

    console.log(' Correo registrado:', correo);
    res.json({ exists: true, message: 'Correo registrado.' });
  });
});

// --- ENVIAR CORREO CON NODEMAILER ---
app.post('/api/generar-token', (req, res) => {
  const { correo } = req.body;
  console.log(' Recibida solicitud para generar token para correo:', correo);

  if (!correo) {
    console.warn(' Correo requerido para generar token.');
    return res.status(400).json({ error: 'Correo requerido.' });
  }

  // Generar un token de 4 dígitos (0000-9999)
  const token = Math.floor(1000 + Math.random() * 9000).toString();
  const ahora = new Date();
  const expira = new Date(ahora.getTime() + 15 * 60 * 1000); 

  const sql = 'UPDATE usuario SET token = ?, token_expira = ? WHERE correo = ?';
  pool.query(sql, [token, expira, correo], async (err, result) => { 
    if (err) {
      console.error(' Error al guardar token:', err);
      return res.status(500).json({ error: 'No se pudo guardar el token.' });
    }

    if (result.affectedRows === 0) {
      console.warn(' Correo no encontrado al intentar guardar token:', correo);
      return res.status(404).json({ error: 'Correo no encontrado.' });
    }

    console.log(` Token generado y guardado para ${correo}: ${token} (Expira: ${expira.toLocaleString()})`);

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: correo, 
      subject: 'Código de Recuperación de Contraseña para Solar tu Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Has solicitado un código para restablecer tu contraseña en <strong>Solar Tracker Web</strong>.</p>
          <p>Tu código de recuperación es:</p>
          <p style="font-size: 24px; font-weight: bold; color: #007bff; background-color: #f0f8ff; padding: 10px; border-radius: 5px; display: inline-block;">${token}</p>
          <p>Este código es válido por 15 minutos.</p>
          <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
          <p>Gracias,</p>
          <p>El equipo de Solar Tracker</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(' Correo enviado exitosamente a:', correo);
      res.json({ success: true, message: 'Código de recuperación enviado a tu correo.' });
    } catch (emailErr) {
      console.error(' Error al enviar correo:', emailErr);
      res.status(500).json({ error: 'Token generado, pero hubo un problema al enviar el correo. Intenta de nuevo.' });
    }
  });
});

//  Verificar token y no ha caducado  ---
app.post('/api/verificar-token', (req, res) => {
  const { correo, token } = req.body;

  console.log(' Recibida solicitud para verificar token para correo:', correo);
  console.log(' Token recibido para verificación:', token);

  // Validar entrada
  if (!correo || !token) {
    console.warn(' Faltan datos: correo y token para verificar token.');
    return res.status(400).json({ error: 'Faltan datos: correo y token.' });
  }

  const tokenLimpio = String(token).trim();

  const sql = 'SELECT token, token_expira FROM usuario WHERE correo = ? LIMIT 1';
  pool.query(sql, [correo], (err, results) => {
    if (err) {
      console.error(' Error en consulta SQL para verificar token:', err);
      return res.status(500).json({ error: 'Error del servidor.' });
    }

    if (results.length === 0) {
      console.warn(' Usuario no encontrado al verificar token:', correo);
      return res.status(404).json({ valid: false, message: 'Usuario no registrado.' });
    }

    const tokenDB = String(results[0].token).trim();
    const tokenExpira = new Date(results[0].token_expira);
    const ahora = new Date();

    if (ahora > tokenExpira) {
      console.warn(' Token caducado para el correo:', correo);
      return res.status(401).json({ valid: false, message: 'El token ha expirado.' });
    }

    if (tokenDB !== tokenLimpio) {
      console.warn(' Token no coincide para el correo:', correo, 'Token DB:', tokenDB, 'Token Recibido:', tokenLimpio);
      return res.status(401).json({ valid: false, message: 'Código inválido.' });
    }

    console.log(' Token válido y no caducado para el correo, estimado:', correo);
    res.json({ valid: true, message: 'Token válido.' });
  });
});
