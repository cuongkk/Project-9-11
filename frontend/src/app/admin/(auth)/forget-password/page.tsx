"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

type ForgetPasswordFormData = {
  email: string;
};

export default function ForgetPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  const onSubmit = async (data: ForgetPasswordFormData) => {
    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.success !== true) {
        setReloadToast("error", responseData.message);
        showReloadToastIfAny();
      } else {
        setReloadToast("success", responseData.message);
        showReloadToastIfAny();
        setTimeout(() => {
          router.push(`/admin/otp-password?email=${encodeURIComponent(email)}`);
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
    <>
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-300 p-16 md:p-24">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Quên mật khẩu</h1>
        <p className="text-lg font-semibold text-gray-800 text-center mb-10 opacity-75">Vui lòng nhập email để tiếp tục</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="relative">
            <label htmlFor="email" className="block w-full font-semibold text-lg text-gray-800 mb-4 text-left">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Ví dụ: levana@gmail.com"
              required
              {...register("email", {
                required: "Vui lòng nhập email!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không đúng định dạng!",
                },
              })}
              className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg text-lg font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="block text-red-500 text-sm font-semibold mt-1">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white font-bold text-xl rounded-lg opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Đang xử lý..." : "Gửi mã OTP"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="font-semibold text-lg text-gray-800 opacity-60">Bạn đã nhớ mật khẩu?</span>
          <Link href="/admin/login" className="font-bold text-lg text-blue-500 underline hover:text-blue-600 transition">
            Đăng nhập
          </Link>
        </div>
      </div>
    </>
  );
}
