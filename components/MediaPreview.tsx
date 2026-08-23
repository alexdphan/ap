"use client";

import { useRef, useState } from "react";

import VideoIframe from "@/components/VideoIframe";

type MediaPreviewKey = "rho" | "browserbase" | "nyc" | "sf";

type Project = {
  id: string;
  name: string;
  video: string;
};

const STREAM_ORIGIN =
  "https://customer-vs7mnf7pn9caalyg.cloudflarestream.com";

const RHO_PROJECT: Project = {
  id: "findrho.co",
  name: "Find Rho",
  video: "d92f2aed546bf4a481c20b22328c0611",
};

const BROWSERBASE_PROJECTS: Project[] = [
  {
    id: "series-b",
    name: "Director and Series B",
    video: "51a62e7e813329fb699cd3cf07804c2f",
  },
  {
    id: "brainrot",
    name: "Brainrot Generator",
    video: "0a570e29470d2313d66e6a19614ec82b",
  },
  {
    id: "mcp",
    name: "Early Browser MCP",
    video: "8c54ad68f121b9d448c66f204de2347b",
  },
  {
    id: "bb-computer-use",
    name: "Anthropic's Computer Use",
    video: "10d6ade97343f1b260298be521cb4be5",
  },
  {
    id: "browsegpt",
    name: "BrowseGPT",
    video: "07f679d0bb531390748f9c3838adcd00",
  },
  {
    id: "stagehand-v2",
    name: "Stagehand v2",
    video: "5288a9f57f7fa07e8d0a12b48675c6e6",
  },
  {
    id: "bb-culture",
    name: "#1 Early Stage",
    video: "c720865aa9ee17dfc4ed6bb752742766",
  },
  {
    id: "series-a",
    name: "Series A",
    video: "eb97ebce0968ab2393a92fb7e28b1834",
  },
  {
    id: "bb-sdk",
    name: "Browserbase Playground",
    video: "ae8fd53badf11d751cac880a6fb18ee2",
  },
];

const YOUTUBE_PREVIEWS = {
  nyc: {
    id: "VGnFLdQW39A",
    label: "New York City",
    title: "NYC Livestream",
  },
  sf: {
    id: "CXYr04BWvmc",
    label: "San Francisco",
    title: "SF Video",
  },
} as const;

function streamUrl(video: string) {
  return `${STREAM_ORIGIN}/${video}/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`;
}

function youtubeUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=${id}`;
}

export default function MediaPreview({ preview }: { preview: MediaPreviewKey }) {
  const [browserbaseProjectId, setBrowserbaseProjectId] =
    useState("series-b");
  const [listScroll, setListScroll] = useState({
    atStart: true,
    atEnd: false,
  });
  const projectListRef = useRef<HTMLDivElement>(null);

  const browserbaseProject =
    BROWSERBASE_PROJECTS.find(
      (project) => project.id === browserbaseProjectId
    ) ?? BROWSERBASE_PROJECTS[0];

  const isStream = preview === "rho" || preview === "browserbase";
  const streamProject = preview === "rho" ? RHO_PROJECT : browserbaseProject;
  const youtubePreview =
    preview === "nyc" || preview === "sf" ? YOUTUBE_PREVIEWS[preview] : null;
  const src = isStream
    ? streamUrl(streamProject.video)
    : youtubeUrl(youtubePreview?.id ?? "");
  const title =
    preview === "rho"
      ? "Rho"
      : preview === "browserbase"
        ? "Browserbase"
        : (youtubePreview?.title ?? "Video");
  const label =
    preview === "rho"
      ? "Rho"
      : preview === "browserbase"
        ? null
        : youtubePreview?.label;

  return (
    <div className="w-full">
      <div className="media-frame aspect-video w-full overflow-hidden">
        <VideoIframe
          key={src}
          src={src}
          title={title}
          loading="eager"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          className="h-full w-full pointer-events-none"
          style={{ border: 0 }}
        />
      </div>

      {preview === "browserbase" ? (
        <div className="relative mt-3">
          <div
            ref={projectListRef}
            aria-label="Browserbase projects"
            className="flex items-center gap-7 overflow-x-auto"
            role="group"
            style={{
              scrollbarWidth: "none",
              maskImage: `linear-gradient(to right, ${listScroll.atStart ? "black" : "transparent"} 0%, black ${listScroll.atStart ? "0%" : "10%"}, black ${listScroll.atEnd ? "100%" : "80%"}, ${listScroll.atEnd ? "black" : "transparent"} 100%)`,
              WebkitMaskImage: `linear-gradient(to right, ${listScroll.atStart ? "black" : "transparent"} 0%, black ${listScroll.atStart ? "0%" : "10%"}, black ${listScroll.atEnd ? "100%" : "80%"}, ${listScroll.atEnd ? "black" : "transparent"} 100%)`,
            }}
            onScroll={(event) => {
              const element = event.currentTarget;
              setListScroll({
                atStart: element.scrollLeft < 5,
                atEnd:
                  element.scrollLeft + element.clientWidth >=
                  element.scrollWidth - 5,
              });
            }}
          >
            {BROWSERBASE_PROJECTS.map((project) => (
              <span key={project.id} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={browserbaseProject.id === project.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    setBrowserbaseProjectId(project.id);
                  }}
                  className="cursor-pointer whitespace-nowrap border-none bg-transparent p-0 text-caption hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    color:
                      browserbaseProject.id === project.id
                        ? "var(--gray-900)"
                        : "var(--gray-400)",
                  }}
                >
                  {project.name}
                </button>
              </span>
            ))}
            <span className="w-6 shrink-0" aria-hidden="true" />
          </div>
        </div>
      ) : label ? (
        <p
          className="mt-3 text-caption font-medium"
          style={{ color: "var(--gray-900)" }}
        >
          {label}
        </p>
      ) : null}
    </div>
  );
}
