export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

export const createHttpError = (status: number, message: string, details?: unknown) => (
  new HttpError(status, message, details)
);
