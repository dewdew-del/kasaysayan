import { afterEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import MusicToggle, { MUSIC_PREF_KEY } from "@/components/MusicToggle";
import { startPlaylist, TUNES, tuneLength } from "@/lib/music";

// A minimal fake of the Web Audio API: enough nodes to count notes. The clock follows Date.now().
function fakeAudio() {
  const created = { ctx: 0, osc: 0, resumed: 0, closed: 0 };
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} });
  const node = () => ({ connect: (n: unknown) => n, disconnect() {}, gain: param() });
  class Ctx {
    t0 = Date.now();
    state = "suspended";
    destination = {};
    get currentTime() {
      return (Date.now() - this.t0) / 1000;
    }
    constructor() {
      created.ctx++;
    }
    resume() {
      created.resumed++;
      this.state = "running";
      return Promise.resolve();
    }
    suspend() {
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
  window.localStorage.clear();
  delete (window as { AudioContext?: unknown }).AudioContext;
});

describe("MusicToggle", () => {
  test("hides when AudioContext unavailable", () => {
    const { container } = render(<MusicToggle />);
    expect(container.querySelector("button")).toBeNull();
  });

  test("is on by default and starts on the first click anywhere", async () => {
    const { Ctx, created } = fakeAudio();
    (window as { AudioContext?: unknown }).AudioContext = Ctx;
    render(<MusicToggle />);
    expect(created.ctx).toBe(0);
    expect(screen.getByRole("button", { name: /Start music/ })).toBeInTheDocument();
    await act(async () => {
      fireEvent.pointerDown(document.body);
    });
    expect(created.ctx).toBe(1);
    expect(created.resumed).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Music on/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Next tune/ })).toBeInTheDocument();
  });

  test("turning it off stops the notes and is remembered", async () => {
    vi.useFakeTimers();
    const { Ctx, created } = fakeAudio();
    (window as { AudioContext?: unknown }).AudioContext = Ctx;
    const { unmount } = render(<MusicToggle />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start music/ }));
    });
    const btn = screen.getByRole("button", { name: /Music on/ });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(window.localStorage.getItem(MUSIC_PREF_KEY)).toBe("off");
    const notes = created.osc;
    vi.advanceTimersByTime(5000);
    expect(created.osc).toBe(notes);
    unmount();
    render(<MusicToggle />);
    expect(screen.getByRole("button", { name: /Music off/ })).toBeInTheDocument();
  });
});

describe("tunes", () => {
  test("there are several tunes and each melody fills its bars", () => {
    expect(TUNES.length).toBeGreaterThanOrEqual(5);
    for (const t of TUNES) {
      expect(t.mel.length, t.name).toBe(tuneLength(t));
      for (const b of t.bars) expect(b.length, t.name).toBe(4);
    }
  });

  test("startPlaylist keeps scheduling notes, moves to the next tune, and stops", () => {
    vi.useFakeTimers();
    const { Ctx, created } = fakeAudio();
    const seen: number[] = [];
    const p = startPlaylist(new Ctx() as unknown as AudioContext, { onTune: (i) => seen.push(i) });
    const first = created.osc;
    expect(first).toBeGreaterThan(0);
    vi.advanceTimersByTime(2000);
    expect(created.osc).toBeGreaterThan(first);
    p.next();
    expect(seen).toEqual([1]);
    p.stop();
    const after = created.osc;
    vi.advanceTimersByTime(3000);
    expect(created.osc).toBe(after);
  });
});
