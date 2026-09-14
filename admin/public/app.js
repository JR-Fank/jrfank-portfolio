const pages = {
  dashboard: { label: 'Repository overview', title: 'Dashboard' },
  home: { label: 'Content snapshot / Home', title: 'Home' },
  stills: { label: 'Content snapshot / Stills', title: 'Stills' },
  motion: { label: 'Content snapshot / Motion', title: 'Motion' },
  about: { label: 'Content snapshot / About', title: 'About' },
  media: { label: 'Manifest inventory', title: 'Media Library' },
  publish: { label: 'Checkpoint boundary', title: 'Publish / Changes' },
};

const main = document.querySelector('#admin-content');
const viewLabel = document.querySelector('#view-label');
const sessionChip = document.querySelector('#session-chip');
const navLinks = [...document.querySelectorAll('[data-page]')];

const state = {
  session: null,
  snapshot: null,
  media: null,
  mediaFilters: { q: '', kind: 'all', scope: 'all', role: 'all' },
  error: null,
};

function append(parent, ...children) {
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return parent;
}

function element(tag, options = {}, ...children) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = String(options.text);
  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    if (value !== undefined && value !== null) node.setAttribute(name, String(value));
  }
  return append(node, ...children);
}

function pageHead(kicker, title, intro) {
  const titleId = `${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-title`;
  return element('header', { className: 'page-head', attrs: { 'aria-labelledby': titleId } },
    element('div', {},
      element('p', { className: 'eyebrow', text: kicker }),
      element('h1', { text: title, attrs: { id: titleId } }),
    ),
    element('p', { className: 'page-head__intro', text: intro }),
  );
}

function sectionTitle(title, index) {
  return element('div', { className: 'section-title' },
    element('h2', { text: title }),
    element('span', { text: index }),
  );
}

function tag(text, signal = false) {
  return element('span', { className: `tag${signal ? ' tag--signal' : ''}`, text });
}

function bilingual(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return [value.en, value.zhHant].filter(Boolean).join(' / ');
}

function dataPair(label, value) {
  return element('div', { className: 'data-pair' },
    element('dt', { text: label }),
    element('dd', { text: value ?? '—' }),
  );
}

function metric(label, value, note) {
  return element('article', { className: 'metric' },
    element('span', { className: 'meta-label', text: label }),
    element('strong', { text: value }),
    element('small', { text: note }),
  );
}

function contentRecord(index, title, summary, tags, meta = []) {
  const details = element('div', {},
    element('h3', { text: title }),
    summary ? element('p', { text: summary }) : null,
  );
  const definition = element('dl', { className: 'record__meta' });
  for (const [label, value] of meta) definition.append(dataPair(label, value));
  return element('article', { className: 'record' },
    element('span', { className: 'record-index', text: String(index).padStart(2, '0') }),
    details,
    definition,
    element('div', { className: 'record__meta' }, tags.map((item) => tag(item.text, item.signal))),
  );
}

function setActivePage(page) {
  const definition = pages[page];
  viewLabel.textContent = definition.label;
  document.title = `${definition.title} — JRFANK Online Admin`;
  for (const link of navLinks) {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}

function currentPage() {
  const candidate = location.hash.slice(1);
  return Object.hasOwn(pages, candidate) ? candidate : 'dashboard';
}

function localMockHeaders() {
  const local = location.hostname === 'localhost' || location.hostname.endsWith('.localhost') || location.hostname === '127.0.0.1' || location.hostname === '[::1]';
  return local ? { 'x-admin-local-mock': 'true' } : {};
}

async function api(path) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json', ...localMockHeaders() },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = new Error(body?.error?.message ?? `Request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function renderError(error) {
  main.replaceChildren(pageHead(
    error.status === 401 ? 'Access required' : 'Runtime unavailable',
    error.status === 401 ? 'Authentication stopped here.' : 'The snapshot could not be read.',
    error.status === 401
      ? 'The static shell is present, but every API request independently requires a valid Cloudflare Access assertion. Sign in through the protected Admin hostname, or use the explicit local mock configuration on loopback.'
      : 'No repository data was changed. Check the local Worker output and configuration, then reload this page.',
  ));
}

