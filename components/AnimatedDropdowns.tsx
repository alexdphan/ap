"use client";

import { motion, useReducedMotion } from "framer-motion";

import MediaPreview from "@/components/MediaPreview";
import { springs, transitions } from "@/lib/animation";

export type PreviewKey = "rho" | "browserbase" | "nyc" | "sf" | "contact";
type MediaPreviewKey = Exclude<PreviewKey, "contact">;

const PREVIEWS: PreviewKey[] = [
  "rho",
  "browserbase",
  "nyc",
  "sf",
  "contact",
];

function previewLabel(preview: PreviewKey) {
  if (preview === "contact") return "Contact Alex Phan";
  if (preview === "browserbase") return "Browserbase preview";
  if (preview === "rho") return "Rho preview";
  return `${preview.toUpperCase()} preview`;
}

function ContactLinks() {
  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border border-[var(--image-outline)] p-3">
        <a
          href="mailto:alexphan0515@gmail.com"
          className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: "var(--text-primary)" }}
        >
          Email
        </a>
        <a
          href="https://linkedin.com/in/alexanderdphan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: "var(--text-primary)" }}
        >
          LinkedIn
        </a>
        <a
          href="https://x.com/alexdphan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: "var(--text-primary)" }}
        >
          X
        </a>
        <a
          href="https://alexdphan-github-io-alexander-phans-projects.vercel.app/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption font-medium hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: "var(--text-primary)" }}
        >
          Archive
        </a>
      </div>
    </div>
  );
}

export default function AnimatedDropdowns({
  activePreview,
  preparedPreviews,
}: {
  activePreview: PreviewKey | null;
  preparedPreviews: readonly PreviewKey[];
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {PREVIEWS.map((preview) => {
        if (!preparedPreviews.includes(preview)) return null;

        const isContact = preview === "contact";
        const isActive = activePreview === preview;
        const hiddenState = isContact
          ? { opacity: 0, height: 0, marginTop: 0 }
          : { opacity: 0, height: 0 };
        const visibleState = isContact
          ? { opacity: 1, height: "auto", marginTop: 24 }
          : { opacity: 1, height: "auto" };
        const transition = shouldReduceMotion
          ? { duration: 0 }
          : isContact
            ? {
                ...springs.snappy,
                opacity: { ...transitions.fade, duration: 0.12 },
              }
            : springs.snappy;

        return (
          <motion.div
            id={`profile-preview-${preview}`}
            key={preview}
            initial={hiddenState}
            animate={isActive ? visibleState : hiddenState}
            transition={transition}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: isActive ? "auto" : "none",
            }}
            role="region"
            aria-hidden={!isActive}
            aria-label={previewLabel(preview)}
            inert={!isActive}
          >
            {isContact ? (
              <ContactLinks />
            ) : (
              <div className="relative w-full pt-6">
                <MediaPreview preview={preview as MediaPreviewKey} />
              </div>
            )}
          </motion.div>
        );
      })}
    </>
  );
}
