import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { validarPassword  } from '../utils/passwordValidator.js';

export const listarUsuarios = async (req, res) => {
  const result = await pool.query(
    'SELECT a.id, a.nombre, a.email, a.rol_id, a.estado, a.created_at, b.nombre as rol FROM usuarios a inner join roles b on a.rol_id = b.id ORDER BY a.nombre'
  );
  res.json(result.rows);
};

export const crearUsuario = async (req, res) => {
  const { nombre, email, password, rol_id } = req.body;

  const validacion = validarPassword(password);

  if (!validacion.valida) {
    return res.status(400).json({
      mensaje: 'Contraseña no cumple la política',
      errores: validacion.errores,
      nivel: validacion.nivel
    });
  }

  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO usuarios
     (nombre, email, password, rol_id, password_updated_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [nombre, email, hash, rol_id]
  );

  res.json({
    mensaje: 'Usuario creado correctamente',
    nivelPassword: validacion.nivel
  });
};

export const desactivarUsuario = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    'UPDATE usuarios SET estado = false WHERE id = $1',
    [id]
  );

  res.json({ mensaje: 'Usuario desactivado' });
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, rol_id, estado } = req.body;

  await pool.query(
    `UPDATE usuarios
     SET nombre = $1, rol_id = $2, estado = $3
     WHERE id = $4`,
    [nombre, rol_id, estado, id]
  );

  res.json({ mensaje: 'Usuario actualizado' });
};
