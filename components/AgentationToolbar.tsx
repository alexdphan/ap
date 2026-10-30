"use client";

import { Agentation } from "agentation";
import { useSyncExternalStore } from "react";

// Annotation needs a precise pointer and room beside the content column.
const DESKTOP_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function AgentationToolbar() {
  const isDesktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );

  return isDesktop ? <Agentation /> : null;
}
