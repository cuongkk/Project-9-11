"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TourFilter, { TourFilters } from "@/components/features/tour/TourFilter";
import TourCreate, { TourCategory, TourCity } from "@/components/features/tour/TourCreate";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";
import { FaPen, FaTrash } from "react-icons/fa6";

type TourItem = {
  id: string;
  name: string;
  avatar: string;
  status: "active" | "inactive";
  categoryId: string;
  categoryName: string;
  priceNew: number;
  stock: number;
  departureDate?: string;
  endDate?: string;
};

type FetchStatus = "idle" | "loading" | "error";

const defaultFilters: TourFilters = {
  status: "",
  startDate: "",
  endDate: "",
  category: "",
  priceMin: "",
  priceMax: "",
  keyword: "",
};

const parseDateFromValue = (value?: string) => {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const datePart = value.includes("-") ? value.split("-").pop()?.trim() || "" : value;
  const [day, month, year] = datePart.split("/").map(Number);
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};

const getCategoryName = (categoryValue: any) => {
  if (!categoryValue) return "";
  if (typeof categoryValue === "string") return "";
  return categoryValue.name || categoryValue.title || "";
};

const getCategoryId = (categoryValue: any) => {
  if (!categoryValue) return "";
  if (typeof categoryValue === "string") return categoryValue;
  return categoryValue._id || categoryValue.id || "";
};

