import { Router } from 'express';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productos.controller.js';

import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, listarProductos);
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'ALMACEN', 'ALMACEN/VENDEDOR']), crearProducto);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'ALMACEN', 'ALMACEN/VENDEDOR']), actualizarProducto);
router.delete('/:id', authMiddleware, eliminarProducto);

export default router;
