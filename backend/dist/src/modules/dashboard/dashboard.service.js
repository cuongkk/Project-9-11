"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revenueChartPost = exports.info = exports.dashboard = void 0;
const account_model_1 = __importDefault(require("../auth/account.model"));
const order_model_1 = __importDefault(require("../order/order.model"));
const setting_model_1 = __importDefault(require("../setting/setting.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const category_helper_1 = require("../category/category.helper");
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
