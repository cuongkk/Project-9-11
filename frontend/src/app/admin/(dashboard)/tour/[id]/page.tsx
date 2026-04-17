"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TourEdit, { TourDetail } from "@/components/features/tour/admin/TourEdit";
import type { TourCategory, TourCity } from "@/components/features/tour/admin/TourCreate";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";

type FetchStatus = "idle" | "loading" | "error";

const parseDateInputValue = (value?: string) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const datePart = value.includes("-") ? value.split("-").pop()?.trim() || "" : value;
  const [day, month, year] = datePart.split("/").map(Number);
  if (!day || !month || !year) return "";

  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

const mapTourDetail = (tour: any): TourDetail => ({
  id: tour._id || tour.id || "",
  name: tour.name || "",
  category: typeof tour.category === "string" ? tour.category : tour.category?._id || tour.category?.id || "",
  status: tour.status || "inactive",
  avatar: tour.avatar || "",
  images: tour.images || [],
  price: Number(tour.price || tour.priceAdult || 0),
  priceNew: Number(tour.priceNew || tour.priceNewAdult || 0),
  stock: Number(tour.stock || tour.stockAdult || 0),
  locations: (tour.locations || []).map((location: any) => String(location).replace("id-", "")),
  departureDate: parseDateInputValue(tour.departureDate || tour.departureDateFormat),
  endDate: parseDateInputValue(tour.endDate || tour.endDateFormat),
  information: tour.information || "",
  schedules: (tour.schedules || []).map((schedule: any) => ({
    title: schedule.title || "",
    description: schedule.description || "",
  })),
});

export default function TourEditPage() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [status, setStatus] = useState<FetchStatus>("loading");
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [cities, setCities] = useState<TourCity[]>([]);

  const fetchDetail = async () => {
    if (!id) return;

    try {
      setStatus("loading");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/edit/${id}`, {
        credentials: "include",
      });

      const data = await response.json();
      const payload = data?.data ?? data;
      const success = data?.success === true || data?.code === "success";

      if (!response.ok || !success) {
        throw new Error(data.message || "Không tải được chi tiết tour");
      }

      const categoryRows: TourCategory[] = (payload.categoryList || []).map((item: any) => ({
        id: item.id || item._id,
        name: item.name || "",
        children: (item.children || []).map((child: any) => ({
          id: child.id || child._id,
          name: child.name || "",
          children: child.children || [],
        })),
      }));

      const cityRows: TourCity[] = (payload.cityList || []).map((item: any) => ({
        id: item.id || item._id,
        name: item.name || "",
      }));

      setTour(mapTourDetail(payload.tourDetail || {}));
      setCategories(categoryRows);
      setCities(cityRows);
      setStatus("idle");
    } catch (requestError: any) {
      setStatus("error");
      setReloadToast("error", requestError.message || "Không tải được dữ liệu");
      showReloadToastIfAny();
    }
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin) {
      router.push("/admin/login");
      return;
    }
    fetchDetail();
  }, [isAuthLoaded, isLogin, id]);

  const handleSubmit = async (payload: FormData) => {
    if (!id) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/edit/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: payload,
    });

    const data = await response.json();
    if (!response.ok || (data?.success !== true && data?.code !== "success")) {
      throw new Error(data.message || "Cập nhật thất bại");
    }

    setReloadToast("success", data.message || "Cập nhật tour thành công");
    router.push("/admin/tour");
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-8 space-y-4 md:space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa tour</h1>

      {status === "loading" && <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 text-sm text-gray-500">Đang tải dữ liệu tour...</div>}

      {status === "error" && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm text-red-500 mb-3">Không thể tải dữ liệu</p>
          <button type="button" onClick={fetchDetail} className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
            Thử lại
          </button>
        </div>
      )}

      {status === "idle" && tour && <TourEdit tour={tour} categories={categories} cities={cities} onSubmit={handleSubmit} onCancel={() => router.push("/admin/tour")} />}
    </div>
  );
}
