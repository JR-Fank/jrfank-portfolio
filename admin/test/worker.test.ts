import assert from 'node:assert/strict';
import test from 'node:test';

import worker, { handleApiRequest } from '../src/worker';

const localEnv = {
  ADMIN_ENVIRONMENT: 'local',
  ADMIN_AUTH_MODE: 'local-mock',
};

function localRequest(path: string, init: RequestInit = {}): Request {
  const headers = new Headers(init.headers);
  headers.set('x-admin-local-mock', 'true');
  return new Request(`http://localhost${path}`, { ...init, headers });
}

test('every API route rejects a missing Access assertion by default', async () => {
  for (const path of ['/api/session', '/api/content', '/api/media']) {
    const response = await worker.fetch(new Request(`https://admin.example.com${path}`), {
      ADMIN_ENVIRONMENT: 'production',
      ADMIN_AUTH_MODE: 'access',
      TEAM_DOMAIN: 'https://owner.cloudflareaccess.com',
      POLICY_AUD: 'expected-audience',
    });
    assert.equal(response.status, 401);
    assert.match(response.headers.get('cache-control') ?? '', /no-store/);
    assert.deepEqual(await response.json(), { error: { code: 'unauthorized', message: 'Authentication required.' } });
  }
});

test('a mocked local identity can read the repository content snapshot', async () => {
  const response = await handleApiRequest(localRequest('/api/content'), localEnv);
  assert.equal(response.status, 200);
  const body = await response.json() as {
    readOnly: boolean;
    source: { mode: string; manifestPath: string };
    sections: { stills: unknown[]; motion: unknown[] };
  };
  assert.equal(body.readOnly, true);
  assert.equal(body.source.mode, 'repository-build-snapshot');
  assert.equal(body.source.manifestPath, 'src/generated/media-manifest.json');
  assert.equal(body.sections.stills.length, 4);
  assert.equal(body.sections.motion.length, 5);
});

test('the media API filters committed manifest metadata and fixed roles without mutation', async () => {
  const response = await handleApiRequest(localRequest('/api/media?kind=video&scope=motion&role=preview&q=development&limit=10'), localEnv);
  assert.equal(response.status, 200);
  const body = await response.json() as {
    assets: Array<{ id: string; kind: string; scope: string; roles: string[]; publishStatus: string }>;
    meta: { total: number; filtered: number; readOnly: boolean; roleVocabulary: string[] };
  };
  assert.equal(body.meta.total, 24);
  assert.equal(body.meta.filtered, 1);
  assert.equal(body.meta.readOnly, true);
  assert.deepEqual(body.assets.map((asset) => asset.id), ['motion.development.preview']);
  assert.ok(body.assets.every((asset) => asset.kind === 'video' && asset.scope === 'motion'));
  assert.ok(body.assets[0]?.roles.includes('preview'));
  assert.equal(body.assets[0]?.publishStatus, 'Not recorded');
  assert.deepEqual(body.meta.roleVocabulary, ['hero', 'cover', 'gallery', 'rail', 'poster', 'satellite', 'filmstrip', 'bts', 'preview', 'full-film', 'about', 'social']);
});

test('authenticated APIs reject write methods and invalid filters', async () => {
  const writeResponse = await handleApiRequest(localRequest('/api/content', { method: 'POST' }), localEnv);
  assert.equal(writeResponse.status, 405);
  assert.deepEqual(await writeResponse.json(), { error: { code: 'method_not_allowed', message: 'Checkpoint A APIs are read-only.' } });

  const filterResponse = await handleApiRequest(localRequest('/api/media?kind=archive'), localEnv);
  assert.equal(filterResponse.status, 400);
});
