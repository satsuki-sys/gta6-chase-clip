// gta6-clipper-01 entry program (Node 22, standard library only).
//
// The entry is the YouTube video itself; this program's whole job is to hand
// the video's address to the grader by copying VIDEO.json from the repository
// root into the output directory, byte for byte. Before copying, it sanity-
// checks that VIDEO.json parses and names a url, so a malformed file fails
// loudly here instead of at the gate.
//
// In the grader the repository is /bot and the output is /output; locally the
// two MAKEFUN_* variables stand in for them:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = join(botDir, 'VIDEO.json');

// The gate accepts a Shorts, watch or youtu.be address whose id is 11
// characters of letters, digits, "_" and "-"; mirror that shape here.
const VIDEO_URL = /^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}([?&#].*)?$/;

function videoUrlOf(value: unknown): string {
  if (typeof value !== 'object' || value === null) {
    throw new Error('VIDEO.json must be a JSON object with a string "url".');
  }
  const url = (value as { url?: unknown }).url;
  if (typeof url !== 'string' || !VIDEO_URL.test(url)) {
    throw new Error(`VIDEO.json's "url" is not a YouTube video address: ${String(url)}`);
  }
  return url;
}

try {
  videoUrlOf(JSON.parse(readFileSync(source, 'utf8')));
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, 'VIDEO.json'));
