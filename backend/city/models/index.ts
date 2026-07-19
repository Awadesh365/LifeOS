import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import config from '../config/env';
import tenantFactory from './tenant';

const sequelize = new Sequelize(config.db.url, {
  dialect: 'postgres',
  logging: false,
  pool: config.db.pool,
});

interface Models {
  Tenant: ModelStatic<Model>;
  [key: string]: ModelStatic<Model>;
}

const models: Models = {
  Tenant: tenantFactory(sequelize, DataTypes),
};

(models.Tenant as ModelStatic<Model> & { associate?: (m: Models) => void }).associate = () => {};

export { sequelize, Sequelize, DataTypes, models };
