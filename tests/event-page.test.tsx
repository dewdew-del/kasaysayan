import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { img, makeEvent } from "./helpers";

// Leaflet can't run in jsdom: replace the client-only mini map with a marker.
vi.mock("next/dynamic", () => ({
  default: () =>
    function MiniMapStub({ place }: { place: { name: string } }) {
      return <div data-testid="mini-map">{place.name}</div>;
    },
}));

import EventArticle from "@/components/EventArticle";

const body = `## A leader in exile

By the end of 1897, the revolution had stalled.[1]

{{photo:2}}

Then the world changed.[2]

## The return

Aguinaldo came home on 19 May 1898.

## Twelve June

The declaration was read aloud.[1]`;

const kawit = makeEvent({
  id: "kawit",
  title: "Declaration of Philippine Independence",
  body,
  images: [img(1, "kawit"), img(2, "kawit"), img(3, "kawit"), img(4, "kawit")],
  sources: [
    { title: "Declaration of Independence", publisher: "NHCP", url: "https://nhcp.gov.ph/a", accessed: "2026-11-06" },
    { title: "Battle of Manila Bay", publisher: "US Navy History", url: "https://history.navy.mil/b", accessed: "2026-11-06" },
  ],
});
const prev = makeEvent({ id: "gomburza", title: "Execution of Gomburza" });
const next = makeEvent({ id: "commonwealth", title: "The Commonwealth begins" });

describe("EventArticle", () => {
  test("renders story body, numbered sources, credit line", () => {
    render(<EventArticle event={kawit} prev={prev} next={next} />);
    expect(screen.getByRole("heading", { level: 1, name: "Declaration of Philippine Independence" })).toBeInTheDocument();
    expect(screen.getByText(/the revolution had stalled/)).toBeInTheDocument();
    const sources = screen.getByRole("list", { name: "Sources" });
    const items = within(sources).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByRole("link")).toHaveAttribute("href", "https://nhcp.gov.ph/a");
    // [1] in the text links to source 1
    expect(screen.getAllByRole("link", { name: "[1]" })[0]).toHaveAttribute("href", "#source-1");
    // every photo has a credit with author, license and a link to its source page
    expect(screen.getAllByText(/Unknown author\. Public domain/).length).toBeGreaterThanOrEqual(3);
  });

  test("renders chapter headings with roman numerals", () => {
    render(<EventArticle event={kawit} prev={prev} next={next} />);
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings.slice(0, 3)).toEqual(["IA leader in exile", "IIThe return", "IIITwelve June"]);
  });

  test("places {{photo:n}} between paragraphs and leaves it out of the gallery", () => {
    const { container } = render(<EventArticle event={kawit} prev={prev} next={next} />);
    const chapter = container.querySelector(".chapter")!;
    expect(chapter.querySelector("figure img")).toHaveAttribute("src", "/images/events/kawit-2.webp");
    const gallery = screen.getByRole("region", { name: "More photographs" });
    const srcs = within(gallery).getAllByRole("img").map((i) => i.getAttribute("src"));
    expect(srcs).toEqual(["/images/events/kawit-3.webp", "/images/events/kawit-4.webp"]);
  });

  test("lightbox opens on click, wraps from last to first, closes on Escape", () => {
    render(<EventArticle event={kawit} prev={prev} next={next} />);
    const gallery = screen.getByRole("region", { name: "More photographs" });
    fireEvent.click(within(gallery).getAllByRole("button")[1]); // photo 4 of 4
    const box = screen.getByRole("dialog", { name: "Photo viewer" });
    expect(within(box).getByText("4 / 4")).toBeInTheDocument();
    expect(within(box).getByRole("button", { name: "Close" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(within(box).getByText("1 / 4")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(within(box).getByText("4 / 4")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Photo viewer" })).toBeNull();
  });

  test("gallery hidden when all images are placed or used as cover", () => {
    const e = makeEvent({ id: "k2", body, images: [img(1, "k2"), img(2, "k2")] });
    render(<EventArticle event={e} prev={undefined} next={undefined} />);
    expect(screen.queryByRole("region", { name: "More photographs" })).toBeNull();
  });

  test("shows Sources differ note when contested", () => {
    const e = makeEvent({ id: "p", contested: true, contestedNote: "Eyewitnesses named different places." });
    render(<EventArticle event={e} prev={undefined} next={undefined} />);
    expect(screen.getByText("Sources differ.")).toBeInTheDocument();
    expect(screen.getByText(/Eyewitnesses named different places/)).toBeInTheDocument();
  });

  test('nationwide event shows "whole archipelago" instead of map', () => {
    render(<EventArticle event={makeEvent({ id: "n", place: undefined })} prev={undefined} next={undefined} />);
    expect(screen.queryByTestId("mini-map")).toBeNull();
    expect(screen.getAllByText(/whole archipelago/).length).toBeGreaterThan(0);
  });

  test("shows the mini map for events with a place", () => {
    render(<EventArticle event={kawit} prev={prev} next={next} />);
    expect(screen.getByTestId("mini-map")).toHaveTextContent("Kawit, Cavite");
  });

  test("Earlier/Later links follow sort order", () => {
    render(<EventArticle event={kawit} prev={prev} next={next} />);
    expect(screen.getByRole("link", { name: /Earlier.*Execution of Gomburza/ })).toHaveAttribute("href", "/events/gomburza");
    expect(screen.getByRole("link", { name: /Later.*The Commonwealth begins/ })).toHaveAttribute("href", "/events/commonwealth");
  });

  test("shows the reading time", () => {
    render(<EventArticle event={kawit} prev={prev} next={next} />);
    expect(screen.getByText(/1 min read/)).toBeInTheDocument();
  });
});

describe("generateStaticParams", () => {
  test("generateStaticParams excludes unverified", async () => {
    vi.resetModules();
    vi.doMock("@/lib/events", () => ({
      getPublishedEvents: () => [makeEvent({ id: "a" }), makeEvent({ id: "b" })],
      getEvent: () => undefined,
    }));
    const page = await import("@/app/events/[id]/page");
    expect(page.dynamicParams).toBe(false);
    expect(await page.generateStaticParams()).toEqual([{ id: "a" }, { id: "b" }]);
    vi.doUnmock("@/lib/events");
  });
});

describe("generateStaticParams with no events", () => {
  test("returns one placeholder so the static export still builds", async () => {
    vi.resetModules();
    vi.doMock("@/lib/events", () => ({ getPublishedEvents: () => [], getEvent: () => undefined }));
    const page = await import("@/app/events/[id]/page");
    expect(await page.generateStaticParams()).toEqual([{ id: "_none" }]);
    vi.doUnmock("@/lib/events");
  });
});
