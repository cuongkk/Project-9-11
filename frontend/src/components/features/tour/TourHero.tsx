import { FaSearch } from "react-icons/fa";

type TourHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
  title?: string;
  subtitle?: string;
};

export function TourHero({ query, onQueryChange, title, subtitle }: TourHeroProps) {
  return (
    <section className="relative min-h-125 lg:min-h-155 flex items-center mb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          alt="Tour hero"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2UPdUN52yjMMpp5_P1hZ7JGIUwEr6UoHLA2YLQYTZN0FZKfZbe8oGXuC8iixw6WJTSP4luKqsnwg7PTMYoTW7PZ7sX6YJ2W6DcZsgk_u0KQeARorMnXpbz_7jiV1LGZYVWvL38Hik_hR9ib3tytxYPKz-lyrEp1t35VY5J4yvk_emlwiYtCumLvzhf5D1C1z8pXFvuNj9akI1EoJVseK_Pum25ouNn1d0OiefXgyLriYcTLmMKMkqaflN20pspmE2RQdF8f7Z0M4"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight mb-6">{title}</h1>
          <p className="text-white/85 text-lg md:text-xl max-w-lg">{subtitle}</p>
        </div>

        <div className="bg-surface-container-lowest/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
          <div className="bg-white rounded-full p-2 flex items-center shadow-lg transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/30">
            <FaSearch className="w-5 h-5 ml-5 text-outline" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-base font-body placeholder:text-outline-variant"
              placeholder="Tìm kiếm"
              type="text"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