function renderDashboard() {
  const stills = state.snapshot.sections.stills;
  const motion = state.snapshot.sections.motion;
  const assets = state.media.assets;
  const images = assets.filter((asset) => asset.kind === 'image').length;
  const videos = assets.filter((asset) => asset.kind === 'video').length;
  const source = state.snapshot.source;

  main.replaceChildren(
    pageHead('Checkpoint A / Read-only', 'Dashboard', 'A protected operational view of repository-owned content and manifest metadata. This surface cannot upload, edit, publish, or write to GitHub.'),
    element('div', { className: 'metric-grid', attrs: { 'aria-label': 'Snapshot totals' } },
      metric('Stills projects', stills.length, 'Repository content'),
      metric('Motion projects', motion.length, 'Temporary status retained'),
      metric('Image assets', images, 'Manifest entries'),
      metric('Video assets', videos, 'Manifest entries'),
    ),
    sectionTitle('Runtime contract', 'SYSTEM / A'),
    element('div', { className: 'prose-grid' },
      element('article', { className: 'prose-card' },
        element('span', { className: 'meta-label', text: 'Source' }),
        element('h3', { text: 'Repository build snapshot' }),
        element('dl', {},
          dataPair('Content root', source.contentRoot),
          dataPair('Manifest', source.manifestPath),
          dataPair('Fingerprint', source.sourceFingerprint),
          dataPair('Manifest authored', source.manifestGeneratedAt),
        ),
      ),
      element('article', { className: 'prose-card' },
        element('span', { className: 'meta-label', text: 'Boundary' }),
        element('h3', { text: 'Protected and deliberately inert' }),
        element('p', { text: 'Cloudflare Access protects the hostname. The Worker also validates its JWT on every API request. Local mock authentication is accepted only when explicitly enabled for a loopback request.' }),
        element('div', { className: 'record__meta' }, tag('READ ONLY', true), tag('NO R2 WRITES'), tag('NO GITHUB WRITES')),
      ),
    ),
  );
}

function renderHome() {
  const home = state.snapshot.sections.home;
  const featured = [...home.featuredStills, home.featuredMotion];
  main.replaceChildren(
    pageHead('Content / 01', 'Home', 'Current Home fields are shown as repository data. Layout, animation values, and approved frontend systems are intentionally absent from this admin contract.'),
    sectionTitle('Hero and introduction', 'HOME / CORE'),
    element('div', { className: 'prose-grid' },
      element('article', { className: 'prose-card' },
        element('span', { className: 'meta-label', text: 'Hero' }),
        element('h3', { text: home.hero.title.join(' ') }),
        element('dl', {}, dataPair('Chinese title', home.hero.titleZh), dataPair('Video media ID', home.hero.videoMediaId)),
      ),
      element('article', { className: 'prose-card' },
        element('span', { className: 'meta-label', text: 'Introduction' }),
        element('h3', { text: home.intro.accessibleHeading }),
        element('p', { text: home.intro.body }),
        element('dl', {}, dataPair('Chinese heading', home.intro.headingZh), dataPair('CTA', `${home.intro.cta} → ${home.intro.href}`)),
      ),
    ),
    sectionTitle('Featured work', 'HOME / SELECTED'),
    element('div', { className: 'record-list' }, featured.map((item, index) => contentRecord(
      index + 1,
      Array.isArray(item.title) ? item.title.join(' ') : item.title,
      item.titleZh,
      [{ text: item.id }, { text: item.location.en }, { text: item.date }],
      [['Route', item.href], ['Media', item.mediaIds?.join(', ') ?? [item.mainMediaId, ...item.satelliteMediaIds].join(', ')]],
    ))),
  );
}

function renderStills() {
  const projects = state.snapshot.sections.stills;
  main.replaceChildren(
    pageHead('Content / 02', 'Stills', 'Four approved data-driven case structures are visible here as a compact editorial inventory. Project blocks remain read-only.'),
    sectionTitle('Projects', `${projects.length} RECORDS`),
    element('div', { className: 'record-list' }, projects.map((project, index) => contentRecord(
      project.index.number || index + 1,
      bilingual(project.title),
      bilingual(project.summary),
      [{ text: project.year }, { text: `${project.blockCount} BLOCKS` }, { text: project.index.featured ? 'FEATURED' : 'STANDARD', signal: project.index.featured }],
      [['Slug', project.slug], ['Location', bilingual(project.location)], ['Cover', project.coverId]],
    ))),
  );
}

