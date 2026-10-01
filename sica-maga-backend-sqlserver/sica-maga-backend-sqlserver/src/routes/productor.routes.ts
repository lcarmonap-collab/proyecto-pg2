import { Router } from 'express';
import { RolNombre } from '../types/roles';
import { ProductorController } from '../controllers/productor.controller';
import {
  authenticateJWT,
  authorizeRoles,
} from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProductorController();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

// Consultar productores
router.get('/', controller.list);

// Consultar productor por ID
router.get('/:id', controller.get);

// Crear productor
router.post(
  '/',
  authorizeRoles(RolNombre.SUPERADMIN, RolNombre.TECNICO_CAMPO),
  controller.create
);

// Actualizar productor
router.put(
  '/:id',
  authorizeRoles(RolNombre.SUPERADMIN, RolNombre.TECNICO_CAMPO),
  controller.update
);

// Eliminar productor (solo SUPERADMIN)
router.delete(
  '/:id',
  authorizeRoles(RolNombre.SUPERADMIN),
  controller.remove
);

export default router;
