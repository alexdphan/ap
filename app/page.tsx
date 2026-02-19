"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import VideoIframe from "@/components/VideoIframe";
import { springs, transitions } from "@/lib/animation";
import Link from "next/link";

export default function Home() {
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [hoveredPreview, setHoveredPreview] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState<string | null>(null); // 'rho' or 'browserbase'
  const [selectedVideo, setSelectedVideo] = useState<{
    rho: string;
    browserbase: string;
  }>({
    rho: "findrho.co",
    browserbase: "series-b",
  });
  const [selectedSubProject, setSelectedSubProject] = useState<{
    [key: string]: string;
  }>({});
  const [videoHeight, setVideoHeight] = useState<{
    rho: number;
    browserbase: number;
  }>({ rho: 0, browserbase: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [preloadReady, setPreloadReady] = useState<Record<string, boolean>>(
    {}
  );
  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const videoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const projectListRef = useRef<HTMLDivElement | null>(null);
  const [listScroll, setListScroll] = useState<{ atStart: boolean; atEnd: boolean }>({ atStart: true, atEnd: false });

  // Drag select state
  const [dragSelect, setDragSelect] = useState<{
    isActive: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const rhoProjects = [
    {
      id: "findrho.co",
      name: "Find Rho",
      video: "d92f2aed546bf4a481c20b22328c0611",
      url: "https://findrho.co",
    },
  ];

  const browserbaseProjects = [
    {
      id: "series-b",
      name: "Director and Series B",
      video: "51a62e7e813329fb699cd3cf07804c2f",
      url: "https://browserbase.com",
    },
    {
      id: "brainrot",
      name: "Brainrot Generator",
      video: "0a570e29470d2313d66e6a19614ec82b",
      url: "https://x.com/alexdphan/status/1879984298138505320?s=20",
    },
    {
      id: "mcp",
      name: "Early Browser MCP",
      video: "8c54ad68f121b9d448c66f204de2347b",
      url: "https://x.com/alexdphan/status/1861501370010083519?s=20",
    },
    {
      id: "bb-computer-use",
      name: "Anthropic's Computer Use",
      video: "10d6ade97343f1b260298be521cb4be5",
      url: "https://x.com/alexdphan/status/1849159686467322221?s=20",
    },
    {
      id: "browsegpt",
      name: "BrowseGPT",
      video: "07f679d0bb531390748f9c3838adcd00",
      url: "https://x.com/alexdphan/status/1846271931395534936?s=20",
    },
    {
      id: "stagehand-v2",
      name: "Stagehand v2",
      video: "5288a9f57f7fa07e8d0a12b48675c6e6",
      url: "https://x.com/Stagehanddev/status/1906771592648249700?s=20",
    },
    {
      id: "bb-culture",
      name: "#1 Early Stage",
      video: "c720865aa9ee17dfc4ed6bb752742766",
      url: "https://x.com/alexdphan/status/1904630387856597207",
    },
    {
      id: "series-a",
      name: "Series A",
      video: "eb97ebce0968ab2393a92fb7e28b1834",
      url: "https://x.com/pk_iv/status/1851270308701106383?s=20",
    },
    {
      id: "bb-sdk",
      name: "Browserbase Playground",
      video: "ae8fd53badf11d751cac880a6fb18ee2",
      url: "https://x.com/alexdphan/status/1821618745191899304?s=20",
    },
  ];

  const getCurrentVideo = (mainProject: string) => {
    if (mainProject === "rho") {
      // Use selected project or default to first
      if (selectedSubProject[mainProject]) {
        const project = rhoProjects.find(
          (p) => p.id === selectedSubProject[mainProject]
        );
        return project?.video || rhoProjects[0].video;
      }
      return rhoProjects[0].video;
    }
    if (mainProject === "browserbase") {
      if (selectedSubProject[mainProject]) {
        const project = browserbaseProjects.find(
          (p) => p.id === selectedSubProject[mainProject]
        );
        return project?.video || browserbaseProjects[0].video;
      }
      return browserbaseProjects[0].video;
    }
    return "";
  };

  const handleMouseEnterPreview = (preview: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!showPreview) {
      setHoveredPreview(preview);
    }
  };

  const handleMouseLeavePreview = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPreview(null);
    }, 3000);
  };

  const handleSubProjectClick = (mainProject: string, subProjectId: string) => {
    // Set the selected project and keep it even when mouse moves away
    setSelectedSubProject((prev) => ({ ...prev, [mainProject]: subProjectId }));
  };

  const handleProjectClick = (project: string) => {
    // Click on link - toggle preview dropdown
    if (showPreview === project) {
      setShowPreview(null);
      // Clear selection when closing
      setSelectedSubProject((prev) => {
        const updated = { ...prev };
        delete updated[project];
        return updated;
      });
    } else {
      // Close any other open previews
      setShowPreview(project);
      setHoveredPreview(null);
      // Set first project as default selection if none selected
      if (!selectedSubProject[project]) {
        if (project === "rho") {
          setSelectedSubProject((prev) => ({
            ...prev,
            [project]: rhoProjects[0].id,
          }));
        } else if (project === "browserbase") {
          setSelectedSubProject((prev) => ({
            ...prev,
            [project]: browserbaseProjects[0].id,
          }));
        }
      }
    }
  };

  const handlePreviewClick = (project: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Click inside preview - open full modal with the currently selected video
    if (project === "rho") {
      setVideoModal(selectedSubProject["rho"] || rhoProjects[0].id);
    } else if (project === "browserbase") {
      setVideoModal(
        selectedSubProject["browserbase"] || browserbaseProjects[0].id
      );
    } else {
      setVideoModal(project);
    }
    setShowPreview(null);
    setHoveredPreview(null);
  };

  const handleCloseModal = () => {
    setVideoModal(null);
    setModalVisible(false);
  };

  // Drive modalVisible for preloaded videos (instant open)
  useEffect(() => {
    if (videoModal) {
      const isPreloaded =
        videoModal === selectedVideo.rho ||
        videoModal === selectedVideo.browserbase;
      if (isPreloaded && preloadReady[videoModal]) {
        setModalVisible(true);
      }
      // Non-preloaded videos: modalVisible is set by fallback's onLoad
    } else {
      setModalVisible(false);
    }
  }, [videoModal, preloadReady, selectedVideo.rho, selectedVideo.browserbase]);

  const getModalVideo = () => {
    if (!videoModal) return { url: "", title: "" };

    // Check if it's a Rho project
    const rhoProject = rhoProjects.find((p) => p.id === videoModal);
    if (rhoProject) {
      return {
        url: `https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${rhoProject.video}/iframe?autoplay=true&muted=false&controls=true&preload=auto&defaultTextTrack=false`,
        title: rhoProject.name,
      };
    }

    // Check if it's a Browserbase project
    const bbProject = browserbaseProjects.find((p) => p.id === videoModal);
    if (bbProject) {
      return {
        url: `https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${bbProject.video}/iframe?autoplay=true&muted=false&controls=true&preload=auto&defaultTextTrack=false`,
        title: bbProject.name,
      };
    }

    // NYC or SF
    if (videoModal === "nyc") {
      return {
        url: "https://www.youtube.com/embed/TsgoxkRFit0?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0",
        title: "NYC Livestream",
      };
    }
    if (videoModal === "sf") {
      return {
        url: "https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0",
        title: "SF Video",
      };
    }

    return { url: "", title: "" };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check video previews (rho, browserbase, nyc, sf)
      if (showPreview || hoveredPreview) {
        const isClickInsidePreview = Object.values(previewRefs.current).some(
          (ref) => ref?.contains(target)
        );
        if (!isClickInsidePreview) {
          setShowPreview(null);
          setHoveredPreview(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showPreview, hoveredPreview]);

  // Drag select functionality
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Only start drag select if clicking on the background (not on interactive elements)
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("iframe");

      if (!isInteractive) {
        setDragSelect({
          isActive: true,
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragSelect.isActive) {
        setDragSelect((prev) => ({
          ...prev,
          currentX: e.clientX,
          currentY: e.clientY,
        }));
      }
    };

    const handleMouseUp = () => {
      setDragSelect((prev) => ({ ...prev, isActive: false }));
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragSelect.isActive]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...springs.snappy,
          opacity: { duration: 0.2 },
        }}
        className="flex flex-col w-full"
      >
        {/* Magazine Header */}
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-4">
            <Image
              src="/alex.jpg"
              alt="Alex Phan"
              width={56}
              height={56}
              className="cursor-pointer transition-none hover:brightness-70 active:brightness-75 object-cover"
              style={{ border: "1px solid var(--gray-100)", width: 56, height: 56 }}
              quality={100}
              priority
            />
            <div className="flex flex-col justify-center gap-0">
              <h1
                className="text-body leading-relaxed"
                style={{ color: "var(--gray-900)" }}
              >
                AP
              </h1>
              <p
                className="text-body leading-relaxed"
                style={{ color: "var(--gray-400)", whiteSpace: "pre" }}
              >
                Alex Phan
              </p>
            </div>
          </div>

          {/* <div
          className="h-px w-full mt-2 mb-5"
          style={{ backgroundColor: "var(--gray-100)" }}
        /> */}
        </div>

        {/* Content Layout */}
        <div className="flex flex-col w-full">
          {/* Text Content */}
          <div className="w-full">
            {/* Philosophy */}
            <p className="text-body my-5" style={{ color: "var(--gray-700)" }}>
              Pursuing opportunities elegantly simple, yet overlooked.
            </p>

            {/* Work */}
            <div
              className="text-body my-5"
              style={{ color: "var(--gray-700)" }}
            >
              At{" "}
              <button
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "spc" ? null : "spc")
                }
                className="cursor-pointer underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 bg-transparent border-none p-0 font-inherit transition-all"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                SPC
              </button>
              , exploring the{" "}
              <a
                href="https://www.tryonra.com/map"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 transition-all"
                style={{ color: "var(--gray-700)" }}
              >
                imports industry
              </a>
              . Angel investing & growth advising on the side. Previously, growth engineer at{" "}
              <button
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "rho" ? null : "rho")
                }
                className="cursor-pointer underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 bg-transparent border-none p-0 font-inherit transition-all"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                Rho
              </button>
              {" "}and{" "}
              <button
                onClick={() =>
                  setHoveredPreview(
                    hoveredPreview === "browserbase" ? null : "browserbase"
                  )
                }
                className="cursor-pointer underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 bg-transparent border-none p-0 font-inherit transition-all"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                Browserbase
              </button>
              .
            </div>

            {/* Contact */}
            <div
              className="text-body my-5"
              style={{ color: "var(--gray-700)" }}
            >
              <button
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "nyc" ? null : "nyc")
                }
                className="cursor-pointer underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 bg-transparent border-none p-0 font-inherit transition-all"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                NYC
              </button>{" "}
              based,{" "}
              <button
                onClick={() =>
                  setHoveredPreview(hoveredPreview === "sf" ? null : "sf")
                }
                className="cursor-pointer underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 bg-transparent border-none p-0 font-inherit transition-all"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                SF
              </button>{" "}
              frequent. Feel free to{" "}
              <button
                onClick={() =>
                  setHoveredPreview(
                    hoveredPreview === "contact" ? null : "contact"
                  )
                }
                className="cursor-pointer underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900 bg-transparent border-none p-0 font-inherit transition-all"
                style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
              >
                reach out
              </button>{" "}
              if you'd like to chat.
            </div>
          </div>

          {/* SPC dropdown */}
          <motion.div
            ref={(el) => {
              previewRefs.current["spc"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "spc"
                ? { opacity: 1, height: "auto", marginTop: 0 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "spc" ? "auto" : "none",
            }}
          >
            <div className="flex gap-3 w-full">
              <a
                href="https://blog.southparkcommons.com/p/what-is-negative-1-to-0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 no-hover hover:opacity-85 transition-opacity"
              >
                <img
                  src="/spc-blog.png"
                  alt="What is -1 to 0"
                  className="w-full object-cover"
                  style={{ border: "1px solid var(--gray-100)" }}
                />
                <p
                  className="text-body mt-2"
                  style={{ color: "var(--gray-900)" }}
                >
                  What is -1 to 0?
                </p>
              </a>
              <a
                href="https://www.southparkcommons.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 no-hover hover:opacity-85 transition-opacity"
              >
                <img
                  src="/spc-home.png"
                  alt="South Park Commons"
                  className="w-full object-cover"
                  style={{ border: "1px solid var(--gray-100)" }}
                />
                <p
                  className="text-body mt-2"
                  style={{ color: "var(--gray-900)" }}
                >
                  South Park Commons
                </p>
              </a>
            </div>
          </motion.div>

          {/* Persistent video previews — iframes stay mounted so they never reload.
               Container animates height/opacity; iframe is clipped but alive when hidden. */}
          <motion.div
            ref={(el) => {
              previewRefs.current["rho"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "rho"
                ? { opacity: 1, height: "auto", marginTop: 0 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "rho" ? "auto" : "none",
            }}
          >
            <div className="relative w-full">
              <div
                ref={(el) => {
                  videoRefs.current["rho"] = el;
                  if (el && el.offsetHeight !== videoHeight.rho) {
                    setVideoHeight((prev) => ({
                      ...prev,
                      rho: el.offsetHeight,
                    }));
                  }
                }}
                className="w-full aspect-video overflow-hidden"
                style={{ border: "1px solid var(--gray-100)" }}
              >
                <VideoIframe
                  key={selectedVideo.rho}
                  src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${
                    rhoProjects.find((p) => p.id === selectedVideo.rho)
                      ?.video || rhoProjects[0].video
                  }/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`}
                  title="Rho"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  className="w-full h-full pointer-events-none"
                  style={{ border: 0 }}
                />
              </div>
              <p
                className="text-body mt-2"
                style={{ color: "var(--gray-900)" }}
              >
                Rho
              </p>
            </div>
          </motion.div>

          <motion.div
            ref={(el) => {
              previewRefs.current["browserbase"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "browserbase"
                ? { opacity: 1, height: "auto", marginTop: 0 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents:
                hoveredPreview === "browserbase" ? "auto" : "none",
            }}
          >
            <div className="relative w-full">
              <div
                ref={(el) => {
                  videoRefs.current["browserbase"] = el;
                  if (el && el.offsetHeight !== videoHeight.browserbase) {
                    setVideoHeight((prev) => ({
                      ...prev,
                      browserbase: el.offsetHeight,
                    }));
                  }
                }}
                className="w-full aspect-video overflow-hidden"
                style={{ border: "1px solid var(--gray-100)" }}
              >
                <VideoIframe
                  key={selectedVideo.browserbase}
                  src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${
                    browserbaseProjects.find(
                      (p) => p.id === selectedVideo.browserbase
                    )?.video || browserbaseProjects[0].video
                  }/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`}
                  title="Browserbase"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  className="w-full h-full pointer-events-none"
                  style={{ border: 0 }}
                />
              </div>
              <div className="relative mt-2">
                <div
                  ref={projectListRef}
                  className="flex items-center gap-1.5 overflow-x-auto"
                  style={{
                    scrollbarWidth: "none",
                    maskImage: `linear-gradient(to right, ${listScroll.atStart ? "black" : "transparent"} 0%, black ${listScroll.atStart ? "0%" : "10%"}, black ${listScroll.atEnd ? "100%" : "80%"}, ${listScroll.atEnd ? "black" : "transparent"} 100%)`,
                    WebkitMaskImage: `linear-gradient(to right, ${listScroll.atStart ? "black" : "transparent"} 0%, black ${listScroll.atStart ? "0%" : "10%"}, black ${listScroll.atEnd ? "100%" : "80%"}, ${listScroll.atEnd ? "black" : "transparent"} 100%)`,
                  }}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const atStart = el.scrollLeft < 5;
                    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
                    setListScroll({ atStart, atEnd });
                  }}
                >
                  {browserbaseProjects.map((project, i) => (
                    <span key={project.id} className="flex items-center gap-1.5 shrink-0">
                      {i > 0 && (
                        <span
                          style={{ color: "var(--gray-300)", display: "inline-flex", alignItems: "center" }}
                        >
                          <span style={{ width: "12px", height: "6px", backgroundColor: "var(--gray-300)", display: "block" }} />
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideo((prev) => ({
                            ...prev,
                            browserbase: project.id,
                          }));
                        }}
                        className="text-sm cursor-pointer bg-transparent border-none p-0 font-inherit transition-colors whitespace-nowrap hover:opacity-70"
                        style={{
                          color:
                            selectedVideo.browserbase === project.id
                              ? "var(--gray-900)"
                              : "var(--gray-400)",
                        }}
                      >
                        {project.name}
                      </button>
                    </span>
                  ))}
                  <span className="shrink-0 w-8" aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={(el) => {
              previewRefs.current["nyc"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "nyc"
                ? { opacity: 1, height: "auto", marginTop: 0 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "nyc" ? "auto" : "none",
            }}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setHoveredPreview("nyc");
            }}
            onMouseLeave={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredPreview(null);
              }, 3000);
            }}
          >
            <div
              className="w-full aspect-video overflow-hidden"
              style={{ border: "1px solid var(--gray-100)" }}
            >
              <VideoIframe
                src="https://www.youtube.com/embed/TsgoxkRFit0?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=TsgoxkRFit0"
                title="NYC Livestream"
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                className="w-full h-full pointer-events-none"
                style={{ border: 0 }}
              />
            </div>
            <p
              className="text-body mt-2"
              style={{ color: "var(--gray-900)" }}
            >
              New York City
            </p>
          </motion.div>

          <motion.div
            initial={false}
            animate={
              hoveredPreview === "sf"
                ? { opacity: 1, height: "auto", marginTop: 0 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "sf" ? "auto" : "none",
            }}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              setHoveredPreview("sf");
            }}
            onMouseLeave={() => {
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredPreview(null);
              }, 3000);
            }}
          >
            <div
              className="w-full aspect-video overflow-hidden"
              style={{ border: "1px solid var(--gray-100)" }}
            >
              <VideoIframe
                src="https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=CXYr04BWvmc"
                title="SF Video"
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                className="w-full h-full pointer-events-none"
                style={{ border: 0 }}
              />
            </div>
            <p
              className="text-body mt-2"
              style={{ color: "var(--gray-900)" }}
            >
              San Francisco
            </p>
          </motion.div>

          {/* Contact preview — same height/opacity animation as all others */}
          <motion.div
            ref={(el) => {
              previewRefs.current["contact"] = el;
            }}
            initial={false}
            animate={
              hoveredPreview === "contact"
                ? { opacity: 1, height: "auto", marginTop: 0 }
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            transition={springs.snappy}
            className="w-full"
            style={{
              overflow: "hidden",
              pointerEvents: hoveredPreview === "contact" ? "auto" : "none",
            }}
          >
            <div
              className="w-full py-2 px-3"
              style={{
                backgroundColor: "var(--bg-content)",
                border: "1px solid var(--gray-100)",
              }}
            >
              <div className="flex items-center gap-3">
                <a
                  href="mailto:alexphan0515@gmail.com"
                  className="text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--gray-500)" }}
                >
                  Email
                </a>
                <a
                  href="https://linkedin.com/in/alexanderdphan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--gray-500)" }}
                >
                  LinkedIn
                </a>
                <a
                  href="https://x.com/alexdphan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--gray-500)" }}
                >
                  X
                </a>
                <a
                  href="https://alexdphan-github-io-alexander-phans-projects.vercel.app/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity"
                  style={{ color: "var(--gray-500)" }}
                >
                  Archive
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ======= VIDEO MODAL SYSTEM =======
           Preloaded modals: persistent iframes for default rho/bb videos.
           The SAME iframe element transitions from hidden to visible — no reload, truly instant.
           Fallback modal: for YouTube and sidebar-switched videos, uses VideoIframe with shimmer. */}

      {/* Modal backdrop — shared across preloaded and fallback modals */}
      <AnimatePresence>
        {videoModal && modalVisible && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitions.fade}
            className="fixed inset-0 z-50"
            style={{ backdropFilter: "blur(12px)" }}
            onClick={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Preloaded video modals — persistent iframes, always in DOM */}
      {[
        {
          videoId: selectedVideo.rho,
          project:
            rhoProjects.find((p) => p.id === selectedVideo.rho) ||
            rhoProjects[0],
          category: "rho" as const,
          projects: rhoProjects,
        },
        {
          videoId: selectedVideo.browserbase,
          project:
            browserbaseProjects.find(
              (p) => p.id === selectedVideo.browserbase
            ) || browserbaseProjects[0],
          category: "browserbase" as const,
          projects: browserbaseProjects,
        },
      ].map(({ videoId, project, category, projects }) => {
        const isActive = videoModal === videoId && modalVisible;
        const url = `https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${project.video}/iframe?autoplay=true&muted=true&controls=true&preload=auto&defaultTextTrack=false`;

        return (
          <motion.div
            key={`preload-${videoId}`}
            initial={false}
            animate={
              isActive
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0.95, opacity: 0, y: 20 }
            }
            transition={{
              ...springs.snappy,
              opacity: { duration: 0.15 },
            }}
            className="fixed inset-0 z-[51] flex items-center justify-center p-4 md:p-8"
            style={{ pointerEvents: isActive ? "auto" : "none" }}
            onClick={isActive ? handleCloseModal : undefined}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 aspect-video">
                  <iframe
                    src={url}
                    title={project.name}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    loading="eager"
                    tabIndex={isActive ? 0 : -1}
                    onLoad={() => {
                      setPreloadReady((prev) => ({
                        ...prev,
                        [videoId]: true,
                      }));
                    }}
                  />
                </div>
                {isActive && (
                  <div
                    className="w-full md:w-56 p-3 flex flex-col gap-2 overflow-y-auto max-h-[216px] md:max-h-[calc(100vh-200px)]"
                    style={{
                      backgroundColor: "var(--bg-content)",
                      border: "1px solid var(--gray-100)",
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      {projects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={() => {
                            setVideoModal(proj.id);
                            setSelectedSubProject((prev) => ({
                              ...prev,
                              [category]: proj.id,
                            }));
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "var(--gray-100)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                          className="text-left text-sm px-2 py-1.5 rounded cursor-pointer transition-colors"
                          style={{
                            color:
                              videoModal === proj.id
                                ? "var(--gray-900)"
                                : "var(--gray-400)",
                          }}
                        >
                          {proj.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Fallback modal — for YouTube, or videos switched via sidebar */}
      <AnimatePresence>
        {videoModal &&
          videoModal !== selectedVideo.rho &&
          videoModal !== selectedVideo.browserbase && (
            <motion.div
              key="fallback-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: modalVisible ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={transitions.fade}
              className="fixed inset-0 z-[51] flex items-center justify-center p-4 md:p-8"
              style={{ pointerEvents: modalVisible ? "auto" : "none" }}
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={
                  modalVisible
                    ? { scale: 1, opacity: 1, y: 0 }
                    : { scale: 0.95, opacity: 0, y: 20 }
                }
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                transition={{
                  ...springs.snappy,
                  opacity: { duration: 0.15 },
                }}
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                {getModalVideo().url && (
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 aspect-video">
                      <VideoIframe
                        src={getModalVideo().url}
                        title={getModalVideo().title}
                        loading="eager"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        allowFullScreen
                        className="w-full h-full"
                        style={{ border: 0 }}
                        onLoad={() => {
                          if (!modalVisible) setModalVisible(true);
                        }}
                      />
                    </div>
                    {modalVisible &&
                      (rhoProjects.find((p) => p.id === videoModal) ||
                        browserbaseProjects.find(
                          (p) => p.id === videoModal
                        )) && (
                        <div
                          className="w-full md:w-56 p-3 flex flex-col gap-2 overflow-y-auto max-h-[216px] md:max-h-[calc(100vh-200px)]"
                          style={{
                            backgroundColor: "var(--bg-content)",
                            border: "1px solid var(--gray-100)",
                          }}
                        >
                          <div className="flex flex-col gap-1">
                            {(rhoProjects.find((p) => p.id === videoModal)
                              ? rhoProjects
                              : browserbaseProjects
                            ).map((project) => (
                              <button
                                key={project.id}
                                onClick={() => {
                                  setVideoModal(project.id);
                                  setSelectedSubProject((prev) => ({
                                    ...prev,
                                    [rhoProjects.find(
                                      (p) => p.id === videoModal
                                    )
                                      ? "rho"
                                      : "browserbase"]: project.id,
                                  }));
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "var(--gray-100)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "transparent")
                                }
                                className="text-left text-sm px-2 py-1.5 rounded cursor-pointer transition-colors"
                                style={{
                                  color:
                                    videoModal === project.id
                                      ? "var(--gray-900)"
                                      : "var(--gray-400)",
                                }}
                              >
                                {project.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Drag Select Box */}
      <AnimatePresence>
        {dragSelect.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              left: Math.min(dragSelect.startX, dragSelect.currentX),
              top: Math.min(dragSelect.startY, dragSelect.currentY),
              width: Math.abs(dragSelect.currentX - dragSelect.startX),
              height: Math.abs(dragSelect.currentY - dragSelect.startY),
            }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              opacity: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
              default: {
                type: "spring",
                stiffness: 500,
                damping: 40,
                mass: 0.5,
              },
            }}
            className="fixed pointer-events-none z-[9999]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--gray-900) 5%, transparent)",
              boxShadow: "0 0 0 0.5px color-mix(in srgb, var(--gray-900) 15%, transparent)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
