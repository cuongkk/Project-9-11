import { FaEnvelope, FaSliders } from "react-icons/fa6";
import type { PublicJournal } from "@/types/client-api";

type JournalSidebarProps = {
  trendingList: PublicJournal[];
};

export function JournalSidebar({ trendingList }: JournalSidebarProps) {
  return (
    <aside className="w-full lg:w-90 space-y-16">
      <div className="bg-surface-container-low p-8 rounded-lg">
        <h4 className="text-lg font-bold mb-6 flex items-center justify-between">
          Curated Lists
          <FaSliders />
        </h4>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-surface-container-lowest transition-colors group">
            <span className="text-sm font-medium">Remote Work Hubs</span>
            <span className="bg-primary-container text-on-primary-container text-[10px] px-2 py-1 rounded font-bold">12</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-surface-container-lowest transition-colors">
            <span className="text-sm font-medium">Sustainable Gear</span>
            <span className="text-outline text-xs">24</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-surface-container-lowest transition-colors">
            <span className="text-sm font-medium">Hidden Cuisines</span>
            <span className="text-outline text-xs">08</span>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-surface-container-lowest transition-colors">
            <span className="text-sm font-medium">Solo Female Travel</span>
            <span className="text-outline text-xs">42</span>
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-8">Trending This Week</h4>
        <div className="space-y-8">
          {trendingList.map((trend) => (
            <article key={trend.title} className="flex gap-4 group cursor-pointer">
              <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-full h-full object-cover transition-transform group-hover:scale-110" data-alt={trend.title} src={trend.image} />
              </div>
              <div className="flex flex-col justify-center">
                <h5 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{trend.title}</h5>
                <p className="text-xs text-outline mt-1 uppercase tracking-tighter">Hot score {trend.trendingScore}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <FaEnvelope className="text-lime-400 mb-4 text-4xl" />
          <h4 className="text-2xl font-bold mb-4 tracking-tight">The Weekly Dispatch</h4>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">No spam. Just curated travel stories and exclusive gear discounts delivered once a week.</p>
          <input className="w-full bg-slate-800 border-none rounded-lg py-3 px-4 mb-3 text-sm focus:ring-2 focus:ring-lime-500/50" placeholder="Your email address" type="email" />
          <button className="w-full bg-lime-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-lime-400 transition-colors">Subscribe Now</button>
        </div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl" />
      </div>
    </aside>
  );
}
