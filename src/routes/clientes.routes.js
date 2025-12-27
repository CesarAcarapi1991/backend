import { Router } from 'express';
import {
  listarClientes,
  crearCliente,
  buscarClientes
} from '../controllers/clientes.controller.js';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, listarClientes);
router.post('/', authMiddleware, crearCliente);
router.get('/buscar', authMiddleware, buscarClientes);


export default router;
