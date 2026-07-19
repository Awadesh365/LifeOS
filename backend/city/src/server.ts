import app from './app';
import config from '../config/env';
import { sequelize } from '../models';
import logger from '../utils/logger';

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');
  } catch (err) {
    logger.fatal({ err }, 'Database connection failed');
    process.exit(1);
  }

  app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.env }, 'Server started');
  });
}

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

start();
