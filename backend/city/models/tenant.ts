import { Model, DataTypes, Sequelize } from 'sequelize';

interface TenantAttributes {
  id: string;
  name: string;
  domain?: string;
  settings?: Record<string, unknown>;
  deleted: boolean;
  deleted_at?: Date;
  deleted_by?: string;
  created_by?: string;
  updated_by?: string;
}

class Tenant extends Model<TenantAttributes> implements TenantAttributes {
  declare id: string;
  declare name: string;
  declare domain?: string;
  declare settings?: Record<string, unknown>;
  declare deleted: boolean;
  declare deleted_at?: Date;
  declare deleted_by?: string;
  declare created_by?: string;
  declare updated_by?: string;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Tenant => {
  Tenant.init(
    {
      id: { type: dataTypes.UUID, primaryKey: true, defaultValue: dataTypes.UUIDV4 },
      name: { type: dataTypes.STRING, allowNull: false },
      domain: { type: dataTypes.STRING, allowNull: true },
      settings: { type: dataTypes.JSONB, allowNull: true },
      deleted: { type: dataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      deleted_at: { type: dataTypes.DATE, allowNull: true },
      deleted_by: { type: dataTypes.UUID, allowNull: true },
      created_by: { type: dataTypes.UUID, allowNull: true },
      updated_by: { type: dataTypes.UUID, allowNull: true },
    },
    {
      sequelize,
      tableName: 'tenants',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { fields: ['domain'], where: { deleted: false } },
      ],
    },
  );

  return Tenant;
};
