import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const roots = ['out', '.next/static'];
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.txt']);
const forbiddenNames = ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'];

async function filesUnder(root: string): Promise<string[]> {
  const files: string[] = [];
  async function walk(path: string): Promise<void> {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (entry.isFile() && textExtensions.has(extname(entry.name))) files.push(child);
    }
  }
  await walk(root);
  return files;
}

async function main(): Promise<void> {
  const values = forbiddenNames
    .map((name) => process.env[name])
    .filter((value): value is string => Boolean(value && value.length >= 8));
  let scanned = 0;
  for (const root of roots) {
    for (const path of await filesUnder(root)) {
      scanned += 1;
      const content = await readFile(path, 'utf8');
      const forbiddenName = forbiddenNames.find((name) => content.includes(name));
      if (forbiddenName) throw new Error(`Client output exposes upload-only secret name ${forbiddenName}: ${relative(process.cwd(), path)}`);
      if (values.some((value) => content.includes(value))) throw new Error(`Client output contains an upload-only secret value: ${relative(process.cwd(), path)}`);
    }
  }
  console.log(`Scanned ${scanned} client/static output files: no R2 credential names or supplied secret values found.`);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
