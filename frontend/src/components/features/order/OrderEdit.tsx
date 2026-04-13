import React, { useState } from "react";

// Interfaces matching data structure
export interface OrderDetailItem {
  name: string;
  avatar: string;
  quantity: number;
  unitPrice: number;
  departureDateFormat: string;
  locationFromName: string;
}

export interface OrderDetail {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  note: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAtFormat: string;
  subTotal: number;
  discount: number;
  total: number;
  items: OrderDetailItem[];
}

interface OrderEditProps {
  orderDetail: OrderDetail;
  onSubmit: (data: Partial<OrderDetail>) => Promise<void>;
  onCancel: () => void;
}

export default function OrderEdit({ orderDetail, onSubmit, onCancel }: OrderEditProps) {
  const [formData, setFormData] = useState({
    fullName: orderDetail.fullName || "",
    phone: orderDetail.phone || "",
    note: orderDetail.note || "",
    paymentMethod: orderDetail.paymentMethod || "",
    paymentStatus: orderDetail.paymentStatus || "",
    status: orderDetail.status || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Tên khách hàng không được để trống";
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Row 1: Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="font-semibold text-gray-700 text-sm">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full p-2.5 bg-gray-50 border ${errors.fullName ? "border-red-400" : "border-gray-200"} rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-colors`}
              placeholder="Nhập họ tên"
            />
            {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="font-semibold text-gray-700 text-sm">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full p-2.5 bg-gray-50 border ${errors.phone ? "border-red-400" : "border-gray-200"} rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-colors`}
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
          </div>
        </div>

        {/* Row 2: Note */}
        <div className="flex flex-col gap-2">
          <label htmlFor="note" className="font-semibold text-gray-700 text-sm">
            Ghi chú
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            value={formData.note}
            onChange={handleInputChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-colors resize-y min-h-25"
            placeholder="Ghi chú đơn hàng..."
          />
        </div>

        {/* Row 3: Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="paymentMethod" className="font-semibold text-gray-700 text-sm">
              Phương thức thanh toán
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="transfer">Chuyển khoản</option>
              <option value="online">Thanh toán online (Momo, VNPay...)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="paymentStatus" className="font-semibold text-gray-700 text-sm">
              Trạng thái thanh toán
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="unpaid">Chưa thanh toán</option>
              <option value="paid">Đã thanh toán</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-semibold text-gray-700 text-sm">
              Trạng thái đơn hàng
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="init">Khởi tạo</option>
              <option value="approved">Đã duyệt</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Row 4: ReadOnly Creation Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700 text-sm">Ngày đặt hàng</label>
            <input type="text" value={orderDetail.createdAtFormat} readOnly className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        {/* Tour List section */}
        <div className="mt-4 pt-6 border-t border-gray-100 flex flex-col gap-4">
          <label className="font-semibold text-gray-800 text-base">Danh sách tour</label>
          <div className="flex flex-col gap-4">
            {orderDetail.items.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <img src={item.avatar || "/admin/assets/images/placeholder.png"} alt={item.name} className="w-24 h-24 md:w-32 md:h-24 object-cover rounded-lg shrink-0 shadow-sm" />
                <div className="flex flex-col gap-1 text-sm text-gray-600 w-full">
                  <div className="font-bold text-gray-800 text-base mb-1">{item.name}</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    <div>
                      <span className="text-gray-500">Ngày khởi hành:</span> {item.departureDateFormat}
                    </div>
                    <div>
                      <span className="text-gray-500">Khởi hành tại:</span> {item.locationFromName}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-200/60 grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-gray-500 font-medium">Số lượng:</span> {item.quantity} x {formatPrice(item.unitPrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-4 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="hidden md:block"></div> {/* Spacer */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col gap-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="font-medium text-gray-800">{formatPrice(orderDetail.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span className="font-medium text-red-500">-{formatPrice(orderDetail.discount)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 mt-1">
              <span className="font-bold text-gray-800 text-base">Tổng thanh toán</span>
              <span className="font-bold text-blue-600 text-xl">{formatPrice(orderDetail.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Quay lại
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : (
              "Cập nhật đơn hàng"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
