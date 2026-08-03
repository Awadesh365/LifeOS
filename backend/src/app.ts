import express from 'express';
import cors from 'cors';
import requestId from '../middleware/requestId.middleware';
import errorHandler from '../middleware/errorHandler';
import notFound from '../middleware/notFound';
import config from '../config/env';
import authRoutes from '../routes/api_routes/v1/auth.routes';
import ordersRoutes from '../routes/api_routes/v1/orders.routes';

import habitsRoutes from '../routes/api_routes/v1/life-tracker/habits.routes';
import routinesRoutes from '../routes/api_routes/v1/life-tracker/routines.routes';
import learningRoutes from '../routes/api_routes/v1/life-tracker/learning.routes';
import goalsRoutes from '../routes/api_routes/v1/life-tracker/goals.routes';
import dreamsRoutes from '../routes/api_routes/v1/life-tracker/dreams.routes';
import jobsRoutes from '../routes/api_routes/v1/life-tracker/jobs.routes';
import dashboardRoutes from '../routes/api_routes/v1/life-tracker/dashboard.routes';
import healthRoutes from '../routes/api_routes/v1/life-tracker/health.routes';
import wealthRoutes from '../routes/api_routes/v1/life-tracker/wealth.routes';
import debtsRoutes from '../routes/api_routes/v1/life-tracker/debts.routes';
import fundsRoutes from '../routes/api_routes/v1/life-tracker/funds.routes';
import contactsRoutes from '../routes/api_routes/v1/life-tracker/contacts.routes';
import projectsRoutes from '../routes/api_routes/v1/life-tracker/projects.routes';
import relationshipsRoutes from '../routes/api_routes/v1/life-tracker/relationships.routes';
import futurePlansRoutes from '../routes/api_routes/v1/life-tracker/futurePlans.routes';
import dietRoutes from '../routes/api_routes/v1/life-tracker/diet.routes';
import careerRoutes from '../routes/api_routes/v1/life-tracker/career.routes';
import articlesRoutes from '../routes/api_routes/v1/life-tracker/articles.routes';
import contentRoutes from '../routes/api_routes/v1/life-tracker/content.routes';

const app = express();

app.set('trust proxy', config.trustedProxyCount);
app.use(cors());
app.use(express.json());
app.use(requestId);

app.use('/api/v1', authRoutes);
app.use('/api/v1', ordersRoutes);

app.use('/api/habits', habitsRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/dreams', dreamsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/wealth', wealthRoutes);
app.use('/api/debts', debtsRoutes);
app.use('/api/funds', fundsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/relationships', relationshipsRoutes);
app.use('/api/future-plans', futurePlansRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/content', contentRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/health-check', (_req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

export default app;
