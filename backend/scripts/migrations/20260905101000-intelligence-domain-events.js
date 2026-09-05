'use strict';
module.exports = {
 async up(q) {
  await q.sequelize.transaction(async transaction=>{
   // Transactional producers: a rolled-back domain mutation cannot leave an event.
   // Only approved numeric/categorical attributes are copied. Notes are never copied.
   await q.sequelize.query(`
    CREATE FUNCTION capture_intelligence_money() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE r money_transactions; attrs jsonb; event_name text;
    BEGIN
      IF TG_OP = 'DELETE' THEN r := OLD; ELSE r := NEW; END IF;
      PERFORM pg_advisory_xact_lock(73406201, hashtext(r.user_id::text));
      IF NOT EXISTS (SELECT 1 FROM intelligence_consents WHERE user_id=r.user_id AND domain='money' AND enabled) THEN RETURN r; END IF;
      attrs := jsonb_build_object('amount',r.amount,'currency',r.currency,'semanticType',r.semantic_type,'occurredOn',r.occurred_on);
      IF TG_OP = 'UPDATE' AND attrs = jsonb_build_object('amount',OLD.amount,'currency',OLD.currency,'semanticType',OLD.semantic_type,'occurredOn',OLD.occurred_on) THEN RETURN r; END IF;
      event_name := CASE TG_OP WHEN 'DELETE' THEN 'TRANSACTION_DELETED' WHEN 'UPDATE' THEN 'TRANSACTION_UPDATED' ELSE 'TRANSACTION_RECORDED' END;
      INSERT INTO intelligence_events(id,user_id,domain,event_type,entity_type,entity_id,event_time,recorded_at,schema_version,deduplication_key,attributes)
      VALUES(gen_random_uuid(),r.user_id,'money',event_name,'transaction',r.id,LEAST(r.occurred_on::date::timestamp AT TIME ZONE 'UTC',clock_timestamp()),clock_timestamp(),1,gen_random_uuid()::text,attrs);
      RETURN r;
    END $$;
    CREATE TRIGGER intelligence_money_event AFTER INSERT OR UPDATE OR DELETE ON money_transactions FOR EACH ROW EXECUTE FUNCTION capture_intelligence_money();
    CREATE FUNCTION capture_intelligence_maintenance() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      PERFORM pg_advisory_xact_lock(73406201, hashtext(NEW.user_id::text));
      IF EXISTS (SELECT 1 FROM intelligence_consents WHERE user_id=NEW.user_id AND domain='maintenance' AND enabled) THEN
        INSERT INTO intelligence_events(id,user_id,domain,event_type,entity_type,entity_id,event_time,recorded_at,schema_version,deduplication_key,attributes)
        VALUES(gen_random_uuid(),NEW.user_id,'maintenance',CASE WHEN NEW.action='completed' THEN 'COMPLETED' ELSE 'DEFERRED' END,'maintenance',NEW.id,clock_timestamp(),clock_timestamp(),1,'maintenance:'||NEW.id,jsonb_build_object('action',NEW.action,'itemId',NEW.item_id));
      END IF;
      RETURN NEW;
    END $$;
    CREATE TRIGGER intelligence_maintenance_event AFTER INSERT ON maintenance_occurrences FOR EACH ROW EXECUTE FUNCTION capture_intelligence_maintenance();
   `,{transaction});
  });
 },
 async down(q) {
  await q.sequelize.query('DROP TRIGGER IF EXISTS intelligence_money_event ON money_transactions; DROP FUNCTION IF EXISTS capture_intelligence_money(); DROP TRIGGER IF EXISTS intelligence_maintenance_event ON maintenance_occurrences; DROP FUNCTION IF EXISTS capture_intelligence_maintenance();');
 }
};
