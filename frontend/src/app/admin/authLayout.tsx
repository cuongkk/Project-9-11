"use client";

import ToastProvider from "@/components/ui/ToastProvider";
import { Header } from "@/components/layout/admin/Header";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isLogin, isAuthLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
    }
  }, [isAuthLoaded, isLogin, pathname, router]);

  if (!isAuthLoaded) {
    return (
      <main className="fixed lg:left-60 top-17.5 w-full lg:w-[calc(100vw-240px)] h-[calc(100vh-70px)] overflow-y-auto p-6">
        <div className="mx-auto w-full max-w-3xl rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-sm">Đang kiểm tra phiên đăng nhập...</div>
      </main>
    );
  }

  if (!isLogin) {
    return null;
  }

  return (
    <>
      <>
        <ToastProvider />
        <Header />
      </>
      <main className="fixed lg:left-60 top-17.5 w-full lg:w-[calc(100vw-240px)] h-[calc(100vh-70px)] overflow-y-auto">{children}</main>
    </>
  );
}
