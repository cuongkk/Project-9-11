export function GearHero() {
  return (
    <section className="relative h-[614px] md:h-[716px] flex items-center overflow-hidden mx-4 md:mx-8 mt-4 rounded-xl md:rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        data-alt="Premium travel backpack and outdoor gear arranged on a rugged stone surface with warm mountain sunset lighting"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1_4AQVQlQzyeScJGSCT6VQIxuBZuZ0n95gBqCvO8AYXe1hYgzAcLXWj7Azrc2_VAVzqlRcA1KkCp_dOoAM0yJsAfHEDT2criyknOQQxtfP7G4qOlUEbjBrGop39c6ZflRqTRX7BUx8EY6EecW9tGGrDGb7a0HyAiTjI7FAhWOPzGOrKyUU2x44WAmVQ5883YPKFkvbzqJQ0x8BIjq2NcxlLqhO1sb9aR3TvQz9jAw8JN6CAtzPryhLNBW1gOO7h2ZZU9MBCH_K9I"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="max-w-2xl">
          <span className="text-primary-fixed bg-primary/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block">The Velocity Curator</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tighter mb-6">
            Engineered for <br /> <span className="text-primary-fixed">The Infinite.</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-xl font-body leading-relaxed mb-8 max-w-md">
            Meticulously curated gear designed to move as fast as your ambition. Light, durable, and uncompromising.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-br from-primary to-primary-fixed-dim text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
              Shop Collection
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">Watch the Film</button>
          </div>
        </div>
      </div>
    </section>
  );
}
