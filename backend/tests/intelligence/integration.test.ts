import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const testUrl = process.env.INTELLIGENCE_TEST_DATABASE_URL;
test(
  "Intelligence database lifecycle, tenant isolation, consent races, event rollback, and privacy",
  { skip: !testUrl },
  async (t) => {
    assert.ok(
      new URL(testUrl!).pathname.endsWith("/lifeos_intelligence_test"),
      "Refusing destructive test setup outside isolated test DB",
    );
    assert.equal(process.env.DATABASE_URL, testUrl);
    const { sequelize, models } = await import("../../models/index.js");
    t.after(() => sequelize.close());
    // Dedicated test database only. Migrations are exercised against existing core tables.
    await sequelize.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
    await sequelize.sync();
    const S = await import("../../services/intelligence/service.js");
    const store = await import("../../services/intelligence/store.js");
    const migration = require("../../scripts/migrations/20260905100000-create-intelligence.js");
    const triggers = require("../../scripts/migrations/20260905101000-intelligence-domain-events.js");
    await migration.up(sequelize.getQueryInterface(), require("sequelize"));
    await triggers.up(sequelize.getQueryInterface());
    const uid = randomUUID(),
      other = randomUUID();
    for (const id of [uid, other])
      await models.User.create({
        id,
        email: `${id}@test.invalid`,
        name: "Test",
        passwordHash: "test-only",
        role: "admin",
      });
    let artifactId = "";
    await t.test("defaults to no consent and no artifacts", async () => {
      assert.equal((await S.summary(uid)).enabledDomains.length, 0);
      await assert.rejects(
        S.createProjection(uid, {
          domain: "money",
          template: "money-run-rate",
          assumptions: { spent: 100, elapsedDays: 10, periodDays: 30 },
        }),
        /consent/,
      );
    });
    await t.test(
      "creates a scenario without changing core domain records",
      async () => {
        await S.setConsent(uid, { domain: "money", enabled: true });
        const a = await S.createProjection(uid, {
          domain: "money",
          template: "money-run-rate",
          assumptions: { spent: 100, elapsedDays: 10, periodDays: 30 },
        });
        artifactId = a.id;
        assert.equal(a.payload.value, 300);
        assert.equal(await models.MoneyTransaction.count(), 0);
        await assert.rejects(S.getArtifact(other, a.id), /not found/);
      },
    );
    await t.test(
      "domain mutation produces a redacted event inside the same transaction",
      async () => {
        await models.MoneyTransaction.create({
          id: "money1",
          userId: uid,
          semanticType: "expense",
          occurredOn: "2026-01-10",
          amount: 200,
          currency: "INR",
          description: "secret",
          notes: "private medical text",
        });
        const es = await S.events(uid);
        assert.equal(es.length, 1);
        assert.equal(es[0].attributes.amount, 200);
        assert.ok(!JSON.stringify(es).includes("private"));
        await assert.rejects(
          sequelize.transaction(async (transaction) => {
            await models.MoneyTransaction.create(
              {
                id: "rolled-back",
                userId: uid,
                semanticType: "expense",
                occurredOn: "2026-01-10",
                amount: 200,
                currency: "INR",
                description: "test",
              },
              { transaction },
            );
            throw new Error("rollback");
          }),
          /rollback/,
        );
        assert.equal((await S.events(uid)).length, 1);
      },
    );
    await t.test("source import is idempotent", async () => {
      await S.importSources(uid);
      const n = (await S.events(uid)).length;
      await S.importSources(uid);
      assert.equal((await S.events(uid)).length, n);
    });
    await t.test("feedback is distinct from outcomes", async () => {
      await S.feedback(uid, artifactId, { response: "helpful" });
      assert.equal(
        (await S.getArtifact(uid, artifactId)).payload.outcome,
        undefined,
      );
      await assert.rejects(
        S.resolveOutcome(uid, artifactId, { actual: 1, reason: "test" }),
        /Only predictions/,
      );
    });
    await t.test(
      "revocation hides artifacts and prevents new events",
      async () => {
        await S.setConsent(uid, { domain: "money", enabled: false });
        assert.equal((await S.listArtifacts(uid)).length, 0);
        await assert.rejects(S.getArtifact(uid, artifactId), /consent/);
        const n = await store.LifeEvent.count({ where: { userId: uid } });
        await models.MoneyTransaction.update(
          { amount: 300 },
          { where: { id: "money1" } },
        );
        assert.equal(
          await store.LifeEvent.count({ where: { userId: uid } }),
          n,
        );
      },
    );
    await t.test("failed candidates never replace a champion", async () => {
      await S.setConsent(uid, { domain: "money", enabled: true });
      const v = await store.ModelVersion.create({
        userId: uid,
        definitionId: "FIN-01",
        payload: {
          currency: "INR",
          validation: "failed",
          gates: { beatsBaseline: false },
          trainedAt: new Date().toISOString(),
        },
      });
      await assert.rejects(
        S.transition(uid, String(v.get("id")), { stage: "champion" }),
        /blocked/,
      );
      assert.equal((await v.reload()).get("stage"), "candidate");
      await assert.rejects(S.predict(uid, { currency: "INR" }), /champion/);
    });
    await t.test(
      "deletion clears derived graph and preserves core records",
      async () => {
        await assert.rejects(
          S.deleteData(uid, { confirmation: "no" }),
          /confirm/,
        );
        await S.deleteData(uid, { confirmation: "DELETE INTELLIGENCE" });
        assert.equal(
          await store.ArtifactRecord.count({ where: { userId: uid } }),
          0,
        );
        assert.equal(
          await store.LifeEvent.count({ where: { userId: uid } }),
          0,
        );
        assert.equal(
          await store.ModelVersion.count({ where: { userId: uid } }),
          0,
        );
        assert.equal((await S.enabledDomains(uid)).length, 0);
        assert.equal(
          await models.MoneyTransaction.count({ where: { userId: uid } }),
          1,
        );
        assert.equal(await store.Audit.count({ where: { userId: uid } }), 1);
      },
    );
    await triggers.down(sequelize.getQueryInterface());
    await migration.down(sequelize.getQueryInterface());

  },
);
