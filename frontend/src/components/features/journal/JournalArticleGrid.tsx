import type { PublicJournal } from "@/types/client-api";

type JournalArticleGridProps = {
  articles: PublicJournal[];
  loading: boolean;
  error: string | null;
};

export function JournalArticleGrid({ articles, loading, error }: JournalArticleGridProps) {
  if (loading) {
    return <p className="text-on-surface-variant font-medium">Dang tai bai viet...</p>;
  }

  if (error) {
    return <p className="text-red-600 font-medium">{error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-on-surface-variant font-medium">Chua co bai viet nao.</p>;
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-extrabold tracking-tighter">Latest Chronicles</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {articles.map((article) => (
          <article key={article.title} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg aspect-4/3 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt={article.title} src={article.image} />
              <div className="absolute top-4 right-4 bg-surface-container-lowest px-4 py-1.5 rounded-full text-xs font-bold shadow-xl">{article.tag}</div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">{article.summary}</p>
              <div className="flex items-center gap-4 pt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="w-6 h-6 rounded-full object-cover" data-alt={article.author} src={article.avatar} />
                <span className="text-xs font-semibold text-on-surface uppercase tracking-wider">{article.author}</span>
                <span className="text-xs text-outline">• {article.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <button className="px-12 py-4 rounded-full border border-outline/20 font-bold text-on-surface hover:bg-surface-container-low transition-colors">Load More Adventures</button>
      </div>
    </div>
  );
}
