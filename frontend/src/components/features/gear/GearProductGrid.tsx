import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { PublicGear } from "@/types/client-api";

type GearProductGridProps = {
  products: PublicGear[];
  loading: boolean;
  error: string | null;
};

export function GearProductGrid({ products, loading, error }: GearProductGridProps) {
  if (loading) {
    return <p className="px-8 text-on-surface-variant font-medium">Dang tai danh sach gear...</p>;
  }

  if (error) {
    return <p className="px-8 text-red-600 font-medium">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="px-8 text-on-surface-variant font-medium">Chua co san pham gear.</p>;
  }

  return (
    <section className="py-12 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Featured Essentials</h2>
          <p className="text-on-surface-variant mt-2">Professional grade tools for the modern explorer.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="p-2 rounded-full border border-outline-variant hover:bg-surface-container-high transition-colors">
            <FaChevronLeft />
          </button>
          <button className="p-2 rounded-full border border-outline-variant hover:bg-surface-container-high transition-colors">
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <article key={product.id} className="group cursor-pointer">
            <div className="relative aspect-3/4 rounded-lg overflow-hidden mb-4 bg-surface-container-high">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt={product.name} src={product.image} />
              {product.badge ? <div className="absolute top-4 right-4 bg-surface-container-lowest px-3 py-1 rounded-full text-xs font-bold shadow-lg">{product.badge}</div> : null}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-on-surface">{product.name}</h3>
                <p className="text-on-surface-variant text-sm font-medium">{product.subtitle}</p>
              </div>
              <p className="text-primary font-bold">${Number(product.price || 0).toLocaleString("en-US")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
