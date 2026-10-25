"use client";

// Shared "brain" for every bot on the page: one tiny store that JARVIS, the side
// bots and the visitor tracker all read from and write to, so they can react to
// each other instead of living in isolation.

import { useSyncExternalStore } from "react";

export type VisitorScan = {
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  company?: string; // "TCS" — only set for corporate networks, never home ISPs
  source?: string; // "LinkedIn", "Google", "Direct"…
  device?: string; // "Desktop · Chrome · Windows"
  visitCount: number;
};

export type BrainEvent =
  | { type: "chat:open" }
  | { type: "chat:asked"; topic: string }
  | { type: "chat:name"; name: string }
  | { type: "visitor:scanned"; scan: VisitorScan };

type BrainState = {
  scan: VisitorScan | null;
  visitorName: string | null;
  questions: string[]; // topics the visitor asked JARVIS about
};

let state: BrainState = { scan: null, visitorName: null, questions: [] };
const listeners = new Set<() => void>();
const eventListeners = new Set<(e: BrainEvent) => void>();

export function emit(event: BrainEvent) {
  const patch: Partial<BrainState> = {};
  if (event.type === "visitor:scanned") patch.scan = event.scan;
  if (event.type === "chat:name") patch.visitorName = event.name;
  if (event.type === "chat:asked") patch.questions = [...state.questions, event.topic].slice(-30);
  if (Object.keys(patch).length > 0) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  }
  eventListeners.forEach((l) => l(event));
}

/** Subscribe to bot events (for one-off reactions like speech bubbles). */
export function onBrainEvent(fn: (e: BrainEvent) => void) {
  eventListeners.add(fn);
  return () => {
    eventListeners.delete(fn);
  };
}

export function getBrain() {
  return state;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const SERVER_STATE: BrainState = { scan: null, visitorName: null, questions: [] };

/** Selectors must return primitives or existing references (no new objects). */
export function useBrain<T>(select: (s: BrainState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state), () => select(SERVER_STATE));
}