export default function TourListPage() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();

  const [filters, setFilters] = useState<TourFilters>(defaultFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<TourFilters>(defaultFilters);
  const [status, setStatus] = useState<FetchStatus>("loading");
  const [error, setError] = useState("");
  const [tours, setTours] = useState<TourItem[]>([]);

  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [cities, setCities] = useState<TourCity[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [filters]);

  const fetchTours = async () => {
    try {
      setStatus("loading");
      setError("");

      const [tourResponse, createResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/list`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/create`, {
          credentials: "include",
        }),
      ]);

      const tourData = await tourResponse.json();
      const createData = await createResponse.json();
      const tourPayload = tourData?.data ?? tourData;
      const createPayload = createData?.data ?? createData;
      const tourSuccess = tourData?.success === true || tourData?.code === "success";
      const createSuccess = createData?.success === true || createData?.code === "success";

      if (!tourResponse.ok || !tourSuccess) {
        throw new Error(tourData.message || "Không tải được danh sách tour");
      }

      if (!createResponse.ok || !createSuccess) {
        throw new Error(createData.message || "Không tải được dữ liệu form tour");
      }

      const mappedTours: TourItem[] = (tourPayload.tourList || []).map((tour: any) => ({
        id: tour._id || tour.id,
        name: tour.name || "",
        avatar: tour.avatar || "",
        status: tour.status || "inactive",
        categoryId: getCategoryId(tour.category),
        categoryName: getCategoryName(tour.category),
        priceNew: Number(tour.priceNew || tour.priceNewAdult || 0),
        stock: Number(tour.stock || tour.stockAdult || 0),
        departureDate: tour.departureDateFormat || tour.departureDate || "",
        endDate: tour.endDateFormat || tour.endDate || "",
      }));

      const categoryRows: TourCategory[] = (createPayload.categoryList || []).map((item: any) => ({
        id: item.id || item._id,
        name: item.name || "",
        children: (item.children || []).map((child: any) => ({
          id: child.id || child._id,
          name: child.name || "",
          children: child.children || [],
        })),
      }));

      const cityRows: TourCity[] = (createPayload.cityList || []).map((item: any) => ({
        id: item.id || item._id,
        name: item.name || "",
      }));

      setTours(mappedTours);
      setCategories(categoryRows);
      setCities(cityRows);
      setStatus("idle");
    } catch (requestError: any) {
      setStatus("error");
      setError(requestError.message || "Đã có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin) {
      router.push("/admin/login");
      return;
    }
    fetchTours();
  }, [isAuthLoaded, isLogin]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const keyword = debouncedFilters.keyword.trim().toLowerCase();

      if (keyword) {
        const searchText = [tour.name, tour.categoryName].join(" ").toLowerCase();
        if (!searchText.includes(keyword)) return false;
      }

      if (debouncedFilters.status && tour.status !== debouncedFilters.status) return false;

      if (debouncedFilters.category && tour.categoryId !== debouncedFilters.category) {
        return false;
      }

      const totalPrice = tour.priceNew;
      const minPrice = Number(debouncedFilters.priceMin || 0) * 1000;
      if (debouncedFilters.priceMin && !Number.isNaN(minPrice) && totalPrice < minPrice) return false;

      const maxPrice = Number(debouncedFilters.priceMax || 0) * 1000;
      if (debouncedFilters.priceMax && !Number.isNaN(maxPrice) && totalPrice > maxPrice) return false;

      const departureDate = parseDateFromValue(tour.departureDate);
      if (debouncedFilters.startDate && departureDate && departureDate < new Date(debouncedFilters.startDate)) return false;

      if (debouncedFilters.endDate && departureDate) {
        const endDate = new Date(debouncedFilters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (departureDate > endDate) return false;
      }

      return true;
    });
  }, [tours, debouncedFilters]);

  const allChecked = filteredTours.length > 0 && filteredTours.every((tour) => selectedIds.includes(tour.id));

  const formatCurrency = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

  const onFilterChange = (key: keyof TourFilters | "__reset__", value: string) => {
    if (key === "__reset__") {
      setFilters(defaultFilters);
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredTours.map((tour) => tour.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      return [...prev, id];
    });
  };

  const handleDeleteTour = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa tour này?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/delete/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok || (data?.success !== true && data?.code !== "success")) {
        throw new Error(data.message || "Xóa tour thất bại");
      }

      await fetchTours();
      setReloadToast("success", data.message || "Đã xóa tour");
      showReloadToastIfAny();
    } catch (requestError: any) {
      setReloadToast("error", requestError.message || "Xóa tour thất bại");
      showReloadToastIfAny();
      setStatus("error");
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/change-multi`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: selectedIds,
          option: bulkAction,
        }),
      });

      const data = await response.json();
      if (!response.ok || (data?.success !== true && data?.code !== "success")) {
        throw new Error(data.message || "Cập nhật hàng loạt thất bại");
      }

      setSelectedIds([]);
      setBulkAction("");
      await fetchTours();
      setReloadToast("success", data.message || "Đã cập nhật dữ liệu");
      showReloadToastIfAny();
    } catch (requestError: any) {
      setReloadToast("error", requestError.message || "Cập nhật hàng loạt thất bại");
      showReloadToastIfAny();
      setStatus("error");
    }
  };

  function getFormattedDate(departureDate?: string) {
    if (!departureDate) return "--";
    const date = new Date(departureDate);
    return date.toLocaleDateString("vi-VN");
  }

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-8 space-y-4 md:space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý tour</h1>

      <TourFilter filters={filters} categories={categories} onChange={onFilterChange} />

      <div className="w-full rounded-xl bg-white border border-gray-100 shadow-sm p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={(event) => setBulkAction(event.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="">-- Hành động --</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Dừng hoạt động</option>
              <option value="delete">Xóa</option>
            </select>
            <button
              type="button"
              disabled={!bulkAction || selectedIds.length === 0}
              onClick={handleBulkAction}
              className="h-10 px-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-64 max-w-full px-3 rounded-lg border border-gray-200 bg-white flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
              <input
                value={filters.keyword}
                onChange={(event) => onFilterChange("keyword", event.target.value)}
                placeholder="Tìm kiếm"
                className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>

            <button type="button" onClick={() => setShowCreateForm((prev) => !prev)} className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
              {showCreateForm ? "Đóng form" : "+ Tạo mới"}
            </button>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <TourCreate
          categories={categories}
          cities={cities}
          onCancel={() => setShowCreateForm(false)}
          onCreated={async () => {
            setShowCreateForm(false);
            await fetchTours();
            setReloadToast("success", "Tạo tour thành công");
            showReloadToastIfAny();
          }}
        />
      )}

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        {status === "loading" && <div className="p-8 text-sm text-gray-500">Đang tải dữ liệu...</div>}

        {status === "error" && (
          <div className="p-8">
            <p className="text-sm text-red-500 mb-3">{error || "Không tải được danh sách tour"}</p>
            <button type="button" onClick={fetchTours} className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              Thử lại
            </button>
          </div>
        )}

        {status === "idle" && filteredTours.length === 0 && <div className="p-8 text-sm text-gray-500">Không có tour phù hợp với bộ lọc hiện tại.</div>}

        {status === "idle" && filteredTours.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275 text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4" />
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Tên Tour</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">Ảnh đại diện</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Giá</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Còn lại</th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700">Trạng thái</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Ngày bắt đầu</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour) => (
                  <tr key={tour.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                    <td className="py-3 px-4">
                      <input type="checkbox" checked={selectedIds.includes(tour.id)} onChange={() => toggleOne(tour.id)} className="w-4 h-4" />
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{tour.name}</td>
                    <td className="py-3 px-4">
                      <div className="w-full flex justify-center">
                        <img src={tour.avatar || "/admin/assets/images/placeholder.png"} alt={tour.name} className="w-20 h-14 object-cover rounded-lg border border-gray-200" />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div>{formatCurrency(tour.priceNew)}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div>{tour.stock}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${tour.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {tour.status === "active" ? "Hoạt động" : "Tạm dừng"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div>{getFormattedDate(tour.departureDate) || "--"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => router.push(`/admin/tour/${tour.id}`)} className="w-8 h-8 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200">
                          <FaPen></FaPen>
                        </button>
                        <button type="button" onClick={() => handleDeleteTour(tour.id)} className="w-8 h-8 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                          <FaTrash></FaTrash>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