function renderMotion() {
  const projects = state.snapshot.sections.motion;
  main.replaceChildren(
    pageHead('Content / 03', 'Motion', 'Motion identity, poster relationships, and explicit asset policy are visible without exposing playback controls or changing the approved poster-only index behavior.'),
    sectionTitle('Projects', `${projects.length} RECORDS`),
    element('div', { className: 'record-list' }, projects.map((project) => contentRecord(
      project.index.number,
      bilingual(project.identity.title),
      bilingual(project.synopsis),
      [
        { text: project.identity.year },
        { text: project.hero.assetPolicy.toUpperCase(), signal: project.hero.assetPolicy !== 'production-ready' },
        { text: `${project.behindTheScenesCount} BTS` },
      ],
      [['Slug', project.slug], ['Location', bilingual(project.identity.location)], ['Poster', project.hero.posterId], ['Preview', project.hero.previewId ?? 'Not assigned'], ['Full film', project.hero.fullFilmId ?? 'Not assigned']],
    ))),
  );
}

function renderAbout() {
  const about = state.snapshot.sections.about;
  main.replaceChildren(
    pageHead('Content / 04', 'About', 'The current bilingual narrative scaffold and information groups are shown exactly as repository-owned content, including pending placeholders.'),
    sectionTitle('Narrative', 'ABOUT / STORY'),
    element('div', { className: 'prose-grid' },
      element('article', { className: 'prose-card' },
        element('span', { className: 'meta-label', text: 'Hero / statement' }),
        element('h3', { text: `${about.hero.line1} ${about.hero.line2}` }),
        element('p', { text: about.statement.body }),
        element('dl', {}, dataPair('Portrait', about.hero.portraitId), dataPair('Chinese statement', about.statement.bodyZh)),
      ),
      element('article', { className: 'prose-card' },
        element('span', { className: 'meta-label', text: 'Story scaffold' }),
        element('h3', { text: about.statement.title.join(' ') }),
        ...about.story.paragraphs.map((paragraph) => element('p', { text: paragraph })),
        element('dl', {}, dataPair('Media', about.story.mediaId), dataPair('Chinese companion', about.story.companionZh)),
      ),
    ),
    sectionTitle('Information groups', `${about.information.length} GROUPS`),
    element('div', { className: 'record-list' }, about.information.map((group, index) => contentRecord(
      index + 1,
      `${group.title} / ${group.titleZh}`,
      group.rows.map((row) => [row.primary, row.secondary].filter(Boolean).join(' — ')).join(' · '),
      [{ text: group.id }, { text: group.enabled ? 'ENABLED' : 'DISABLED', signal: !group.enabled }, { text: `${group.rows.length} ROWS` }],
      [],
    ))),
  );
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** exponent)).toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function variantTable(variants) {
  const table = element('table', { className: 'variant-table' });
  table.append(
    element('thead', {}, element('tr', {}, ...['Format', 'Width', 'Bytes', 'Object key'].map((label) => element('th', { text: label, attrs: { scope: 'col' } })))),
    element('tbody', {}, ...variants.map((variant) => element('tr', {},
      element('td', { text: variant.format }),
      element('td', { text: `${variant.width}px` }),
      element('td', { text: formatBytes(variant.bytes) }),
      element('td', { text: variant.key }),
    ))),
  );
  return table;
}

