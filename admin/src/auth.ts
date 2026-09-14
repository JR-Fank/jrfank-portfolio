export interface AdminEnv {
  readonly ADMIN_ENVIRONMENT?: string;
  readonly ADMIN_AUTH_MODE?: string;
  readonly TEAM_DOMAIN?: string;
  readonly POLICY_AUD?: string;
  readonly ASSETS?: { fetch(request: Request): Promise<Response> };
}

export interface AdminIdentity {
  readonly mode: 'access' | 'local-mock';
  readonly subject: string;
  readonly email?: string;
  readonly expiresAt?: number;
}

interface AccessJwtHeader {
  readonly alg: string;
  readonly kid: string;
  readonly typ?: string;
}

interface AccessJwtClaims {
  readonly iss: string;
  readonly aud: string | readonly string[];
  readonly sub: string;
  readonly email?: string;
  readonly exp: number;
  readonly nbf?: number;
  readonly iat?: number;
}

interface AccessJwk extends JsonWebKey {
  readonly kid: string;
  readonly alg?: string;
}

interface JwksResponse {
  readonly keys: readonly AccessJwk[];
}

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface AccessVerificationOptions {
  readonly fetchImpl?: FetchLike;
  readonly nowSeconds?: number;
  readonly bypassCache?: boolean;
}

interface CachedJwks {
  readonly expiresAt: number;
  readonly keys: readonly AccessJwk[];
}

const JWT_MAX_LENGTH = 16_384;
const CLOCK_TOLERANCE_SECONDS = 60;
const JWKS_CACHE_SECONDS = 300;
const jwksCache = new Map<string, CachedJwks>();

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function decodeBase64Url(segment: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error('Malformed JWT segment.');
  const base64 = segment.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(segment.length / 4) * 4, '=');
  const decoded = atob(base64);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function decodeJsonSegment(segment: string): unknown {
  return JSON.parse(new TextDecoder().decode(decodeBase64Url(segment))) as unknown;
}

function parseHeader(value: unknown): AccessJwtHeader {
  if (!isObject(value) || value.alg !== 'RS256' || typeof value.kid !== 'string' || !value.kid.trim()) {
    throw new Error('Unsupported Access JWT header.');
  }
  return {
    alg: value.alg,
    kid: value.kid,
    ...(typeof value.typ === 'string' ? { typ: value.typ } : {}),
  };
}

function parseClaims(value: unknown): AccessJwtClaims {
  if (
    !isObject(value)
    || typeof value.iss !== 'string'
    || !(typeof value.aud === 'string' || (Array.isArray(value.aud) && value.aud.every((item) => typeof item === 'string')))
    || typeof value.sub !== 'string'
    || !value.sub.trim()
    || typeof value.exp !== 'number'
  ) {
    throw new Error('Invalid Access JWT claims.');
  }

  return {
    iss: value.iss,
    aud: value.aud,
    sub: value.sub,
    exp: value.exp,
    ...(typeof value.email === 'string' ? { email: value.email } : {}),
    ...(typeof value.nbf === 'number' ? { nbf: value.nbf } : {}),
    ...(typeof value.iat === 'number' ? { iat: value.iat } : {}),
  };
}

export function normalizeTeamIssuer(teamDomain: string): string {
  const candidate = teamDomain.trim();
  if (!candidate) throw new Error('TEAM_DOMAIN is required.');
  const url = new URL(candidate.includes('://') ? candidate : `https://${candidate}`);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('TEAM_DOMAIN must be an HTTPS Cloudflare Access origin.');
  }
  if (url.pathname !== '/' && url.pathname !== '') {
    throw new Error('TEAM_DOMAIN must not include a path.');
  }
  return url.origin;
}

function parseJwks(value: unknown): readonly AccessJwk[] {
  if (!isObject(value) || !Array.isArray(value.keys)) throw new Error('Cloudflare Access JWKS response is invalid.');
  const keys = value.keys.filter((key): key is AccessJwk => isObject(key) && key.kty === 'RSA' && typeof key.kid === 'string');
  if (keys.length === 0) throw new Error('Cloudflare Access JWKS contains no RSA keys.');
  return keys;
}

async function fetchJwks(issuer: string, fetchImpl: FetchLike, nowSeconds: number, force: boolean): Promise<readonly AccessJwk[]> {
  const cached = jwksCache.get(issuer);
  if (!force && cached && cached.expiresAt > nowSeconds) return cached.keys;

  const response = await fetchImpl(`${issuer}/cdn-cgi/access/certs`, {
    headers: { Accept: 'application/json' },
    redirect: 'error',
  });
  if (!response.ok) throw new Error('Unable to load Cloudflare Access signing keys.');
  const keys = parseJwks(await response.json() as JwksResponse);
  jwksCache.set(issuer, { keys, expiresAt: nowSeconds + JWKS_CACHE_SECONDS });
  return keys;
}

