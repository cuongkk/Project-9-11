import type { Request } from "express";
import moment from "moment";
import Order from "./order.model";
import City from "../city/city.model";
import { paymentMethodList, paymentStatusList, statusList } from "../../configs/variable.config";

const normalizeOrderItems = (items: any[] = []): any[] => {
  return items.map((item) => {
    const quantity = Number(item.quantity ?? 0) || Number(item.quantityAdult ?? 0) + Number(item.quantityChildren ?? 0) + Number(item.quantityBaby ?? 0);

    const unitPrice = Number(item.unitPrice ?? 0) || Number(item.priceNew ?? 0) || Number(item.priceNewAdult ?? 0) || Number(item.priceAdult ?? 0) || 0;

    return {
      ...item,
      quantity,
      unitPrice,
    };
  });
};

export const list = async (req: Request): Promise<{ orderList: any[] }> => {
  const orderList: any[] = await Order.find({
    deleted: false,
  }).sort({ createdAt: "desc" });

  for (const orderDetail of orderList) {
    const paymentMethod = paymentMethodList.find((item) => item.value === (orderDetail as any).paymentMethod);
    const paymentStatus = paymentStatusList.find((item) => item.value === (orderDetail as any).paymentStatus);
    const status = statusList.find((item) => item.value === (orderDetail as any).status);

    (orderDetail as any).paymentMethodName = paymentMethod?.label;
    (orderDetail as any).paymentStatusName = paymentStatus?.label;
    (orderDetail as any).statusDetail = status;

    (orderDetail as any).createdAtTime = moment((orderDetail as any).createdAt).format("HH:mm");
    (orderDetail as any).createdAtDate = moment((orderDetail as any).createdAt).format("DD/MM/YYYY");
    (orderDetail as any).items = normalizeOrderItems((orderDetail as any).items || []);
  }

  return { orderList };
};

export const edit = async (
  req: Request,
): Promise<{ orderDetail: any; paymentMethodList: typeof paymentMethodList; paymentStatusList: typeof paymentStatusList; statusList: typeof statusList } | { code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };

    const orderDetail: any = await Order.findOne({ _id: id, deleted: false });

    if (!orderDetail) {
      return { code: "error", message: "Đơn hàng không tồn tại!" };
    }

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");
    orderDetail.items = normalizeOrderItems(orderDetail.items || []);

    const cityIds = [...new Set((orderDetail.items || []).map((i: any) => i.locationFrom).filter(Boolean))];
    const cities = await City.find({ _id: { $in: cityIds } }).select("name");
    const cityMap = new Map<string, any>(cities.map((c: any) => [c._id.toString(), c]));

    for (const item of orderDetail.items || []) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = cityMap.get(String(item.locationFrom));
      if (city) item.locationFromName = (city as any).name;
    }

    return { orderDetail, paymentMethodList, paymentStatusList, statusList };
  } catch (error) {
    return { code: "error", message: "Đơn hàng không tồn tại!" };
  }
};

export const editPatch = async (req: Request): Promise<{ code: string; message: string }> => {
  try {
    const { id } = req.params as { id: string };

    const orderDetail = await Order.findOne({ _id: id, deleted: false });

    if (!orderDetail) {
      return {
        code: "error",
        message: "Đơn hàng không tồn tại!",
      };
    }

    await Order.updateOne({ _id: id, deleted: false }, (req as any).body);

    return {
      code: "success",
      message: "Đã cập nhật đơn hàng!",
    };
  } catch (error) {
    return {
      code: "error",
      message: "Đơn hàng không tồn tại!",
    };
  }
};
