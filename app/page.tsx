"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [hoveredPreview, setHoveredPreview] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [selectedSubProject, setSelectedSubProject] = useState<{
    [key: string]: string;
  }>({});
  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
      id: "Early Browser MCP",
      name: "Director",
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
      setShowPreview(project);
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
  };

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
        url: "https://www.youtube.com/embed/R1CG9ZuK2V8?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0",
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
    const handleClickOutside = (event: MouseEvent) => {
      if (showPreview || hoveredPreview) {
        const target = event.target as Node;
        const isClickInsidePreview = Object.values(previewRefs.current).some(
          (ref) => ref?.contains(target)
        );
        if (!isClickInsidePreview) {
          setShowPreview(null);
        }
      }
      if (showContactDropdown) {
        // Check if click is outside contact dropdown
        const contactContainer = document.querySelector(
          ".contact-dropdown-container"
        );
        if (
          contactContainer &&
          !contactContainer.contains(event.target as Node)
        ) {
          setShowContactDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPreview, hoveredPreview, showContactDropdown]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col w-full mt-16 md:mt-32"
      >
        {/* Magazine Header */}
        <div className="flex flex-col w-full">
          <h1 className="text-heading" style={{ color: "var(--gray-900)" }}>
            Alex Phan
          </h1>
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
              You'll constantly find me looking for opportunities that are
              simple, yet overlooked.
            </p>

            {/* Work */}
            <div
              className="text-body my-5"
              style={{ color: "var(--gray-700)" }}
            >
              I'm currently helping{" "}
              <span className="relative inline-block">
                <button
                  onClick={() => handleProjectClick("rho")}
                  onMouseEnter={() => setHoveredPreview("rho")}
                  onMouseLeave={() => setHoveredPreview(null)}
                  className="underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
                >
                  Rho
                </button>
                <AnimatePresence>
                  {(showPreview === "rho" || hoveredPreview === "rho") && (
                    <motion.div
                      ref={(el) => {
                        previewRefs.current["rho"] = el;
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      onMouseEnter={() => setHoveredPreview("rho")}
                      onMouseLeave={() => setHoveredPreview(null)}
                      className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 z-10 w-64 md:w-auto overflow-hidden"
                      style={{
                        backgroundColor: "var(--bg-content)",
                        border: "1px solid var(--gray-100)",
                      }}
                    >
                      <div className="flex">
                        {/* Video Preview */}
                        <div
                          onClick={(e) => handlePreviewClick("rho", e)}
                          className="flex-1 md:flex-none md:w-96 aspect-video cursor-pointer overflow-hidden relative group"
                        >
                          <iframe
                            key={getCurrentVideo("rho")}
                            src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${getCurrentVideo(
                              "rho"
                            )}/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`}
                            title="Rho Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                            className="w-full h-full pointer-events-none"
                            style={{ border: 0, pointerEvents: "none" }}
                          />
                        </div>

                        {/* Project List - Right (Desktop Only) */}
                        <div className="hidden md:flex md:w-40 p-2 flex-col gap-1 overflow-y-auto max-h-[180px]">
                          {rhoProjects.map((project) => (
                            <div
                              key={project.id}
                              onClick={() =>
                                handleSubProjectClick("rho", project.id)
                              }
                              className="text-left text-xs md:text-sm px-2 py-1 rounded cursor-pointer transition-colors"
                              style={{
                                color:
                                  selectedSubProject["rho"] === project.id
                                    ? "var(--gray-900)"
                                    : "var(--gray-400)",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "var(--gray-100)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              {project.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              setup growth engineering foundations. Previously, I was at{" "}
              <span className="relative inline-block">
                <button
                  onClick={() => handleProjectClick("browserbase")}
                  onMouseEnter={() => setHoveredPreview("browserbase")}
                  onMouseLeave={() => setHoveredPreview(null)}
                  className="underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
                >
                  Browserbase
                </button>
                <AnimatePresence>
                  {(showPreview === "browserbase" ||
                    hoveredPreview === "browserbase") && (
                    <motion.div
                      ref={(el) => {
                        previewRefs.current["browserbase"] = el;
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      onMouseEnter={() => setHoveredPreview("browserbase")}
                      onMouseLeave={() => setHoveredPreview(null)}
                      className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 z-10 w-64 md:w-auto overflow-hidden"
                      style={{
                        backgroundColor: "var(--bg-content)",
                        border: "1px solid var(--gray-100)",
                      }}
                    >
                      <div className="flex">
                        {/* Video Preview */}
                        <div
                          onClick={(e) => handlePreviewClick("browserbase", e)}
                          className="flex-1 md:flex-none md:w-96 aspect-video cursor-pointer overflow-hidden relative group"
                        >
                          <iframe
                            key={getCurrentVideo("browserbase")}
                            src={`https://customer-vs7mnf7pn9caalyg.cloudflarestream.com/${getCurrentVideo(
                              "browserbase"
                            )}/iframe?autoplay=true&muted=true&controls=true&loop=true&preload=auto&defaultTextTrack=false`}
                            title="Browserbase Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                            className="w-full h-full pointer-events-none"
                            style={{ border: 0, pointerEvents: "none" }}
                          />
                        </div>

                        {/* Project List - Right (Desktop Only) */}
                        <div className="hidden md:flex md:w-40 p-2 flex-col gap-1 overflow-y-auto max-h-[180px]">
                          {browserbaseProjects.map((project) => (
                            <div
                              key={project.id}
                              onClick={() =>
                                handleSubProjectClick("browserbase", project.id)
                              }
                              className="text-left text-xs md:text-sm px-2 py-1 rounded cursor-pointer transition-colors"
                              style={{
                                color:
                                  selectedSubProject["browserbase"] ===
                                  project.id
                                    ? "var(--gray-900)"
                                    : "var(--gray-400)",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "var(--gray-100)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              {project.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              as a founding growth engineer.
            </div>

            {/* Interests */}
            <p className="text-body my-5" style={{ color: "var(--gray-700)" }}>
              I also angel invest and advise startups on growth. You'll find me
              embarassing myself learning new things, challenging myself, or
              being selfless around others.
            </p>
            {/* Contact */}
            <div
              className="text-body my-5"
              style={{ color: "var(--gray-700)" }}
            >
              I live in{" "}
              <span className="relative inline-block">
                <button
                  onClick={() => handleProjectClick("nyc")}
                  onMouseEnter={() => setHoveredPreview("nyc")}
                  onMouseLeave={() => setHoveredPreview(null)}
                  className="underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
                >
                  NYC
                </button>
                <AnimatePresence>
                  {(showPreview === "nyc" || hoveredPreview === "nyc") && (
                    <motion.div
                      ref={(el) => {
                        previewRefs.current["nyc"] = el;
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      onMouseEnter={() => setHoveredPreview("nyc")}
                      onMouseLeave={() => setHoveredPreview(null)}
                      onClick={(e) => handlePreviewClick("nyc", e)}
                      className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 z-10 w-64 md:w-96 aspect-video overflow-hidden cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-content)",
                        border: "1px solid var(--gray-100)",
                      }}
                    >
                      <iframe
                        src="https://www.youtube.com/embed/R1CG9ZuK2V8?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=R1CG9ZuK2V8"
                        title="NYC Livestream Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        className="w-full h-full pointer-events-none"
                        style={{ border: 0 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              and visit{" "}
              <span className="relative inline-block">
                <button
                  onClick={() => handleProjectClick("sf")}
                  onMouseEnter={() => setHoveredPreview("sf")}
                  onMouseLeave={() => setHoveredPreview(null)}
                  className="underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
                >
                  SF
                </button>
                <AnimatePresence>
                  {(showPreview === "sf" || hoveredPreview === "sf") && (
                    <motion.div
                      ref={(el) => {
                        previewRefs.current["sf"] = el;
                      }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      onMouseEnter={() => setHoveredPreview("sf")}
                      onMouseLeave={() => setHoveredPreview(null)}
                      onClick={(e) => handlePreviewClick("sf", e)}
                      className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 z-10 w-64 md:w-96 aspect-video overflow-hidden cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-content)",
                        border: "1px solid var(--gray-100)",
                      }}
                    >
                      <iframe
                        src="https://www.youtube.com/embed/CXYr04BWvmc?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&fs=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&playsinline=1&loop=1&playlist=CXYr04BWvmc"
                        title="SF Video Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        className="w-full h-full pointer-events-none"
                        style={{ border: 0 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              often. Feel free to{" "}
            </div>

            <div className="text-body" style={{ color: "var(--gray-700)" }}>
              <span className="relative inline-block contact-dropdown-container">
                <button
                  onClick={() => setShowContactDropdown(!showContactDropdown)}
                  className="underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ color: "var(--gray-700)", fontFamily: "inherit" }}
                >
                  reach out
                </button>

                {/* Contact Dropdown */}
                <AnimatePresence>
                  {showContactDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-0 top-full mt-2 flex gap-3 py-2 px-3 z-10"
                      style={{
                        backgroundColor: "var(--bg-content)",
                        border: "1px solid var(--gray-100)",
                      }}
                    >
                      <a
                        href="mailto:alexphan0515@gmail.com"
                        className="text-caption"
                        style={{ color: "var(--gray-700)" }}
                      >
                        Email
                      </a>
                      <span style={{ color: "var(--gray-400)" }}>·</span>
                      <a
                        href="https://linkedin.com/in/alexanderdphan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption"
                        style={{ color: "var(--gray-700)" }}
                      >
                        LinkedIn
                      </a>
                      <span style={{ color: "var(--gray-400)" }}>·</span>
                      <a
                        href="https://x.com/alexdphan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-caption"
                        style={{ color: "var(--gray-700)" }}
                      >
                        X
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              if you'd like to chat about anything.
            </div>
          </div>
        </div>
        {/* </div> */}
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(8px)",
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {getModalVideo().url && (
                <div className="flex flex-col md:flex-row gap-2">
                  {/* Video */}
                  <div className="flex-1 aspect-video">
                    <iframe
                      src={getModalVideo().url}
                      title={getModalVideo().title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 0 }}
                    />
                  </div>

                  {/* Sidebar - Below on Mobile, Right on Desktop (Only for Rho/Browserbase) */}
                  {(rhoProjects.find((p) => p.id === videoModal) ||
                    browserbaseProjects.find((p) => p.id === videoModal)) && (
                    <div
                      className="w-full md:w-56 py-4 pl-4 pr-0 flex flex-col gap-2 overflow-y-auto max-h-[200px] md:max-h-[calc(100vh-200px)]"
                      style={{
                        backgroundColor: "var(--bg-content)",
                        border: "1px solid var(--gray-100)",
                      }}
                    >
                      {/* Project List */}
                      <div className="flex flex-col gap-1 pr-2">
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
                                [rhoProjects.find((p) => p.id === videoModal)
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
                            className="text-left text-sm px-3 py-2 rounded cursor-pointer transition-colors"
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
    </>
  );
}
