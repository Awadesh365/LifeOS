import assert from "node:assert/strict";
import test from "node:test";

// Run only against an explicitly supplied, disposable test database, never .env.
const testUrl = process.env.HABITS_TEST_DATABASE_URL;
test(
  "authenticated web/mobile sessions share persisted habit CRUD and civil-date history",
  { skip: !testUrl },
  async () => {
    const url = new URL(testUrl!);
    assert.match(url.pathname, /test/);
    assert.ok(
      ["127.0.0.1", "localhost"].includes(url.hostname),
      "Use a disposable local test database",
    );
    process.env.DATABASE_URL = testUrl;
    process.env.DB_SYNC = "false";
    process.env.VERCEL = "1";
    process.env.SESSION_SECRET = "habits-isolated-test-session-secret";
    const { default: app } = await import("../../src/app.js");
    const { sequelize, models } = await import("../../models/index.js");
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address() as { port: number };
    const base = `http://127.0.0.1:${address.port}/api`;
    function client() {
      let cookie = "";
      let csrf = "";
      return async (
        path: string,
        method = "GET",
        body?: unknown,
        expected = 200,
      ) => {
        const response = await fetch(base + path, {
          method,
          headers: {
            cookie,
            "Content-Type": "application/json",
            "x-csrf-token": csrf,
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const nextCookie = response.headers.get("set-cookie");
        if (nextCookie) cookie = nextCookie.split(";")[0];
        const payload = await response.json();
        assert.equal(response.status, expected, JSON.stringify(payload));
        if (payload.csrfToken) csrf = payload.csrfToken;
        return payload;
      };
    }
    const web = client(),
      mobile = client();
    const ids: string[] = [];
    try {
      await web("/habits", "GET", undefined, 401);
      const session = await web("/auth/session");
      const account = {
        email: "habits-test@example.test",
        password: "Habits-test-password-2026",
        displayName: "Habits Test",
      };
      if (session.registrationOpen)
        await web("/auth/register", "POST", account, 201);
      else await web("/auth/login", "POST", account);
      await mobile("/auth/login", "POST", account);
      await web("/habits", "POST", { name: "" }, 400);
      await web("/habits?date=2025-02-29", "GET", undefined, 400);
      await web("/habits/completion", "PUT", null, 400);
      const habit = await web("/habits", "POST", {
        name: "API test practice",
        category: "Tests",
        icon: "✓",
      });
      ids.push(habit.id);
      assert.ok(
        (await mobile("/habits?date=2024-02-29")).some(
          (row: any) => row.id === habit.id && !row.done,
        ),
      );
      await mobile(`/habits/${habit.id}`, "PUT", { name: "Edited on mobile" });
      assert.equal(
        (await web("/habits?date=2024-02-29")).find(
          (row: any) => row.id === habit.id,
        ).name,
        "Edited on mobile",
      );
      const completion = { date: "2024-02-29", done: true };
      await Promise.all(
        Array.from({ length: 8 }, () =>
          web(`/habits/${habit.id}/completion`, "PUT", completion),
        ),
      );
      assert.equal(
        await models.HabitLog.count({
          where: { habitId: habit.id, date: completion.date },
        }),
        1,
      );
      assert.equal(
        (await mobile("/habits?date=2024-02-29")).find(
          (row: any) => row.id === habit.id,
        ).done,
        true,
      );
      assert.equal(
        (await mobile("/habits?date=2024-03-01")).find(
          (row: any) => row.id === habit.id,
        ).done,
        false,
      );
      await mobile(`/habits/${habit.id}/completion`, "PUT", {
        ...completion,
        done: false,
      });
      assert.equal(
        (await web("/habits/history/2024-02-29")).find(
          (row: any) => row.habitId === habit.id,
        ).done,
        false,
      );
      const second = await mobile("/habits", "POST", {
        name: "Second practice",
      });
      ids.push(second.id);
      await web("/habits/completion", "PUT", { ids, ...completion });
      let week = await mobile("/habits/week?date=2024-03-02");
      assert.equal(week.days.length, 7);
      assert.equal(
        week.days
          .find((day: any) => day.date === completion.date)
          .habits.filter((row: any) => ids.includes(row.id) && row.done).length,
        2,
      );
      await web(
        "/habits/completion",
        "PUT",
        {
          ids: [...ids, "zz-missing-habit"],
          date: completion.date,
          done: false,
        },
        404,
      );
      assert.equal(
        (await mobile("/habits?date=2024-02-29")).filter(
          (row: any) => ids.includes(row.id) && row.done,
        ).length,
        2,
        "failed bulk update must roll back",
      );
      await web(
        `/habits/${habit.id}/completion`,
        "PUT",
        { date: completion.date, done: "false" },
        400,
      );
      await mobile(`/habits/${habit.id}`, "DELETE");
      assert.equal(
        await models.HabitLog.count({ where: { habitId: habit.id } }),
        0,
      );
      week = await web("/habits/week?date=2024-03-02");
      assert.ok(
        week.days.every(
          (day: any) => !day.habits.some((row: any) => row.id === habit.id),
        ),
      );
      await web(`/habits/${habit.id}/completion`, "PUT", completion, 404);
      await web("/habits/completion", "PUT", {
        ids: [second.id],
        date: completion.date,
        done: false,
      });
      assert.equal(
        (await mobile("/habits?date=2024-02-29")).find(
          (row: any) => row.id === second.id,
        ).done,
        false,
      );
    } finally {
      for (const id of ids) {
        await models.HabitLog.destroy({ where: { habitId: id } });
        await models.Habit.destroy({ where: { id } });
      }
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await sequelize.close();
    }
  },
);
