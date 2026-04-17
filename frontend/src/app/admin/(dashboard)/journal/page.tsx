"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPen } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

type JournalItem = {
  id: string;
  title: string;
  tag: string;
  author: string;
  dateLabel: string;
  trendingScore: number;
  status: "active" | "inactive";
};

type JournalForm = {
  title: string;
  summary: string;
  tag: string;
  author: string;
  dateLabel: string;
  image: string;
  avatar: string;
  trendingScore: string;
  status: "active" | "inactive";
};

const defaultForm: JournalForm = {
  title: "",
  summary: "",
  tag: "",
  author: "",
  dateLabel: "",
  image: "",
  avatar: "",
  trendingScore: "",
  status: "active",
};

export default function JournalAdminPage() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [rows, setRows] = useState<JournalItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<JournalForm>(defaultForm);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchFailed(false);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journal/list`, {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || data?.success !== true) {
        throw new Error(data?.message || "Không tải được danh sách journal");
      }

      const list = (data?.data?.journalList || []).map((item: any) => ({
        id: item._id || item.id,
        title: item.title || "",
        tag: item.tag || "",
        author: item.author || "",
        dateLabel: item.dateLabel || "",
        trendingScore: Number(item.trendingScore || 0),
        status: item.status || "inactive",
      }));

      setRows(list);
    } catch (error: any) {
      setFetchFailed(true);
      setReloadToast("error", error.message || "Đã có lỗi xảy ra");
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
  }, [isAuthLoaded, isLogin]);

  const filteredRows = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return rows.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (!kw) return true;
      return [item.title, item.tag, item.author].join(" ").toLowerCase().includes(kw);
    });
  }, [rows, keyword, statusFilter]);

  const submitCreate = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journal/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    if (!response.ok || data?.success !== true) {
      setReloadToast("error", data?.message || "Tạo journal thất bại");
      showReloadToastIfAny();
      return;
    }

    setReloadToast("success", data?.message || "Tạo journal thành công");
    showReloadToastIfAny();
    setForm(defaultForm);
    setShowCreate(false);
    await fetchData();
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-8 space-y-4 md:space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý journal</h1>

      <div className="w-full rounded-xl bg-white border border-gray-100 shadow-sm p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tiêu đề, tag, tác giả..."
            className="h-10 w-full md:w-72 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Dừng hoạt động</option>
          </select>

          <button type="button" onClick={() => setShowCreate((prev) => !prev)} className="h-10 px-4 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
            {showCreate ? "Đóng form" : "Thêm mới"}
          </button>
        </div>

        {showCreate && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl border border-gray-200 p-4">
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Tiêu đề"
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm md:col-span-2"
            />
            <input value={form.tag} onChange={(event) => setForm((prev) => ({ ...prev, tag: event.target.value }))} placeholder="Tag" className="h-10 px-3 rounded-lg border border-gray-200 text-sm" />
            <input
              value={form.author}
              onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
              placeholder="Tác giả"
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={form.dateLabel}
              onChange={(event) => setForm((prev) => ({ ...prev, dateLabel: event.target.value }))}
              placeholder="Ngày hiển thị (vd: 24/10/2024)"
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm"
            />
            <input
              value={form.trendingScore}
              onChange={(event) => setForm((prev) => ({ ...prev, trendingScore: event.target.value }))}
              placeholder="Điểm trending"
              type="number"
              min={0}
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm"
            />
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as "active" | "inactive" }))}
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Dừng hoạt động</option>
            </select>
            <input
              value={form.image}
              onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
              placeholder="URL ảnh bài viết"
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm md:col-span-2"
            />
            <input
              value={form.avatar}
              onChange={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
              placeholder="URL avatar tác giả"
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm md:col-span-2"
            />
            <textarea
              value={form.summary}
              onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
              placeholder="Tóm tắt"
              className="min-h-24 px-3 py-2 rounded-lg border border-gray-200 text-sm md:col-span-2"
            />
            <div className="md:col-span-2">
              <button type="button" onClick={submitCreate} className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                Lưu journal
              </button>
            </div>
          </div>
        )}

        {loading && <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>}

        {!loading && fetchFailed && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm text-red-500">Không tải được dữ liệu journal.</p>
            <button type="button" onClick={fetchData} className="mt-3 h-9 px-4 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !fetchFailed && (
          <div className="overflow-auto rounded-xl border border-gray-100">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tiêu đề</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tag</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Tác giả</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ngày</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Trending</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Trạng thái</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-800 font-medium">{item.title}</td>
                    <td className="px-4 py-3 text-gray-700">{item.tag}</td>
                    <td className="px-4 py-3 text-gray-700">{item.author}</td>
                    <td className="px-4 py-3 text-gray-700">{item.dateLabel}</td>
                    <td className="px-4 py-3 text-gray-700">{item.trendingScore}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {item.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => router.push(`/admin/journal/${item.id}`)} className="w-8 h-8 rounded-md bg-amber-100 text-amber-600 hover:bg-amber-200">
                        <FaPen className="mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                      Không có journal phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
