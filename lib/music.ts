// Five original tunes played live with Web Audio, one after another.
// All composed for this project (only the genre names are traditional), so there
// are no copyright questions and no audio files to download.

/** A melody step: a MIDI note, a rest (null), or several notes splitting the beat. */
export type Step = number | null | number[];

export type Tune = {
  /** Short name shown on the music button. */
  name: string;
  /** What the genre is, for the button's tooltip. */
  title: string;
  beatMs: number;
  beatsPerBar: number;
  /** "block": bass on beat 1, chord on the other beats. "arp": bass, then the chord one note at a time. */
  style: "block" | "arp";
  /** Bass + three chord notes per bar (MIDI numbers). */
  bars: number[][];
  /** One step per beat; its length is bars × beatsPerBar. */
  mel: Step[];
  /** Bandurria-style tremolo on the melody (rondalla). */
  tremolo?: boolean;
  /** How many times the tune repeats before the next one starts. */
  loops: number;
};

export const TUNES: Tune[] = [
  {
    name: "Lumang Balse",
    title: "Old waltz",
    beatMs: 520,
    beatsPerBar: 3,
    style: "block",
    bars: [
      [45, 57, 60, 64],
      [50, 57, 62, 65],
      [52, 56, 59, 64],
      [45, 57, 60, 64],
      [53, 57, 60, 65],
      [50, 57, 62, 65],
      [52, 56, 59, 62],
      [45, 57, 60, 64],
    ],
    mel: [76, null, 74, 72, null, 71, 72, null, null, 69, null, 71, 72, 74, 76, 77, null, 76, 74, null, 72, 71, null, null],
    loops: 3,
  },
  {
    name: "Harana",
    title: "Serenade",
    beatMs: 600,
    beatsPerBar: 4,
    style: "arp",
    bars: [
      [50, 62, 66, 69],
      [47, 62, 66, 71],
      [43, 62, 67, 71],
      [45, 61, 64, 67],
      [50, 62, 66, 69],
      [42, 61, 66, 69],
      [43, 62, 67, 71],
      [45, 61, 64, 67],
    ],
    mel: [
      78, null, 76, 74,
      74, null, 71, 74,
      79, null, 78, 76,
      76, null, null, 73,
      78, 81, null, 78,
      78, 76, 73, 76,
      74, 76, 79, 78,
      76, null, 73, null,
    ],
    loops: 3,
  },
  {
    name: "Kundiman",
    title: "Love song, minor turning to major",
    beatMs: 640,
    beatsPerBar: 3,
    style: "block",
    bars: [
      [40, 55, 59, 64],
      [45, 57, 60, 64],
      [47, 57, 59, 63],
      [40, 55, 59, 64],
      [48, 55, 60, 64],
      [45, 57, 60, 64],
      [47, 57, 59, 63],
      [47, 57, 59, 63],
      [40, 56, 59, 64],
      [45, 57, 61, 64],
      [47, 57, 59, 63],
      [40, 56, 59, 64],
      [49, 56, 61, 64],
      [45, 57, 61, 64],
      [47, 57, 59, 63],
      [40, 56, 59, 64],
    ],
    mel: [
      71, 76, 79,
      76, null, 72,
      75, 78, 81,
      79, null, 76,
      72, 76, 79,
      81, null, 76,
      78, 75, 71,
      75, null, null,
      76, 80, 83,
      81, null, 76,
      78, 81, 78,
      80, null, 76,
      73, 76, 80,
      81, 80, 78,
      75, 78, 71,
      76, null, null,
    ],
    loops: 2,
  },
  {
    name: "Rondalla",
    title: "String-band march",
    beatMs: 380,
    beatsPerBar: 2,
    style: "block",
    tremolo: true,
    bars: [
      [43, 59, 62, 67],
      [43, 59, 62, 67],
      [50, 57, 60, 66],
      [50, 57, 60, 66],
      [50, 57, 60, 66],
      [50, 57, 60, 66],
      [43, 59, 62, 67],
      [43, 59, 62, 67],
      [43, 59, 62, 67],
      [43, 59, 62, 67],
      [48, 60, 64, 67],
      [48, 60, 64, 67],
      [43, 59, 62, 67],
      [50, 57, 60, 66],
      [43, 59, 62, 67],
      [43, 59, 62, 67],
    ],
    mel: [
      [79, 81], 83,
      [81, 79], 74,
      [78, 79], 81,
      [79, 78], 76,
      [78, 76], 74,
      [76, 78], 81,
      [79, 78], [79, 81],
      79, null,
      [83, 84], 86,
      [84, 83], 79,
      [76, 79], 84,
      [84, 83], 81,
      [79, 83], 86,
      [84, 81], 78,
      [79, 83], [81, 78],
      79, null,
    ],
    loops: 3,
  },
  {
    name: "Habagat",
    title: "Monsoon lullaby",
    beatMs: 300,
    beatsPerBar: 6,
    style: "arp",
    bars: [
      [41, 57, 60, 65],
      [38, 57, 62, 65],
      [46, 58, 62, 65],
      [48, 58, 60, 64],
      [41, 57, 60, 65],
      [38, 57, 62, 65],
      [48, 58, 60, 64],
      [41, 57, 60, 65],
    ],
    mel: [
      81, null, null, 79, null, 77,
      77, null, null, 74, null, null,
      74, null, 77, 82, null, 81,
      79, null, null, 76, null, null,
      72, null, 77, 81, null, 84,
      81, null, null, 77, null, 74,
      76, null, 79, 82, null, 79,
      77, null, null, null, null, null,
    ],
    loops: 3,
  },
];

