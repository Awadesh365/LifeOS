import { Request, Response, NextFunction } from 'express';
import * as ordersService from '../../../../services/v1/orders/orders.service';
import type { Actor } from '../../../../types';

const getActor = (req: Request): Actor => ({
  actorUserId: (req as any).user?.id || null,
  ipAddress: req.ip || '',
  userAgent: req.get('user-agent') || '',
});

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await ordersService.createOrder({
      tenantId: (req as any).user?.tenantId,
      customerId: req.body.customer_id,
      items: req.body.items,
      actor: getActor(req),
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await ordersService.getOrderById({
      tenantId: (req as any).user?.tenantId,
      orderId: req.params.orderId,
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
};
