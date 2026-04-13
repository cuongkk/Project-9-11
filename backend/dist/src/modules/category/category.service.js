"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeMultiPatch = exports.deletePatch = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.list = void 0;
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = __importDefault(require("./category.model"));
const category_helper_1 = require("./category.helper");
const pagination_helper_1 = require("../../utils/pagination.helper");
const activeFilter = { deletedAt: { $exists: false } };
const parsePosition = (value) => {
    if (value === undefined || value === null || value === "")
        return null;
    const parsed = Number.parseFloat(String(value));
    return Number.isNaN(parsed) ? null : parsed;
};
const roundPosition = (value) => Math.round(value * 100) / 100;
const getRootFilter = () => ({
    ...activeFilter,
    $or: [{ parent: { $exists: false } }, { parent: "" }, { parent: null }],
});
const getNextPosition = async (parentId) => {
    if (parentId) {
        const parent = await category_model_1.default.findOne({ _id: parentId, ...activeFilter }).select("position");
        const parentPosition = Number((parent === null || parent === void 0 ? void 0 : parent.position) || 0);
        const sibling = await category_model_1.default.findOne({ parent: parentId, ...activeFilter })
            .sort({ position: "desc" })
            .select("position");
        if (sibling) {
            return roundPosition(Number(sibling.position || 0) + 0.1);
        }
        if (parentPosition > 0) {
            return roundPosition(parentPosition + 0.1);
        }
        return 1;
    }
    const lastRoot = await category_model_1.default.findOne(getRootFilter()).sort({ position: "desc" }).select("position");
    if (!lastRoot)
        return 1;
    const maxRoot = Number(lastRoot.position || 0);
    return roundPosition(Math.floor(maxRoot) + 1);
};
const reindexPositionsByParent = async (parentId) => {
    if (parentId) {
        const parent = await category_model_1.default.findOne({ _id: parentId, ...activeFilter }).select("position");
        const parentBase = Number((parent === null || parent === void 0 ? void 0 : parent.position) || 0);
        const siblings = await category_model_1.default.find({ parent: parentId, ...activeFilter }).sort({ position: "asc", _id: "asc" });
        for (let i = 0; i < siblings.length; i += 1) {
            const nextPosition = roundPosition(parentBase + (i + 1) * 0.1);
            const currentPosition = Number(siblings[i].position || 0);
            if (currentPosition !== nextPosition) {
                await category_model_1.default.updateOne({ _id: siblings[i]._id }, { position: nextPosition });
            }
        }
        return;
    }
    const roots = await category_model_1.default.find(getRootFilter()).sort({ position: "asc", _id: "asc" });
    for (let i = 0; i < roots.length; i += 1) {
        const nextPosition = i + 1;
        const currentPosition = Number(roots[i].position || 0);
        if (currentPosition !== nextPosition) {
            await category_model_1.default.updateOne({ _id: roots[i]._id }, { position: nextPosition });
        }
    }
};
const list = async (req) => {
    var _a, _b;
    const find = { ...activeFilter };
    const anyReq = req;
    if ((_a = anyReq.query) === null || _a === void 0 ? void 0 : _a.status) {
        find.status = anyReq.query.status;
    }
    if ((_b = anyReq.query) === null || _b === void 0 ? void 0 : _b.keyword) {
        let regex = anyReq.query.keyword.trim();
        regex = regex.replace(/\s\s+/g, " ");
        regex = (0, slugify_1.default)(regex);
        const re = new RegExp(regex, "i");
        find.slug = re;
    }
    const pageInfo = await (0, pagination_helper_1.pagination)(category_model_1.default, find, anyReq);
    const categoryList = await category_model_1.default.find(find).sort({ position: "asc" }).limit(pageInfo.limitItems).skip(pageInfo.skip);
    return { categoryList, pagination: pageInfo };
};
exports.list = list;
const create = async (req) => {
    const categoryList = await category_model_1.default.find(activeFilter).sort({ position: "asc" });
    const categoryTree = (0, category_helper_1.buildCategoryTree)(categoryList);
    return { categoryList: categoryTree };
};
exports.create = create;
const createPost = async (req) => {
    var _a, _b, _c, _d, _e;
    const anyReq = req;
    const payload = {
        name: String(((_a = anyReq.body) === null || _a === void 0 ? void 0 : _a.name) || "").trim(),
        parent: String(((_b = anyReq.body) === null || _b === void 0 ? void 0 : _b.parent) || "").trim(),
        status: String(((_c = anyReq.body) === null || _c === void 0 ? void 0 : _c.status) || "active").trim(),
        description: String(((_d = anyReq.body) === null || _d === void 0 ? void 0 : _d.description) || "").trim(),
    };
    if (!payload.parent) {
        delete payload.parent;
    }
    const inputPosition = parsePosition((_e = anyReq.body) === null || _e === void 0 ? void 0 : _e.position);
    payload.position = inputPosition !== null && inputPosition !== void 0 ? inputPosition : (await getNextPosition(payload.parent || undefined));
    const newRecord = new category_model_1.default(payload);
    await newRecord.save();
    return {
        code: "success",
        message: "Tạo danh mục thành công",
    };
};
exports.createPost = createPost;
const edit = async (req) => {
    try {
        const { id } = req.params;
        const categoryDetail = await category_model_1.default.findOne({ _id: id, ...activeFilter });
        if (!categoryDetail) {
            return {
                code: "error",
                message: "Danh mục không tồn tại!",
            };
        }
        const categoryList = await category_model_1.default.find(activeFilter).sort({ position: "asc" });
        const categoryTree = (0, category_helper_1.buildCategoryTree)(categoryList);
        return { categoryList: categoryTree, categoryDetail };
    }
    catch (error) {
        return {
            code: "error",
            message: "Danh mục không tồn tại!",
        };
    }
};
exports.edit = edit;
const editPatch = async (req) => {
    var _a, _b, _c, _d, _e;
    try {
        const { id } = req.params;
        const anyReq = req;
        const categoryDetail = await category_model_1.default.findOne({ _id: id, ...activeFilter });
        if (!categoryDetail) {
            return {
                code: "error",
                message: "Danh mục không tồn tại!",
            };
        }
        const payload = {
            name: String(((_a = anyReq.body) === null || _a === void 0 ? void 0 : _a.name) || "").trim(),
            parent: String(((_b = anyReq.body) === null || _b === void 0 ? void 0 : _b.parent) || "").trim(),
            status: String(((_c = anyReq.body) === null || _c === void 0 ? void 0 : _c.status) || "active").trim(),
            description: String(((_d = anyReq.body) === null || _d === void 0 ? void 0 : _d.description) || "").trim(),
        };
        if (payload.parent === id) {
            return {
                code: "error",
                message: "Danh mục cha không được trùng với chính nó!",
            };
        }
        if (!payload.parent) {
            delete payload.parent;
        }
        const inputPosition = parsePosition((_e = anyReq.body) === null || _e === void 0 ? void 0 : _e.position);
        payload.position = inputPosition !== null && inputPosition !== void 0 ? inputPosition : (await getNextPosition(payload.parent || undefined));
        const result = await category_model_1.default.updateOne({ _id: id, ...activeFilter }, payload);
        if (!result.matchedCount) {
            return {
                code: "error",
                message: "Danh mục không tồn tại!",
            };
        }
        return {
            code: "success",
            message: "Đã cập nhật danh mục!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Cập nhật danh mục thất bại!",
        };
    }
};
exports.editPatch = editPatch;
const deletePatch = async (req) => {
    const DELETE_CODE = (process.env.DELETE_CODE || "").trim();
    try {
        const { id } = req.params;
        const { deleteCode } = req.body;
        if (!DELETE_CODE) {
            return {
                code: "error",
                message: "Thiếu cấu hình DELETE_CODE trên server",
            };
        }
        if ((deleteCode || "").trim() !== DELETE_CODE) {
            return {
                code: "error",
                message: "Mã xác nhận không đúng!",
            };
        }
        const categoryDetail = await category_model_1.default.findOne({ _id: id, ...activeFilter });
        if (!categoryDetail) {
            return {
                code: "error",
                message: "Danh mục không tồn tại!",
            };
        }
        const parentId = categoryDetail.parent ? String(categoryDetail.parent) : "";
        await category_model_1.default.updateOne({ _id: id, ...activeFilter }, {
            deletedAt: new Date(),
        });
        await reindexPositionsByParent(parentId || null);
        return {
            code: "success",
            message: "Đã xóa danh mục!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Xóa danh mục thất bại!",
        };
    }
};
exports.deletePatch = deletePatch;
const changeMultiPatch = async (req) => {
    try {
        const { listId, option } = req.body;
        if (!Array.isArray(listId) || listId.length === 0 || !option) {
            return {
                code: "error",
                message: "Dữ liệu không hợp lệ!",
            };
        }
        switch (option) {
            case "active":
            case "inactive":
                await category_model_1.default.updateMany({ _id: { $in: listId }, ...activeFilter }, { status: option });
                return {
                    code: "success",
                    message: "Đã cập nhật trạng thái danh mục!",
                };
            case "delete":
                const toDelete = await category_model_1.default.find({ _id: { $in: listId }, ...activeFilter }).select("parent");
                await category_model_1.default.updateMany({ _id: { $in: listId }, ...activeFilter }, {
                    deletedAt: new Date(),
                });
                const parentSet = new Set();
                for (const item of toDelete) {
                    parentSet.add(item.parent ? String(item.parent) : "");
                }
                for (const parentId of parentSet) {
                    await reindexPositionsByParent(parentId || null);
                }
                return {
                    code: "success",
                    message: "Đã xóa danh mục!",
                };
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
