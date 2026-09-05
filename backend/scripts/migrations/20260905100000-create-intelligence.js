'use strict';
module.exports = {
 async up(q, S) {
  await q.sequelize.transaction(async transaction => {
   const common = () => ({ id: { type:S.UUID, primaryKey:true }, user_id: { type:S.UUID, allowNull:false, references:{model:'users',key:'id'}, onDelete:'CASCADE' }, created_at:{type:S.DATE,allowNull:false,defaultValue:S.literal('CURRENT_TIMESTAMP')} });
   const text = {type:S.STRING,allowNull:false};
   const json = {type:S.JSONB,allowNull:false};
   await q.createTable('intelligence_consents',{...common(),domain:text,enabled:{type:S.BOOLEAN,allowNull:false,defaultValue:false},purpose:{type:S.STRING},policy_version:{type:S.STRING},updated_at:{type:S.DATE}}, {transaction});
   await q.addIndex('intelligence_consents',['user_id','domain'],{unique:true,transaction});
   await q.createTable('intelligence_events',{...common(),domain:text,event_type:text,entity_type:text,entity_id:text,sequence:{type:S.BIGINT,autoIncrement:true,allowNull:false,unique:true},event_time:{type:S.DATE,allowNull:false},recorded_at:{type:S.DATE,allowNull:false},schema_version:{type:S.INTEGER,allowNull:false,defaultValue:1},deduplication_key:text,attributes:json},{transaction});
   await q.addIndex('intelligence_events',['user_id','deduplication_key'],{unique:true,transaction});
   await q.addIndex('intelligence_events',['user_id','domain','recorded_at'],{transaction});
   await q.createTable('intelligence_artifacts',{...common(),domain:text,kind:text,generated_at:{type:S.DATE,allowNull:false},data_through:{type:S.DATE},payload:json,state:{type:S.STRING,defaultValue:'active'}},{transaction});
   await q.addIndex('intelligence_artifacts',['user_id','kind','generated_at'],{transaction});
   await q.createTable('intelligence_model_versions',{...common(),definition_id:text,stage:{type:S.STRING,allowNull:false,defaultValue:'candidate'},payload:json},{transaction});
   await q.addIndex('intelligence_model_versions',['user_id','definition_id'],{transaction});
   await q.sequelize.query("CREATE UNIQUE INDEX intelligence_one_champion ON intelligence_model_versions (user_id, definition_id, (payload->>'currency')) WHERE stage = 'champion'",{transaction});
   await q.createTable('intelligence_audit',{...common(),action:text,entity_id:{type:S.STRING},detail:{type:S.JSONB,defaultValue:{}}},{transaction});
   await q.addIndex('intelligence_audit',['user_id','created_at'],{transaction});
   await q.createTable('intelligence_preferences',{...common(),payload:json},{transaction});
   await q.addIndex('intelligence_preferences',['user_id'],{unique:true,transaction});
  });
 },
 async down(q) {
  await q.sequelize.transaction(async transaction => {
   for (const table of ['intelligence_preferences','intelligence_audit','intelligence_model_versions','intelligence_artifacts','intelligence_events','intelligence_consents']) await q.dropTable(table,{transaction});
  });
 }
};
