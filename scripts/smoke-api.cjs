const assert = require('node:assert/strict');
async function main() {
  const app = require('../api/index.js');
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const health = await fetch(base + '/api/health-check');
    assert.equal(health.status, 200);
    assert.equal((await health.json()).ok, true);
    const session = await fetch(base + '/api/auth/session');
    assert.equal(session.status, 200);
    assert.equal((await session.json()).authenticated, false);
    assert.equal((await fetch(base + '/api/dashboard')).status, 401);
    const rejected = await fetch(base + '/api/auth/login', {
      method: 'POST', headers: { origin: 'https://untrusted.invalid', 'content-type': 'application/json' },
      body: '{}'
    });
    assert.equal(rejected.status, 403);
    console.log('Vercel API entry: health, database session, authentication and origin checks passed.');
  } finally { server.close(); }
}
main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
