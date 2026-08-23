import Image from "next/image";

import InteractiveBio from "@/components/InteractiveBio";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-5 sm:gap-6">
      <header className="w-full">
        <div className="flex items-center gap-3">
          <Image
            src="/alex.jpg"
            alt="Alex Phan"
            width={48}
            height={48}
            sizes="48px"
            className="profile-image size-12 shrink-0 object-cover"
            quality={100}
            priority
          />
          <div className="flex h-12 min-w-0 flex-col justify-center">
            <h1
              className="text-body font-medium leading-5"
              style={{ color: "var(--text-primary)" }}
            >
              <span aria-hidden="true">AP</span>{" "}
              <span className="sr-only">
                Alex Phan, angel investor and growth advisor
              </span>
            </h1>
            <p
              aria-hidden="true"
              className="text-caption"
              style={{ color: "var(--text-muted)", whiteSpace: "pre" }}
            >
              Alex Phan
            </p>
          </div>
        </div>
      </header>

      <InteractiveBio />
    </div>
  );
}
