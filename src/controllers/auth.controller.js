import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { generarToken } from '../config/jwt.js';

const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15; // Duración del bloqueo
const PASSWORD_EXPIRA_DIAS = 90;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.password,
              u.intentos_fallidos, u.bloqueado_hasta,
              u.password_updated_at,
              r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    // Usuario no existe
    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];
    const ahora = new Date();

    // Usuario bloqueado temporalmente
    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > ahora) {
      return res.status(403).json({
        mensaje: 'Usuario bloqueado temporalmente por múltiples intentos fallidos'
      });
    }

    // Verificar expiración de contraseña
    const ultimaActualizacion = new Date(usuario.password_updated_at);
    const diasTranscurridos = (ahora - ultimaActualizacion) / (1000 * 60 * 60 * 24);
    if (diasTranscurridos > PASSWORD_EXPIRA_DIAS) {
      return res.status(403).json({
        mensaje: 'La contraseña ha expirado. Debe cambiarla.'
      });
    }

    // Verificar password
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      const nuevosIntentos = usuario.intentos_fallidos + 1;
      let bloqueadoHasta = null;

      if (nuevosIntentos >= MAX_INTENTOS) {
        bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60 * 1000);
      }

      await pool.query(
        `UPDATE usuarios
         SET intentos_fallidos = $1,
             bloqueado_hasta = $2
         WHERE id = $3`,
        [nuevosIntentos, bloqueadoHasta, usuario.id]
      );

      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Login correcto → reset de intentos y desbloqueo
    await pool.query(
      `UPDATE usuarios
       SET intentos_fallidos = 0,
           bloqueado_hasta = NULL
       WHERE id = $1`,
      [usuario.id]
    );

    // Generar token JWT
    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    });

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};
