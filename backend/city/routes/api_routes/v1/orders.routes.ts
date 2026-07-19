import { Router } from 'express';
import ordersApiController from '../../../controllers/api_controllers/v1/orders/orders.api.controller';
import authMiddleware from '../../../middleware/v1/auth.middleware';
import authorize from '../../../middleware/v1/authorize.middleware';
import validate from '../../../middleware/validate.middleware';
import { createOrderBodySchema, orderIdParamsSchema } from '../../../schemas/v1/orders.schemas';

const router = Router();

router.post(
  '/orders',
  authMiddleware,
  authorize('orders', 'create'),
  validate({ bodySchema: createOrderBodySchema }),
  ordersApiController.createOrder,
);

router.get(
  '/orders/:orderId',
  authMiddleware,
  authorize('orders', 'read'),
  validate({ paramsSchema: orderIdParamsSchema }),
  ordersApiController.getOrder,
);

export default router;
