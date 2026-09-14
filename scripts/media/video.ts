import { cliString, parseCliArgs, readCatalog, repositoryPath } from './contracts';
import { validatePreparedVideo } from './video-lib';

function quote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function printPlan(args: Map<string, string | true>): void {
  const input = cliString(args, 'input');
  const outputPrefix = cliString(args, 'output-prefix', 'media-source/prepared/film');
  const previewSeconds = Number(cliString(args, 'preview-seconds', '8'));
  if (!Number.isFinite(previewSeconds) || previewSeconds <= 0) throw new Error('--preview-seconds must be positive.');
  const audioApproved = args.has('full-audio');
  const preview = `${outputPrefix}-preview.mp4`;
  const film = `${outputPrefix}-full-film.mp4`;
  console.log('Validated command plan only; no transcode was started.');
  console.log('Preview (muted, no audio stream, H.264, yuv420p, faststart):');
  console.log([
    'ffmpeg -hide_banner -i', quote(input),
    '-map_metadata -1 -an',
    `-t ${previewSeconds}`,
    '-vf', quote("scale='min(1280,iw)':-2:flags=lanczos,format=yuv420p"),
    '-c:v libx264 -preset slow -crf 24 -movflags +faststart',
    quote(preview),
  ].join(' '));
  console.log(`Full film (${audioApproved ? 'explicitly approved AAC audio' : 'muted/no audio'}, H.264, yuv420p, faststart):`);
  console.log([
    'ffmpeg -hide_banner -i', quote(input),
    '-map_metadata -1',
    '-vf', quote("scale='min(1920,iw)':-2:flags=lanczos,format=yuv420p"),
    '-c:v libx264 -preset slow -crf 20 -movflags +faststart',
    audioApproved ? '-c:a aac -b:a 192k' : '-an',
    quote(film),
  ].join(' '));
  console.log('Run media:video:validate against the matching catalog entry before media:prepare accepts either derivative.');
}

async function validate(args: Map<string, string | true>): Promise<void> {
  const catalogPath = cliString(args, 'catalog');
  const id = cliString(args, 'id');
  const catalog = await readCatalog(catalogPath);
  const asset = catalog.assets.find((candidate) => candidate.id === id);
  if (!asset || asset.kind !== 'video') throw new Error(`Video intake entry not found: ${id}`);
  await validatePreparedVideo(repositoryPath(asset.source), asset);
  console.log(`Validated video derivative ${id}: H.264, yuv420p, faststart, dimensions, duration, and audio policy.`);
}

async function main(): Promise<void> {
  const [command, ...rest] = process.argv.slice(2);
  const args = parseCliArgs(rest);
  if (command === 'plan') {
    printPlan(args);
  } else if (command === 'validate') {
    await validate(args);
  } else {
    throw new Error('Expected video command: plan or validate.');
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
