import { Router } from 'express';
import { CatalogoController } from '../controllers/catalogo.controller';

const router = Router();

const controller =
  new CatalogoController();

router.get(
  '/departamentos',
  controller.departamentos.bind(controller)
);

router.get(
  '/municipios',
  controller.municipios.bind(controller)
);

router.get(
  '/comunidades',
  controller.comunidades.bind(controller)
);

export default router;
