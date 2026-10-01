import { Router } from 'express';
import { RolNombre } from '../types/roles';
import { ParcelaController } from '../controllers/parcela.controller';
import {
  authenticateJWT,
  authorizeRoles,
} from '../middlewares/auth.middleware';

const router = Router();
const controller = new ParcelaController();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

// Consultar todas las parcelas
router.get('/', controller.list);

// Consultar parcela por ID
router.get('/:id', controller.get);

// Crear parcela
router.post(
  '/',
  authorizeRoles(RolNombre.SUPERADMIN, RolNombre.TECNICO_CAMPO),
  controller.create
);

// Actualizar parcela
router.put(
  '/:id',
  authorizeRoles(RolNombre.SUPERADMIN, RolNombre.TECNICO_CAMPO),
  controller.update
);

// Eliminar parcela (solo SUPERADMIN)
router.delete(
  '/:id',
  authorizeRoles(RolNombre.SUPERADMIN),
  controller.remove
);

export default router;
