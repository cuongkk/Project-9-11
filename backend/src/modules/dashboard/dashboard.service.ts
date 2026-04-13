import type { Request } from "express";
import AccountAdmin from "../auth/account.model";
import Order from "../order/order.model";
import SettingWebsiteInfo from "../setting/setting.model";
import Category from "../category/category.model";
import { buildCategoryTree } from "../category/category.helper";

export const dashboard = async (
  req: Request,
): Promise<{
  totalAdmin: number;
  totalOrder: number;
  totalRevenue: number;
}> => {
  const [totalAdmin, orderAgg] = await Promise.all([
    AccountAdmin.countDocuments({ deleted: false }),
    Order.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: null,
          totalOrder: { $sum: 1 },
          totalRevenue: { $sum: { $ifNull: ["$total", 0] } },
        },
      },
    ]),
  ]);

  const summary = orderAgg?.[0] || { totalOrder: 0, totalRevenue: 0 };

  return {
    totalAdmin,
    totalOrder: summary.totalOrder,
    totalRevenue: summary.totalRevenue,
  };
};

export const info = async (req: Request): Promise<{ settingWebsiteInfo: any; categoryList: any[] }> => {
  const settingRecord = await SettingWebsiteInfo.findOne({});

  const settingWebsiteInfo =
    settingRecord ||
    ({
      websiteName: "",
      phone: "",
      email: "",
      address: "",
      logo: "",
      favicon: "",
    } as any);

  const categories = await Category.find({ deletedAt: { $exists: false }, status: "active" }).sort({ position: "asc" });
  const categoryTree = buildCategoryTree(categories as any[]);

  return {
    settingWebsiteInfo,
    categoryList: categoryTree,
  };
};

export const revenueChartPost = async (req: Request): Promise<{ dataMonthCurrent: number[]; dataMonthPrevious: number[] }> => {
  const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body as any;

  const [currentAgg, previousAgg] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          deleted: false,
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1),
          },
        },
      },
      { $project: { day: { $dayOfMonth: "$createdAt" }, total: { $ifNull: ["$total", 0] } } },
      { $group: { _id: "$day", revenue: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      {
        $match: {
          deleted: false,
          createdAt: {
            $gte: new Date(previousYear, previousMonth - 1, 1),
            $lt: new Date(previousYear, previousMonth, 1),
          },
        },
      },
      { $project: { day: { $dayOfMonth: "$createdAt" }, total: { $ifNull: ["$total", 0] } } },
      { $group: { _id: "$day", revenue: { $sum: "$total" } } },
    ]),
  ]);

  const currentMap = new Map<number, number>(currentAgg.map((r: any) => [Number(r._id), Number(r.revenue || 0)]));
  const previousMap = new Map<number, number>(previousAgg.map((r: any) => [Number(r._id), Number(r.revenue || 0)]));

  const days = Array.isArray(arrayDay) ? (arrayDay as number[]) : [];
  const dataMonthCurrent = days.map((d) => currentMap.get(Number(d)) || 0);
  const dataMonthPrevious = days.map((d) => previousMap.get(Number(d)) || 0);

  return { dataMonthCurrent, dataMonthPrevious };
};
