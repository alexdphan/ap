import ArtworkCard from "@/components/ArtworkCard";

export default function WorkPage() {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-16">
        <div className="flex-shrink-0 max-w-sm">
          <p className="text-[15px] leading-[1.7] text-gray-900 tracking-tight font-normal">
            Discover the power of light and darkness in{" "}
            <span className="text-orange-600 font-medium">Caravaggio</span>
            &apos;s works of art. This exhibition reveals the artist&apos;s raw
            emotion, realism, and revolutionary vision that changed the course
            of Baroque art.
          </p>
        </div>

        {/* Artwork */}
        <ArtworkCard
          title="Narcissus at\nthe Source"
          image="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=500&fit=crop"
          date="1597-1599"
          alt="Narcissus at the Source by Caravaggio"
          width={200}
          height={250}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col items-center gap-8">
        <ArtworkCard
          title="Narcissus at\nthe Source"
          image="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=500&fit=crop"
          date="1597-1599"
          alt="Narcissus at the Source by Caravaggio"
          width={200}
          height={250}
        />

        <div className="max-w-sm text-center px-4">
          <p className="text-[15px] leading-[1.7] text-gray-900 tracking-tight font-normal">
            Discover the power of light and darkness in{" "}
            <span className="text-orange-600 font-medium">Caravaggio</span>
            &apos;s works of art. This exhibition reveals the artist&apos;s raw
            emotion, realism, and revolutionary vision that changed the course
            of Baroque art.
          </p>
        </div>
      </div>
    </>
  );
}
