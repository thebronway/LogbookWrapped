import { CalculatedStats } from './types';

const VERSION = 'v1';

/** Round a coordinate pair to 3 decimals (≈110 m) in place-returning form. */
const roundCoord = (c: [number, number]): [number, number] => [
  Math.round(c[0] * 1000) / 1000,
  Math.round(c[1] * 1000) / 1000,
];

/** Slim the stats down before compression. Returned object is JSON-safe. */
const slimStats = (stats: CalculatedStats): any => {
  const slim: any = { ...stats };
  if (stats.mapData) {
    slim.mapData = {
      nodes: stats.mapData.nodes.map(roundCoord),
      edges: stats.mapData.edges.map(([a, b]) => [roundCoord(a), roundCoord(b)]),
      bounds: stats.mapData.bounds,
      homeBaseCoords: stats.mapData.homeBaseCoords ? roundCoord(stats.mapData.homeBaseCoords) : null,
    };
  }
  return slim;
};

/**
 * Browser-safe base64url (RFC 4648 §5) encode/decode for Uint8Array payloads.
 * URL-safe characters only (no `+`, `/`, or `=` padding that would need
 * percent-encoding in a hash fragment).
 */
const toBase64Url = (bytes: Uint8Array): string => {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (s: string): Uint8Array => {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

/** Run a Uint8Array through a TransformStream (gzip / gunzip). */
const pipeThrough = async (input: Uint8Array, stream: TransformStream): Promise<Uint8Array> => {
  const blob = new Blob([new Uint8Array(input)]);
  const compressedStream = blob.stream().pipeThrough(stream);
  const compressedBlob = await new Response(compressedStream).blob();
  return new Uint8Array(await compressedBlob.arrayBuffer());
};

export const encodeStatsToHash = async (stats: CalculatedStats): Promise<string> => {
  const json = JSON.stringify(slimStats(stats));
  const raw = new TextEncoder().encode(json);
  const compressed = await pipeThrough(raw, new CompressionStream('gzip'));
  return `${VERSION}.${toBase64Url(compressed)}`;
};

export const decodeHashToStats = async (hash: string): Promise<CalculatedStats> => {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  const dot = clean.indexOf('.');
  if (dot === -1) throw new Error('Malformed share link: missing version prefix.');
  const version = clean.slice(0, dot);
  const payload = clean.slice(dot + 1);
  if (version !== VERSION) {
    throw new Error(`Unsupported share link version "${version}". This link was created by a newer app build.`);
  }
  const compressed = fromBase64Url(payload);
  const decompressed = await pipeThrough(compressed, new DecompressionStream('gzip'));
  const json = new TextDecoder().decode(decompressed);
  return JSON.parse(json) as CalculatedStats;
};

/** Full URL the user will actually copy/share. */
export const buildShareUrl = (hashFragment: string): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://logbookwrapped.com';
  return `${origin}/s#${hashFragment}`;
};
