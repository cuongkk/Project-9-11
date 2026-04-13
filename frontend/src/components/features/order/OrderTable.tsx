import React from "react";

interface OrderItem {
  name: string;
  avatar: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  note: string;
  items: OrderItem[];
  subTotal: number;
  discount: number;
  discountCode: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAtFormat: string;
  timeFormat: string;
}

interface OrderTableProps {
  orders: Order[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OrderTable({ orders, onEdit, onDelete }: OrderTableProps) {
  if (orders.length === 0) {
    return <div className="bg-white rounded-xl p-10 text-center text-gray-500 border border-gray-100 shadow-sm">Không tìm thấy đơn hàng nào.</div>;
  }

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-5 py-4 whitespace-nowrap">Mã</th>
              <th className="px-5 py-4 min-w-50">Thông tin khách</th>
              <th className="px-5 py-4 min-w-87.5">Danh sách tour</th>
              <th className="px-5 py-4 min-w-50">Thanh toán</th>
              <th className="px-5 py-4 text-center whitespace-nowrap">Trạng thái</th>
              <th className="px-5 py-4 whitespace-nowrap">Ngày đặt</th>
              <th className="px-5 py-4 whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 align-top">
                  <div className="font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">{order.code}</div>
                </td>
                <td className="px-5 py-4 align-top text-gray-700 space-y-1">
                  <div>
                    <span className="text-gray-500">Họ tên:</span> <span className="font-medium">{order.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">SĐT:</span> {order.phone}
                  </div>
                  {order.note && <div className="text-gray-500 italic text-xs mt-1">Ghi chú: {order.note}</div>}
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start border border-gray-100 rounded-lg p-2 bg-gray-50/30">
                        <img src={item.avatar || "/admin/assets/images/placeholder.png"} alt={item.name} className="w-16 h-12 object-cover rounded-md shrink-0" />
                        <div className="text-xs text-gray-600 space-y-0.5">
                          <div className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1" title={item.name}>
                            {item.name}
                          </div>
                          <div>
                            Số lượng: {item.quantity} x {formatPrice(item.unitPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-gray-700 space-y-1 text-sm">
                  <div>
                    <span className="text-gray-500">Tổng tiền:</span> {formatPrice(order.subTotal)}
                  </div>
                  {order.discount > 0 && (
                    <div>
                      <span className="text-gray-500">Giảm:</span> <span className="text-red-500">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  {order.discountCode && (
                    <div>
                      <span className="text-gray-500">Mã giảm:</span> <span className="bg-gray-100 px-1 py-0.5 rounded text-xs">{order.discountCode}</span>
                    </div>
                  )}
                  <div className="font-bold text-gray-900 mt-1 pt-1 border-t border-gray-100">
                    <span className="text-gray-500 font-normal">Thanh toán:</span> {formatPrice(order.total)}
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-gray-500">PTTT:</span> {order.paymentMethod}
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">TTTT:</span> {order.paymentStatus}
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === "init"
                        ? "bg-orange-50 text-orange-600 border-orange-200"
                        : order.status === "approved"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : order.status === "cancelled"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {order.status === "init" ? "Khởi tạo" : order.status === "approved" ? "Đã duyệt" : order.status === "cancelled" ? "Đã hủy" : order.status}
                  </span>
                </td>
                <td className="px-5 py-4 align-top text-gray-500 text-sm whitespace-nowrap">
                  <div className="font-medium text-gray-800">{order.timeFormat}</div>
                  <div>{order.createdAtFormat}</div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(order.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                      title="Sửa"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      onClick={() => onDelete(order.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Xóa"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
