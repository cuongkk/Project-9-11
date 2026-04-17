"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeMultiPatch = exports.destroyDel = exports.undoPatch = exports.deletePatch = exports.editPatch = exports.edit = exports.trash = exports.createPost = exports.create = exports.list = void 0;
const moment_1 = __importDefault(require("moment"));
const slugify_1 = __importDefault(require("slugify"));
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
};
const parseJsonArrayField = (value, fallback = []) => {
    if (value === undefined) {
        return { value: fallback };
    }
    if (Array.isArray(value)) {
        return { value };
    }
    if (typeof value === "string") {
        if (!value.trim()) {
            return { value: [] };
        }
        try {
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) {
                return { value: fallback, error: "Dữ liệu mảng không hợp lệ!" };
            }
            return { value: parsed };
        }
        catch (_error) {
            return { value: fallback, error: "Dữ liệu mảng không hợp lệ!" };
        }
    }
    return { value: fallback, error: "Dữ liệu mảng không hợp lệ!" };
};
const parseDateField = (value, fallback = null) => {
    if (value === undefined) {
        return { value: fallback };
    }
    if (value === null || value === "") {
        return { value: null };
    }
    const parsed = new Date(String(value));
    if (Number.isNaN(parsed.getTime())) {
        return { value: fallback, error: "Ngày không hợp lệ!" };
    }
    return { value: parsed };
};
const ensureValidDateRange = (departureDate, endDate) => {
    if ((departureDate && !endDate) || (!departureDate && endDate)) {
        return "Ngày khởi hành và ngày kết thúc phải được nhập đồng thời!";
    }
    if (departureDate && endDate && endDate.getTime() < departureDate.getTime()) {
        return "Ngày kết thúc phải lớn hơn hoặc bằng ngày khởi hành!";
    }
    return null;
};
const buildDurationLabel = (departureDate, endDate) => {
    if (!departureDate || !endDate) {
        return "";
    }
    const diffMs = endDate.getTime() - departureDate.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.ceil(diffMs / dayMs) + 1;
    return `${days} ngày`;
};
const extractSlugBase = (value) => {
    const raw = String(value || "").trim();
    return (0, slugify_1.default)(raw, { lower: true, strict: true });
};
const buildUniqueTourSlug = async (slugBase, excludeId) => {
    let base = slugBase || `tour-${Date.now()}`;
    let candidate = base;
    let counter = 1;
    while (true) {
        const condition = { slug: candidate };
        if (excludeId) {
            condition._id = { $ne: excludeId };
        }
        const existed = await tour_model_1.default.findOne(condition).select("_id");
        if (!existed) {
            return candidate;
        }
        candidate = `${base}-${counter}`;
        counter += 1;
    }
};
const isDuplicateKeyError = (error) => {
    return typeof error === "object" && error !== null && error.code === 11000;
};
const list = async (req) => {
    const find = { deleted: false };
    const pageInfo = await (0, pagination_helper_1.pagination)(tour_model_1.default, find, req);
    const tourList = await tour_model_1.default.find(find).sort({ createdAt: "desc" }).limit(pageInfo.limitItems).skip(pageInfo.skip);
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
    var _a, _b, _c, _d, _e, _f;
    try {
        const anyReq = req;
        const reqWithAccount = req;
        const payload = { ...anyReq.body };
        normalizeTourPricing(payload);
        const locationsParsed = parseJsonArrayField(payload.locations, []);
        if (locationsParsed.error) {
            return { code: "error", message: "Danh sách điểm đến không hợp lệ!" };
        }
        const schedulesParsed = parseJsonArrayField(payload.schedules, []);
        if (schedulesParsed.error) {
            return { code: "error", message: "Lịch trình tour không hợp lệ!" };
        }
        payload.locations = locationsParsed.value;
        payload.schedules = schedulesParsed.value;
        const departureDateParsed = parseDateField(payload.departureDate, null);
        if (departureDateParsed.error) {
            return { code: "error", message: "Ngày khởi hành không hợp lệ!" };
        }
        const endDateParsed = parseDateField(payload.endDate, null);
        if (endDateParsed.error) {
            return { code: "error", message: "Ngày kết thúc không hợp lệ!" };
        }
        const dateRangeError = ensureValidDateRange(departureDateParsed.value, endDateParsed.value);
        if (dateRangeError) {
            return { code: "error", message: dateRangeError };
        }
        payload.departureDate = departureDateParsed.value;
        payload.endDate = endDateParsed.value;
        payload.time = buildDurationLabel(payload.departureDate, payload.endDate);
        payload.avatar = ((_c = (_b = (_a = anyReq.files) === null || _a === void 0 ? void 0 : _a.avatar) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path) || "";
        payload.images = ((_e = (_d = anyReq.files) === null || _d === void 0 ? void 0 : _d.images) === null || _e === void 0 ? void 0 : _e.length) ? anyReq.files.images.map((item) => item.path) : [];
        payload.createdBy = (_f = reqWithAccount.account) === null || _f === void 0 ? void 0 : _f.id;
        const slugBase = extractSlugBase(payload.slug || payload.name);
        payload.slug = await buildUniqueTourSlug(slugBase);
        const newRecord = new tour_model_1.default(payload);
        await newRecord.save();
        return {
            code: "success",
            message: "Đã tạo tour!",
        };
    }
    catch (error) {
        if (isDuplicateKeyError(error)) {
            return { code: "error", message: "Slug tour đã tồn tại, vui lòng thử tên khác!" };
        }
        return { code: "error", message: "Tạo tour thất bại, vui lòng thử lại!" };
    }
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
        const updatePayload = {};
        const incomingBody = (anyReq.body || {});
        for (const field of ["name", "category", "status", "position", "information"]) {
            if (incomingBody[field] !== undefined) {
                updatePayload[field] = incomingBody[field];
            }
        }
        if (incomingBody.price !== undefined || incomingBody.priceNew !== undefined || incomingBody.stock !== undefined || incomingBody.priceAdult !== undefined || incomingBody.priceNewAdult !== undefined || incomingBody.stockAdult !== undefined) {
            const pricingPayload = {
                price: (_a = incomingBody.price) !== null && _a !== void 0 ? _a : tourDetail.price,
                priceNew: (_b = incomingBody.priceNew) !== null && _b !== void 0 ? _b : tourDetail.priceNew,
                stock: (_c = incomingBody.stock) !== null && _c !== void 0 ? _c : tourDetail.stock,
                priceAdult: incomingBody.priceAdult,
                priceNewAdult: incomingBody.priceNewAdult,
                stockAdult: incomingBody.stockAdult,
            };
            normalizeTourPricing(pricingPayload);
            updatePayload.price = pricingPayload.price;
            updatePayload.priceNew = pricingPayload.priceNew;
            updatePayload.stock = pricingPayload.stock;
        }
        if (incomingBody.locations !== undefined) {
            const locationsParsed = parseJsonArrayField(incomingBody.locations);
            if (locationsParsed.error) {
                return { code: "error", message: "Danh sách điểm đến không hợp lệ!" };
            }
            updatePayload.locations = locationsParsed.value;
        }
        if (incomingBody.schedules !== undefined) {
            const schedulesParsed = parseJsonArrayField(incomingBody.schedules);
            if (schedulesParsed.error) {
                return { code: "error", message: "Lịch trình tour không hợp lệ!" };
            }
            updatePayload.schedules = schedulesParsed.value;
        }
        const hasDepartureDate = Object.prototype.hasOwnProperty.call(incomingBody, "departureDate");
        const hasEndDate = Object.prototype.hasOwnProperty.call(incomingBody, "endDate");
        if (hasDepartureDate || hasEndDate) {
            const departureDateParsed = parseDateField(incomingBody.departureDate, tourDetail.departureDate || null);
            if (departureDateParsed.error) {
                return { code: "error", message: "Ngày khởi hành không hợp lệ!" };
            }
            const endDateParsed = parseDateField(incomingBody.endDate, tourDetail.endDate || null);
            if (endDateParsed.error) {
                return { code: "error", message: "Ngày kết thúc không hợp lệ!" };
            }
            const dateRangeError = ensureValidDateRange(departureDateParsed.value, endDateParsed.value);
            if (dateRangeError) {
                return { code: "error", message: dateRangeError };
            }
            updatePayload.departureDate = departureDateParsed.value;
            updatePayload.endDate = endDateParsed.value;
            updatePayload.time = buildDurationLabel(departureDateParsed.value, endDateParsed.value);
        }
        if ((_e = (_d = anyReq.files) === null || _d === void 0 ? void 0 : _d.avatar) === null || _e === void 0 ? void 0 : _e[0]) {
            updatePayload.avatar = anyReq.files.avatar[0].path;
        }
        if ((_g = (_f = anyReq.files) === null || _f === void 0 ? void 0 : _f.images) === null || _g === void 0 ? void 0 : _g.length) {
            const uploadedImages = anyReq.files.images.map((item) => item.path);
            updatePayload.images = [...(tourDetail.images || []), ...uploadedImages];
        }
        const slugSource = (_h = incomingBody.slug) !== null && _h !== void 0 ? _h : incomingBody.name;
        if (slugSource !== undefined) {
            const slugBase = extractSlugBase(slugSource);
            updatePayload.slug = await buildUniqueTourSlug(slugBase, id);
        }
        updatePayload.updatedBy = (_j = reqWithAccount.account) === null || _j === void 0 ? void 0 : _j.id;
        await tour_model_1.default.updateOne({ _id: id, deleted: false }, updatePayload);
        return {
            code: "success",
            message: "Đã cập nhật tour!",
        };
    }
    catch (error) {
        if (isDuplicateKeyError(error)) {
            return { code: "error", message: "Slug tour đã tồn tại, vui lòng thử tên khác!" };
        }
        return {
            code: "error",
            message: "Cập nhật tour thất bại!",
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
            deletedBy: "",
            deletedAt: null,
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
                    deletedBy: "",
                    deletedAt: null,
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
