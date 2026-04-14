import Image from "next/image";

const HERO_SRC =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=80";

/** Jumbotron full lebar */
export function CatalogHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[280px] w-full sm:min-h-[320px] md:min-h-[380px]">
        <Image
          src={HERO_SRC}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-tl from-[#1E3A5F]/90 via-[#2D5A8F]/80 to-[#1E3A5F]/90"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            NextMart
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Discover quality products from our curated selection — simple browsing,
            secure cart, and checkout-ready experience.
          </p>
        </div>
      </div>
    </section>
  );
}
