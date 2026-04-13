"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  agree: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      agree: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (isLogin) {
      router.replace("/admin");
    }
  }, [isAuthLoaded, isLogin, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok || responseData.success !== true) {
        setReloadToast("error", responseData.message);
        showReloadToastIfAny();
      } else {
        setReloadToast("success", responseData.message);
        showReloadToastIfAny();
        setTimeout(() => {
          router.replace("/admin/login");
        }, 800);
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
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Đăng ký</h1>
      <p className="text-lg font-semibold text-gray-800 text-center mb-10 opacity-75">Tạo một tài khoản để tiếp tục</p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="relative">
          <label htmlFor="fullName" className="block w-full font-semibold text-lg text-gray-800 mb-4 text-left">
            Họ tên
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Ví dụ: Lê Văn A"
            required
            {...register("fullName", {
              required: "Vui lòng nhập họ tên!",
              minLength: {
                value: 5,
                message: "Họ tên phải có ít nhất 5 ký tự",
              },
              maxLength: {
                value: 50,
                message: "Họ tên không được vượt quá 50 ký tự",
              },
            })}
            className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg text-lg font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullName && <span className="block text-red-500 text-sm font-semibold mt-1">{errors.fullName.message}</span>}
        </div>

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

        <div className="relative">
          <label htmlFor="password" className="block w-full font-semibold text-lg text-gray-800 mb-4 text-left">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
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
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agree"
              required
              {...register("agree", {
                required: "Bạn phải chấp nhận các điều khoản và điều kiện",
              })}
              className="w-5 h-5 accent-blue-500 cursor-pointer mt-1 shrink-0"
            />
            <label htmlFor="agree" className="font-semibold text-lg text-gray-800 cursor-pointer">
              Tôi chấp nhận các điều khoản và điều kiện
            </label>
          </div>
          {errors.agree && <span className="block text-red-500 text-sm font-semibold mt-2 ml-1">{errors.agree.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 text-white font-bold text-xl rounded-lg opacity-90 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Đang xử lý..." : "Đăng Ký"}
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-3">
        <span className="font-semibold text-lg text-gray-800 opacity-60">Bạn đã có tài khoản?</span>
        <Link href="/admin/login" className="font-bold text-lg text-blue-500 underline hover:text-blue-600 transition">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
