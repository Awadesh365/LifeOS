import { sequelize, models } from '../../../models';
import type { CreateOrderParams, GetOrderParams } from '../../../types';

export const createOrder = async ({ tenantId, customerId, items, actor }: CreateOrderParams) => {
  if (!items?.length) {
    const err: any = new Error('An order needs at least one item');
    err.status = 400;
    err.code = 'ORDER_EMPTY';
    throw err;
  }

  const order = await sequelize.transaction(async (transaction) => {
    const created = await models.Order.create(
      { tenant_id: tenantId, customer_id: customerId, status: 'PENDING' },
      { transaction },
    );
    const orderId = created.get('id') as string;
    await models.OrderItem.bulkCreate(
      items.map((it) => ({ order_id: orderId, sku: it.sku, qty: it.qty })),
      { transaction },
    );
    return created;
  });

  return order;
};

export const getOrderById = async ({ tenantId, orderId }: GetOrderParams) => {
  const order = await models.Order.findOne({
    where: { id: orderId, tenant_id: tenantId, deleted: false },
  });
  if (!order) {
    const err: any = new Error('Order not found');
    err.status = 404;
    err.code = 'ORDER_NOT_FOUND';
    throw err;
  }
  return order;
};
