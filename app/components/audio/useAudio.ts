"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const AUDIO_SRC = "/music/elite-one-ambient.mp3";
const TARGET_VOLUME = 0.2;
const FADE_DURATION_MS = 2000;
const MUTE_STORAGE_KEY = "eliteOneSpaAudioMuted";

interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  isUnlocked: boolean;
}

let state: AudioState = {
  isPlaying: false,
  isMuted: false,
  isUnlocked: false,
};

const listeners = new Set<() => void>();
let audioEl: HTMLAudioElement | null = null;
let fadeFrame: number | null = null;
let isStarting = false;
let hasReadStoredMute = false;
let pausedForVisibility = false;
let visibilityHandlersAttached = false;

function setState(patch: Partial<AudioState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return state;
}

function readStoredMute() {
  if (hasReadStoredMute || typeof window === "undefined") return;
  hasReadStoredMute = true;
  try {
    if (window.localStorage.getItem(MUTE_STORAGE_KEY) === "1") {
      state = { ...state, isMuted: true };
    }
  } catch {
    // localStorage indisponible (navigation privée) — le son reste actif pour cette visite.
  }
}

function ensureAudioElement(): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio(AUDIO_SRC);
    audioEl.loop = true;
    audioEl.preload = "auto";
    audioEl.volume = 0;
    audioEl.muted = state.isMuted;
    attachVisibilityHandlers();
  }
  return audioEl;
}

function cancelFade() {
  if (fadeFrame !== null) {
    cancelAnimationFrame(fadeFrame);
    fadeFrame = null;
  }
}

/**
 * Coupe immédiatement la lecture quand la page n'est plus visible (onglet changé,
 * app mise en arrière-plan, etc.). N'affecte pas `state.isPlaying`/`isMuted` : ce
 * sont des pauses techniques, pas un choix utilisateur — le bouton mute/unmute et
 * la reprise automatique (resumeFromVisibility) doivent rester cohérents.
 */
function pauseForVisibility() {
  if (!audioEl || audioEl.paused) return;
  cancelFade();
  audioEl.pause();
  pausedForVisibility = true;
}

/**
 * Reprend la lecture uniquement si elle avait été coupée par pauseForVisibility
 * (jamais si l'utilisateur a mis en pause manuellement) et si l'ambiance était
 * active. Le volume `muted` est préservé tel quel (on ne force pas l'unmute).
 * Si le navigateur refuse la reprise (ex. iOS après une longue mise en arrière-plan),
 * on repasse `isPlaying` à false pour que le bouton mute/unmute puisse relancer la
 * lecture au prochain geste utilisateur.
 */
function resumeFromVisibility() {
  if (!pausedForVisibility) return;
  pausedForVisibility = false;
  if (!audioEl || !state.isPlaying) return;
  audioEl.play().catch(() => {
    setState({ isPlaying: false });
  });
}

function handleVisibilityChange() {
  if (document.hidden) {
    pauseForVisibility();
  } else {
    resumeFromVisibility();
  }
}

/**
 * `pagehide` est plus définitif que `visibilitychange` : fermeture d'onglet,
 * navigation hors du site, ou (notamment sur Safari iOS) mise en arrière-plan de
 * l'app. On coupe systématiquement le son ; une éventuelle restauration depuis le
 * bfcache est gérée par `pageshow` ci-dessous.
 */
function handlePageHide() {
  if (!audioEl || audioEl.paused) return;
  cancelFade();
  audioEl.pause();
  pausedForVisibility = true;
}

function handlePageShow(event: PageTransitionEvent) {
  if (event.persisted) resumeFromVisibility();
}

function attachVisibilityHandlers() {
  if (visibilityHandlersAttached || typeof document === "undefined") return;
  visibilityHandlersAttached = true;
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", handlePageHide);
  window.addEventListener("pageshow", handlePageShow);
}

function fadeInVolume(audio: HTMLAudioElement) {
  cancelFade();
  const startTime = performance.now();
  const startVolume = audio.volume;

  const step = (now: number) => {
    const progress = Math.min(Math.max((now - startTime) / FADE_DURATION_MS, 0), 1);
    const newVolume = startVolume + (TARGET_VOLUME - startVolume) * progress;
    audio.volume = Math.min(1, Math.max(0, newVolume));
    fadeFrame = progress < 1 ? requestAnimationFrame(step) : null;
  };
  fadeFrame = requestAnimationFrame(step);
}

/**
 * À appeler uniquement depuis un vrai geste utilisateur (clic), dans le même tick,
 * pour satisfaire les politiques d'autoplay des navigateurs. Un seul élément <audio>
 * est réutilisé (ensureAudioElement) et les appels concurrents sont ignorés
 * (isStarting / isPlaying) afin d'empêcher toute double lecture.
 */
export async function startAmbientAudio() {
  readStoredMute();

  if (isStarting || state.isPlaying) return;
  isStarting = true;

  const audio = ensureAudioElement();
  audio.muted = state.isMuted;

  try {
    await audio.play();
    setState({ isPlaying: true });
    fadeInVolume(audio);
  } catch {
    // Lecture bloquée par le navigateur : l'utilisateur pourra réessayer via le bouton mute/unmute.
  } finally {
    isStarting = false;
  }
}

/** Rend le bouton mute/unmute disponible une fois le choix musical de l'utilisateur connu. */
export function markAudioSystemUnlocked() {
  readStoredMute();
  setState({ isUnlocked: true });
}

export function useAudio() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    readStoredMute();
  }, []);

  const toggleMute = useCallback(() => {
    if (!state.isPlaying) {
      // Aucune ambiance en cours (utilisateur ayant décliné) : ce clic est un geste
      // utilisateur direct, on peut donc démarrer la lecture ici.
      void startAmbientAudio();
      return;
    }
    const next = !state.isMuted;
    if (audioEl) audioEl.muted = next;
    try {
      window.localStorage.setItem(MUTE_STORAGE_KEY, next ? "1" : "0");
    } catch {
      // localStorage indisponible (navigation privée) — l'état ne persistera pas au rechargement.
    }
    setState({ isMuted: next });
  }, []);

  return {
    isPlaying: snapshot.isPlaying,
    isMuted: snapshot.isMuted,
    isUnlocked: snapshot.isUnlocked,
    toggleMute,
  };
}
