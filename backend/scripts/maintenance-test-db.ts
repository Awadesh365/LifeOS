import { Client } from "pg";
import config from "../config/env.js";
import { spawnSync } from "node:child_process";
async function main() {
  const settings = config.db.url
    ? { connectionString: config.db.url }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
      };
  const host = config.db.url ? new URL(config.db.url).hostname : config.db.host;
  if (!["localhost", "127.0.0.1", "::1"].includes(host))
    throw new Error("Integration runner only provisions a local test database");
  const client = new Client(settings);
  await client.connect();
  const name = "lifeos_maintenance_test";
  const exists = await client.query(
    "SELECT 1 FROM pg_database WHERE datname=$1",
    [name],
  );
  if (!exists.rowCount) await client.query(`CREATE DATABASE ${name}`);
  await client.end();
  const url = config.db.url
    ? new URL(config.db.url)
    : new URL("postgresql://localhost");
  if (!config.db.url) {
    url.hostname = config.db.host;
    url.port = String(config.db.port);
    url.username = config.db.user;
    url.password = config.db.password;
  }
  url.pathname = "/" + name;
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx", "--test", "tests/maintenance/integration.test.ts"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: url.toString(),
        MAINTENANCE_TEST_DATABASE_URL: url.toString(),
      },
    },
  );
  process.exitCode = result.status ?? 1;
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
