"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategorySubId = exports.buildCategoryTree = void 0;
const category_model_1 = __importDefault(require("./category.model"));
const buildCategoryTree = (categories, parentId) => {
    var _a;
    const tree = [];
    for (const item of categories) {
        const itemParent = (_a = item.parent) !== null && _a !== void 0 ? _a : "";
        const currentParentId = parentId !== null && parentId !== void 0 ? parentId : "";
        if (itemParent == currentParentId) {
            const children = (0, exports.buildCategoryTree)(categories, item.id);
            tree.push({
                id: item.id,
                name: item.name,
                slug: item.slug,
                children,
            });
        }
    }
    return tree;
};
exports.buildCategoryTree = buildCategoryTree;
const getCategorySubId = async (parentId = "") => {
    const listId = [];
    const children = await category_model_1.default.find({
        parent: parentId,
        deletedAt: { $exists: false },
        status: "active",
    });
    for (const item of children) {
        listId.push(item.id);
        const subIds = await (0, exports.getCategorySubId)(item.id);
        listId.push(...subIds);
    }
    return listId;
};
exports.getCategorySubId = getCategorySubId;
