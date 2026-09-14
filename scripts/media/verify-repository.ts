import { execFileSync } from 'node:child_process';
import { extname } from 'node:path';

const foundationBaseline = 'a5c8390028c25bfc10a619b64d0da4f7ce625eb6';
const binaryMediaExtensions = new Set([
  '.3fr', '.aif', '.aiff', '.ari', '.arw', '.avif', '.braw', '.cr2', '.cr3', '.dng', '.erf',
  '.flac', '.flv', '.gif', '.heic', '.heif', '.iiq', '.jpeg', '.jpg', '.m2ts', '.m4a', '.m4v',
  '.mkv', '.mos', '.mov', '.mp3', '.mp4', '.mts', '.mxf', '.nef', '.nrw', '.orf', '.pef',
  '.png', '.raf', '.raw', '.rwl', '.rw2', '.sr2', '.srf', '.srw', '.tif', '.tiff', '.wav',
  '.webm', '.webp', '.wmv',
]);
const legacyMediaPrefixes = ['public/mock-media/', 'outputs/', 'reference/'];
const forbiddenTrackedPrefixes = ['media-source/masters/', 'media-source/prepared/', 'public/production-media/'];
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const baselineTracked = new Set(execFileSync('git', ['ls-tree', '-r', '--name-only', foundationBaseline], { encoding: 'utf8' }).split('\n').filter(Boolean));

for (const probe of ['.media-work/.guard.jpg', 'work/.guard.mov', 'media-source/masters/.guard.dng', 'media-source/prepared/.guard.mp4', 'public/mock-media/v1/.guard.avif', 'public/production-media/.guard.webp']) {
  try {
    execFileSync('git', ['check-ignore', '--quiet', '--no-index', probe], { stdio: 'ignore' });
  } catch {
    throw new Error(`Required production-media path is not ignored: ${probe}`);
  }
}

const forbiddenRoots = tracked.filter((path) => forbiddenTrackedPrefixes.some((prefix) => path.startsWith(prefix)));
if (forbiddenRoots.length > 0) throw new Error(`Production media root contains tracked files:\n${forbiddenRoots.join('\n')}`);

const unexpectedMedia = tracked.filter((path) =>
  binaryMediaExtensions.has(extname(path).toLowerCase())
  && !(baselineTracked.has(path) && legacyMediaPrefixes.some((prefix) => path.startsWith(prefix))),
);
if (unexpectedMedia.length > 0) throw new Error(`Tracked binary media is not part of the approved foundation baseline:\n${unexpectedMedia.join('\n')}`);

const changedLegacyMedia = execFileSync('git', ['diff', '--name-only', foundationBaseline, '--', ...legacyMediaPrefixes], { encoding: 'utf8' })
  .split('\n')
  .filter((path) => path && binaryMediaExtensions.has(extname(path).toLowerCase()));
if (changedLegacyMedia.length > 0) throw new Error(`Approved baseline mock/reference/evidence binary changed:\n${changedLegacyMedia.join('\n')}`);

console.log(`Checked ${tracked.length} tracked files: production roots are ignored/untracked and every tracked binary matches the approved ${foundationBaseline.slice(0, 8)} mock/reference/evidence baseline.`);
