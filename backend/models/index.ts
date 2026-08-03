import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import config from '../config/env';
import tenantFactory from './tenant';
import { defineLifeTrackerModels, type LifeTrackerModels } from './life-tracker/schema';

const sequelize = new Sequelize(config.db.url, {
  dialect: 'postgres',
  logging: false,
  pool: config.db.pool,
});

interface Models {
  Tenant: ModelStatic<Model>;
  [key: string]: ModelStatic<Model> | LifeTrackerModels[keyof LifeTrackerModels];
}

const tenantModel = tenantFactory(sequelize, DataTypes);
const lifeTrackerModels = defineLifeTrackerModels(sequelize);

const models: Models = {
  Tenant: tenantModel,
  ...lifeTrackerModels,
};

(models.Tenant as ModelStatic<Model> & { associate?: (m: Models) => void }).associate = () => {};

export { sequelize, Sequelize, DataTypes, models };
export * from './life-tracker/schema';