/** Beats in one pass of a tune. */
export const tuneLength = (t: Tune) => t.bars.length * t.beatsPerBar;

const freq = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
const ARP = [0, 1, 2, 3, 2, 1];
const LOOKAHEAD_S = 0.4;
const TICK_MS = 100;
const GAP_S = 1.4;
const FADE_S = 0.4;

function pluck(ctx: AudioContext, out: AudioNode, f: number, t: number, volume: number, dur: number) {
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
  o.connect(lp).connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** Schedules every note of one beat of `tune` at time `t`. */
function playBeat(ctx: AudioContext, out: AudioNode, tune: Tune, beat: number, t: number) {
  const s = tune.beatMs / 1000;
  const bar = tune.bars[Math.floor(beat / tune.beatsPerBar) % tune.bars.length];
  const pos = beat % tune.beatsPerBar;

  if (pos === 0) pluck(ctx, out, freq(bar[0]), t, 0.18, s * 4);
  else if (tune.style === "arp") {
    if (tune.beatsPerBar === 6 && pos === 3) pluck(ctx, out, freq(bar[0]), t, 0.1, s * 3);
    pluck(ctx, out, freq(bar[ARP[pos % ARP.length] || 1]), t, 0.06, s * 2.5);
  } else for (const [k, v] of [[1, 0.07], [2, 0.06], [3, 0.05]] as const) pluck(ctx, out, freq(bar[k]), t, v, s * 2.2);

  const step = tune.mel[beat % tune.mel.length];
  if (step === null || step === undefined) return;
  const notes = Array.isArray(step) ? step : [step];
  const each = s / notes.length;
  notes.forEach((n, i) => {
    const at = t + i * each;
    if (tune.tremolo) {
      for (let k = 0; k * 0.085 < each; k++) pluck(ctx, out, freq(n), at + k * 0.085, 0.07, 0.22);
    } else pluck(ctx, out, freq(n), at, 0.09, Math.max(0.6, each * 3));
  });
}

export type Player = {
  /** Fades out and stops for good. */
  stop: () => void;
  /** Fades out the current tune and starts the next one. */
  next: () => void;
};

/**
 * Plays the tunes in order, starting at `start`, looping the whole list.
 * Notes are scheduled a little ahead on the audio clock, so a busy page doesn't make them stutter.
 */
export function startPlaylist(ctx: AudioContext, opts: { start?: number; onTune?: (index: number) => void } = {}): Player {
  let index = ((opts.start ?? 0) % TUNES.length + TUNES.length) % TUNES.length;
  let beat = 0;
  let at = ctx.currentTime + 0.1;
  let out = newOut();

  function newOut() {
    const g = ctx.createGain();
    g.gain.value = 0.8;
    g.connect(ctx.destination);
    return g;
  }
  function fade(g: GainNode) {
    const now = ctx.currentTime;
    g.gain.cancelScheduledValues(now);
    g.gain.setValueAtTime(g.gain.value, now);
    g.gain.linearRampToValueAtTime(0, now + FADE_S);
    setTimeout(() => g.disconnect(), (FADE_S + 0.2) * 1000);
  }
  function advance() {
    index = (index + 1) % TUNES.length;
    beat = 0;
    opts.onTune?.(index);
  }

  const tick = () => {
    while (at < ctx.currentTime + LOOKAHEAD_S) {
      const tune = TUNES[index];
      playBeat(ctx, out, tune, beat, at);
      at += tune.beatMs / 1000;
      beat++;
      if (beat >= tuneLength(tune) * tune.loops) {
        advance();
        at += GAP_S;
      }
    }
  };
  tick();
  const id = setInterval(tick, TICK_MS);

  return {
    stop() {
      clearInterval(id);
      fade(out);
    },
    next() {
      fade(out);
      out = newOut();
      advance();
      at = ctx.currentTime + FADE_S;
    },
  };
}
