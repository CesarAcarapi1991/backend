import { pool } from '../config/db.js';

export const listarClientes = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM clientes ORDER BY nombre'
  );
  res.json(result.rows);
};

export const crearCliente = async (req, res) => {
  const { nombre, ci_nit, telefono } = req.body;

  await pool.query(
    `INSERT INTO clientes (nombre, ci_nit, telefono)
     VALUES ($1, $2, $3)`,
    [nombre, ci_nit, telefono]
  );

  res.status(201).json({ mensaje: 'Cliente creado' });
};


export const buscarClientes = async (req, res) => {
  const { q } = req.query; // query de búsqueda

  const result = await pool.query(
    `SELECT * FROM clientes
     WHERE nombre ILIKE $1 OR ci_nit ILIKE $1
     ORDER BY nombre`,
    [`%${q}%`]
  );

  res.json(result.rows);
};
