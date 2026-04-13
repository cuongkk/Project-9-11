"use client";

import React, { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

type SettingWebsiteInfo = {
  websiteName: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
  favicon: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const emptyForm: SettingWebsiteInfo = {
  websiteName: "",
  phone: "",
  email: "",
  address: "",
  logo: "",
  favicon: "",
};

export default function SystemPage() {
  const [form, setForm] = useState<SettingWebsiteInfo>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPondFiles, setLogoPondFiles] = useState<any[]>([]);
  const [faviconPondFiles, setFaviconPondFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadSetting = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setting/info-web`, {
          credentials: "include",
        });

        const data: ApiResponse<{ settingWebsiteInfo?: Partial<SettingWebsiteInfo> }> = await res.json();

        if (!res.ok || data.success !== true) {
          throw new Error(data.message || "Không thể tải thông tin hệ thống");
        }

        const info = data.data?.settingWebsiteInfo || {};
        setForm({
          websiteName: info.websiteName || "",
          phone: info.phone || "",
          email: info.email || "",
          address: info.address || "",
          logo: info.logo || "",
          favicon: info.favicon || "",
        });

        setLogoPondFiles(info.logo ? [{ source: info.logo, options: { type: "local" as const } }] : []);
        setFaviconPondFiles(info.favicon ? [{ source: info.favicon, options: { type: "local" as const } }] : []);
      } catch (e: any) {
        setError(e?.message || "Không thể tải thông tin hệ thống");
      } finally {
        setLoading(false);
      }
    };

    void loadSetting();
  }, []);

  const setValue = (key: keyof SettingWebsiteInfo, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = new FormData();
      payload.append("name", form.websiteName.trim());
      payload.append("phone", form.phone.trim());
      payload.append("email", form.email.trim());
      payload.append("address", form.address.trim());

      if (logoFile) payload.append("logo", logoFile);
      if (faviconFile) payload.append("favicon", faviconFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setting/website-info`, {
        method: "PATCH",
        credentials: "include",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok || data.success !== true) {
        throw new Error(data.message || "Cập nhật thông tin hệ thống thất bại");
      }

      setSuccess(data.message || "Cập nhật thành công");
      setLogoFile(null);
      setFaviconFile(null);
      if (logoPondFiles.length > 0) {
        setLogoPondFiles([]);
      }
      if (faviconPondFiles.length > 0) {
        setFaviconPondFiles([]);
      }

      const infoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setting/info-web`, {
        credentials: "include",
      });
      const infoData: ApiResponse<{ settingWebsiteInfo?: Partial<SettingWebsiteInfo> }> = await infoRes.json();
      if (infoRes.ok && infoData.success) {
        const info = infoData.data?.settingWebsiteInfo || {};
        setForm((prev) => ({
          ...prev,
          logo: info.logo || "",
          favicon: info.favicon || "",
        }));
        setLogoPondFiles(info.logo ? [{ source: info.logo, options: { type: "local" as const } }] : []);
        setFaviconPondFiles(info.favicon ? [{ source: info.favicon, options: { type: "local" as const } }] : []);
      }
    } catch (e: any) {
      setError(e?.message || "Cập nhật thông tin hệ thống thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="w-full flex-1 p-4 md:p-8 bg-[#f5f6fa] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cài đặt hệ thống</h1>

        {loading && <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 text-sm text-gray-500">Đang tải dữ liệu cấu hình hệ thống...</div>}

        {!loading && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white shadow-sm p-4 md:p-6 space-y-5">
            {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {success && <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
                <input
                  type="text"
                  value={form.websiteName}
                  onChange={(event) => setValue("websiteName", event.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                  placeholder="Nhập tên website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) => setValue("phone", event.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setValue("email", event.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => setValue("address", event.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="avatar-pond">
                  <FilePond
                    files={logoPondFiles}
                    onupdatefiles={(items) => {
                      const nextFiles = items.map((item) => item.file as File);
                      setLogoPondFiles(nextFiles);
                      setLogoFile(nextFiles[0] ?? null);
                    }}
                    allowMultiple={false}
                    maxFiles={1}
                    acceptedFileTypes={["image/*"]}
                    name="logo"
                    labelIdle='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" style="display:block;margin:0 auto 8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16v-8m-4 4 4-4 4 4M6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 17.5 6h-2l-1.5-2h-4L8.5 6h-2A1.5 1.5 0 0 0 5 7.5v11A1.5 1.5 0 0 0 6.5 20Z"/></svg>Kéo thả ảnh hoặc <span class="filepond--label-action">chọn file</span>'
                    imagePreviewHeight={256}
                    styleLoadIndicatorPosition="center bottom"
                    styleProgressIndicatorPosition="right bottom"
                    styleButtonRemoveItemPosition="left bottom"
                    styleButtonProcessItemPosition="right bottom"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="avatar-pond">
                  <FilePond
                    files={faviconPondFiles}
                    onupdatefiles={(items) => {
                      const nextFiles = items.map((item) => item.file as File);
                      setFaviconPondFiles(nextFiles);
                      setFaviconFile(nextFiles[0] ?? null);
                    }}
                    allowMultiple={false}
                    maxFiles={1}
                    acceptedFileTypes={["image/*"]}
                    name="favicon"
                    labelIdle='<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" style="display:block;margin:0 auto 8px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16v-8m-4 4 4-4 4 4M6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 17.5 6h-2l-1.5-2h-4L8.5 6h-2A1.5 1.5 0 0 0 5 7.5v11A1.5 1.5 0 0 0 6.5 20Z"/></svg>Kéo thả ảnh hoặc <span class="filepond--label-action">chọn file</span>'
                    imagePreviewHeight={96}
                    styleLoadIndicatorPosition="center bottom"
                    styleProgressIndicatorPosition="right bottom"
                    styleButtonRemoveItemPosition="left bottom"
                    styleButtonProcessItemPosition="right bottom"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving} className="h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? "Đang lưu..." : "Lưu cài đặt"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
