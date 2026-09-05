import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const url = process.env.MAINTENANCE_TEST_DATABASE_URL;
test('Maintenance concurrency, ownership, history and migration round trip', { skip: !url }, async () => {
  assert.equal(new URL(url!).pathname, '/lifeos_maintenance_test');
  assert.equal(process.env.DATABASE_URL, url);
  const { sequelize, models } = await import('../../models/index.js');
  try {
    await sequelize.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public');
    await sequelize.sync();
    const qi = sequelize.getQueryInterface();
    const migration = require('../../scripts/migrations/20260905090000-harden-maintenance-domain.js');
    await qi.addIndex('maintenance_occurrences', ['user_id', 'client_operation_id'], { unique: true, name: 'maintenance_occurrences_user_operation_unique' });
    const owner = randomUUID(), other = randomUUID();
    for (const id of [owner, other]) await models.User.create({ id, email: id + '@test.invalid', name: 'Test', passwordHash: 'test' });
    await models.MaintenanceArea.create({ id: 'area', userId: owner, name: 'Home', type: 'home' });
    for (const [id, workKind] of [['repair', 'repair'], ['project', 'improvement_project']]) {
      await models.MaintenanceItem.create({ id, userId: owner, areaId: 'area', name: id, workKind, scheduleType: 'none' });
    }
    await migration.down(qi);
    const [legacy] = await sequelize.query("SELECT schedule_type FROM maintenance_items ORDER BY id");
    assert.deepEqual(legacy.map((row: any) => row.schedule_type), ['project', 'repair']);
    await migration.up(qi, require('sequelize'));
    assert.equal((await models.MaintenanceItem.findByPk('project'))!.get('workKind'), 'improvement_project');
    const S = await import('../../services/maintenance/maintenance.service.js');
    await S.updateItem(owner, 'repair', { scheduleType: 'hard_deadline', nextDate: '2026-09-10' });
    await assert.rejects(migration.down(qi), /Cannot rollback/);
    assert.ok((await qi.describeTable('maintenance_items')).work_kind);
    const results = await Promise.all(Array.from({ length: 8 }, () => S.completeItem(owner, 'repair', { clientOperationId: 'same' })));
    assert.equal(new Set(results.map(r => r.occurrence.id)).size, 1);
    assert.equal(await models.MaintenanceOccurrence.count(), 1);
    assert.equal(results[0].occurrence.hardDueAt, '2026-09-10');
    await assert.rejects(S.completeItem(owner, 'project', { clientOperationId: 'same' }), /another maintenance action/);
    await assert.rejects(S.getItem(other, 'repair'), /not found/);
    await assert.rejects(S.getItemHistory(other, 'repair'), /not found/);
    await S.updateItem(owner, 'repair', { nextDate: '2026-10-10' });
    const history = await S.getItemHistory(owner, 'repair');
    assert.equal((history[0] as any).hardDueAt, '2026-09-10');
  } finally { await sequelize.close(); }
});
