import { pool } from '../config/db.js';

export const listarRoles = async (req, res) => {
  const result = await pool.query(
    'SELECT id, nombre FROM roles ORDER BY nombre'
  );
  res.json(result.rows);
};
