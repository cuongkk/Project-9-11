"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";
import { RevenueChart } from "@/components/ui/Chart";
import { useAuth } from "@/hooks/useAuth";

type OverviewData = {
  totalAdmin: number;
  totalOrder: number;
  totalRevenue: number;
};

export default function Dashboard() {
  const router = useRouter();
  const { isLogin, isAuthLoaded } = useAuth();

  const [overview, setOverview] = useState<OverviewData>({
    totalAdmin: 0,
    totalOrder: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!isLogin) {
      router.replace("/admin/login");
    }
  }, [isAuthLoaded, isLogin, router]);

  useEffect(() => {
    if (!isAuthLoaded || !isLogin) return;

    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;
        const response = await fetch(apiUrl, {
          credentials: "include",
        });

        const responseData = await response.json();

        if (responseData.code === "success") {
          setOverview(responseData.overview);
        } else {
          setReloadToast("error", responseData.message || "Lỗi khi tải dữ liệu dashboard");
        }
      } catch (error) {
        setReloadToast("error", "Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthLoaded, isLogin]);

  if (!isAuthLoaded || !isLogin) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <>
      {isLogin ? (
        <>
          <main className="w-full min-h-screen bg-gray-100 p-8 flex flex-col justify-start gap-8 md:left-0 md:w-full md:top-20 md:p-6 sm:p-4 sm:gap-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mt-0">Tổng quan</h1>

            {/* Section 1: Overview Cards */}
            <div className="grid grid-cols-3 gap-8 lg:grid-cols-2 md:grid-cols-1">
              {/* Users Card */}
              <div className="w-full py-7 bg-white rounded-2xl flex flex-row justify-center items-center gap-5">
                <img src="/admin/icon-user.png" alt="Users" className="w-16 h-16" />
                <div className="flex flex-col justify-center items-start gap-1">
                  <span className="font-semibold text-lg text-gray-800">Người dùng</span>
                  <span className="font-bold text-3xl text-gray-800">{formatCurrency(overview.totalAdmin)}</span>
                </div>
              </div>

              {/* Orders Card */}
              <div className="w-full py-7 bg-white rounded-2xl flex flex-row justify-center items-center gap-5">
                <img src="/admin/icon-order.png" alt="Orders" className="w-16 h-16" />
                <div className="flex flex-col justify-center items-start gap-1">
                  <span className="font-semibold text-lg text-gray-800">Đơn hàng</span>
                  <span className="font-bold text-3xl text-gray-800">{formatCurrency(overview.totalOrder)}</span>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="w-full py-7 bg-white rounded-2xl flex flex-row justify-center items-center gap-5">
                <img src="/admin/icon-revenue.png" alt="Revenue" className="w-16 h-16" />
                <div className="flex flex-col justify-center items-start gap-1">
                  <span className="font-semibold text-lg text-gray-800">Doanh thu</span>
                  <span className="font-bold text-3xl text-gray-800">{formatCurrency(overview.totalRevenue)}đ</span>
                </div>
              </div>
            </div>
          </main>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
