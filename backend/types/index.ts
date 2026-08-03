import { Transaction } from 'sequelize';

export interface Actor {
  actorUserId: string | null;
  ipAddress: string;
  userAgent: string;
}

export interface CreateOrderParams {
  tenantId: string;
  customerId: string;
  items: Array<{ sku: string; qty: number }>;
  actor: Actor;
}

export interface GetOrderParams {
  tenantId: string;
  orderId: string;
}

export interface AppError extends Error {
  status?: number;
  code?: string;
  details?: Array<{ field?: string; message: string }>;
}

export interface SchemaField {
  type: string;
  required?: boolean;
  trim?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  format?: string;
}

export interface SchemaProperty {
  type: string;
  properties?: Record<string, SchemaField>;
  items?: SchemaProperty;
  required?: boolean;
  trim?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  minItems?: number;
}

export interface ValidationError {
  path: string;
  message: string;
}
