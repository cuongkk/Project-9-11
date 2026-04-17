"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import CategoryFilter, { AdminOption, CategoryFilters } from "@/components/features/category/CategoryFilter";
import CategoryCreate, { CategoryNode } from "@/components/features/category/CategoryCreate";
import { FaPen, FaTrash } from "react-icons/fa6";

type CategoryItem = {
  id: string;
  name: string;
  status: "active" | "inactive";
  position: number;
};

type PageData = {
  categoryList: CategoryItem[];
  accountAdminList?: AdminOption[];
  categoryTree: CategoryNode[];
  pagination: {
    totalPage: number;
    totalRecord: number;
    limitItems: number;
    skip: number;
  };
};

const defaultFilters: CategoryFilters = {
  status: "",
  keyword: "",
};

const mapTree = (items: any[]): CategoryNode[] =>
  (items || []).map((item) => ({
    id: item.id || item._id,
    name: item.name || "",
    children: mapTree(item.children || []),
  }));

export default function CategoryListPage() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();

  const [filters, setFilters] = useState<CategoryFilters>(defaultFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<CategoryFilters>(defaultFilters);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [rows, setRows] = useState<CategoryItem[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryNode[]>([]);
  const [pagination, setPagination] = useState<PageData["pagination"]>({
    totalPage: 1,
    totalRecord: 0,
    limitItems: 0,
    skip: 0,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [deleteConfirmCode, setDeleteConfirmCode] = useState("");
  const [deleteConfirmError, setDeleteConfirmError] = useState("");
  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [filters]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedFilters.status) params.set("status", debouncedFilters.status);
    if (debouncedFilters.keyword.trim()) params.set("keyword", debouncedFilters.keyword.trim());
    params.set("page", String(page));
    return params.toString();
  }, [debouncedFilters, page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchFailed(false);

      const [listResponse, createResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/list?${queryString}`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/create`, {
          credentials: "include",
        }),
      ]);

      const listData = await listResponse.json();
      const createData = await createResponse.json();
      const listPayload = listData?.data ?? listData;
      const createPayload = createData?.data ?? createData;
      const listSuccess = listData?.success === true || listData?.code === "success";
      const createSuccess = createData?.success === true || createData?.code === "success";

      if (!listResponse.ok || !listSuccess) {
        throw new Error(listData.message || "Không tải được danh sách danh mục");
      }
      if (!createResponse.ok || !createSuccess) {
        throw new Error(createData.message || "Không tải được dữ liệu tạo danh mục");
      }

      setRows(
        (listPayload.categoryList || []).map((item: any) => ({
          id: item.id || item._id,
          name: item.name || "",
          status: item.status || "inactive",
          position: item.position || 0,
        })),
      );
      setCategoryOptions(mapTree(createPayload.categoryList || []));
      setPagination(listPayload.pagination || { totalPage: 1, totalRecord: 0, limitItems: 0, skip: 0 });
      setSelectedIds([]);
    } catch (requestError: any) {
      setFetchFailed(true);
      setReloadToast("error", requestError.message || "Lỗi kết nối. Vui lòng thử lại.");
      showReloadToastIfAny();
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
    fetchData();
  }, [isAuthLoaded, isLogin, queryString]);

  const allChecked = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  const handleToggleAll = () => {
    if (allChecked) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(rows.map((row) => row.id));
  };

  const handleToggleOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleDeleteOne = async (id: string) => {
    setOpenConfirmDelete({ open: true, id });
    setDeleteConfirmCode("");
    setDeleteConfirmError("");
  };

  const submitDelete = async () => {
    if (!openConfirmDelete.id) return;

    if (!deleteConfirmCode.trim()) {
      setDeleteConfirmError("Vui lòng nhập mã xác nhận");
      return;
    }

    const id = openConfirmDelete.id;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/delete/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleteCode: deleteConfirmCode.trim() }),
    });
    const data = await response.json();

    if (!data.success) {
      setReloadToast("error", data.message || "Xóa danh mục thất bại");
      showReloadToastIfAny();
      return;
    }

    setOpenConfirmDelete({ open: false, id: null });
    setDeleteConfirmCode("");
    setDeleteConfirmError("");
    setReloadToast("success", data.message || "Đã xóa danh mục");
    showReloadToastIfAny();
    await fetchData();
  };

  const handleBulkApply = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/change-multi`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listId: selectedIds, option: bulkAction }),
    });

    const data = await response.json();
    if (!data.success) {
      setReloadToast("error", data.message || "Thao tác hàng loạt thất bại");
      showReloadToastIfAny();
      return;
    }

    setReloadToast("success", data.message || "Đã cập nhật dữ liệu");
    showReloadToastIfAny();
    setBulkAction("");
    await fetchData();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-8 space-y-4 md:space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>

      <CategoryFilter filters={filters} onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))} />

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
              onClick={handleBulkApply}
              disabled={!bulkAction || selectedIds.length === 0}
              className="h-10 px-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
            <button type="button" onClick={() => setShowCreateForm((prev) => !prev)} className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
              {showCreateForm ? "Đóng form" : "+ Tạo mới"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-64 max-w-full px-3 rounded-lg border border-gray-200 bg-white flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
              <input
                value={filters.keyword}
                onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
                placeholder="Tìm kiếm"
                autoComplete="off"
                name="category-search"
                className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <CategoryCreate
          categoryOptions={categoryOptions}
          onCancel={() => setShowCreateForm(false)}
          onCreated={async () => {
            setShowCreateForm(false);
            setReloadToast("success", "Tạo danh mục thành công");
            showReloadToastIfAny();
            await fetchData();
          }}
        />
      )}

      {openConfirmDelete.open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-800">Xác nhận xóa </h3>
            <p className="text-sm text-gray-600 mt-2">Nhập mã xác nhận để xóa </p>

            <input
              type="password"
              value={deleteConfirmCode}
              autoComplete="new-password"
              name="delete-confirm-code"
              onChange={(event) => {
                setDeleteConfirmCode(event.target.value);
                setDeleteConfirmError("");
              }}
              placeholder="Nhập mã xác nhận"
              className="mt-4 w-full h-10 px-3 rounded-lg border border-gray-300 outline-none focus:border-red-500"
            />

            {deleteConfirmError && <p className="text-sm text-red-500 mt-2">{deleteConfirmError}</p>}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpenConfirmDelete({ open: false, id: null });
                  setDeleteConfirmCode("");
                  setDeleteConfirmError("");
                }}
                className="h-10 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button type="button" onClick={submitDelete} className="h-10 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        {loading && <div className="p-8 text-sm text-gray-500">Đang tải dữ liệu...</div>}

        {!loading && fetchFailed && (
          <div className="p-8">
            <p className="text-sm text-red-500 mb-3">Không tải được danh sách danh mục.</p>
            <button type="button" onClick={fetchData} className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !fetchFailed && rows.length === 0 && <div className="p-8 text-sm text-gray-500">Không có danh mục phù hợp.</div>}

        {!loading && !fetchFailed && rows.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-245 text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left">
                      <input type="checkbox" checked={allChecked} onChange={handleToggleAll} className="w-4 h-4" />
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Tên danh mục</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Vị trí</th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-700">Trạng thái</th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                      <td className="py-3 px-4">
                        <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => handleToggleOne(item.id)} className="w-4 h-4" />
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-center">
                        {Number(item.position || 0)
                          .toFixed(1)
                          .replace(/\.0$/, "")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {item.status === "active" ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => router.push(`/admin/category/${item.id}`)} className="w-8 h-8 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200">
                            <FaPen></FaPen>
                          </button>
                          <button type="button" onClick={() => handleDeleteOne(item.id)} className="w-8 h-8 rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                            <FaTrash></FaTrash>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
              <select
                value={page}
                onChange={(event) => setPage(Number(event.target.value))}
                className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-500"
              >
                {Array.from({ length: Math.max(1, pagination.totalPage) }, (_, idx) => idx + 1).map((pageOption) => (
                  <option key={pageOption} value={pageOption}>
                    Trang {pageOption}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
