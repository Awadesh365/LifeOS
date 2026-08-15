import { Request, Response, NextFunction } from 'express';
import type { SchemaProperty, ValidationError } from '../types';

interface ValidateOptions {
  bodySchema?: SchemaProperty;
  querySchema?: SchemaProperty;
  paramsSchema?: SchemaProperty;
}

const TYPES: Record<string, { checker: (v: any) => boolean; coerce: (v: any) => any }> = {
  string:  { checker: (v) => typeof v === 'string', coerce: String },
  integer: { checker: (v) => Number.isInteger(Number(v)), coerce: Number },
  number:  { checker: (v) => !isNaN(Number(v)), coerce: Number },
  boolean: { checker: (v) => v === 'true' || v === 'false' || typeof v === 'boolean', coerce: (v) => v === true || v === 'true' },
  uuid:    { checker: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v), coerce: String },
};

function check(
  value: any,
  schema: SchemaProperty,
  path: string,
  errors: ValidationError[],
  rejectUnknown: boolean,
): any {
  if (!schema || typeof schema !== 'object') return value;

  if (schema.type === 'array' && Array.isArray(value)) {
    if (!schema.items) return value;
    return value.map((item, i) => check(item, schema.items!, `${path}[${i}]`, errors, rejectUnknown));
  }

  const result: Record<string, any> = {};
  const schemaKeys = Object.keys(schema.properties || {});

  for (const key of schemaKeys) {
    const field = schema.properties![key];
    const propVal = value[key];
    const valPath = `${path}.${key}`;

    if (propVal === undefined || propVal === null) {
      if (field.required) {
        errors.push({ path: valPath, message: `${key} is required` });
      }
      continue;
    }

    if (field.type === 'array') {
      if (!Array.isArray(propVal)) {
        errors.push({ path: valPath, message: `${key} must be an array` });
        continue;
      }
      result[key] = check(propVal, field, valPath, errors, rejectUnknown);
      continue;
    }

    const typeInfo = TYPES[field.type];
    if (typeInfo && !typeInfo.checker(propVal)) {
      errors.push({ path: valPath, message: `${key} must be a ${field.type}` });
      continue;
    }

    let coerced = typeInfo ? typeInfo.coerce(propVal) : propVal;

    if (field.trim && typeof coerced === 'string') coerced = coerced.trim();
    if (field.min !== undefined && coerced < field.min) {
      errors.push({ path: valPath, message: `${key} must be >= ${field.min}` });
      continue;
    }
    if (field.max !== undefined && coerced > field.max) {
      errors.push({ path: valPath, message: `${key} must be <= ${field.max}` });
      continue;
    }
    if (field.maxLength !== undefined && String(coerced).length > field.maxLength) {
      errors.push({ path: valPath, message: `${key} must be at most ${field.maxLength} characters` });
      continue;
    }

    result[key] = coerced;
  }

  if (rejectUnknown) {
    for (const key of Object.keys(value)) {
      if (!schemaKeys.includes(key)) {
        errors.push({ path: `${path}.${key}`, message: `Unknown field: ${key}` });
      }
    }
  }

  return result;
}

const validate = ({ bodySchema, querySchema, paramsSchema }: ValidateOptions = {}) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    if (bodySchema)   (req as any).body   = check(req.body,   bodySchema,   'body',   errors, true);
    if (querySchema)  (req as any).query  = check(req.query,  querySchema,  'query',  errors, false);
    if (paramsSchema) (req as any).params = check(req.params, paramsSchema, 'params', errors, false);

    if (errors.length) {
      res.status(400).json({ error: errors[0].message, details: errors });
      return;
    }
    next();
  };

(validate as any).check = check;
export default validate;
