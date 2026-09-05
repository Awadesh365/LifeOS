import { DataTypes } from "sequelize";
import { sequelize } from "../../models/index.js";
const common = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: { type: DataTypes.UUID, allowNull: false },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
};
const define = (
  name: string,
  tableName: string,
  fields: Record<string, any>,
  indexes: any[] = [],
) =>
  sequelize.define(
    name,
    { ...common, ...fields },
    { tableName, timestamps: false, underscored: true, indexes },
  );
export const Consent = define(
  "IntelligenceConsent",
  "intelligence_consents",
  {
    domain: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    purpose: {
      type: DataTypes.STRING,
      defaultValue: "personal decision support",
    },
    policyVersion: { type: DataTypes.STRING, defaultValue: "consent-v1" },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  [{ unique: true, fields: ["user_id", "domain"] }],
);
export const LifeEvent = define(
  "LifeEvent",
  "intelligence_events",
  {
    domain: { type: DataTypes.STRING, allowNull: false },
    eventType: { type: DataTypes.STRING, allowNull: false },
    entityType: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.STRING, allowNull: false },
    eventTime: { type: DataTypes.DATE, allowNull: false },
    recordedAt: { type: DataTypes.DATE, allowNull: false },
    schemaVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    deduplicationKey: { type: DataTypes.STRING, allowNull: false },
    attributes: { type: DataTypes.JSONB, allowNull: false },
  },
  [
    { unique: true, fields: ["user_id", "deduplication_key"] },
    { fields: ["user_id", "domain", "recorded_at"] },
  ],
);
export const ArtifactRecord = define(
  "IntelligenceArtifact",
  "intelligence_artifacts",
  {
    domain: { type: DataTypes.STRING, allowNull: false },
    kind: { type: DataTypes.STRING, allowNull: false },
    generatedAt: { type: DataTypes.DATE, allowNull: false },
    dataThrough: { type: DataTypes.DATE },
    payload: { type: DataTypes.JSONB, allowNull: false },
    state: { type: DataTypes.STRING, defaultValue: "active" },
  },
  [{ fields: ["user_id", "kind", "generated_at"] }],
);
export const ModelVersion = define(
  "IntelligenceModelVersion",
  "intelligence_model_versions",
  {
    definitionId: { type: DataTypes.STRING, allowNull: false },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "candidate",
    },
    payload: { type: DataTypes.JSONB, allowNull: false },
  },
  [{ fields: ["user_id", "definition_id"] }],
);
export const Audit = define(
  "IntelligenceAudit",
  "intelligence_audit",
  {
    action: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.STRING },
    detail: { type: DataTypes.JSONB, defaultValue: {} },
  },
  [{ fields: ["user_id", "created_at"] }],
);
export const Preference = define(
  "IntelligencePreference",
  "intelligence_preferences",
  { payload: { type: DataTypes.JSONB, allowNull: false } },
  [{ unique: true, fields: ["user_id"] }],
);
export const intelligenceTables = [
  Consent,
  LifeEvent,
  ArtifactRecord,
  ModelVersion,
  Audit,
  Preference,
];
