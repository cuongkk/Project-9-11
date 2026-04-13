"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleDeletePatch = exports.roleEditPatch = exports.roleEdit = exports.roleCreatePost = exports.roleCreate = exports.roleList = exports.accountAdminEditPatch = exports.accountAdminEdit = exports.accountAdminCreatePost = exports.accountAdminCreate = exports.accountAdminList = exports.websiteInfoPatch = exports.websiteInfo = exports.list = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_1 = __importDefault(require("moment"));
const slugify_1 = __importDefault(require("slugify"));
const role_model_1 = __importDefault(require("../user/role.model"));
const account_model_1 = __importDefault(require("../auth/account.model"));
const setting_model_1 = __importDefault(require("./setting.model"));
const variable_config_1 = require("../../configs/variable.config");
const list = async (req) => {
    return {
        pageTitle: "Cài đặt",
    };
};
exports.list = list;
const websiteInfo = async (req) => {
    const existRecord = await setting_model_1.default.findOne({});
    const settingWebsiteInfo = existRecord ||
        {
            websiteName: "",
            phone: "",
            email: "",
            address: "",
            logo: "",
            favicon: "",
        };
    return { settingWebsiteInfo };
};
exports.websiteInfo = websiteInfo;
const websiteInfoPatch = async (req) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const anyReq = req;
    const existRecord = await setting_model_1.default.findOne({});
    const websiteName = ((_a = anyReq.body) === null || _a === void 0 ? void 0 : _a.name) || (existRecord === null || existRecord === void 0 ? void 0 : existRecord.websiteName) || "";
    const phone = ((_b = anyReq.body) === null || _b === void 0 ? void 0 : _b.phone) || (existRecord === null || existRecord === void 0 ? void 0 : existRecord.phone) || "";
    const email = ((_c = anyReq.body) === null || _c === void 0 ? void 0 : _c.email) || (existRecord === null || existRecord === void 0 ? void 0 : existRecord.email) || "";
    const address = ((_d = anyReq.body) === null || _d === void 0 ? void 0 : _d.address) || (existRecord === null || existRecord === void 0 ? void 0 : existRecord.address) || "";
    let logo = existRecord === null || existRecord === void 0 ? void 0 : existRecord.logo;
    let favicon = existRecord === null || existRecord === void 0 ? void 0 : existRecord.favicon;
    if ((_f = (_e = anyReq.files) === null || _e === void 0 ? void 0 : _e.logo) === null || _f === void 0 ? void 0 : _f[0]) {
        logo = anyReq.files.logo[0].path;
    }
    if ((_h = (_g = anyReq.files) === null || _g === void 0 ? void 0 : _g.favicon) === null || _h === void 0 ? void 0 : _h[0]) {
        favicon = anyReq.files.favicon[0].path;
    }
    const payload = {
        websiteName,
        phone,
        email,
        address,
        logo: logo || "",
        favicon: favicon || "",
    };
    if (!existRecord) {
        const newRecord = new setting_model_1.default(payload);
        await newRecord.save();
    }
    else {
        await setting_model_1.default.updateOne({}, payload);
    }
    return {
        code: "success",
        message: "Cập nhật thành công!",
    };
};
exports.websiteInfoPatch = websiteInfoPatch;
const accountAdminList = async (req) => {
    const accountAdminList = await account_model_1.default.find({
        deleted: false,
    }).sort({
        createdAt: "desc",
    });
    for (const item of accountAdminList) {
        if (item.role) {
            const role = await role_model_1.default.findOne({
                _id: item.role,
                deleted: false,
            });
            if (role) {
                item.roleName = role.name;
            }
        }
    }
    return { accountAdminList };
};
exports.accountAdminList = accountAdminList;
const accountAdminCreate = async (req) => {
    const roleList = await role_model_1.default.find({ deleted: false });
    return { roleList };
};
exports.accountAdminCreate = accountAdminCreate;
const accountAdminCreatePost = async (req) => {
    var _a;
    const anyReq = req;
    const existEmail = await account_model_1.default.findOne({
        email: anyReq.body.email,
    });
    if (existEmail) {
        return {
            code: "error",
            message: "Email đã tồn tại trong hệ thống!",
        };
    }
    if (anyReq.file) {
        anyReq.body.avatar = anyReq.file.path;
    }
    else {
        anyReq.body.avatar = "";
    }
    const reqWithAccount = req;
    anyReq.body.createdBy = (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id;
    if (anyReq.body.fullName) {
        anyReq.body.slug = (0, slugify_1.default)(anyReq.body.fullName, { lower: true, strict: true });
    }
    anyReq.body.password = await bcryptjs_1.default.hash(anyReq.body.password, 10);
    const newAccount = new account_model_1.default(anyReq.body);
    await newAccount.save();
    return {
        code: "success",
        message: "Đã tạo tài khoản quản trị!",
    };
};
exports.accountAdminCreatePost = accountAdminCreatePost;
const accountAdminEdit = async (req) => {
    try {
        const { id } = req.params;
        const accountDetail = await account_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!accountDetail) {
            return { code: "error", message: "Tài khoản không tồn tại!" };
        }
        const roleList = await role_model_1.default.find({ deleted: false });
        return { roleList, accountDetail };
    }
    catch (error) {
        return { code: "error", message: "Tài khoản không tồn tại!" };
    }
};
exports.accountAdminEdit = accountAdminEdit;
const accountAdminEditPatch = async (req) => {
    var _a;
    try {
        const { id } = req.params;
        const anyReq = req;
        const accountDetail = await account_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!accountDetail) {
            return {
                code: "error",
                message: "Tài khoản không tồn tại!",
            };
        }
        const existEmail = await account_model_1.default.findOne({
            _id: { $ne: id },
            email: anyReq.body.email,
        });
        if (existEmail) {
            return {
                code: "error",
                message: "Email đã tồn tại trong hệ thống!",
            };
        }
        if (anyReq.file) {
            anyReq.body.avatar = anyReq.file.path;
        }
        else {
            anyReq.body.avatar = "";
        }
        const reqWithAccount = req;
        anyReq.body.updatedBy = (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id;
        await account_model_1.default.updateOne({
            _id: id,
            deleted: false,
        }, anyReq.body);
        return {
            code: "success",
            message: "Đã cập nhật khoản quản trị!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Email không tồn tại!",
        };
    }
};
exports.accountAdminEditPatch = accountAdminEditPatch;
const roleList = async (req) => {
    const find = {
        deleted: false,
    };
    const roleList = await role_model_1.default.find(find).sort({
        createdAt: "desc",
    });
    for (const item of roleList) {
        if (item.createdBy) {
            const infoAccount = await account_model_1.default.findOne({ _id: item.createdBy });
            if (infoAccount) {
                item.createdByFullName = infoAccount.fullName;
                item.createdAtFormat = (0, moment_1.default)(item.createdAt).format("HH:mm - DD/MM/YYYY");
            }
        }
        if (item.updatedBy) {
            const infoAccount = await account_model_1.default.findOne({ _id: item.updatedBy });
            if (infoAccount) {
                item.updatedByFullName = infoAccount.fullName;
                item.updatedAtFormat = (0, moment_1.default)(item.updatedAt).format("HH:mm - DD/MM/YYYY");
            }
        }
    }
    return { roleList };
};
exports.roleList = roleList;
const roleCreate = async (req) => {
    return { permissionList: variable_config_1.permissionList };
};
exports.roleCreate = roleCreate;
const roleCreatePost = async (req) => {
    var _a;
    const anyReq = req;
    const reqWithAccount = req;
    anyReq.body.createdBy = (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id;
    const record = new role_model_1.default(anyReq.body);
    await record.save();
    return {
        code: "success",
        message: "Đã tạo nhóm quyền!",
    };
};
exports.roleCreatePost = roleCreatePost;
const roleEdit = async (req) => {
    try {
        const { id } = req.params;
        const role = await role_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!role) {
            return { code: "error", message: "Nhóm quyền không tồn tại!" };
        }
        return { permissionList: variable_config_1.permissionList, role };
    }
    catch (error) {
        return { code: "error", message: "Nhóm quyền không tồn tại!" };
    }
};
exports.roleEdit = roleEdit;
const roleEditPatch = async (req) => {
    var _a;
    try {
        const { id } = req.params;
        const anyReq = req;
        const reqWithAccount = req;
        const role = await role_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!role) {
            return {
                code: "error",
                message: "Nhóm quyền không tồn tại!",
            };
        }
        anyReq.body.updatedBy = (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id;
        await role_model_1.default.updateOne({
            _id: id,
            deleted: false,
        }, anyReq.body);
        return {
            code: "success",
            message: "Đã cập nhật nhóm quyền!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Nhóm quyền không tồn tại!",
        };
    }
};
exports.roleEditPatch = roleEditPatch;
const roleDeletePatch = async (req) => {
    var _a;
    try {
        const { id } = req.params;
        const reqWithAccount = req;
        const role = await role_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!role) {
            return {
                code: "error",
                message: "Nhóm quyền không tồn tại!",
            };
        }
        await role_model_1.default.updateOne({
            _id: id,
            deleted: false,
        }, {
            deleted: true,
            deletedBy: (_a = reqWithAccount.account) === null || _a === void 0 ? void 0 : _a.id,
            deletedAt: Date.now(),
        });
        return {
            code: "success",
            message: "Đã xóa nhóm quyền!",
        };
    }
    catch (error) {
        return {
            code: "error",
            message: "Nhóm quyền không tồn tại!",
        };
    }
};
exports.roleDeletePatch = roleDeletePatch;
