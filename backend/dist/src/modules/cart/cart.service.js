"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCartDetails = buildCartDetails;
const moment_1 = __importDefault(require("moment"));
const tour_model_1 = __importDefault(require("../tour/tour.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
async function buildCartDetails(cart) {
    const tourIds = [...new Set(cart.map((c) => c.tourId).filter(Boolean))];
    const cityIds = [...new Set(cart.map((c) => c.locationFrom).filter(Boolean))];
    const [tours, cities] = await Promise.all([
        tour_model_1.default.find({ _id: { $in: tourIds }, status: "active", deleted: false }).select("avatar name slug priceNew stock priceNewAdult priceNewChildren priceNewBaby stockAdult stockChildren stockBaby"),
        city_model_1.default.find({ _id: { $in: cityIds } }).select("name"),
    ]);
    const tourMap = new Map(tours.map((t) => [t._id.toString(), t]));
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));
    return cart
        .map((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const tourDetail = tourMap.get(String(item.tourId));
        const cityDetail = cityMap.get(String(item.locationFrom));
        if (!tourDetail || !cityDetail)
            return null;
        const cartItem = {
            ...item,
            avatar: tourDetail.avatar,
            name: tourDetail.name,
            slug: tourDetail.slug,
            departureDate: (0, moment_1.default)(item.departureDate).format("DD/MM/YYYY"),
            locationFromName: cityDetail.name || "",
            priceNew: (_a = tourDetail.priceNew) !== null && _a !== void 0 ? _a : tourDetail.priceNewAdult,
            stock: (_b = tourDetail.stock) !== null && _b !== void 0 ? _b : tourDetail.stockAdult,
            priceNewAdult: (_c = tourDetail.priceNewAdult) !== null && _c !== void 0 ? _c : tourDetail.priceNew,
            priceNewChildren: (_d = tourDetail.priceNewChildren) !== null && _d !== void 0 ? _d : tourDetail.priceNew,
            priceNewBaby: (_e = tourDetail.priceNewBaby) !== null && _e !== void 0 ? _e : tourDetail.priceNew,
            stockAdult: (_f = tourDetail.stockAdult) !== null && _f !== void 0 ? _f : tourDetail.stock,
            stockChildren: (_g = tourDetail.stockChildren) !== null && _g !== void 0 ? _g : tourDetail.stock,
            stockBaby: (_h = tourDetail.stockBaby) !== null && _h !== void 0 ? _h : tourDetail.stock,
        };
        return cartItem;
    })
        .filter(Boolean);
}
