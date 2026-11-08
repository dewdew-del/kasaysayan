import { existsSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import MusicToggle, { MUSIC_PREF_KEY } from "@/components/MusicToggle";
import { startPlaylist, TUNES, tuneLength } from "@/lib/music";
import { TRACKS } from "@/lib/tracks";

// A minimal fake of the Web Audio API: enough nodes to count notes. The clock follows Date.now().
function fakeAudio() {
  const created = { ctx: 0, osc: 0 };
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
      this.state = "running";
      return Promise.resolve();
    }
    suspend() {
      return Promise.resolve();
    }
    close() {
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

let played: string[] = [];
let paused = 0;
beforeEach(() => {
  played = [];
  paused = 0;
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    played.push(this.src);
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {
    paused++;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.localStorage.clear();
  delete (window as { AudioContext?: unknown }).AudioContext;
});

describe("MusicToggle", () => {
  test("is on by default and starts the first recording on the first click anywhere", async () => {
    render(<MusicToggle />);
    expect(screen.getByRole("button", { name: /Start music/ })).toBeInTheDocument();
    expect(played).toHaveLength(0);
    await act(async () => {
      fireEvent.pointerDown(document.body);
    });
    expect(played[0]).toContain(TRACKS[0].src);
    expect(screen.getByRole("button", { name: /Music on/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(TRACKS[0].name)).toBeInTheDocument();
  });

  test("the next button moves to the next recording", async () => {
    render(<MusicToggle />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start music/ }));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Next track/ }));
    });
    expect(played[1]).toContain(TRACKS[1].src);
    expect(screen.getByText(TRACKS[1].name)).toBeInTheDocument();
  });

  test("stays waiting if the browser blocks sound", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.reject(new Error("NotAllowedError")));
    render(<MusicToggle />);
    await act(async () => {
      fireEvent.pointerDown(document.body);
    });
    expect(screen.getByRole("button", { name: /Start music/ })).toBeInTheDocument();
  });

  test("turning it off pauses the music and is remembered", async () => {
    const { unmount } = render(<MusicToggle />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start music/ }));
    });
    const before = paused;
    fireEvent.click(screen.getByRole("button", { name: /Music on/ }));
    expect(paused).toBeGreaterThan(before);
    expect(window.localStorage.getItem(MUSIC_PREF_KEY)).toBe("off");
    unmount();
    render(<MusicToggle />);
    expect(screen.getByRole("button", { name: /Music off/ })).toBeInTheDocument();
  });
});

describe("tracks", () => {
  test("every recording file exists and every track is credited with a free license", () => {
    for (const t of TRACKS) {
      if (t.src) expect(existsSync(path.join("public", t.src)), t.src).toBe(true);
      expect(t.license, t.name).toMatch(/^(Public domain|CC0|CC BY(-SA)? \d\.\d)/);
      expect(t.performer.length, t.name).toBeGreaterThan(0);
    }
    expect(TRACKS.some((t) => !t.src)).toBe(true); // the live waltz is in the list
  });

  test("the waltz melody fills its bars", () => {
    for (const t of TUNES) expect(t.mel.length, t.name).toBe(tuneLength(t));
  });

  test("startPlaylist keeps scheduling notes, reports when the tune ends, and stops", () => {
    vi.useFakeTimers();
    const { Ctx, created } = fakeAudio();
    const seen: number[] = [];
    const p = startPlaylist(new Ctx() as unknown as AudioContext, { onTune: (i) => seen.push(i) });
    const first = created.osc;
    expect(first).toBeGreaterThan(0);
    vi.advanceTimersByTime(2000);
    expect(created.osc).toBeGreaterThan(first);
    p.next();
    expect(seen).toHaveLength(1);
    p.stop();
    const after = created.osc;
    vi.advanceTimersByTime(3000);
    expect(created.osc).toBe(after);
  });
});
