import React from "react";

export interface CategoryFilters {
  status: string;
  keyword: string;
}

export interface AdminOption {
  id: string;
  fullName: string;
}

interface CategoryFilterProps {
  filters: CategoryFilters;
  onChange: (key: keyof CategoryFilters, value: string) => void;
}

export default function CategoryFilter({ filters, onChange }: CategoryFilterProps) {
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
      </div>
    </div>
  );
}
