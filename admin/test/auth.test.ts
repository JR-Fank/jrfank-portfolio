import { generateKeyPairSync, sign } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';

import { authenticateRequest, normalizeTeamIssuer, verifyAccessJwt } from '../src/auth';

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

test('normalizes an Access team hostname to the exact HTTPS issuer origin', () => {
  assert.equal(normalizeTeamIssuer('owner.cloudflareaccess.com'), 'https://owner.cloudflareaccess.com');
  assert.throws(() => normalizeTeamIssuer('http://owner.cloudflareaccess.com'));
  assert.throws(() => normalizeTeamIssuer('https://owner.cloudflareaccess.com/path'));
});

test('local mock authentication requires all explicit loopback gates', async () => {
  const env = { ADMIN_ENVIRONMENT: 'local', ADMIN_AUTH_MODE: 'local-mock' };
  assert.equal(await authenticateRequest(new Request('http://localhost/api/session'), env), null);
  assert.equal(await authenticateRequest(new Request('https://admin.example.com/api/session', { headers: { 'x-admin-local-mock': 'true' } }), env), null);
  assert.equal(await authenticateRequest(new Request('http://localhost/api/session', { headers: { 'x-admin-local-mock': 'true' } }), { ...env, ADMIN_ENVIRONMENT: 'production' }), null);
  assert.deepEqual(
    await authenticateRequest(new Request('http://localhost/api/session', { headers: { 'x-admin-local-mock': 'true' } }), env),
    { mode: 'local-mock', subject: 'local-checkpoint-a-owner', email: 'local-owner@mock.invalid' },
  );
});

test('verifies a mocked RS256 Cloudflare Access assertion by issuer and audience', async () => {
  const nowSeconds = 1_800_000_000;
  const issuer = 'https://owner.cloudflareaccess.com';
  const audience = 'checkpoint-a-audience';
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const jwk = {
    ...publicKey.export({ format: 'jwk' }),
    kid: 'checkpoint-a-key',
    alg: 'RS256',
    use: 'sig',
  };

  const header = encode({ alg: 'RS256', kid: jwk.kid, typ: 'JWT' });
  const claims = encode({
    iss: issuer,
    aud: [audience],
    sub: 'owner-subject',
    email: 'owner@example.com',
    iat: nowSeconds - 10,
    exp: nowSeconds + 300,
  });
  const signingInput = `${header}.${claims}`;
  const signature = sign('RSA-SHA256', Buffer.from(signingInput), privateKey).toString('base64url');
  const token = `${signingInput}.${signature}`;
  const fetchImpl = async (input: RequestInfo | URL): Promise<Response> => {
    assert.equal(String(input), `${issuer}/cdn-cgi/access/certs`);
    return Response.json({ keys: [jwk] });
  };

  assert.deepEqual(await verifyAccessJwt(token, issuer, audience, { nowSeconds, fetchImpl, bypassCache: true }), {
    mode: 'access',
    subject: 'owner-subject',
    email: 'owner@example.com',
    expiresAt: nowSeconds + 300,
  });
  await assert.rejects(() => verifyAccessJwt(token, issuer, 'wrong-audience', { nowSeconds, fetchImpl, bypassCache: true }));
  await assert.rejects(() => verifyAccessJwt(token, issuer, audience, { nowSeconds: nowSeconds + 1_000, fetchImpl, bypassCache: true }));
});
