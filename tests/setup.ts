import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Vitest runs without globals, so Testing Library can't register its own cleanup.
afterEach(() => cleanup());

// jsdom has no layout engine: stub the browser APIs the storyteller uses.
if (typeof window !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
  window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as never;
}
