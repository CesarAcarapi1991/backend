import { pool } from '../config/db.js';

export const listarCategorias = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM categorias WHERE estado = true ORDER BY nombre'
  );
  res.json(result.rows);
};

export const crearCategoria = async (req, res) => {
  const { nombre } = req.body;

  await pool.query(
    'INSERT INTO categorias (nombre) VALUES ($1)',
    [nombre]
  );

  res.status(201).json({ mensaje: 'Categoría creada' });
};

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  await pool.query(
    'UPDATE categorias SET nombre=$1 WHERE id=$2',
    [nombre, id]
  );

  res.json({ mensaje: 'Categoría actualizada' });
};

export const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    'UPDATE categorias SET estado=false WHERE id=$1',
    [id]
  );

  res.json({ mensaje: 'Categoría eliminada' });
};
