"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueChartPost = exports.journals = exports.gears = exports.tourDetail = exports.tours = exports.info = exports.dashboard = void 0;
const account_model_1 = __importDefault(require("../auth/account.model"));
const order_model_1 = __importDefault(require("../order/order.model"));
const setting_model_1 = __importDefault(require("../setting/setting.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const category_helper_1 = require("../category/category.helper");
const tour_model_1 = __importDefault(require("../tour/tour.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const gear_model_1 = __importDefault(require("../gear/gear.model"));
const journal_model_1 = __importDefault(require("../journal/journal.model"));
const dashboard = async (req) => {
    const [totalAdmin, orderAgg] = await Promise.all([
        account_model_1.default.countDocuments({ deleted: false }),
        order_model_1.default.aggregate([
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
    const summary = (orderAgg === null || orderAgg === void 0 ? void 0 : orderAgg[0]) || { totalOrder: 0, totalRevenue: 0 };
    return {
        totalAdmin,
        totalOrder: summary.totalOrder,
        totalRevenue: summary.totalRevenue,
    };
};
exports.dashboard = dashboard;
const info = async (req) => {
    const settingRecord = await setting_model_1.default.findOne({});
    const settingWebsiteInfo = settingRecord ||
        {
            websiteName: "",
            phone: "",
            email: "",
            address: "",
            logo: "",
            favicon: "",
        };
    const categories = await category_model_1.default.find({ deletedAt: { $exists: false }, status: "active" }).sort({ position: "asc" });
    const categoryTree = (0, category_helper_1.buildCategoryTree)(categories);
    return {
        settingWebsiteInfo,
        categoryList: categoryTree,
    };
};
exports.info = info;
const toPublicTour = (tour, categoryMap, cityMap) => {
    const categoryRecord = tour.category ? categoryMap.get(String(tour.category)) : undefined;
    const locations = Array.isArray(tour.locations) ? tour.locations : [];
    const locationNames = locations
        .map((item) => {
        if (!item)
            return "";
        if (typeof item === "string") {
            const city = cityMap.get(item);
            return (city === null || city === void 0 ? void 0 : city.name) ? String(city.name) : "";
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
const tours = async (req) => {
    const [tourList, categories, cities] = await Promise.all([
        tour_model_1.default.find({ deleted: false, status: "active" }).sort({ createdAt: -1 }),
        category_model_1.default.find({ deletedAt: { $exists: false }, status: "active" }),
        city_model_1.default.find({}),
    ]);
    const categoryMap = new Map(categories.map((item) => [String(item._id), item]));
    const cityMap = new Map(cities.map((item) => [String(item._id), item]));
    return {
        tourList: tourList.map((tour) => toPublicTour(tour, categoryMap, cityMap)),
    };
};
exports.tours = tours;
const tourDetail = async (req) => {
    const { slug } = req.params;
    const tour = await tour_model_1.default.findOne({ slug, deleted: false, status: "active" });
    if (!tour) {
        return { tour: null };
    }
    const [categories, cities] = await Promise.all([category_model_1.default.find({ deletedAt: { $exists: false }, status: "active" }), city_model_1.default.find({})]);
    const categoryMap = new Map(categories.map((item) => [String(item._id), item]));
    const cityMap = new Map(cities.map((item) => [String(item._id), item]));
    return {
        tour: toPublicTour(tour, categoryMap, cityMap),
    };
};
exports.tourDetail = tourDetail;
const gears = async (req) => {
    const gearList = await gear_model_1.default.find({ status: "active" }).sort({ createdAt: -1 });
    const publicGearList = gearList.map((item) => ({
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
exports.gears = gears;
const journals = async (req) => {
    const journals = await journal_model_1.default.find({ status: "active" }).sort({ createdAt: -1 });
    const articleList = journals.map((item) => ({
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
exports.journals = journals;
const revenueChartPost = async (req) => {
    const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;
    const [currentAgg, previousAgg] = await Promise.all([
        order_model_1.default.aggregate([
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
        order_model_1.default.aggregate([
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
    const currentMap = new Map(currentAgg.map((r) => [Number(r._id), Number(r.revenue || 0)]));
    const previousMap = new Map(previousAgg.map((r) => [Number(r._id), Number(r.revenue || 0)]));
    const days = Array.isArray(arrayDay) ? arrayDay : [];
    const dataMonthCurrent = days.map((d) => currentMap.get(Number(d)) || 0);
    const dataMonthPrevious = days.map((d) => previousMap.get(Number(d)) || 0);
    return { dataMonthCurrent, dataMonthPrevious };
};
exports.revenueChartPost = revenueChartPost;
