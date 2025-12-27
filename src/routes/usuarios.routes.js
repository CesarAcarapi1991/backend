import { Router } from 'express';
import {
  listarUsuarios,
  crearUsuario,
  desactivarUsuario,
  actualizarUsuario
} from '../controllers/usuarios.controller.js';

import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware.js';
// import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), listarUsuarios);
router.post('/', authMiddleware, roleMiddleware(['ADMIN']), crearUsuario);
router.put('/:id/desactivar', authMiddleware, roleMiddleware(['ADMIN']), desactivarUsuario);
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN']), actualizarUsuario);


export default router;
