import { describe, expect, test } from "vitest";
import { MAP_H, MAP_W, coastPaths, doodles, isOnLand, markerPositions, project } from "@/lib/map";
import type { Event } from "@/lib/events";

const ev = (id: string, place?: { lat: number; lng: number }) =>
  ({ id, place: place ? { name: id, ...place } : undefined }) as unknown as Event;

describe("map geometry", () => {
  test("projects Manila inside bounds", () => {
    const [x, y] = project(120.98, 14.58);
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(MAP_W);
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThan(MAP_H);
  });

  test("north is up and east is right", () => {
    const [xManila, yManila] = project(120.98, 14.58);
    const [xDavao, yDavao] = project(125.61, 7.07);
    expect(xDavao).toBeGreaterThan(xManila);
    expect(yDavao).toBeGreaterThan(yManila);
  });

  test("Batanes is inside the map", () => {
    const [, y] = project(121.97, 20.45);
    expect(y).toBeGreaterThan(0);
  });

  test("coast paths are SVG path strings for every island", () => {
    const paths = coastPaths();
    expect(paths.length).toBeGreaterThan(50);
    for (const d of paths) expect(d).toMatch(/^M[\d.]+,[\d.]+.*Z$/);
  });

  test("Manila and Cebu are on land, the Sulu Sea is not", () => {
    expect(isOnLand(...project(121.05, 14.6))).toBe(true);
    expect(isOnLand(...project(123.9, 10.3))).toBe(true);
    expect(isOnLand(...project(120.5, 8.5))).toBe(false);
  });

  test("offsets stacked markers", () => {
    const manila = { lat: 14.58, lng: 120.98 };
    const pos = markerPositions([ev("a", manila), ev("b", manila), ev("c", manila)]);
    const pts = ["a", "b", "c"].map((id) => pos.get(id)!);
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        expect(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)).toBeGreaterThanOrEqual(8);
      }
  });

  test("nationwide event yields no marker", () => {
    const pos = markerPositions([ev("nationwide"), ev("manila", { lat: 14.58, lng: 120.98 })]);
    expect(pos.has("nationwide")).toBe(false);
    const m = pos.get("manila")!;
    expect(Number.isFinite(m.x) && Number.isFinite(m.y)).toBe(true);
  });

  test("doodles are deterministic and on land", () => {
    const a = doodles(7);
    expect(a).toEqual(doodles(7));
    expect(a.length).toBeGreaterThan(20);
    for (const d of a) {
      expect(["palm", "hill"]).toContain(d.kind);
      expect(isOnLand(d.x, d.y)).toBe(true);
    }
  });
});
