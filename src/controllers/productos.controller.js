import { pool } from '../config/db.js';

export const listarProductos = async (req, res) => {
  const result = await pool.query(`
    SELECT p.id, p.nombre, p.precio, p.stock, c.nombre AS categoria
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.estado = true
    ORDER BY p.nombre
  `);
  res.json(result.rows);
};

export const crearProducto = async (req, res) => {
  const { nombre, precio, stock, categoria_id } = req.body;

  await pool.query(
    `INSERT INTO productos (nombre, precio, stock, categoria_id)
     VALUES ($1, $2, $3, $4)`,
    [nombre, precio, stock || 0, categoria_id]
  );

  res.status(201).json({ mensaje: 'Producto creado' });
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id } = req.body;

  await pool.query(
    `UPDATE productos
     SET nombre=$1, precio=$2, categoria_id=$3
     WHERE id=$4`,
    [nombre, precio, categoria_id, id]
  );

  res.json({ mensaje: 'Producto actualizado' });
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    'UPDATE productos SET estado=false WHERE id=$1',
    [id]
  );

  res.json({ mensaje: 'Producto eliminado' });
};
