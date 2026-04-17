"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCartDetails = buildCartDetails;
const moment_1 = __importDefault(require("moment"));
const tour_model_1 = __importDefault(require("../tour/tour.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
const toObjectIdString = (value) => {
    const text = String(value || "").trim();
    return objectIdRegex.test(text) ? text : "";
};
const resolveTourLocationId = (tour) => {
    const locations = Array.isArray(tour === null || tour === void 0 ? void 0 : tour.locations) ? tour.locations : [];
    for (const location of locations) {
        if (typeof location === "string") {
            const id = toObjectIdString(location);
            if (id)
                return id;
            continue;
        }
        if (location && typeof location === "object") {
            const locationObj = location;
            const candidates = [locationObj._id, locationObj.id, locationObj.cityId, locationObj.locationFrom];
            for (const candidate of candidates) {
                const id = toObjectIdString(candidate);
                if (id)
                    return id;
            }
        }
    }
    return "";
};
const normalizeQuantity = (value) => {
    const quantity = Number(value || 1);
    if (!Number.isFinite(quantity))
        return 1;
    return Math.max(1, Math.floor(quantity));
};
async function buildCartDetails(cart) {
    const normalizedCart = cart
        .map((item) => ({
        ...item,
        tourId: toObjectIdString(item.tourId),
        locationFrom: toObjectIdString(item.locationFrom),
        quantity: normalizeQuantity(item.quantity),
    }))
        .filter((item) => Boolean(item.tourId));
    const tourIds = [...new Set(normalizedCart.map((c) => c.tourId).filter(Boolean))];
    if (tourIds.length === 0)
        return [];
    const tours = await tour_model_1.default.find({ _id: { $in: tourIds }, status: "active", deleted: false }).select("avatar name slug priceNew price stock departureDate locations priceNewAdult priceNewChildren priceNewBaby stockAdult stockChildren stockBaby");
    const tourMap = new Map(tours.map((t) => [t._id.toString(), t]));
    const cityIds = new Set();
    for (const item of normalizedCart) {
        if (item.locationFrom) {
            cityIds.add(item.locationFrom);
            continue;
        }
        const tourDetail = tourMap.get(item.tourId);
        const fallbackLocationId = resolveTourLocationId(tourDetail);
        if (fallbackLocationId)
            cityIds.add(fallbackLocationId);
    }
    const cities = cityIds.size > 0 ? await city_model_1.default.find({ _id: { $in: [...cityIds] } }).select("name") : [];
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c]));
    return normalizedCart
        .map((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const tourDetail = tourMap.get(String(item.tourId));
        if (!tourDetail)
            return null;
        const resolvedLocationFrom = item.locationFrom || resolveTourLocationId(tourDetail);
        const cityDetail = resolvedLocationFrom ? cityMap.get(String(resolvedLocationFrom)) : null;
        const departureDateSource = item.departureDate || tourDetail.departureDate || null;
        const cartItem = {
            ...item,
            tourId: String(item.tourId),
            quantity: normalizeQuantity(item.quantity),
            locationFrom: resolvedLocationFrom,
            avatar: tourDetail.avatar,
            name: tourDetail.name,
            slug: tourDetail.slug,
            departureDate: departureDateSource ? (0, moment_1.default)(departureDateSource).format("DD/MM/YYYY") : "",
            locationFromName: (cityDetail === null || cityDetail === void 0 ? void 0 : cityDetail.name) || "",
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
