"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: data.password }),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.success !== true) {
        setReloadToast("error", responseData.message);
        showReloadToastIfAny();
      } else {
        setReloadToast("success", responseData.message);
        showReloadToastIfAny();
        setTimeout(() => {
          router.push("/admin/login");
        }, 1000);
      }
    } catch {
      setReloadToast("error", "Lỗi kết nối. Vui lòng thử lại.");
      showReloadToastIfAny();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-300 p-16 md:p-24">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Đổi mật khẩu</h1>
      <p className="text-lg font-semibold text-gray-800 text-center mb-10 opacity-75">Vui lòng nhập mật khẩu để tiếp tục</p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="relative">
          <label htmlFor="password" className="block w-full font-semibold text-lg text-gray-800 mb-4 text-left">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu mới"
            required
            {...register("password", {
              required: "Vui lòng nhập mật khẩu!",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
              maxLength: {
                value: 30,
                message: "Mật khẩu không được vượt quá 30 ký tự",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                message: "Mật khẩu phải có chữ cái và số",
              },
            })}
            className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg text-lg font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <span className="block text-red-500 text-sm font-semibold mt-1">{errors.password.message}</span>}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block w-full font-semibold text-lg text-gray-800 mb-4 text-left">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            required
            {...register("confirmPassword", {
              required: "Vui lòng xác nhận mật khẩu!",
              validate: (value) => value === password || "Mật khẩu xác nhận không khớp",
            })}
            className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg text-lg font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && <span className="block text-red-500 text-sm font-semibold mt-1">{errors.confirmPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 text-white font-bold text-xl rounded-lg opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-3">
        <span className="font-semibold text-lg text-gray-800 opacity-60">Bạn đã nhớ mật khẩu?</span>
        <Link href="/admin/login" className="font-bold text-lg text-blue-500 underline hover:text-blue-600 transition">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