function mediaRecord(asset, index) {
  const fallback = element('div', {
    className: `media-thumb media-thumb--${asset.scope}${asset.kind === 'video' ? ' media-thumb--video' : ''}`,
    attrs: { role: 'img', 'aria-label': `${asset.kind} metadata preview fallback for ${asset.id}` },
  }, element('span', { text: asset.kind === 'video' ? 'POSTER' : asset.scope.toUpperCase() }));
  const identity = element('div', { className: 'media-identity' },
    fallback,
    element('div', {},
      element('h3', { text: asset.id }),
      element('p', { text: asset.bilingualMetadata.en }),
      element('p', { text: `繁中 metadata: ${asset.bilingualMetadata.zhHant}` }),
    ),
  );
  const details = element('details', {},
    element('summary', { text: `${asset.variantCount} manifest variant${asset.variantCount === 1 ? '' : 's'} · ${formatBytes(asset.variantBytes)} · ${asset.usageLocations.length} usage location${asset.usageLocations.length === 1 ? '' : 's'}` }),
    element('dl', {},
      dataPair('Usage locations', asset.usageLocations.length ? asset.usageLocations.join(' · ') : 'Not recorded'),
      dataPair('Preview source', asset.preview.reason),
      dataPair('Created', asset.createdAt),
      dataPair('Updated', asset.updatedAt),
      dataPair('Publish status', asset.publishStatus),
    ),
    asset.variants.length ? variantTable(asset.variants) : element('p', { text: 'No variants are recorded.' }),
  );
  return element('article', { className: 'record media-record' },
    element('span', { className: 'record-index', text: String(index + 1).padStart(2, '0') }),
    identity,
    element('dl', { className: 'record__meta' },
      dataPair('Dimensions', `${asset.width} × ${asset.height}`),
      dataPair('Ratio', Number(asset.aspectRatio).toFixed(3)),
      dataPair('Project', asset.projects.length ? asset.projects.join(', ') : 'Not recorded'),
      dataPair('Poster relation', asset.posterId ?? 'Not recorded'),
      asset.duration !== undefined ? dataPair('Duration', `${asset.duration}s`) : null,
    ),
    element('div', { className: 'record__meta' },
      tag(asset.kind.toUpperCase()),
      tag(asset.scope.toUpperCase()),
      ...(asset.roles.length ? asset.roles.map((role) => tag(role.toUpperCase())) : [tag('ROLE NOT RECORDED', true)]),
      tag(asset.recordStatus.toUpperCase()),
      asset.variantCount === 0 ? tag('NO VARIANTS', true) : null,
    ),
    details,
  );
}

async function updateMedia(filters, statusNode, listNode) {
  statusNode.textContent = 'Filtering manifest…';
  const params = new URLSearchParams({ ...filters, limit: '100' });
  try {
    state.media = await api(`/api/media?${params}`);
    state.mediaFilters = filters;
    statusNode.textContent = `${state.media.meta.filtered} of ${state.media.meta.total} assets match.`;
    listNode.replaceChildren(...state.media.assets.map(mediaRecord));
    if (state.media.assets.length === 0) listNode.append(element('p', { className: 'notice', text: 'No manifest entries match these filters.' }));
  } catch (error) {
    statusNode.textContent = error.message;
  }
}

function renderMedia() {
  const qInput = element('input', { attrs: { id: 'media-q', name: 'q', type: 'search', value: state.mediaFilters.q, maxlength: '80', autocomplete: 'off' } });
  const kindSelect = element('select', { attrs: { id: 'media-kind', name: 'kind' } },
    ...['all', 'image', 'video'].map((value) => element('option', { text: value === 'all' ? 'All kinds' : value, attrs: { value, ...(state.mediaFilters.kind === value ? { selected: '' } : {}) } })),
  );
  const scopeSelect = element('select', { attrs: { id: 'media-scope', name: 'scope' } },
    ...['all', 'home', 'stills', 'motion', 'about', 'site', 'other'].map((value) => element('option', { text: value === 'all' ? 'All scopes' : value, attrs: { value, ...(state.mediaFilters.scope === value ? { selected: '' } : {}) } })),
  );
  const roles = ['all', 'unassigned', 'hero', 'cover', 'gallery', 'rail', 'poster', 'satellite', 'filmstrip', 'bts', 'preview', 'full-film', 'about', 'social'];
  const roleSelect = element('select', { attrs: { id: 'media-role', name: 'role' } },
    ...roles.map((value) => element('option', { text: value === 'all' ? 'All roles' : value, attrs: { value, ...(state.mediaFilters.role === value ? { selected: '' } : {}) } })),
  );
  const statusNode = element('p', { className: 'filter-status', text: `${state.media.meta.filtered} of ${state.media.meta.total} assets shown.`, attrs: { 'aria-live': 'polite' } });
  const listNode = element('div', { className: 'record-list' }, ...state.media.assets.map(mediaRecord));
  const form = element('form', { className: 'filter-form', attrs: { 'aria-label': 'Filter media manifest' } },
    element('div', { className: 'field' }, element('label', { text: 'Search ID or metadata', attrs: { for: 'media-q' } }), qInput),
    element('div', { className: 'field' }, element('label', { text: 'Kind', attrs: { for: 'media-kind' } }), kindSelect),
    element('div', { className: 'field' }, element('label', { text: 'Scope', attrs: { for: 'media-scope' } }), scopeSelect),
    element('div', { className: 'field' }, element('label', { text: 'Role', attrs: { for: 'media-role' } }), roleSelect),
    element('button', { text: 'Apply filter', attrs: { type: 'submit' } }),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void updateMedia({ q: qInput.value.trim(), kind: kindSelect.value, scope: scopeSelect.value, role: roleSelect.value }, statusNode, listNode);
  });

  main.replaceChildren(
    pageHead('Manifest / 01', 'Media Library', 'Filter the complete committed media manifest by ID, descriptive metadata, kind, content scope, or fixed role. Object keys and rendition metadata are inspection-only.'),
    form,
    statusNode,
    listNode,
  );
}

