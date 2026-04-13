import React from "react";

interface FilterProps {
  filters: {
    status: string;
    startDate: string;
    endDate: string;
    paymentMethod: string;
    paymentStatus: string;
    keyword: string;
  };
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function Filter({ filters, onChange, onReset }: FilterProps) {
  return (
    <div className="w-full flex flex-col gap-4 mb-8">
      {/* Section 4 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-wrap items-center gap-5">
          <div className="font-semibold text-gray-800 text-base py-2 flex items-center gap-2">
            <i className="fa-solid fa-filter"></i> Bộ lọc
          </div>
          <div className="flex-1 min-w-37.5">
            <select
              value={filters.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Trạng thái</option>
              <option value="init">Khởi tạo</option>
              <option value="approved">Đã duyệt</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-62.5">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex-1 min-w-37.5">
            <select
              value={filters.paymentMethod}
              onChange={(e) => onChange("paymentMethod", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Phương thức thanh toán</option>
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="online">Thanh toán online</option>
              <option value="transfer">Chuyển khoản</option>
            </select>
          </div>
          <div className="flex-1 min-w-37.5">
            <select
              value={filters.paymentStatus}
              onChange={(e) => onChange("paymentStatus", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Trạng thái thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>
          <button onClick={onReset} className="cursor-pointer font-semibold text-blue-500 py-2 flex items-center gap-2 hover:text-blue-700 transition-colors">
            <i className="fa-solid fa-rotate-left"></i> Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Section 5 */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 border border-gray-100">
        <div className="flex items-center gap-3 w-full bg-gray-50 rounded-lg px-4 py-2 border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all">
          <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={filters.keyword}
            onChange={(e) => onChange("keyword", e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
