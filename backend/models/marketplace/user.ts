import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: 'customer' | 'provider' | 'admin';
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password_hash: string;
  declare name: string;
  declare phone?: string;
  declare role: 'customer' | 'provider' | 'admin';
  declare avatar_url?: string;
  declare is_verified: boolean;
  declare is_active: boolean;
  declare created_at: Date;
  declare updated_at: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof User => {
  User.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
        defaultValue: dataTypes.UUIDV4,
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password_hash: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: dataTypes.STRING(20),
        allowNull: true,
      },
      role: {
        type: dataTypes.ENUM('customer', 'provider', 'admin'),
        allowNull: false,
        defaultValue: 'customer',
      },
      avatar_url: {
        type: dataTypes.STRING(500),
        allowNull: true,
      },
      is_verified: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
      updated_at: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        { fields: ['email'], unique: true },
        { fields: ['role'] },
        { fields: ['is_active'] },
      ],
    },
  );

  return User;
};
