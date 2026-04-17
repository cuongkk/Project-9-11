import type { Request } from "express";
import AccountAdmin from "../auth/account.model";
import Order from "../order/order.model";
import SettingWebsiteInfo from "../setting/setting.model";
import Category from "../category/category.model";
import { buildCategoryTree } from "../category/category.helper";
import Tour from "../tour/tour.model";
import City from "../city/city.model";
import Gear from "../gear/gear.model";
import Journal from "../journal/journal.model";

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

type PublicTour = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  images: string[];
  price: number;
  priceNew: number;
  time: string;
  information: string;
  stock: number;
  departureDate: Date | null;
  endDate: Date | null;
  locations: any[];
  locationNames: string[];
  schedules: any[];
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

const toPublicTour = (tour: any, categoryMap: Map<string, any>, cityMap: Map<string, any>): PublicTour => {
  const categoryRecord = tour.category ? categoryMap.get(String(tour.category)) : undefined;
  const locations = Array.isArray(tour.locations) ? tour.locations : [];

  const locationNames = locations
    .map((item: any) => {
      if (!item) return "";

      if (typeof item === "string") {
        const city = cityMap.get(item);
        return city?.name ? String(city.name) : "";
      }

      if (typeof item === "object") {
        return String(item.name || item.title || "");
      }

      return "";
    })
    .filter(Boolean);

  return {
    id: String(tour._id),
    name: String(tour.name || ""),
    slug: String(tour.slug || ""),
    avatar: String(tour.avatar || ""),
    images: Array.isArray(tour.images) ? tour.images : [],
    price: Number(tour.price || 0),
    priceNew: Number(tour.priceNew || 0),
    time: String(tour.time || ""),
    information: String(tour.information || ""),
    stock: Number(tour.stock || 0),
    departureDate: tour.departureDate ? new Date(tour.departureDate) : null,
    endDate: tour.endDate ? new Date(tour.endDate) : null,
    locations,
    locationNames,
    schedules: Array.isArray(tour.schedules) ? tour.schedules : [],
    rating: Number(tour.rating || 0),
    reviewCount: Number(tour.reviewCount || 0),
    category: categoryRecord
      ? {
          id: String(categoryRecord._id),
          name: String(categoryRecord.name || ""),
          slug: String(categoryRecord.slug || ""),
        }
      : null,
  };
};

export const tours = async (req: Request): Promise<{ tourList: PublicTour[] }> => {
  const [tourList, categories, cities] = await Promise.all([
    Tour.find({ deleted: false, status: "active" }).sort({ createdAt: -1 }),
    Category.find({ deletedAt: { $exists: false }, status: "active" }),
    City.find({}),
  ]);

  const categoryMap = new Map<string, any>(categories.map((item: any) => [String(item._id), item]));
  const cityMap = new Map<string, any>(cities.map((item: any) => [String(item._id), item]));

  return {
    tourList: (tourList as any[]).map((tour) => toPublicTour(tour, categoryMap, cityMap)),
  };
};

export const tourDetail = async (req: Request): Promise<{ tour: PublicTour | null }> => {
  const { slug } = req.params as { slug: string };

  const tour = await Tour.findOne({ slug, deleted: false, status: "active" });

  if (!tour) {
    return { tour: null };
  }

  const [categories, cities] = await Promise.all([Category.find({ deletedAt: { $exists: false }, status: "active" }), City.find({})]);
  const categoryMap = new Map<string, any>(categories.map((item: any) => [String(item._id), item]));
  const cityMap = new Map<string, any>(cities.map((item: any) => [String(item._id), item]));

  return {
    tour: toPublicTour(tour as any, categoryMap, cityMap),
  };
};

type PublicGear = {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  badge: string;
};

export const gears = async (req: Request): Promise<{ gearList: PublicGear[]; categories: string[] }> => {
  const gearList = await Gear.find({ status: "active" }).sort({ createdAt: -1 });

  const publicGearList: PublicGear[] = (gearList as any[]).map((item) => ({
    id: String(item._id),
    name: String(item.name || ""),
    category: String(item.category || ""),
    subtitle: String(item.subtitle || ""),
    description: String(item.description || ""),
    price: Number(item.price || 0),
    image: String(item.image || ""),
    badge: String(item.badge || ""),
  }));

  const categories = [...new Set(publicGearList.map((item) => item.category).filter(Boolean))];

  return {
    gearList: publicGearList,
    categories,
  };
};

type PublicJournal = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  author: string;
  date: string;
  image: string;
  avatar: string;
  trendingScore: number;
};

export const journals = async (req: Request): Promise<{ articleList: PublicJournal[]; trendingList: PublicJournal[] }> => {
  const journals = await Journal.find({ status: "active" }).sort({ createdAt: -1 });

  const articleList: PublicJournal[] = (journals as any[]).map((item) => ({
    id: String(item._id),
    title: String(item.title || ""),
    summary: String(item.summary || ""),
    tag: String(item.tag || ""),
    author: String(item.author || ""),
    date: String(item.dateLabel || ""),
    image: String(item.image || ""),
    avatar: String(item.avatar || ""),
    trendingScore: Number(item.trendingScore || 0),
  }));

  const trendingList = [...articleList].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 3);

  return {
    articleList,
    trendingList,
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
