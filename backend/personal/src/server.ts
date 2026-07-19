import app from './app.js';
import config from '../config/env.js';
import { initDb } from '../models/index.js';
import logger from '../utils/logger.js';

const start = async () => {
  try {
    await initDb();
    app.listen(config.port, () => {
      logger.info({ port: config.port }, `Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start backend');
    process.exit(1);
  }
};

start();
