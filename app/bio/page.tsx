import FloatingMusicPlayer from "@/components/FloatingMusicPlayer";
import Link from "next/link";

export default function BioPage() {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-16">
        {/* Bio Description */}
        <div className="flex-shrink-0 max-w-sm">
          <p className="text-[15px] leading-[1.7] text-gray-900 tracking-tight font-normal">
            I'm currently pursuing{" "}
            <Link
              href="/work"
              className="text-orange-600 font-medium hover:underline"
            >
              work
            </Link>{" "}
            in the fintech space. You'll find me always look for opportunities
            that are simple, yet overlooked. If you think we'd be great friends,
            don't hesitate to reach out.
          </p>
        </div>

        {/* Floating Music Player */}
        <FloatingMusicPlayer />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center gap-8">
        {/* Floating Music Player */}
        <FloatingMusicPlayer />

        {/* Bio Description */}
        <div className="max-w-sm text-center px-4">
          <p className="text-[15px] leading-[1.7] text-gray-900 tracking-tight font-normal">
            I'm currently pursuing{" "}
            <Link
              href="/work"
              className="text-orange-600 font-medium hover:underline"
            >
              work
            </Link>{" "}
            in the fintech space. You'll find me always look for opportunities
            that are simple, yet overlooked. If you think we'd be great friends,
            don't hesitate to reach out.
          </p>
        </div>
      </div>
    </>
  );
}
