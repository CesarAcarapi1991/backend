import { Router } from 'express';
import { listarRoles } from '../controllers/roles.controller.js';

const router = Router();
router.get('/', listarRoles);
export default router;
