"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { setReloadToast } from "@/utils/toast";
import CategoryEdit, { CategoryDetail } from "@/components/features/category/CategoryEdit";
import type { CategoryNode } from "@/components/features/category/CategoryCreate";

const mapTree = (items: any[]): CategoryNode[] =>
  (items || []).map((item) => ({
    id: item.id || item._id,
    name: item.name || "",
    children: mapTree(item.children || []),
  }));

const mapDetail = (item: any): CategoryDetail => ({
  id: item.id || item._id,
  name: item.name || "",
  parent: item.parent || "",
  position: Number(item.position || 0),
  status: item.status || "inactive",
  description: item.description || "",
});

export default function CategoryEditPage() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<CategoryDetail | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryNode[]>([]);

  const fetchDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/edit/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      const payload = data?.data ?? data;
      const success = data?.success === true || data?.code === "success";

      if (!response.ok || !success) {
        throw new Error(data.message || "Không tải được dữ liệu danh mục");
      }

      setDetail(mapDetail(payload.categoryDetail));
      setCategoryOptions(mapTree(payload.categoryList || []));
    } catch (requestError: any) {
      setError(requestError.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
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

  const handleSubmit = async (payload: { id: string; name: string; parent: string; position: string; status: string; description: string }) => {
    if (!id) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/edit/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || (data?.success !== true && data?.code !== "success")) {
      throw new Error(data.message || "Cập nhật danh mục thất bại");
    }

    setReloadToast("success", data.message || "Cập nhật danh mục thành công");
    router.push("/admin/category");
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-8 space-y-4 md:space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa danh mục</h1>

      {loading && <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 text-sm text-gray-500">Đang tải dữ liệu danh mục...</div>}

      {!loading && error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button type="button" onClick={fetchDetail} className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && detail && <CategoryEdit detail={detail} categoryOptions={categoryOptions} onSubmit={handleSubmit} onCancel={() => router.push("/admin/category")} />}
    </div>
  );
}
