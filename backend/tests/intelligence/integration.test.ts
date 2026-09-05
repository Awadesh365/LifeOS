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
    await t.test(
      "event replay is idempotent regardless of attribute key order",
      async () => {
        const input = {
          domain: "money",
          entityType: "transaction",
          entityId: "event-test",
          eventType: "TRANSACTION_RECORDED",
          eventTime: "2024-01-01T00:00:00Z",
          schemaVersion: 1,
          deduplicationKey: "event-replay",
          attributes: {
            amount: 1,
            currency: "INR",
            semanticType: "expense",
            occurredOn: "2024-01-01",
          },
        };
        const first = await S.ingest(uid, input);
        const second = await S.ingest(uid, {
          ...input,
          attributes: {
            occurredOn: "2024-01-01",
            semanticType: "expense",
            currency: "INR",
            amount: 1,
          },
        });
        assert.equal(first.id, second.id);
        await assert.rejects(
          S.ingest(uid, {
            ...input,
            attributes: { ...input.attributes, amount: "not a number" },
          }),
          /amount/,
        );
      },
    );
    await t.test("source import is idempotent", async () => {
      await S.importSources(uid);
      const n = (await S.events(uid)).length;
      await S.importSources(uid);
      assert.equal((await S.events(uid)).length, n);
    });
    await t.test(
      "ledger projection uses owned records and leaves the source unchanged",
      async () => {
        const date = new Date().toISOString().slice(0, 10);
        const row = await models.MoneyTransaction.create({
          id: "source-projection",
          userId: uid,
          semanticType: "expense",
          occurredOn: date,
          amount: 100,
          currency: "USD",
          description: "Test ledger projection",
        });
        const before = await models.MoneyTransaction.count();
        const a = await S.sourceProjection(uid, { currency: "USD" });
        assert.equal(a.kind, "projection");
        assert.equal(a.payload.unit, "USD");
        assert.equal(a.payload.assumptions.spent, 100);
        assert.equal(a.payload.readiness, "source_backed");
        assert.equal(await models.MoneyTransaction.count(), before);
        await row.destroy();
      },
    );
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
    await t.test(
      "concurrent feedback does not exhaust the database pool",
      async () => {
        await S.setConsent(uid, { domain: "money", enabled: true });
        await Promise.all(
          Array.from({ length: 8 }, () =>
            S.feedback(uid, artifactId, { response: "helpful" }),
          ),
        );
      },
    );
    await t.test(
      "export includes revoked-domain data without enabling processing",
      async () => {
        await S.setConsent(uid, { domain: "money", enabled: false });
        const exported = await S.exportData(uid);
        assert.ok(exported.artifacts.some((a: any) => a.id === artifactId));
        assert.equal((await S.enabledDomains(uid)).length, 0);
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
    await t.test("eligible history trains, promotes and serves a reproducible forecast", async()=>{
      const current = new Date();
      const historical = Array.from({length:24},(_,i)=>{
        const date=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()-24+i,10)).toISOString();
        return {userId:uid,domain:'money',entityType:'transaction',entityId:`trained-${i}`,eventType:'TRANSACTION_RECORDED',eventTime:date,recordedAt:date,schemaVersion:1,deduplicationKey:`training-fixture-${i}`,attributes:{amount:100+i%3*10,currency:'EUR',semanticType:'expense',occurredOn:date.slice(0,10)}};
      });
      await store.LifeEvent.bulkCreate(historical);
      await S.ingest(uid,{domain:'money',entityType:'transaction',entityId:'current-eur',eventType:'TRANSACTION_RECORDED',eventTime:current.toISOString(),schemaVersion:1,deduplicationKey:'current-eur',attributes:{amount:1,currency:'EUR',semanticType:'expense',occurredOn:current.toISOString().slice(0,10)}});
      const candidate=await S.train(uid,{definitionId:'FIN-01',currency:'EUR'});
      assert.equal(candidate.payload.validation,'passed');
      await S.transition(uid,candidate.id,{stage:'champion'});
      const prediction=await S.predict(uid,{currency:'EUR'});
      assert.equal(prediction.payload.value,110);
      assert.equal(prediction.payload.modelVersion,candidate.id);
      assert.equal((await S.getArtifact(uid,prediction.id)).payload.value,110);
      assert.ok(prediction.payload.lower<=prediction.payload.value&&prediction.payload.upper>=prediction.payload.value);
      await assert.rejects(S.resolveOutcome(uid,prediction.id,{actual:110,reason:'Too early'}),/horizon has not ended/);
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
    await t.test(
      "HTTP endpoints enforce sessions, CSRF, role and malformed input",
      async () => {
        await sequelize.query(
          "CREATE TABLE user_sessions (sid varchar PRIMARY KEY, sess json NOT NULL, expire timestamp(6) NOT NULL)",
        );
        const { hash } = await import("@node-rs/argon2");
        await models.User.update(
          { passwordHash: await hash("Test-only-password-4821"), role: "user" },
          { where: { id: other } },
        );
        const { default: app } = await import("../../src/app.js");
        const server = await new Promise<import("node:http").Server>(
          (resolve) => {
            const server = app.listen(0, "127.0.0.1", () => resolve(server));
          },
        );
        try {
          const address = server.address() as import("node:net").AddressInfo;
          const base = `http://127.0.0.1:${address.port}/api`;
          assert.equal(
            (await fetch(base + "/intelligence/summary")).status,
            401,
          );
          const login = await fetch(base + "/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: `${other}@test.invalid`,
              password: "Test-only-password-4821",
            }),
          });
          assert.equal(login.status, 200);
          const session = (await login.json()) as any;
          const cookie = login.headers.get("set-cookie")!.split(";")[0];
          assert.equal(
            (
              await fetch(base + "/intelligence/consents", {
                method: "PUT",
                headers: { cookie, "Content-Type": "application/json" },
                body: JSON.stringify({ domain: "money", enabled: true }),
              })
            ).status,
            403,
          );
          const headers = {
            cookie,
            "Content-Type": "application/json",
            "x-csrf-token": session.csrfToken,
          };
          assert.equal(
            (
              await fetch(base + "/intelligence/consents", {
                method: "PUT",
                headers,
                body: JSON.stringify({ domain: "money", enabled: true }),
              })
            ).status,
            200,
          );
          assert.equal(
            (await fetch(base + "/intelligence/diagnostics", { headers }))
              .status,
            403,
          );
          assert.equal(
            (
              await fetch(base + "/intelligence/artifacts/not-a-uuid", {
                headers,
              })
            ).status,
            404,
          );
          assert.equal(
            (
              await fetch(base + "/intelligence/projections", {
                method: "POST",
                headers,
                body: "[]",
              })
            ).status,
            400,
          );
        } finally {
          await new Promise<void>((resolve, reject) =>
            server.close((e) => (e ? reject(e) : resolve())),
          );
        }
      },
    );
    await triggers.down(sequelize.getQueryInterface());
    await migration.down(sequelize.getQueryInterface());
  },
);
