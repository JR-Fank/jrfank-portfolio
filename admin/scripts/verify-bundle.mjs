import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const browserRoot = new URL('../public/', import.meta.url);
const workerRoot = new URL('../dist/worker/', import.meta.url);
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.txt']);
const serverOnlyNames = [
  'TEAM_DOMAIN',
  'POLICY_AUD',
  'R2_ACCOUNT_ID',
  'R2_BUCKET',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'GITHUB_APP_ID',
  'GITHUB_APP_PRIVATE_KEY',
  'GITHUB_TOKEN',
];
const suppliedValues = serverOnlyNames
  .map((name) => process.env[name])
  .filter((value) => value && value.length >= 8);
const credentialPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /gh[oprsu]_[A-Za-z0-9_]{30,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
];

async function filesUnder(rootUrl) {
  const rootPath = rootUrl.pathname;
  const files = [];
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (entry.isFile() && (textExtensions.has(extname(entry.name)) || entry.name === '_headers')) files.push(child);
    }
  }
  if (!(await stat(rootPath)).isDirectory()) throw new Error(`Bundle root is missing: ${rootPath}`);
  await walk(rootPath);
  return files;
}

let browserFiles = 0;
for (const path of await filesUnder(browserRoot)) {
  browserFiles += 1;
  const content = await readFile(path, 'utf8');
  const exposedName = serverOnlyNames.find((name) => content.includes(name));
  if (exposedName) throw new Error(`Browser asset exposes server-only binding name ${exposedName}: ${relative(process.cwd(), path)}`);
  if (suppliedValues.some((value) => content.includes(value))) throw new Error(`Browser asset contains a supplied server-only value: ${relative(process.cwd(), path)}`);
  if (credentialPatterns.some((pattern) => pattern.test(content))) throw new Error(`Browser asset contains a credential-shaped value: ${relative(process.cwd(), path)}`);
}

let workerFiles = 0;
for (const path of await filesUnder(workerRoot)) {
  workerFiles += 1;
  const content = await readFile(path, 'utf8');
  if (suppliedValues.some((value) => content.includes(value))) throw new Error(`Worker bundle contains a supplied server-only value: ${relative(process.cwd(), path)}`);
  if (credentialPatterns.some((pattern) => pattern.test(content))) throw new Error(`Worker bundle contains a credential-shaped value: ${relative(process.cwd(), path)}`);
}

console.log(`Scanned ${browserFiles} browser assets and ${workerFiles} Worker outputs: no server-only names in browser assets and no supplied secret values in either bundle.`);
