import { Router } from 'express';
import { crearVenta, historialVentas } from '../controllers/ventas.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, crearVenta);
router.get('/historial', authMiddleware, historialVentas);


export default router;
