import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';

import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { z } from 'zod';

import { CACHE_CONTROL, assertRepositoryRelative, assertSafeGeneratedPath, cliString, parseCliArgs, repositoryPath, sha256 } from './contracts';

const uploadObjectSchema = z.object({
  key: z.string().startsWith('v1/'),
  localPath: z.string().min(1),
  bytes: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  contentType: z.enum(['image/avif', 'image/webp', 'image/jpeg', 'video/mp4']),
  cacheControl: z.literal(CACHE_CONTROL),
});
const uploadPlanSchema = z.object({
  version: z.literal(1),
  manifestPath: z.string().min(1),
  objects: z.array(uploadObjectSchema),
});
type UploadObject = z.infer<typeof uploadObjectSchema>;

function requiredSecret(name: 'R2_ACCOUNT_ID' | 'R2_BUCKET' | 'R2_ACCESS_KEY_ID' | 'R2_SECRET_ACCESS_KEY'): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required only for --apply publishing.`);
  return value;
}

function isMissing(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return candidate.name === 'NotFound' || candidate.name === 'NoSuchKey' || candidate.$metadata?.httpStatusCode === 404;
}

function isPreconditionConflict(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return candidate.name === 'PreconditionFailed' || candidate.$metadata?.httpStatusCode === 412;
}

async function verifyLocalObject(object: UploadObject, apply: boolean): Promise<void> {
  assertRepositoryRelative(object.localPath, 'Upload localPath');
  if (apply) assertSafeGeneratedPath(object.localPath);
  assertRepositoryRelative(object.key, 'Upload key');
  const file = await readFile(repositoryPath(object.localPath));
  if (!object.key.includes(object.sha256.slice(0, 12))) throw new Error(`Upload key does not contain its content-hash prefix: ${object.key}`);
  if (/(?:^|\/)(?:img|dsc)[-_]?\d+/i.test(object.key)) throw new Error(`Camera filename is forbidden in upload key: ${object.key}`);
  if (file.byteLength !== object.bytes) throw new Error(`Upload plan byte count differs from local file: ${object.key}`);
  if (sha256(file) !== object.sha256) throw new Error(`Upload plan hash differs from local file: ${object.key}`);
}

async function verifyRemoteHead(client: S3Client, bucket: string, object: UploadObject): Promise<void> {
  const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: object.key }));
  if (head.ContentLength !== object.bytes) throw new Error(`Remote byte count mismatch: ${object.key}`);
  if (head.ContentType !== object.contentType) throw new Error(`Remote Content-Type mismatch: ${object.key}`);
  if (head.CacheControl !== object.cacheControl) throw new Error(`Remote Cache-Control mismatch: ${object.key}`);
  if (head.Metadata?.sha256 !== object.sha256) throw new Error(`Remote sha256 metadata mismatch: ${object.key}`);
}

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));
  const planPath = cliString(args, 'plan', '.media-work/upload-plan.json');
  const apply = args.has('apply');
  if (apply && args.has('dry-run')) throw new Error('Choose either --dry-run or --apply, not both.');
  assertRepositoryRelative(planPath, 'Upload plan');
  const plan = uploadPlanSchema.parse(JSON.parse(await readFile(repositoryPath(planPath), 'utf8')) as unknown);
  assertRepositoryRelative(plan.manifestPath, 'Manifest path');
  await stat(repositoryPath(plan.manifestPath));
  if (new Set(plan.objects.map((object) => object.key)).size !== plan.objects.length) throw new Error('Upload plan contains duplicate object keys.');
  for (const object of plan.objects) await verifyLocalObject(object, apply);

  console.log(`${apply ? '[apply]' : '[dry-run]'} immutable R2 upload plan: ${plan.objects.length} object(s).`);
  for (const object of plan.objects) {
    console.log(`  ${object.key} | ${object.contentType} | ${object.bytes} bytes | ${object.sha256.slice(0, 12)}`);
  }
  if (!apply) {
    console.log('[dry-run] No credentials were read and no network request was made.');
    console.log('[dry-run] Apply mode would HEAD every key, atomically create only missing keys with If-None-Match: *, and HEAD-verify bytes, type, cache policy, and sha256 metadata.');
    return;
  }

  const accountId = requiredSecret('R2_ACCOUNT_ID');
  const bucket = requiredSecret('R2_BUCKET');
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requiredSecret('R2_ACCESS_KEY_ID'),
      secretAccessKey: requiredSecret('R2_SECRET_ACCESS_KEY'),
    },
  });

  for (const object of plan.objects) {
    let exists = false;
    try {
      await verifyRemoteHead(client, bucket, object);
      exists = true;
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    if (exists) {
      console.log(`verified existing immutable object: ${object.key}`);
      continue;
    }
    try {
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: object.key,
        Body: createReadStream(repositoryPath(object.localPath)),
        ContentLength: object.bytes,
        ContentType: object.contentType,
        CacheControl: object.cacheControl,
        Metadata: { sha256: object.sha256 },
        IfNoneMatch: '*',
      }));
    } catch (error) {
      if (!isPreconditionConflict(error)) throw error;
      await verifyRemoteHead(client, bucket, object);
      console.log(`verified concurrently created immutable object: ${object.key}`);
      continue;
    }
    await verifyRemoteHead(client, bucket, object);
    console.log(`uploaded and verified immutable object: ${object.key}`);
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
