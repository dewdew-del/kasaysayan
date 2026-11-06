// An original, slow plucked-string waltz in A minor, generated live with Web Audio.
// Composed for this project, so there are no copyright questions.

export const BEAT_MS = 520;

/** Bass + chord per bar (MIDI note numbers), three beats each. */
const BARS = [
  [45, 57, 60, 64],
  [50, 57, 62, 65],
  [52, 56, 59, 64],
  [45, 57, 60, 64],
  [53, 57, 60, 65],
  [50, 57, 62, 65],
  [52, 56, 59, 62],
  [45, 57, 60, 64],
];
/** Melody, one entry per beat (null = rest). */
const MEL = [76, null, 74, 72, null, 71, 72, null, null, 69, null, 71, 72, 74, 76, 77, null, 76, 74, null, 72, 71, null, null];

const freq = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

function pluck(ctx: AudioContext, f: number, t: number, volume: number, dur: number) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  o.type = "triangle";
  o.frequency.value = f;
  lp.type = "lowpass";
  lp.frequency.value = 1800;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(volume, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(lp).connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** Starts the waltz on `ctx` and returns a function that stops it. */
export function startWaltz(ctx: AudioContext): () => void {
  let beat = 0;
  const tick = () => {
    const t = ctx.currentTime + 0.05;
    const bar = BARS[Math.floor(beat / 3) % BARS.length];
    if (beat % 3 === 0) pluck(ctx, freq(bar[0]), t, 0.18, 2.2);
    else for (const [k, v] of [[1, 0.07], [2, 0.06], [3, 0.05]] as const) pluck(ctx, freq(bar[k]), t, v, 1.2);
    const m = MEL[beat % MEL.length];
    if (m) pluck(ctx, freq(m), t, 0.09, 1.6);
    beat++;
  };
  tick();
  const id = setInterval(tick, BEAT_MS);
  return () => clearInterval(id);
}
