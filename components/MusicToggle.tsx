"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { startPlaylist, TUNES, type Player } from "@/lib/music";

type AudioCtor = typeof AudioContext;
const getCtor = (): AudioCtor | undefined =>
  typeof window === "undefined" ? undefined : (window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext);

export const MUSIC_PREF_KEY = "kasaysayan-music";
const GESTURES = ["pointerdown", "keydown", "touchend", "click"] as const;

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
 * Music, on by default. Browsers only allow sound after the visitor interacts with the page,
 * so it starts on the first click, tap or key press anywhere. It lives in the site layout,
 * so it keeps playing while you move between the map and the stories. Turning it off is
 * remembered in this browser. Hidden if Web Audio is missing.
 */
export default function MusicToggle() {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<"off" | "waiting" | "on">("off");
  const [tune, setTune] = useState(0);
  const ctx = useRef<AudioContext | null>(null);
  const player = useRef<Player | null>(null);
  const tuneRef = useRef(0);

  const onTune = useCallback((i: number) => {
    tuneRef.current = i;
    setTune(i);
  }, []);

  const play = useCallback(() => {
    try {
      const Ctor = getCtor()!;
      ctx.current ??= new Ctor();
      const c = ctx.current;
      player.current ??= startPlaylist(c, { start: tuneRef.current, onTune });
      // resume() only succeeds inside a real user gesture; until then keep waiting.
      c.resume()
        .then(() => {
          if (c.state === "running" && player.current) setState("on");
        })
        .catch(() => {});
      if (c.state === "running") setState("on");
    } catch {
      setSupported(false);
    }
  }, [onTune]);

  const stop = useCallback(() => {
    player.current?.stop();
    player.current = null;
  }, []);

  useEffect(() => {
    const ok = Boolean(getCtor());
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
      const c = ctx.current;
      if (!c) return;
      if (document.hidden) c.suspend?.().catch(() => {});
      else c.resume().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [state]);

  useEffect(
    () => () => {
      player.current?.stop();
      void ctx.current?.close().catch(() => {});
    },
    [],
  );

  if (!supported) return null;

  const toggle = () => {
    if (state === "on") {
      stop();
      savePref("off");
      setState("off");
      return;
    }
    savePref("on");
    play();
  };

  const current = TUNES[tune];
  const label = state === "on" ? "Music on" : state === "waiting" ? "Start music" : "Music off";

  return (
    <div className="music-box">
      <button type="button" className="music" aria-pressed={state === "on"} onClick={toggle} title={state === "on" ? "Turn the music off" : "Turn the music on"}>
        ♪ {label}
      </button>
      {state === "on" && (
        <>
          <span className="tune-name" title={current.title}>
            {current.name}
          </span>
          <button type="button" className="music next" aria-label={`Next tune (now playing ${current.name})`} onClick={() => player.current?.next()}>
            »
          </button>
        </>
      )}
    </div>
  );
}
