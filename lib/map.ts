// Geometry for the vintage SVG map: a simple equirectangular projection of the
// Philippines, coastline paths from data/ph-coast.json, and the palm/hill doodles.
import coast from "../data/ph-coast.json";
import type { Event } from "./events";

/** Map bounds in degrees. Top edge is 21.2 so Batanes (lat ~20.8) fits. */
export const LNG_MIN = 116.4;
export const LNG_MAX = 127.2;
export const LAT_MIN = 4.6;
export const LAT_MAX = 21.2;
/** SVG units per degree. */
export const K = 40;

export const MAP_W = (LNG_MAX - LNG_MIN) * K;
export const MAP_H = (LAT_MAX - LAT_MIN) * K;

export type Point = [number, number];

export function project(lng: number, lat: number): Point {
  return [(lng - LNG_MIN) * K, (LAT_MAX - lat) * K];
}

type Ring = [number, number][];
type CoastFeature = { geometry: { type: "Polygon"; coordinates: Ring[] } };

/** Outer ring of each island, projected to SVG units. */
const ISLANDS: Point[][] = (coast as unknown as { features: CoastFeature[] }).features.map((f) =>
  f.geometry.coordinates[0].map(([lng, lat]) => project(lng, lat)),
);

const r1 = (n: number) => n.toFixed(1);

/** One closed SVG path per island. */
export function coastPaths(): string[] {
  return ISLANDS.map((pts) => `M${pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join("L")}Z`);
}

function inPolygon(x: number, y: number, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function isOnLand(x: number, y: number): boolean {
  return ISLANDS.some((p) => inPolygon(x, y, p));
}

export type Doodle = { kind: "palm" | "hill"; x: number; y: number };

/** Deterministic palms and hills scattered on land (same seed, same picture on every build). */
export function doodles(seed: number, attempts = 400): Doodle[] {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out: Doodle[] = [];
  for (let n = 0; n < attempts; n++) {
    const x = rnd() * MAP_W;
    const y = rnd() * MAP_H;
    const kindRoll = rnd();
    if (!isOnLand(x, y)) continue;
    // keep doodles apart so they read as drawings, not noise
    if (out.some((d) => Math.hypot(d.x - x, d.y - y) < 26)) continue;
    out.push({ kind: kindRoll < 0.45 ? "hill" : "palm", x, y });
  }
  return out;
}

/** Marker position per event id. Events at the same spot are fanned out so each stays clickable. */
export function markerPositions(events: Pick<Event, "id" | "place">[]): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  const stack = new Map<string, number>();
  for (const e of events) {
    if (!e.place) continue;
    const [x, y] = project(e.place.lng, e.place.lat);
    const key = `${Math.round(x / 14)},${Math.round(y / 14)}`;
    const n = stack.get(key) ?? 0;
    stack.set(key, n + 1);
    out.set(e.id, { x: x + n * 9, y: y - n * 7 });
  }
  return out;
}
