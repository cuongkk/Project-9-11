"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.edit = exports.list = void 0;
const moment_1 = __importDefault(require("moment"));
const order_model_1 = __importDefault(require("./order.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const variable_config_1 = require("../../configs/variable.config");
const normalizeOrderItems = (items = []) => {
    return items.map((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const quantity = Number((_a = item.quantity) !== null && _a !== void 0 ? _a : 0) || Number((_b = item.quantityAdult) !== null && _b !== void 0 ? _b : 0) + Number((_c = item.quantityChildren) !== null && _c !== void 0 ? _c : 0) + Number((_d = item.quantityBaby) !== null && _d !== void 0 ? _d : 0);
        const unitPrice = Number((_e = item.unitPrice) !== null && _e !== void 0 ? _e : 0) || Number((_f = item.priceNew) !== null && _f !== void 0 ? _f : 0) || Number((_g = item.priceNewAdult) !== null && _g !== void 0 ? _g : 0) || Number((_h = item.priceAdult) !== null && _h !== void 0 ? _h : 0) || 0;
        return {
            ...item,
            quantity,
            unitPrice,
        };
    });
};
const list = async (req) => {
    const orderList = await order_model_1.default.find({
        deleted: false,
    }).sort({ createdAt: "desc" });
    for (const orderDetail of orderList) {
        const paymentMethod = variable_config_1.paymentMethodList.find((item) => item.value === orderDetail.paymentMethod);
        const paymentStatus = variable_config_1.paymentStatusList.find((item) => item.value === orderDetail.paymentStatus);
        const status = variable_config_1.statusList.find((item) => item.value === orderDetail.status);
        orderDetail.paymentMethodName = paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.label;
        orderDetail.paymentStatusName = paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.label;
        orderDetail.statusDetail = status;
        orderDetail.createdAtTime = (0, moment_1.default)(orderDetail.createdAt).format("HH:mm");
        orderDetail.createdAtDate = (0, moment_1.default)(orderDetail.createdAt).format("DD/MM/YYYY");
        orderDetail.items = normalizeOrderItems(orderDetail.items || []);
    }
    return { orderList };
};
exports.list = list;
const edit = async (req) => {
    try {
        const { id } = req.params;
        const orderDetail = await order_model_1.default.findOne({ _id: id, deleted: false });
        if (!orderDetail) {
            return { code: "error", message: "Đơn hàng không tồn tại!" };
        }
        orderDetail.createdAtFormat = (0, moment_1.default)(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");
        orderDetail.items = normalizeOrderItems(orderDetail.items || []);
        const cityIds = [...new Set((orderDetail.items || []).map((i) => i.locationFrom).filter(Boolean))];
        const cities = await city_model_1.default.find({ _id: { $in: cityIds } }).select("name");
        const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));
        for (const item of orderDetail.items || []) {
            item.departureDateFormat = (0, moment_1.default)(item.departureDate).format("DD/MM/YYYY");
            const city = cityMap.get(String(item.locationFrom));
            if (city)
                item.locationFromName = city.name;
        }
        return { orderDetail, paymentMethodList: variable_config_1.paymentMethodList, paymentStatusList: variable_config_1.paymentStatusList, statusList: variable_config_1.statusList };
    }
    catch (error) {
        return { code: "error", message: "Đơn hàng không tồn tại!" };
    }
};
exports.edit = edit;
const editPatch = async (req) => {
    try {
        const { id } = req.params;
        const orderDetail = await order_model_1.default.findOne({ _id: id, deleted: false });
        if (!orderDetail) {
            return {
                code: "error",
                message: "Đơn hàng không tồn tại!",
            };
        }
        await order_model_1.default.updateOne({ _id: id, deleted: false }, req.body);
        return {
            code: "success",
            message: "Đã cập nhật đơn hàng!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Đơn hàng không tồn tại!",
        };
    }
};
exports.editPatch = editPatch;
