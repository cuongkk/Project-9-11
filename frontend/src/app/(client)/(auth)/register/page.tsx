"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    showReloadToastIfAny();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setReloadToast("error", "Vui lòng điền đầy đủ thông tin.");
      showReloadToastIfAny();
      return;
    }

    if (password.length < 6) {
      setReloadToast("error", "Mật khẩu phải có ít nhất 6 ký tự.");
      showReloadToastIfAny();
      return;
    }

    if (password !== confirmPassword) {
      setReloadToast("error", "Mật khẩu xác nhận không khớp.");
      showReloadToastIfAny();
      return;
    }

    if (!agree) {
      setReloadToast("error", "Bạn cần chấp nhận điều khoản trước khi đăng ký.");
      showReloadToastIfAny();
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          agree: true,
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.success !== true) {
        setReloadToast("error", data?.message || "Đăng ký thất bại.");
        showReloadToastIfAny();
        return;
      }

      setReloadToast("success", data?.message || "Đăng ký thành công.");
      showReloadToastIfAny();
      router.push("/login");
    } catch {
      setReloadToast("error", "Lỗi kết nối. Vui lòng thử lại.");
      showReloadToastIfAny();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row">
        {/* Left Section: Registration Form */}
        <section className="relative flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 z-10">
          <img className="absolute w-full h-full lg:hidden inset-0" src="https://res.cloudinary.com/dkamd3ghb/image/upload/v1776147963/unnamed_1_xpadze.png" alt="" />
          <div className="w-full max-w-xl lg:bg-surface bg-[#ffffff] p-5 rounded-[20px] shadow-lg z-10">
            <div className="space-y-2 mb-10">
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-inverse-surface tracking-tighter leading-tight">Tạo tài khoản mới</h1>
              <p className="text-on-surface-variant font-medium">Tham gia cộng đồng du lịch toàn cầu cùng TravelKa.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Họ và tên</label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full bg-surface-container-lowest border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-4 px-5 transition-all placeholder:text-outline-variant outline-none border"
                    placeholder="Nguyễn Văn A"
                    type="text"
                    autoComplete="name"
                    required
                  />
                </div>
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Địa chỉ Email</label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-surface-container-lowest border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-4 px-5 transition-all placeholder:text-outline-variant outline-none border"
                    placeholder="hello@travelka.com"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Mật khẩu</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full bg-surface-container-lowest border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-4 px-5 transition-all placeholder:text-outline-variant outline-none border"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      required
                    />
                    <FaEye className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-primary transition-colors"></FaEye>
                  </div>
                </div>
                {/* Confirm Password */}
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full bg-surface-container-lowest border-outline-variant/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md py-4 px-5 transition-all placeholder:text-outline-variant outline-none border"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      required
                    />
                    <FaEye className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer hover:text-primary transition-colors"></FaEye>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <input
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                  id="terms"
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                />
                <label className="text-sm text-secondary font-medium" htmlFor="terms">
                  Tôi đồng ý với{" "}
                  <a className="text-primary hover:underline underline-offset-4 transition-all" href="#">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a className="text-primary hover:underline underline-offset-4 transition-all" href="#">
                    Chính sách quyền riêng tư
                  </a>
                </label>
              </div>
              <div className="flex flex-col gap-4 pt-4">
                <button
                  disabled={isLoading}
                  className="w-full bg-linear-to-br from-primary to-primary-container text-on-primary-container py-5 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                  type="submit"
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
                <div className="relative flex items-center py-4">
                  <div className="grow border-t border-outline-variant/20" />
                  <span className="shrink mx-4 text-outline font-label text-xs uppercase tracking-widest">hoặc tiếp tục với</span>
                  <div className="grow border-t border-outline-variant/20" />
                </div>
                <button
                  className="w-full bg-secondary-container text-on-secondary-container py-5 rounded-full font-bold text-lg hover:bg-secondary-fixed-dim active:scale-95 transition-all flex items-center justify-center gap-3"
                  type="button"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
                  </svg>
                  Đăng ký với Google
                </button>
              </div>
            </form>
            <div className="mt-12 text-center lg:text-right">
              <p className="text-secondary font-medium">
                Đã có tài khoản?
                <Link className="text-primary font-bold hover:underline underline-offset-4 transition-all ml-1" href="/login">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </section>
        {/* Right Section: Stunning Lifestyle Image */}
        <section className="hidden lg:block lg:flex-1 relative overflow-hidden z-10">
          <img className="absolute w-full h-full" src="https://res.cloudinary.com/dkamd3ghb/image/upload/v1776147963/unnamed_1_xpadze.png" alt="" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent" />
          <div className="absolute bottom-20 left-20 right-20 text-white space-y-4">
            <div className="w-12 h-1 bg-white/40 mb-6" />
            <h2 className="font-headline text-5xl font-extrabold tracking-tighter leading-tight drop-shadow-xl">
              Khám phá <br />
              những miền đất mới.
            </h2>
            <p className="text-xl font-medium opacity-90 max-w-md drop-shadow-lg">Khám phá điểm đến độc quyền và hòa mình vào cộng đồng du khách đẳng cấp.</p>
          </div>
        </section>
      </main>
    </>
  );
}
