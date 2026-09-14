import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

import type { VideoIntake } from './contracts';

const execFileAsync = promisify(execFile);

interface FfprobeStream {
  readonly codec_type?: string;
  readonly codec_name?: string;
  readonly pix_fmt?: string;
  readonly width?: number;
  readonly height?: number;
}

interface FfprobeOutput {
  readonly streams?: readonly FfprobeStream[];
  readonly format?: { readonly duration?: string };
}

export async function validatePreparedVideo(path: string, asset: VideoIntake): Promise<void> {
  let stdout: string;
  try {
    ({ stdout } = await execFileAsync('ffprobe', [
      '-v', 'error',
      '-show_streams',
      '-show_format',
      '-of', 'json',
      path,
    ], { encoding: 'utf8' }));
  } catch (error) {
    throw new Error(`ffprobe is required to validate production video derivatives before manifest generation: ${String(error)}`);
  }

  const probe = JSON.parse(stdout) as FfprobeOutput;
  const video = probe.streams?.find((stream) => stream.codec_type === 'video');
  const audio = probe.streams?.find((stream) => stream.codec_type === 'audio');
  if (!video || video.codec_name !== 'h264') {
    throw new Error(`${asset.id} must contain H.264 video.`);
  }
  if (video.pix_fmt !== 'yuv420p') {
    throw new Error(`${asset.id} must use yuv420p pixel format; found ${video.pix_fmt ?? 'unknown'}.`);
  }
  if (video.width !== asset.width || video.height !== asset.height) {
    throw new Error(`${asset.id} dimensions differ from intake metadata (${video.width}x${video.height} vs ${asset.width}x${asset.height}).`);
  }
  if (Boolean(audio) !== asset.hasAudio) {
    throw new Error(`${asset.id} audio-stream state differs from intake metadata.`);
  }
  if (asset.role === 'preview' && audio) {
    throw new Error(`${asset.id} preview contains a forbidden audio stream.`);
  }
  const duration = Number(probe.format?.duration);
  if (!Number.isFinite(duration) || Math.abs(duration - asset.duration) > 0.25) {
    throw new Error(`${asset.id} duration differs from intake metadata (${duration} vs ${asset.duration}).`);
  }

  const bytes = await readFile(path);
  const moov = bytes.indexOf(Buffer.from('moov'));
  const mdat = bytes.indexOf(Buffer.from('mdat'));
  if (moov < 0 || mdat < 0 || moov > mdat) {
    throw new Error(`${asset.id} is not faststart: the moov atom must precede mdat.`);
  }
}
