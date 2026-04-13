"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeMultiPatch = exports.destroyDel = exports.undoPatch = exports.deletePatch = exports.editPatch = exports.edit = exports.trash = exports.createPost = exports.create = exports.list = void 0;
const moment_1 = __importDefault(require("moment"));
const category_model_1 = __importDefault(require("../category/category.model"));
const city_model_1 = __importDefault(require("../city/city.model"));
const category_helper_1 = require("../category/category.helper");
const tour_model_1 = __importDefault(require("./tour.model"));
const pagination_helper_1 = require("../../utils/pagination.helper");
const toInt = (value, fallback = 0) => {
    if (value === undefined || value === null || value === "")
        return fallback;
    const parsed = parseInt(String(value), 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};
const normalizeTourPricing = (body) => {
    const basePrice = toInt(body.price, toInt(body.priceAdult, 0));
    const salePrice = toInt(body.priceNew, toInt(body.priceNewAdult, basePrice));
    const stock = toInt(body.stock, toInt(body.stockAdult, 0));
    body.price = basePrice;
    body.priceNew = salePrice;
    body.stock = stock;
    // Backward-compatibility fields for screens that still read NL/TE/EB values.
    body.priceAdult = basePrice;
    body.priceChildren = basePrice;
    body.priceBaby = basePrice;
    body.priceNewAdult = salePrice;
    body.priceNewChildren = salePrice;
    body.priceNewBaby = salePrice;
    body.stockAdult = stock;
    body.stockChildren = stock;
    body.stockBaby = stock;
};
const list = async (req) => {
    const find = { deleted: false };
    const pageInfo = await (0, pagination_helper_1.pagination)(tour_model_1.default, find, req);
    const tourList = await tour_model_1.default.find(find).sort({ position: "desc" }).limit(pageInfo.limitItems).skip(pageInfo.skip);
    for (const item of tourList) {
        if (item.createdBy) {
            item.createdByFullName = "Admin";
            item.createdAtFormat = (0, moment_1.default)(item.createdAt).format("HH:mm - DD/MM/YYYY");
        }
        if (item.updatedBy) {
            item.updatedByFullName = "Admin";
            item.updatedAtFormat = (0, moment_1.default)(item.updatedAt).format("HH:mm - DD/MM/YYYY");
        }
    }
    return { tourList, pagination: pageInfo };
};
exports.list = list;
const create = async (req) => {
    const categoryList = await category_model_1.default.find({ deletedAt: { $exists: false } });
    const categoryTree = (0, category_helper_1.buildCategoryTree)(categoryList);
    const cityList = await city_model_1.default.find({});
    return { categoryList: categoryTree, cityList };
};
exports.create = create;
const createPost = async (req) => {
    var _a, _b, _c, _d, _e;
    const anyReq = req;
    const reqWithAccount = req;
    if ((_b = (_a = anyReq.files) === null || _a === void 0 ? void 0 : _a.avatar) === null || _b === void 0 ? void 0 : _b[0]) {
        anyReq.body.avatar = anyReq.files.avatar[0].path;
    }
    else {
        anyReq.body.avatar = "";
    }
    if ((_d = (_c = anyReq.files) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d.length) {
        anyReq.body.images = anyReq.files.images.map((item) => item.path);
    }
    else {
        anyReq.body.images = [];
    }
    if (anyReq.body.position) {
        anyReq.body.position = parseInt(anyReq.body.position, 10);
    }
    else {
        const record = await tour_model_1.default.findOne({}).sort({ position: "desc" });
        anyReq.body.position = record ? record.position + 1 : 1;
    }
    normalizeTourPricing(anyReq.body);
    anyReq.body.locations = anyReq.body.locations ? JSON.parse(anyReq.body.locations) : [];
    anyReq.body.departureDate = anyReq.body.departureDate ? new Date(anyReq.body.departureDate) : null;
    anyReq.body.endDate = anyReq.body.endDate ? new Date(anyReq.body.endDate) : null;
    if (anyReq.body.departureDate && anyReq.body.endDate) {
        const diffMs = anyReq.body.endDate.getTime() - anyReq.body.departureDate.getTime();
        const dayMs = 24 * 60 * 60 * 1000;
        const days = Math.max(1, Math.ceil(diffMs / dayMs));
        anyReq.body.time = `${days} ngày`;
    }
    else {
        anyReq.body.time = "";
    }
    anyReq.body.schedules = anyReq.body.schedules ? JSON.parse(anyReq.body.schedules) : [];
    anyReq.body.createdBy = (_e = reqWithAccount.account) === null || _e === void 0 ? void 0 : _e.id;
    const newRecord = new tour_model_1.default(anyReq.body);
    await newRecord.save();
    return {
        code: "success",
        message: "Đã tạo tour!",
    };
};
exports.createPost = createPost;
const trash = async (req) => {
    const find = { deleted: true };
    const tourList = await tour_model_1.default.find(find).sort({ deletedAt: "desc" });
    for (const item of tourList) {
        if (item.createdBy) {
            item.createdByFullName = "Admin";
            item.createdAtFormat = (0, moment_1.default)(item.createdAt).format("HH:mm - DD/MM/YYYY");
        }
        if (item.deletedBy) {
            item.deletedByFullName = "Admin";
            item.deletedAtFormat = (0, moment_1.default)(item.deletedAt).format("HH:mm - DD/MM/YYYY");
        }
    }
    return { tourList };
};
exports.trash = trash;
const edit = async (req) => {
    try {
        const { id } = req.params;
        const tourDetail = await tour_model_1.default.findOne({ _id: id, deleted: false });
        if (!tourDetail) {
            return { code: "error", message: "Tour không tồn tại!" };
        }
        if (tourDetail.departureDate) {
            tourDetail.departureDateFormat = (0, moment_1.default)(tourDetail.departureDate).format("YYYY-MM-DD");
        }
        const categoryList = await category_model_1.default.find({ deletedAt: { $exists: false } });
        const categoryTree = (0, category_helper_1.buildCategoryTree)(categoryList);
        const cityList = await city_model_1.default.find({});
        return { categoryList: categoryTree, tourDetail, cityList };
    }
    catch (error) {
        return { code: "error", message: "Tour không tồn tại!" };
    }
};
exports.edit = edit;
const editPatch = async (req) => {
    var _a, _b, _c, _d, _e;
    try {
        const { id } = req.params;
        const anyReq = req;
        const reqWithAccount = req;
        const tourDetail = await tour_model_1.default.findOne({ _id: id, deleted: false });
        if (!tourDetail) {
            return {
                code: "error",
                message: "Tour không tồn tại!",
            };
        }
        if ((_b = (_a = anyReq.files) === null || _a === void 0 ? void 0 : _a.avatar) === null || _b === void 0 ? void 0 : _b[0]) {
            anyReq.body.avatar = anyReq.files.avatar[0].path;
        }
        else {
            anyReq.body.avatar = "";
        }
        if ((_d = (_c = anyReq.files) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d.length) {
            anyReq.body.images = anyReq.files.images.map((item) => item.path);
        }
        else {
            anyReq.body.images = [];
        }
        if (anyReq.body.position) {
            anyReq.body.position = parseInt(anyReq.body.position, 10);
        }
        else {
            const record = await tour_model_1.default.findOne({}).sort({ position: "desc" });
            anyReq.body.position = record ? record.position + 1 : 1;
        }
        normalizeTourPricing(anyReq.body);
        anyReq.body.locations = anyReq.body.locations ? JSON.parse(anyReq.body.locations) : [];
        anyReq.body.vehicle = anyReq.body.vehicle || tourDetail.vehicle || "";
        anyReq.body.departureDate = anyReq.body.departureDate ? new Date(anyReq.body.departureDate) : tourDetail.departureDate || null;
        anyReq.body.endDate = anyReq.body.endDate ? new Date(anyReq.body.endDate) : tourDetail.endDate || null;
        if (anyReq.body.departureDate && anyReq.body.endDate) {
            const diffMs = anyReq.body.endDate.getTime() - anyReq.body.departureDate.getTime();
            const dayMs = 24 * 60 * 60 * 1000;
            const days = Math.max(1, Math.ceil(diffMs / dayMs));
            anyReq.body.time = `${days} ngày`;
        }
        else {
            anyReq.body.time = tourDetail.time || "";
        }
        anyReq.body.schedules = anyReq.body.schedules ? JSON.parse(anyReq.body.schedules) : [];
        anyReq.body.updatedBy = (_e = reqWithAccount.account) === null || _e === void 0 ? void 0 : _e.id;
        await tour_model_1.default.updateOne({ _id: id, deleted: false }, anyReq.body);
        return {
            code: "success",
            message: "Đã cập nhật tour!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Tour không tồn tại!",
        };
    }
};
exports.editPatch = editPatch;
const deletePatch = async (req) => {
    var _a;
    try {
        const { id } = req.params;
        const reqWithAccount = req;
        const tourDetail = await tour_model_1.default.findOne({ _id: id, deleted: false });
        if (!tourDetail) {
            return {
                code: "error",
                message: "Tour không tồn tại!",
            };
        }
        await tour_model_1.default.updateOne({ _id: id, deleted: false }, {
            deleted: true,
            deletedBy: (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id,
            deletedAt: Date.now(),
        });
        return {
            code: "success",
            message: "Đã xóa tour!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Tour không tồn tại!",
        };
    }
};
exports.deletePatch = deletePatch;
const undoPatch = async (req) => {
    try {
        const { id } = req.params;
        const tourDetail = await tour_model_1.default.findOne({ _id: id, deleted: true });
        if (!tourDetail) {
            return {
                code: "error",
                message: "Tour không tồn tại!",
            };
        }
        await tour_model_1.default.updateOne({ _id: id, deleted: true }, {
            deleted: false,
        });
        return {
            code: "success",
            message: "Đã khôi phục tour!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Tour không tồn tại!",
        };
    }
};
exports.undoPatch = undoPatch;
const destroyDel = async (req) => {
    try {
        const { id } = req.params;
        const tourDetail = await tour_model_1.default.findOne({ _id: id, deleted: true });
        if (!tourDetail) {
            return {
                code: "error",
                message: "Tour không tồn tại!",
            };
        }
        await tour_model_1.default.deleteOne({ _id: id, deleted: true });
        return {
            code: "success",
            message: "Đã xóa vĩnh viễn tour!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Tour không tồn tại!",
        };
    }
};
exports.destroyDel = destroyDel;
const changeMultiPatch = async (req) => {
    var _a, _b;
    try {
        const { listId, option } = req.body;
        const reqWithAccount = req;
        switch (option) {
            case "active":
            case "inactive":
                await tour_model_1.default.updateMany({ _id: { $in: listId }, deleted: false }, {
                    status: option,
                    updatedBy: (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id,
                });
                return {
                    code: "success",
                    message: "Đã cập nhật trạng thái tour!",
                };
                break;
            case "delete":
                await tour_model_1.default.updateMany({ _id: { $in: listId }, deleted: false }, {
                    deleted: true,
                    deletedBy: (_b = reqWithAccount.account) === null || _b === void 0 ? void 0 : _b.id,
                    deletedAt: Date.now(),
                });
                return {
                    code: "success",
                    message: "Đã chuyển tour vào thùng rác!",
                };
                break;
            case "undo":
                await tour_model_1.default.updateMany({ _id: { $in: listId }, deleted: true }, {
                    deleted: false,
                });
                return {
                    code: "success",
                    message: "Đã khôi phục các tour!",
                };
                break;
            case "destroy":
                await tour_model_1.default.deleteMany({ _id: { $in: listId }, deleted: true });
                return {
                    code: "success",
                    message: "Đã xóa vĩnh viễn các tour!",
                };
                break;
            default:
                return {
                    code: "error",
                    message: "Dữ liệu không hợp lệ!",
                };
        }
    }
    catch (error) {
        return {
            code: "error",
            message: "Dữ liệu không hợp lệ!",
        };
    }
};
exports.changeMultiPatch = changeMultiPatch;
