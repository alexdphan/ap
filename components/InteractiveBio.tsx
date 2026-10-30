"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { preconnect } from "react-dom";

import type { PreviewKey } from "@/components/AnimatedDropdowns";

type MediaPreviewKey = Exclude<PreviewKey, "contact">;

const STREAM_ORIGIN =
  "https://customer-vs7mnf7pn9caalyg.cloudflarestream.com";
const YOUTUBE_ORIGIN = "https://www.youtube.com";

const loadAnimatedDropdowns = () => import("@/components/AnimatedDropdowns");
const AnimatedDropdowns = dynamic(loadAnimatedDropdowns, { ssr: false });

function warmMediaConnection(preview: MediaPreviewKey) {
  preconnect(
    preview === "rho" || preview === "browserbase"
      ? STREAM_ORIGIN
      : YOUTUBE_ORIGIN
  );
}

function warmPreview(preview: PreviewKey) {
  void loadAnimatedDropdowns();
  if (preview !== "contact") warmMediaConnection(preview);
}

export default function InteractiveBio() {
  const [activePreview, setActivePreview] = useState<PreviewKey | null>(null);
  const [preparedPreviews, setPreparedPreviews] = useState<PreviewKey[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePreview) return;

    // Close on a tap or click outside, but not when a touch starts a scroll.
    let press: { x: number; y: number } | null = null;
    const startOutsidePress = (event: PointerEvent) => {
      press = rootRef.current?.contains(event.target as Node)
        ? null
        : { x: event.clientX, y: event.clientY };
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!press) return;
      const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
      press = null;
      if (moved < 10) setActivePreview(null);
    };
    const cancelOutsidePress = () => {
      press = null;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePreview(null);
    };

    document.addEventListener("pointerdown", startOutsidePress);
    document.addEventListener("pointerup", closeOnOutsidePress);
    document.addEventListener("pointercancel", cancelOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", startOutsidePress);
      document.removeEventListener("pointerup", closeOnOutsidePress);
      document.removeEventListener("pointercancel", cancelOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activePreview]);

  useEffect(() => {
    const drag = {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      frame: 0,
    };

    const drawOverlay = () => {
      drag.frame = 0;
      const overlay = dragOverlayRef.current;
      if (!overlay || !drag.active) return;

      overlay.style.left = `${Math.min(drag.startX, drag.currentX)}px`;
      overlay.style.top = `${Math.min(drag.startY, drag.currentY)}px`;
      overlay.style.width = `${Math.abs(drag.currentX - drag.startX)}px`;
      overlay.style.height = `${Math.abs(drag.currentY - drag.startY)}px`;
    };

    const handlePointerDown = (event: PointerEvent) => {
      // Marquee selection is a mouse affordance; touch drags should scroll.
      if (!event.isPrimary || event.button !== 0) return;
      if (event.pointerType !== "mouse") return;

      const target = event.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        Boolean(target.closest("button, a, input, iframe"));

      if (isInteractive) return;

      drag.active = true;
      drag.startX = event.clientX;
      drag.startY = event.clientY;
      drag.currentX = event.clientX;
      drag.currentY = event.clientY;
      document.body.classList.add("drag-select-active");

      if (dragOverlayRef.current) {
        dragOverlayRef.current.hidden = false;
      }
      target.setPointerCapture?.(event.pointerId);
      drawOverlay();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isPrimary || !drag.active) return;

      drag.currentX = event.clientX;
      drag.currentY = event.clientY;
      if (!drag.frame) drag.frame = requestAnimationFrame(drawOverlay);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!event.isPrimary || !drag.active) return;

      drag.active = false;
      if (drag.frame) cancelAnimationFrame(drag.frame);
      drag.frame = 0;
      document.body.classList.remove("drag-select-active");
      if (dragOverlayRef.current) dragOverlayRef.current.hidden = true;
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      if (drag.frame) cancelAnimationFrame(drag.frame);
      document.body.classList.remove("drag-select-active");
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  const preparePreview = (preview: PreviewKey) => {
    warmPreview(preview);
    setPreparedPreviews((current) =>
      current.includes(preview) ? current : [...current, preview]
    );
  };

  const togglePreview = (preview: PreviewKey) => {
    preparePreview(preview);
    setActivePreview((current) => (current === preview ? null : preview));
  };

  const previewButtonProps = (preview: PreviewKey) => ({
    "aria-controls": `profile-preview-${preview}`,
    "aria-expanded": activePreview === preview,
    onClick: () => togglePreview(preview),
    onFocus: () => preparePreview(preview),
    onPointerDown: () => preparePreview(preview),
    onPointerEnter: () => preparePreview(preview),
  });

  return (
    <>
      <div ref={rootRef} className="flex w-full flex-col">
        <div className="flex w-full flex-col gap-4 sm:gap-5">
          <p
            className="text-body text-pretty"
            style={{ color: "var(--gray-700)" }}
          >
            Pursuing opportunities elegantly simple, yet overlooked.
          </p>

          <p
            className="text-body text-pretty"
            style={{ color: "var(--gray-700)" }}
          >
            Angel investing &amp; growth advising on the side. Previously,
            growth engineer at{" "}
            <button
              type="button"
              className="inline-preview-trigger touch-target"
              {...previewButtonProps("rho")}
            >
              Rho
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="inline-preview-trigger touch-target"
              {...previewButtonProps("browserbase")}
            >
              Browserbase
            </button>
            .
          </p>

          <p
            className="text-body text-pretty"
            style={{ color: "var(--gray-700)" }}
          >
            <button
              type="button"
              className="inline-preview-trigger touch-target"
              {...previewButtonProps("nyc")}
            >
              NYC
            </button>{" "}
            based,{" "}
            <button
              type="button"
              className="inline-preview-trigger touch-target"
              {...previewButtonProps("sf")}
            >
              SF
            </button>{" "}
            frequent. Feel free to{" "}
            <button
              type="button"
              className="inline-preview-trigger touch-target"
              {...previewButtonProps("contact")}
            >
              reach out
            </button>{" "}
            if you’d like to chat.
          </p>
        </div>

        {preparedPreviews.length > 0 ? (
          <AnimatedDropdowns
            activePreview={activePreview}
            preparedPreviews={preparedPreviews}
          />
        ) : null}
      </div>

      <div
        ref={dragOverlayRef}
        hidden
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999]"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--gray-900) 5%, transparent)",
          boxShadow:
            "0 0 0 0.5px color-mix(in srgb, var(--gray-900) 15%, transparent)",
        }}
      />
    </>
  );
}
