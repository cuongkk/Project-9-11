"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderEdit, { OrderDetail } from "@/components/features/order/OrderEdit";
import { setReloadToast, showReloadToastIfAny } from "@/utils/toast";

type OrderEditResponse = {
  success: boolean;
  message: string;
  data?: {
    orderDetail?: any;
  };
};

const mapOrderDetail = (data: any): OrderDetail => ({
  id: data?._id || data?.id || "",
  code: data?.code || "",
  fullName: data?.fullName || "",
  phone: data?.phone || "",
  note: data?.note || "",
  paymentMethod: data?.paymentMethod || "cod",
  paymentStatus: data?.paymentStatus || "unpaid",
  status: data?.status || "init",
  createdAtFormat: data?.createdAtFormat || "",
  subTotal: Number(data?.subTotal || 0),
  discount: Number(data?.discount || 0),
  total: Number(data?.total || 0),
  items: (data?.items || []).map((item: any) => ({
    name: item.name || "",
    avatar: item.avatar || "",
    quantity: Number(item.quantity || 0),
    unitPrice: Number(item.unitPrice || 0),
    departureDateFormat: item.departureDateFormat || "",
    locationFromName: item.locationFromName || "",
  })),
});

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = useMemo(() => (Array.isArray(params.id) ? params.id[0] : params.id), [params.id]);

  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setIsLoading(true);
      setLoadFailed(false);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/order/edit/${orderId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Không thể tải thông tin đơn hàng");
        }

        const data: OrderEditResponse = await res.json();

        if (!data.success || !data.data?.orderDetail) {
          throw new Error(data.message || "Không tìm thấy đơn hàng");
        }

        setOrderDetail(mapOrderDetail(data.data.orderDetail));
      } catch (e: any) {
        setLoadFailed(true);
        setReloadToast("error", e.message || "Có lỗi xảy ra khi tải đơn hàng");
        showReloadToastIfAny();
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (payload: Partial<OrderDetail>) => {
    if (!orderId) return;

    const updatePayload = {
      fullName: payload.fullName,
      phone: payload.phone,
      note: payload.note,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      status: payload.status,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/order/edit/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatePayload),
    });

    const data: OrderEditResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Cập nhật đơn hàng thất bại");
    }

    setReloadToast("success", data.message || "Đã cập nhật đơn hàng");
    router.push("/admin/order");
  };

  if (isLoading) {
    return (
      <main className="w-full flex-1 p-4 md:p-8 bg-[#f5f6fa] min-h-screen">
        <div className="max-w-300 mx-auto bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-gray-500">Đang tải dữ liệu đơn hàng...</div>
      </main>
    );
  }

  if (loadFailed || !orderDetail) {
    return (
      <main className="w-full flex-1 p-4 md:p-8 bg-[#f5f6fa] min-h-screen">
        <div className="max-w-300 mx-auto bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
          <div className="font-semibold mb-3">Không thể mở trang chỉnh sửa đơn hàng</div>
          <div className="mb-4">Đơn hàng không tồn tại</div>
          <button type="button" onClick={() => router.push("/admin/order")} className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
            Quay lại danh sách
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 p-4 md:p-8 bg-[#f5f6fa] min-h-screen">
      <div className="max-w-300 mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng: {orderDetail.code}</h1>
        <OrderEdit orderDetail={orderDetail} onSubmit={handleSubmit} onCancel={() => router.push("/admin/order")} />
      </div>
    </main>
  );
}
