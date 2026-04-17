import { FaHiking, FaLaptop, FaShoppingBag, FaTh, FaWalking } from "react-icons/fa";

const icons = [FaShoppingBag, FaHiking, FaWalking, FaLaptop, FaTh];
const defaultLabels = ["Packs", "Apparel", "Footwear", "Tech", "Browse All"];

type GearCategoryGridProps = {
  labels: string[];
};

export function GearCategoryGrid({ labels }: GearCategoryGridProps) {
  const renderLabels = labels.length > 0 ? labels : defaultLabels;

  return (
    <section className="py-12 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {renderLabels.map((label, index) => {
          const Icon = icons[index];
          const SafeIcon = Icon || FaTh;

          return (
            <button
              key={label}
              className={`flex items-center justify-center gap-3 bg-surface-container-lowest p-6 rounded-lg shadow-sm hover:shadow-md transition-all group ${index === renderLabels.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <SafeIcon className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-on-surface">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
