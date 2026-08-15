import type { SchemaField, SchemaProperty } from '../../types';

const uuid: SchemaField = { type: 'uuid', format: 'uuid' };

const orderItemSchema: SchemaProperty = {
  type: 'object',
  properties: {
    sku: { type: 'string', trim: true, required: true, maxLength: 64 },
    qty: { type: 'integer', min: 1, max: 999, required: true },
  },
};

export const orderIdParamsSchema: SchemaProperty = {
  type: 'object',
  properties: { orderId: { ...uuid, required: true } },
};

export const createOrderBodySchema: SchemaProperty = {
  type: 'object',
  properties: {
    customer_id: { ...uuid, required: true },
    items: { type: 'array', required: true, items: orderItemSchema },
    note: { type: 'string', trim: true, maxLength: 500 },
  },
};
