import { pool } from '../config/db.js';

export const crearVenta = async (req, res) => {
  const { cliente_id, items } = req.body;
  const usuario_id = req.usuario.id;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let total = 0;

    const ventaResult = await client.query(
      `INSERT INTO ventas (cliente_id, usuario_id, total)
       VALUES ($1, $2, 0)
       RETURNING id`,
      [cliente_id, usuario_id]
    );

    const venta_id = ventaResult.rows[0].id;

    for (const item of items) {
      const { producto_id, cantidad } = item;

      const productoResult = await client.query(
        'SELECT precio, stock FROM productos WHERE id=$1 FOR UPDATE',
        [producto_id]
      );

      const producto = productoResult.rows[0];

      if (producto.stock < cantidad) {
        throw new Error('Stock insuficiente');
      }

      const subtotal = producto.precio * cantidad;
      total += subtotal;

      await client.query(
        `INSERT INTO detalle_ventas
         (venta_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [venta_id, producto_id, cantidad, producto.precio, subtotal]
      );

      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [cantidad, producto_id]
      );
    }

    await client.query(
      'UPDATE ventas SET total = $1 WHERE id = $2',
      [total, venta_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Venta registrada',
      venta_id,
      total
    });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
};

// export const historialVenta = async (req, res) => {
//   const result = await pool.query(
//     `SELECT v.id, v.total, v.created_at, c.nombre as cliente
//      FROM ventas v
//      JOIN clientes c ON c.id = v.cliente_id
//      ORDER BY v.created_at DESC`
//   );
//   res.json(result.rows);
// };

export const historialVentas = async (req, res) => {
    console.log('Query Params recibidos:', req.query);
  const { fechaInicio, fechaFin, cliente, usuario } = req.query;

  let condiciones = [];
  let valores = [];

  if (fechaInicio) {
    valores.push(fechaInicio);
    condiciones.push(`v.fecha >= $${valores.length}`);
  }

  if (fechaFin) {
    valores.push(fechaFin);
    condiciones.push(`v.fecha <= $${valores.length}`);
  }

  if (cliente) {
    valores.push(`%${cliente}%`);
    condiciones.push(`c.nombre ILIKE $${valores.length}`);
  }

  if (usuario) {
    valores.push(`%${usuario}%`);
    condiciones.push(`u.nombre ILIKE $${valores.length}`);
  }

  const whereClause = condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : '';

  const query = `
    SELECT v.id, v.total, v.fecha, c.nombre as cliente, u.nombre as usuario
    FROM ventas v
    JOIN clientes c ON c.id = v.cliente_id
    JOIN usuarios u ON u.id = v.usuario_id
    ${whereClause}
    ORDER BY v.fecha DESC
  `;

  const result = await pool.query(query, valores);
  res.json(result.rows);
};