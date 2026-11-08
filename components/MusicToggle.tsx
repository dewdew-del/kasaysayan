"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startPlaylist, type Player } from "@/lib/music";
import { TRACKS } from "@/lib/tracks";

type AudioCtor = typeof AudioContext;
const getCtor = (): AudioCtor | undefined =>
  typeof window === "undefined" ? undefined : (window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext);

export const MUSIC_PREF_KEY = "kasaysayan-music";
const GESTURES = ["pointerdown", "keydown", "touchend", "click"] as const;
const VOLUME = 0.6;

function readPref(): "on" | "off" {
  try {
    return window.localStorage.getItem(MUSIC_PREF_KEY) === "off" ? "off" : "on";
  } catch {
    return "on";
  }
}
function savePref(v: "on" | "off") {
  try {
    window.localStorage.setItem(MUSIC_PREF_KEY, v);
  } catch {
    // private mode: the choice just isn't remembered
  }
}

/**
 * Music, on by default: old Philippine recordings plus one original waltz, one after another.
 * Browsers only allow sound after the visitor interacts with the page, so it starts on the
 * first click, tap or key press anywhere. It lives in the site layout, so it keeps playing
 * while you move between the map and the stories. Turning it off is remembered.
 */
export default function MusicToggle() {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"off" | "waiting" | "on">("off");
  const [track, setTrack] = useState(0);
  const trackRef = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const synth = useRef<Player | null>(null);

  const silence = useCallback(() => {
    audio.current?.pause();
    synth.current?.stop();
    synth.current = null;
  }, []);

  /** Starts track `i`; resolves once sound is allowed, rejects if the browser blocks it. */
  const startTrack = useCallback(
    (i: number): Promise<void> => {
      silence();
      const n = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
      trackRef.current = n;
      setTrack(n);
      const t = TRACKS[n];
      if (t.src) {
        if (!audio.current) {
          audio.current = new Audio();
          audio.current.volume = VOLUME;
          audio.current.preload = "auto";
          audio.current.onended = () => void startTrack(trackRef.current + 1).catch(() => {});
        }
        audio.current.src = t.src;
        return Promise.resolve(audio.current.play());
      }
      const Ctor = getCtor();
      if (!Ctor) return startTrack(n + 1);
      ctx.current ??= new Ctor();
      const c = ctx.current;
      // The waltz plays its loops once; when it moves on, go to the next track.
      synth.current = startPlaylist(c, { onTune: () => void startTrack(trackRef.current + 1).catch(() => {}) });
      return c.resume().then(() => {
        if (c.state !== "running") throw new Error("blocked");
      });
    },
    [silence],
  );

  const play = useCallback(() => {
    startTrack(trackRef.current)
      .then(() => setState("on"))
      .catch(() => silence()); // still blocked: keep waiting for the next interaction
  }, [startTrack, silence]);

  useEffect(() => {
    const ok = typeof window !== "undefined" && typeof window.Audio === "function";
    setSupported(ok);
    if (ok && readPref() === "on") setState("waiting");
  }, []);

  // Waiting: the first interaction anywhere (outside the music controls) starts the music.
  useEffect(() => {
    if (state !== "waiting") return;
    const onGesture = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(".music-box")) return;
      play();
    };
    for (const g of GESTURES) window.addEventListener(g, onGesture, true);
    return () => {
      for (const g of GESTURES) window.removeEventListener(g, onGesture, true);
    };
  }, [state, play]);

  // Pause while the tab is hidden, pick up again when it's back.
  useEffect(() => {
    if (state !== "on") return;
    const onVis = () => {
      if (document.hidden) {
        audio.current?.pause();
        ctx.current?.suspend?.().catch(() => {});
      } else if (TRACKS[trackRef.current].src) {
        void audio.current?.play().catch(() => {});
      } else {
        ctx.current?.resume().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [state]);

  useEffect(
    () => () => {
      audio.current?.pause();
      synth.current?.stop();
      void ctx.current?.close().catch(() => {});
    },
    [],
  );

  if (!supported) return null;

  const toggle = () => {
    if (state === "on") {
      silence();
      savePref("off");
      setState("off");
      return;
    }
    savePref("on");
    play();
  };

  const current = TRACKS[track];
  const label = state === "on" ? "Music on" : state === "waiting" ? "Start music" : "Music off";

  return (
    <div className="music-box">
      <button type="button" className="music" aria-pressed={state === "on"} onClick={toggle} title={state === "on" ? "Turn the music off" : "Turn the music on"}>
        ♪ {label}
      </button>
      {state === "on" && (
        <>
          <span className="tune-name" title={`${current.about}. ${current.performer}.`}>
            {current.name}
          </span>
          <button type="button" className="music next" aria-label={`Next track (now playing ${current.name})`} onClick={() => void startTrack(trackRef.current + 1).catch(() => {})}>
            »
          </button>
        </>
      )}
    </div>
  );
}
