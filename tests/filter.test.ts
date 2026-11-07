import { describe, expect, test } from "vitest";
import { filterByTopic, parseTopic } from "@/lib/filter";
import { clampView, fullView, panView, zoomView } from "@/lib/zoom";
import { MAP_H, MAP_W } from "@/lib/map";
import { makeEvent } from "./helpers";

const events = [
  makeEvent({ id: "mactan", topics: ["war", "visayas"] }),
  makeEvent({ id: "lci", topics: ["culture"] }),
  makeEvent({ id: "bataan", topics: ["war"] }),
];

describe("filterByTopic", () => {
  test("filterByTopic null returns all", () => {
    expect(filterByTopic(events, null).map((e) => e.id)).toEqual(["mactan", "lci", "bataan"]);
  });

  test("filterByTopic war returns only war events", () => {
    expect(filterByTopic(events, "war").map((e) => e.id)).toEqual(["mactan", "bataan"]);
  });

  test("parseTopic accepts known topics only", () => {
    expect(parseTopic("war")).toBe("war");
    expect(parseTopic("sports")).toBeNull();
    expect(parseTopic(null)).toBeNull();
  });
});

describe("zoom math", () => {
  test("zooming in keeps the point under the cursor in place", () => {
    const v = zoomView(fullView(), 2, 300, 200);
    expect(v.w).toBeCloseTo(MAP_W / 2);
    // the cursor point stays at the same fraction of the view
    expect((300 - v.x) / v.w).toBeCloseTo(300 / MAP_W);
    expect((200 - v.y) / v.h).toBeCloseTo(200 / MAP_H);
  });

  test("zoom is limited to 1x–6x", () => {
    expect(zoomView(fullView(), 100, 0, 0).w).toBeCloseTo(MAP_W / 6);
    expect(zoomView(fullView(), 0.01, 0, 0).w).toBeCloseTo(MAP_W);
  });

  test("panning stops at the map edge", () => {
    const zoomed = zoomView(fullView(), 3, MAP_W / 2, MAP_H / 2);
    const far = panView(zoomed, -99999, -99999);
    expect(far.x + far.w).toBeLessThanOrEqual(MAP_W * 1.05 + 0.001);
    expect(clampView({ x: -500, y: -500, w: MAP_W, h: MAP_H }).x).toBeGreaterThanOrEqual(-MAP_W * 0.05);
  });
});

describe("scale bar ticks", () => {
  test("tick labels are short years, with BP for prehistoric dates", async () => {
    const { pickTicks } = await import("@/components/Storyteller");
    const cards = [
      { date: { label: "c. 67,000–50,000 years ago", sort: -67000, approx: true as const } },
      { date: { year: 900, month: 4, day: 21 } },
      { date: { label: "1565–1815", sort: 1565.5, approx: true as const } },
      { date: { year: 2019, month: 1, day: 21 } },
    ];
    expect(pickTicks(cards as never).map((t) => t.label)).toEqual(["67,000 BP", "900", "1565", "2019"]);
  });
});