function renderPublish() {
  main.replaceChildren(
    pageHead('Boundary / 01', 'Publish / Changes', 'Checkpoint A establishes identity, navigation, and read-only inspection. It intentionally provides no mutation controls, upload authorizations, GitHub integration, or deployment action.'),
    element('section', { className: 'boundary-panel', attrs: { 'aria-labelledby': 'boundary-title' } },
      element('div', {},
        element('p', { className: 'eyebrow', text: 'No actions available' }),
        element('h2', { text: 'This checkpoint stops before change.', attrs: { id: 'boundary-title' } }),
      ),
      element('ul', { className: 'boundary-list' },
        ...['No R2 upload or object mutation', 'No GitHub commit, branch, or pull request', 'No content editing or reordering', 'No Pages or Worker deployment', 'No production domain or Access policy configured'].map((item) => element('li', { text: item })),
      ),
    ),
    sectionTitle('Future state vocabulary', 'CONTRACT / ONLY'),
    element('div', { className: 'record__meta', attrs: { 'aria-label': 'Reserved future publish states' } },
      ...['DRAFT', 'UPLOADED', 'VALIDATED', 'PREVIEW READY', 'PUBLISHED', 'ERROR'].map((status) => tag(status, status === 'ERROR')),
    ),
    element('p', { className: 'notice', text: 'These labels reserve a future auditable workflow vocabulary only. They are not the status of any current asset and they do not activate a transition or action.' }),
    element('p', { className: 'notice', text: 'Future checkpoints require fresh authorization, owner-supplied Cloudflare configuration, a reviewed write model, immutable upload authorization, and auditable Git-based approval. None of those capabilities are implied by this shell.' }),
  );
}

function renderCurrentPage() {
  const page = currentPage();
  setActivePage(page);
  if (state.error) {
    renderError(state.error);
    return;
  }
  if (!state.snapshot || !state.media) return;
  ({
    dashboard: renderDashboard,
    home: renderHome,
    stills: renderStills,
    motion: renderMotion,
    about: renderAbout,
    media: renderMedia,
    publish: renderPublish,
  })[page]();
}

async function boot() {
  try {
    [state.session, state.snapshot, state.media] = await Promise.all([
      api('/api/session'),
      api('/api/content'),
      api('/api/media?limit=100'),
    ]);
    const identity = state.session.identity;
    sessionChip.dataset.mode = identity.mode;
    sessionChip.textContent = identity.mode === 'local-mock'
      ? 'Local mock · read only'
      : `${identity.email ?? 'Access owner'} · read only`;
  } catch (error) {
    state.error = error;
    sessionChip.textContent = error.status === 401 ? 'Access not verified' : 'Runtime unavailable';
  }
  renderCurrentPage();
}

window.addEventListener('hashchange', renderCurrentPage);
if (!location.hash || !Object.hasOwn(pages, location.hash.slice(1))) history.replaceState(null, '', '#dashboard');
setActivePage(currentPage());
void boot();