async function verifySignature(token: string, signingInput: string, signatureSegment: string, header: AccessJwtHeader, issuer: string, options: AccessVerificationOptions): Promise<void> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  let keys = await fetchJwks(issuer, fetchImpl, nowSeconds, options.bypassCache === true);
  let key = keys.find((candidate) => candidate.kid === header.kid);

  if (!key && options.bypassCache !== true) {
    keys = await fetchJwks(issuer, fetchImpl, nowSeconds, true);
    key = keys.find((candidate) => candidate.kid === header.kid);
  }
  if (!key) throw new Error('Access JWT signing key is unknown.');
  if (key.alg && key.alg !== 'RS256') throw new Error('Access JWT key algorithm is unsupported.');

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    key,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const signatureBytes = decodeBase64Url(signatureSegment);
  const signature = signatureBytes.buffer.slice(signatureBytes.byteOffset, signatureBytes.byteOffset + signatureBytes.byteLength) as ArrayBuffer;
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signature,
    new TextEncoder().encode(signingInput),
  );
  if (!valid) throw new Error(`Invalid Access JWT signature (${token.length} bytes).`);
}

export async function verifyAccessJwt(token: string, teamDomain: string, policyAudience: string, options: AccessVerificationOptions = {}): Promise<AdminIdentity> {
  if (!token || token.length > JWT_MAX_LENGTH) throw new Error('Access JWT is missing or too large.');
  const segments = token.split('.');
  if (segments.length !== 3) throw new Error('Malformed Access JWT.');
  const [encodedHeader, encodedClaims, encodedSignature] = segments;
  if (!encodedHeader || !encodedClaims || !encodedSignature) throw new Error('Malformed Access JWT.');

  const header = parseHeader(decodeJsonSegment(encodedHeader));
  const claims = parseClaims(decodeJsonSegment(encodedClaims));
  const issuer = normalizeTeamIssuer(teamDomain);
  const audience = policyAudience.trim();
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);

  if (!audience) throw new Error('POLICY_AUD is required.');
  if (claims.iss !== issuer) throw new Error('Access JWT issuer does not match TEAM_DOMAIN.');
  const audiences = typeof claims.aud === 'string' ? [claims.aud] : claims.aud;
  if (!audiences.includes(audience)) throw new Error('Access JWT audience does not match POLICY_AUD.');
  if (claims.exp <= nowSeconds - CLOCK_TOLERANCE_SECONDS) throw new Error('Access JWT is expired.');
  if (claims.nbf !== undefined && claims.nbf > nowSeconds + CLOCK_TOLERANCE_SECONDS) throw new Error('Access JWT is not active.');
  if (claims.iat !== undefined && claims.iat > nowSeconds + CLOCK_TOLERANCE_SECONDS) throw new Error('Access JWT was issued in the future.');

  await verifySignature(token, `${encodedHeader}.${encodedClaims}`, encodedSignature, header, issuer, options);
  return {
    mode: 'access',
    subject: claims.sub,
    ...(claims.email ? { email: claims.email } : {}),
    expiresAt: claims.exp,
  };
}

function isLoopbackHostname(hostname: string): boolean {
  return hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || hostname === '127.0.0.1'
    || hostname === '[::1]'
    || hostname === '::1';
}

export async function authenticateRequest(request: Request, env: AdminEnv, options: AccessVerificationOptions = {}): Promise<AdminIdentity | null> {
  const mode = env.ADMIN_AUTH_MODE ?? 'access';

  if (mode === 'local-mock') {
    const hostname = new URL(request.url).hostname;
    const explicitlyRequested = request.headers.get('x-admin-local-mock') === 'true';
    if (env.ADMIN_ENVIRONMENT !== 'local' || !isLoopbackHostname(hostname) || !explicitlyRequested) return null;
    return { mode: 'local-mock', subject: 'local-checkpoint-a-owner', email: 'local-owner@mock.invalid' };
  }

  if (mode !== 'access' || !env.TEAM_DOMAIN || !env.POLICY_AUD) return null;
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) return null;

  try {
    return await verifyAccessJwt(token, env.TEAM_DOMAIN, env.POLICY_AUD, options);
  } catch {
    return null;
  }
}
