import { FaSliders } from "react-icons/fa6";

export type TourSort = "latest" | "price-asc" | "price-desc";

type TourFiltersProps = {
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (value: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  departureFrom: string;
  onDepartureFromChange: (value: string) => void;
  sort: TourSort;
  onSortChange: (value: TourSort) => void;
  onReset: () => void;
};

export function TourFilters({
  categories,
  selectedCategories,
  onCategoryToggle,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  departureFrom,
  onDepartureFromChange,
  sort,
  onSortChange,
  onReset,
}: TourFiltersProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-28 space-y-6 bg-surface-container-low/50 lg:bg-transparent p-6 lg:p-0 rounded-2xl">
        <div>
          <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2">
            <FaSliders className="text-primary" /> Bộ lọc
          </h3>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline-variant mb-2 block">Danh mục</label>
              <div className="max-h-44 overflow-auto rounded-lg border border-outline-variant/25 bg-white p-2 space-y-1">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 px-2 py-1 rounded-md text-sm hover:bg-surface-container-low cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => onCategoryToggle(category)} className="accent-primary" />
                    <span>{category}</span>
                  </label>
                ))}
                {categories.length === 0 && <p className="px-2 py-1 text-sm text-on-surface-variant">Chưa có danh mục.</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline-variant mb-2 block">Khoảng giá (VND)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(event) => onMinPriceChange(event.target.value)}
                  placeholder="Tu"
                  className="w-full h-11 px-3 rounded-lg border border-outline-variant/25 bg-white text-sm outline-none focus:border-primary"
                />
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(event) => onMaxPriceChange(event.target.value)}
                  placeholder="Den"
                  className="w-full h-11 px-3 rounded-lg border border-outline-variant/25 bg-white text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline-variant mb-2 block">Ngày khởi hành từ</label>
              <input
                type="date"
                value={departureFrom}
                onChange={(event) => onDepartureFromChange(event.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-outline-variant/25 bg-white text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-outline-variant mb-2 block">Sắp xếp</label>
              <select
                value={sort}
                onChange={(event) => onSortChange(event.target.value as TourSort)}
                className="w-full h-11 px-3 rounded-lg border border-outline-variant/25 bg-white text-sm outline-none focus:border-primary"
              >
                <option value="latest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>

            <button
              className="primary-gradient-btn w-full h-11 rounded-lg border border-outline-variant/25 text-sm font-semibold hover:bg-surface-container-low transition-colors"
              type="button"
              onClick={onReset}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
