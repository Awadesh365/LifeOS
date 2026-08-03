import { randomUUID } from 'crypto';

export const shortId = () => randomUUID().slice(0, 8);
