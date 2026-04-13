"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = async (model, find, req) => {
    var _a;
    const limitItems = 4;
    let page = 1;
    if ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) {
        page = parseInt(req.query.page, 10);
    }
    const totalRecord = await model.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems);
    const skip = (page - 1) * limitItems;
    return {
        totalPage,
        totalRecord,
        limitItems,
        skip,
    };
};
exports.pagination = pagination;
