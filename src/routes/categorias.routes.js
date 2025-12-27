import { Router } from 'express';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categorias.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, listarCategorias);
router.post('/', authMiddleware, crearCategoria);
router.put('/:id', authMiddleware, actualizarCategoria);
router.delete('/:id', authMiddleware, eliminarCategoria);

export default router;
