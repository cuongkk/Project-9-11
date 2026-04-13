"use client";

import React, { useState, useEffect, useCallback } from "react";
import Filter from "@/components/features/order/OrderFilter";
import OrderTable, { Order } from "@/components/features/order/OrderTable";
import Pagination from "@/components/ui/Pagination";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const router = useRouter();

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    paymentStatus: "",
    keyword: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const mapOrder = (order: any): Order => ({
    id: order._id,
    code: order.code || "",
    fullName: order.fullName || "",
    phone: order.phone || "",
    note: order.note || "",
    items: (order.items || []).map((item: any) => ({
      name: item.name || "",
      avatar: item.avatar || "",
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
    })),
    subTotal: Number(order.subTotal || 0),
    discount: Number(order.discount || 0),
    discountCode: order.discountCode || "",
    total: Number(order.total || 0),
    paymentMethod: order.paymentMethodName || order.paymentMethod || "",
    paymentStatus: order.paymentStatusName || order.paymentStatus || "",
    status: order.status || "",
    createdAtFormat: order.createdAtDate || "",
    timeFormat: order.createdAtTime || "",
  });

  // Fetch logic
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/list`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu đơn hàng");

      const data = await res.json();
      const sourceOrders = (data.orderList || []).map(mapOrder);

      const keyword = filters.keyword.trim().toLowerCase();
      const filteredOrders = sourceOrders.filter((order: Order) => {
        const matchKeyword = !keyword || order.code.toLowerCase().includes(keyword) || order.fullName.toLowerCase().includes(keyword) || order.phone.toLowerCase().includes(keyword);

        const matchStatus = !filters.status || order.status === filters.status;
        const matchPaymentMethod = !filters.paymentMethod || order.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase());
        const matchPaymentStatus = !filters.paymentStatus || order.paymentStatus.toLowerCase().includes(filters.paymentStatus.toLowerCase());

        const matchDate = (() => {
          if (!filters.startDate && !filters.endDate) return true;
          const [day, month, year] = (order.createdAtFormat || "").split("/");
          if (!day || !month || !year) return true;
          const orderDate = new Date(Number(year), Number(month) - 1, Number(day));
          const start = filters.startDate ? new Date(filters.startDate) : null;
          const end = filters.endDate ? new Date(filters.endDate) : null;
          if (start && orderDate < start) return false;
          if (end && orderDate > end) return false;
          return true;
        })();

        return matchKeyword && matchStatus && matchPaymentMethod && matchPaymentStatus && matchDate;
      });

      const totalItems = filteredOrders.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / pagination.limit));
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pagination.limit);

      setOrders(paginatedOrders);
      setPagination((prev) => ({ ...prev, totalItems, totalPages }));
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset page when filter changes
  };

  const handleFilterReset = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      paymentMethod: "",
      paymentStatus: "",
      keyword: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/order/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");

      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Lỗi khi xóa");
    }
  };

  return (
    <main className="w-full flex-1 p-4 md:p-8 bg-[#f5f6fa] min-h-screen">
      <div className="max-w-350 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>

        <Filter filters={filters} onChange={handleFilterChange} onReset={handleFilterReset} />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
            <button onClick={() => fetchOrders()} className="ml-auto underline font-medium text-sm">
              Thử lại
            </button>
          </div>
        )}

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <OrderTable orders={orders} onEdit={handleEdit} onDelete={handleDelete} />

          {!isLoading && orders.length > 0 && (
            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} itemsPerPage={pagination.limit} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </main>
  );
}
