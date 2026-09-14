import { execFileSync } from 'node:child_process';
import { extname } from 'node:path';

const binaryMediaExtensions = new Set(['.avif', '.gif', '.heic', '.jpeg', '.jpg', '.mov', '.mp4', '.png', '.tif', '.tiff', '.webm', '.webp']);
const allowedTrackedPrefixes = ['public/mock-media/', 'outputs/', 'reference/'];
const forbiddenTrackedPrefixes = ['media-source/masters/', 'media-source/prepared/', 'public/production-media/'];
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);

const forbiddenRoots = tracked.filter((path) => forbiddenTrackedPrefixes.some((prefix) => path.startsWith(prefix)));
if (forbiddenRoots.length > 0) throw new Error(`Production media root contains tracked files:\n${forbiddenRoots.join('\n')}`);

const unexpectedMedia = tracked.filter((path) =>
  binaryMediaExtensions.has(extname(path).toLowerCase())
  && !allowedTrackedPrefixes.some((prefix) => path.startsWith(prefix)),
);
if (unexpectedMedia.length > 0) throw new Error(`Tracked binary media exists outside approved mock/evidence roots:\n${unexpectedMedia.join('\n')}`);

console.log(`Checked ${tracked.length} tracked files: production masters/derivatives are untracked; binary media is confined to approved mock and historical reference/evidence roots.`);
