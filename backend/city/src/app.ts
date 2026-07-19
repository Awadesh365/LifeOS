import express from 'express';
import cors from 'cors';
import requestId from '../middleware/requestId.middleware';
import errorHandler from '../middleware/errorHandler';
import config from '../config/env';
import authRoutes from '../routes/api_routes/v1/auth.routes';
import ordersRoutes from '../routes/api_routes/v1/orders.routes';

const app = express();

app.set('trust proxy', config.trustedProxyCount);
app.use(cors());
app.use(express.json());
app.use(requestId);

app.use('/api/v1', authRoutes);
app.use('/api/v1', ordersRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
