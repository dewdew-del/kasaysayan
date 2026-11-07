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

/** Events whose true points are closer than this (map units, about 0.3°) share one cluster. */
export const CLUSTER_RADIUS = 16;
/** Spacing of the spiral that fans a cluster out around its centre. */
const SPIRAL_STEP = 7.2;

export type MarkerPos = { x: number; y: number; tx: number; ty: number; cluster: number };

/**
 * Marker position per event id. Events near each other are grouped into a cluster and
 * fanned out on a small spiral around the cluster centre, so each stays visible and clickable
 * without drifting far from where it happened. tx/ty keep the true projected point.
 */
export function markerPositions(events: Pick<Event, "id" | "place">[]): Map<string, MarkerPos> {
  const clusters: { cx: number; cy: number; ids: { id: string; tx: number; ty: number }[] }[] = [];
  for (const e of events) {
    if (!e.place) continue;
    const [tx, ty] = project(e.place.lng, e.place.lat);
    const c = clusters.find((k) => Math.hypot(k.cx - tx, k.cy - ty) < CLUSTER_RADIUS);
    if (c) c.ids.push({ id: e.id, tx, ty });
    else clusters.push({ cx: tx, cy: ty, ids: [{ id: e.id, tx, ty }] });
  }
  const out = new Map<string, MarkerPos>();
  clusters.forEach((c, ci) => {
    c.ids.forEach((m, n) => {
      // Vogel spiral: n=0 at the centre, then outward at the golden angle.
      const r = n === 0 ? 0 : SPIRAL_STEP * Math.sqrt(n);
      const a = n * 2.39996;
      out.set(m.id, { x: c.cx + r * Math.cos(a), y: c.cy + r * Math.sin(a), tx: m.tx, ty: m.ty, cluster: ci });
    });
  });
  relax([...out.values()]);
  return out;
}

/** Minimum gap between any two markers, in map units. */
const MIN_GAP = 7;

/** Nudges markers that sit closer than MIN_GAP apart (for example from neighbouring clusters). */
function relax(ps: MarkerPos[]) {
  for (let iter = 0; iter < 40; iter++) {
    let moved = false;
    for (let i = 0; i < ps.length; i++)
      for (let j = i + 1; j < ps.length; j++) {
        const dx = ps[j].x - ps[i].x;
        const dy = ps[j].y - ps[i].y;
        const d = Math.hypot(dx, dy);
        if (d >= MIN_GAP) continue;
        const ux = d ? dx / d : 1;
        const uy = d ? dy / d : 0;
        const push = (MIN_GAP - d) / 2 + 0.01;
        ps[i].x -= ux * push;
        ps[i].y -= uy * push;
        ps[j].x += ux * push;
        ps[j].y += uy * push;
        moved = true;
      }
    if (!moved) break;
  }
}
