import { type AccessVerificationOptions, type AdminEnv, authenticateRequest } from './auth';
import { CONTENT_SNAPSHOT, MEDIA_LIBRARY, MEDIA_ROLES } from './snapshot';

const API_HEADERS = {
  'Cache-Control': 'no-store, private',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
} as const;

function json(body: unknown, status = 200, extraHeaders: HeadersInit = {}): Response {
  return Response.json(body, {
    status,
    headers: {
      ...API_HEADERS,
      ...extraHeaders,
    },
  });
}

function errorResponse(status: number, code: string, message: string): Response {
  return json({ error: { code, message } }, status);
}

function parseLimit(url: URL): number | null {
  const raw = url.searchParams.get('limit');
  if (raw === null) return 100;
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return parsed >= 1 && parsed <= 100 ? parsed : null;
}

export async function handleApiRequest(request: Request, env: AdminEnv, authOptions: AccessVerificationOptions = {}): Promise<Response> {
  const identity = await authenticateRequest(request, env, authOptions);
  if (!identity) return errorResponse(401, 'unauthorized', 'Authentication required.');

  if (request.method !== 'GET') {
    return errorResponse(405, 'method_not_allowed', 'Checkpoint A APIs are read-only.');
  }

  const url = new URL(request.url);
  if (url.pathname === '/api/session') {
    return json({ identity, readOnly: true, checkpoint: 'A' });
  }

  if (url.pathname === '/api/content') {
    return json(CONTENT_SNAPSHOT);
  }

  if (url.pathname === '/api/media') {
    const query = (url.searchParams.get('q') ?? '').trim().toLocaleLowerCase();
    const kind = url.searchParams.get('kind') ?? 'all';
    const scope = url.searchParams.get('scope') ?? 'all';
    const role = url.searchParams.get('role') ?? 'all';
    const limit = parseLimit(url);
    if (query.length > 80) return errorResponse(400, 'invalid_query', 'Search query is too long.');
    if (!['all', 'image', 'video'].includes(kind)) return errorResponse(400, 'invalid_kind', 'Media kind is invalid.');
    if (!['all', 'home', 'stills', 'motion', 'about', 'site', 'other'].includes(scope)) {
      return errorResponse(400, 'invalid_scope', 'Media scope is invalid.');
    }
    if (!['all', 'unassigned', ...MEDIA_ROLES].includes(role)) return errorResponse(400, 'invalid_role', 'Media role is invalid.');
    if (limit === null) return errorResponse(400, 'invalid_limit', 'Limit must be between 1 and 100.');

    const filtered = MEDIA_LIBRARY.filter((asset) => {
      const matchesKind = kind === 'all' || asset.kind === kind;
      const matchesScope = scope === 'all' || asset.scope === scope;
      const matchesRole = role === 'all' || (role === 'unassigned' ? asset.roles.length === 0 : asset.roles.includes(role as typeof MEDIA_ROLES[number]));
      const haystack = `${asset.id} ${asset.bilingualMetadata.en} ${asset.bilingualMetadata.zhHant} ${asset.posterId ?? ''} ${asset.projects.join(' ')} ${asset.usageLocations.join(' ')}`.toLocaleLowerCase();
      return matchesKind && matchesScope && matchesRole && (!query || haystack.includes(query));
    });

    return json({
      assets: filtered.slice(0, limit),
      meta: {
        total: MEDIA_LIBRARY.length,
        filtered: filtered.length,
        returned: Math.min(filtered.length, limit),
        query: { q: query, kind, scope, role, limit },
        readOnly: true,
        roleVocabulary: MEDIA_ROLES,
      },
    });
  }

  return errorResponse(404, 'not_found', 'API route not found.');
}

const worker = {
  async fetch(request: Request, env: AdminEnv): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) return await handleApiRequest(request, env);
      if (env.ASSETS) return await env.ASSETS.fetch(request);
      return new Response('Not found', { status: 404, headers: API_HEADERS });
    } catch {
      return errorResponse(500, 'internal_error', 'The admin runtime could not complete the request.');
    }
  },
};

export default worker;
