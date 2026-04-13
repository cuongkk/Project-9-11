import React from "react";
import type { TourCategory } from "./TourCreate";

export interface TourFilters {
  status: string;
  startDate: string;
  endDate: string;
  category: string;
  priceMin: string;
  priceMax: string;
  keyword: string;
}

interface TourFilterProps {
  filters: TourFilters;
  categories: TourCategory[];
  onChange: (key: keyof TourFilters | "__reset__", value: string) => void;
}

const flattenCategories = (categories: TourCategory[], depth = 0): Array<{ id: string; label: string }> => {
  const rows: Array<{ id: string; label: string }> = [];
  for (const category of categories) {
    rows.push({ id: category.id, label: `${"— ".repeat(depth)}${category.name}` });
    if (category.children?.length) {
      rows.push(...flattenCategories(category.children, depth + 1));
    }
  }
  return rows;
};

export default function TourFilter({ filters, categories, onChange }: TourFilterProps) {
  const categoryOptions = flattenCategories(categories);

  return (
    <div className="w-full rounded-xl bg-white border border-gray-100 shadow-sm p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="font-semibold text-gray-800 flex items-center gap-2 min-w-fit">
          <i className="fa-solid fa-filter"></i>
          Bộ lọc
        </div>

        <select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
          className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="">Trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm dừng</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange("startDate", event.target.value)}
            title="Ngày khởi hành từ"
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange("endDate", event.target.value)}
            title="Ngày khởi hành đến"
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
          className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="">Danh mục</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={filters.priceMin}
            onChange={(event) => onChange("priceMin", event.target.value)}
            placeholder="Từ (nghìn đ)"
            className="h-10 w-32 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            min={0}
            value={filters.priceMax}
            onChange={(event) => onChange("priceMax", event.target.value)}
            placeholder="Đến (nghìn đ)"
            className="h-10 w-32 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
          />
        </div>

        <button type="button" onClick={() => onChange("__reset__", "")} className="h-10 px-3 rounded-lg border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors">
          <i className="fa-solid fa-rotate-left mr-2"></i>
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
