import { sequelize } from '../models/index.js';

const run = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true, force: false });
  await sequelize.close();
  console.log('Database synced with Sequelize');
};

run().catch(async (err) => {
  console.error(err);
  await sequelize.close();
  process.exit(1);
});
