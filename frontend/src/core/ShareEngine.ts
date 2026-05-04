import { CalculatedStats } from './types';

/**
 * v1.0.5 shareable link: client-side encoded snapshot of CalculatedStats.
 *
 * The URL is of the form:   /s#v1.<base64url-compressed-json>
 *
 * Nothing touches the server. The recipient's browser decompresses the hash
 * and hydrates the store for a read-only viewer mode.
 *
 * Size strategy:
 *   - mapData.nodes / edges are stored as [lon, lat] number pairs which are
 *     the bulk of the payload. We round them to 3 decimal places (≈110 m
 *     precision, plenty for a zoomed-out route map) before encoding.
 *   - Everything else in CalculatedStats is tiny (~40 fields of numbers /
 *     short strings) so we don't pre-process it.
 *   - DecompressionStream / CompressionStream are native in all modern
 *     browsers; no third-party compression dep needed.
 */

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

/**
 * Encode a CalculatedStats object into a URL hash fragment suitable for
 * pasting after `/s#`. Returns the fragment WITHOUT the leading `#`.
 */
export const encodeStatsToHash = async (stats: CalculatedStats): Promise<string> => {
  const json = JSON.stringify(slimStats(stats));
  const raw = new TextEncoder().encode(json);
  const compressed = await pipeThrough(raw, new CompressionStream('gzip'));
  return `${VERSION}.${toBase64Url(compressed)}`;
};

/**
 * Decode a hash fragment (with or without a leading `#`) back into a
 * CalculatedStats object. Throws on corrupt / wrong-version input; callers
 * should wrap in try/catch and show a user-friendly error.
 */
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
