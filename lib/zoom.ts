// Pure math for zooming and panning the map's SVG viewBox.
import { MAP_H, MAP_W } from "./map";

export type View = { x: number; y: number; w: number; h: number };

export const MAX_ZOOM = 6;
/** How far past the map edge you may pan, as a fraction of the map. */
const SLACK = 0.05;

export const fullView = (): View => ({ x: 0, y: 0, w: MAP_W, h: MAP_H });

export const zoomLevel = (v: View) => MAP_W / v.w;

export function clampView(v: View): View {
  const w = Math.max(MAP_W / MAX_ZOOM, Math.min(MAP_W, v.w));
  const h = (w * MAP_H) / MAP_W;
  const x = Math.max(-MAP_W * SLACK, Math.min(v.x, MAP_W * (1 + SLACK) - w));
  const y = Math.max(-MAP_H * SLACK, Math.min(v.y, MAP_H * (1 + SLACK) - h));
  return { x, y, w, h };
}

/** Zoom by `factor` (>1 = in) around the map point (cx, cy), which stays under the cursor. */
export function zoomView(v: View, factor: number, cx: number, cy: number): View {
  const w = Math.max(MAP_W / MAX_ZOOM, Math.min(MAP_W, v.w / factor));
  const k = w / v.w;
  return clampView({ x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, w, h: (w * MAP_H) / MAP_W });
}

/** Move the view by (dx, dy) map units. */
export const panView = (v: View, dx: number, dy: number): View => clampView({ ...v, x: v.x + dx, y: v.y + dy });

/** Center the view on a map point, keeping the zoom. */
export const centerView = (v: View, x: number, y: number): View => clampView({ ...v, x: x - v.w / 2, y: y - v.h / 2 });

/** True when (x, y) sits inside the middle 70% of the view. */
export const isComfortablyInView = (v: View, x: number, y: number) =>
  x > v.x + v.w * 0.15 && x < v.x + v.w * 0.85 && y > v.y + v.h * 0.15 && y < v.y + v.h * 0.85;
