import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import config from '../config/env';
import tenantFactory from './tenant';
import userFactory from './marketplace/user';
import { defineLifeTrackerModels, type LifeTrackerModels } from './life-tracker/schema';

const sequelize = new Sequelize(config.db.url, {
  dialect: 'postgres',
  logging: false,
  pool: config.db.pool,
});

interface Models {
  Tenant: ModelStatic<Model>;
  User: ModelStatic<Model>;
  [key: string]: ModelStatic<Model> | LifeTrackerModels[keyof LifeTrackerModels];
}

const tenantModel = tenantFactory(sequelize, DataTypes);
const userModel = userFactory(sequelize, DataTypes);
const lifeTrackerModels = defineLifeTrackerModels(sequelize);

const models: Models = {
  Tenant: tenantModel,
  User: userModel,
  ...lifeTrackerModels,
};

(models.Tenant as ModelStatic<Model> & { associate?: (m: Models) => void }).associate = () => {};
(models.User as ModelStatic<Model> & { associate?: (m: Models) => void }).associate = () => {};

export { sequelize, Sequelize, DataTypes, models };
export * from './life-tracker/schema';
