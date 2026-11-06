import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import MusicToggle from "@/components/MusicToggle";
import { startWaltz } from "@/lib/waltz";

// A minimal fake of the Web Audio API: enough nodes to count notes.
function fakeAudio() {
  const created = { ctx: 0, osc: 0, resumed: 0, closed: 0 };
  const node = () => ({ connect: (n: unknown) => n, gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} } });
  class Ctx {
    currentTime = 0;
    destination = {};
    constructor() {
      created.ctx++;
    }
    resume() {
      created.resumed++;
      return Promise.resolve();
    }
    close() {
      created.closed++;
      return Promise.resolve();
    }
    createOscillator() {
      created.osc++;
      return { ...node(), type: "", frequency: { value: 0 }, start() {}, stop() {} };
    }
    createGain() {
      return node();
    }
    createBiquadFilter() {
      return { ...node(), type: "", frequency: { value: 0 } };
    }
  }
  return { Ctx, created };
}

afterEach(() => {
  vi.useRealTimers();
  delete (window as { AudioContext?: unknown }).AudioContext;
});

describe("MusicToggle", () => {
  test("hides when AudioContext unavailable", () => {
    const { container } = render(<MusicToggle />);
    expect(container.querySelector("button")).toBeNull();
  });

  test("creates and resumes context only on click", () => {
    const { Ctx, created } = fakeAudio();
    (window as { AudioContext?: unknown }).AudioContext = Ctx;
    render(<MusicToggle />);
    expect(created.ctx).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: /Music/ }));
    expect(created.ctx).toBe(1);
    expect(created.resumed).toBe(1);
  });

  test("aria-pressed reflects state and second click stops", () => {
    vi.useFakeTimers();
    const { Ctx, created } = fakeAudio();
    (window as { AudioContext?: unknown }).AudioContext = Ctx;
    render(<MusicToggle />);
    const btn = screen.getByRole("button", { name: /Music/ });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    const notes = created.osc;
    vi.advanceTimersByTime(5000);
    expect(created.osc).toBe(notes); // no more notes after stopping
  });
});

describe("startWaltz", () => {
  test("plays notes on a 520 ms beat until stopped", () => {
    vi.useFakeTimers();
    const { Ctx, created } = fakeAudio();
    const stop = startWaltz(new Ctx() as unknown as AudioContext);
    const first = created.osc;
    expect(first).toBeGreaterThan(0);
    vi.advanceTimersByTime(520 * 3);
    expect(created.osc).toBeGreaterThan(first);
    stop();
    const after = created.osc;
    vi.advanceTimersByTime(520 * 6);
    expect(created.osc).toBe(after);
  });
});
