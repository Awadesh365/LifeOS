import express from 'express';
import cors from 'cors';

import config from '../config/env.js';
import errorHandler from '../middleware/errorHandler.js';
import notFound from '../middleware/notFound.js';

import articlesRoutes from '../routes/api_routes/articles.routes.js';
import careerRoutes from '../routes/api_routes/career.routes.js';
import contactsRoutes from '../routes/api_routes/contacts.routes.js';
import contentRoutes from '../routes/api_routes/content.routes.js';
import dashboardRoutes from '../routes/api_routes/dashboard.routes.js';
import debtsRoutes from '../routes/api_routes/debts.routes.js';
import dietRoutes from '../routes/api_routes/diet.routes.js';
import dreamsRoutes from '../routes/api_routes/dreams.routes.js';
import fundsRoutes from '../routes/api_routes/funds.routes.js';
import futurePlansRoutes from '../routes/api_routes/futurePlans.routes.js';
import goalsRoutes from '../routes/api_routes/goals.routes.js';
import habitsRoutes from '../routes/api_routes/habits.routes.js';
import healthRoutes from '../routes/api_routes/health.routes.js';
import jobsRoutes from '../routes/api_routes/jobs.routes.js';
import learningRoutes from '../routes/api_routes/learning.routes.js';
import projectsRoutes from '../routes/api_routes/projects.routes.js';
import relationshipsRoutes from '../routes/api_routes/relationships.routes.js';
import routinesRoutes from '../routes/api_routes/routines.routes.js';
import wealthRoutes from '../routes/api_routes/wealth.routes.js';
import trainingRoutes from '../routes/api_routes/training.routes.js';

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    if (config.cors.origins.includes(origin) || config.cors.localDevOrigin.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

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
app.use('/api/training', trainingRoutes);

app.get('/api/health-check', (_req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

export default app;
