"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const slugify_1 = __importDefault(require("slugify"));
const database_config_1 = require("./src/configs/database.config");
const category_model_1 = __importDefault(require("./src/modules/category/category.model"));
const setting_model_1 = __importDefault(require("./src/modules/setting/setting.model"));
const role_model_1 = __importDefault(require("./src/modules/user/role.model"));
const city_model_1 = __importDefault(require("./src/modules/city/city.model"));
const tour_model_1 = __importDefault(require("./src/modules/tour/tour.model"));
const account_model_1 = __importDefault(require("./src/modules/auth/account.model"));
const order_model_1 = __importDefault(require("./src/modules/order/order.model"));
dotenv_1.default.config();
const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];
const toDateISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const randomPhone = (index) => `09${String(10000000 + index).slice(0, 8)}`;
async function seed() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
    try {
        await (0, database_config_1.connectDB)();
        const plainPassword = "Cc123456@";
        const hashedPassword = await bcryptjs_1.default.hash(plainPassword, 10);
        await order_model_1.default.deleteMany({});
        await tour_model_1.default.deleteMany({});
        await category_model_1.default.deleteMany({});
        await city_model_1.default.deleteMany({});
        await account_model_1.default.deleteMany({});
        await role_model_1.default.deleteMany({});
        await setting_model_1.default.deleteMany({});
        const roles = await role_model_1.default.insertMany([
            {
                name: "Admin",
                description: "Toan quyen quan tri he thong",
                permissions: ["*"],
                slug: "admin",
                deleted: false,
            },
            {
                name: "Operator",
                description: "Quan ly du lieu tour va don hang",
                permissions: ["tour-view", "tour-create", "tour-edit", "tour-delete", "tour-trash"],
                slug: "operator",
                deleted: false,
            },
            {
                name: "User",
                description: "Tai khoan khach hang",
                permissions: [],
                slug: "user",
                deleted: false,
            },
        ]);
        console.log(`Inserted roles: ${roles.length}`);
        const accountPayload = [
            {
                fullName: "Admin System",
                email: "admin@example.com",
                phone: "0900000000",
                positionCompany: "System Admin",
                role: "admin",
                status: "active",
                password: hashedPassword,
                avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=256&auto=format&fit=crop",
                slug: (0, slugify_1.default)("Admin System", { lower: true, strict: true }),
                deleted: false,
            },
            {
                fullName: "Client User",
                email: "user@example.com",
                phone: "0900000001",
                role: "client",
                status: "active",
                password: hashedPassword,
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop",
                slug: (0, slugify_1.default)("Client User", { lower: true, strict: true }),
                deleted: false,
            },
            {
                fullName: "Le Van C",
                email: "clientc@example.com",
                phone: "0900000004",
                role: "client",
                status: "active",
                password: hashedPassword,
                slug: (0, slugify_1.default)("Le Van C", { lower: true, strict: true }),
                deleted: false,
            },
            {
                fullName: "Tran Thi D",
                email: "clientd@example.com",
                phone: "0900000005",
                role: "client",
                status: "active",
                password: hashedPassword,
                slug: (0, slugify_1.default)("Tran Thi D", { lower: true, strict: true }),
                deleted: false,
            },
        ];
        const accounts = await account_model_1.default.insertMany(accountPayload);
        console.log(`Inserted accounts: ${accounts.length}`);
        const adminAccounts = accounts.filter((account) => account.role === "admin");
        const clientAccounts = accounts.filter((account) => account.role === "client");
        const setting = await setting_model_1.default.create({
            websiteName: "Travel Pro",
            phone: "0123456789",
            email: "info@travel.com",
            address: "123 Nguyen Hue, Quan 1, TP. Ho Chi Minh",
            logo: "/header/logo.png",
            favicon: "/favicon.ico",
        });
        console.log("Inserted setting website info", setting._id.toString());
        const topCategories = await category_model_1.default.insertMany([
            {
                name: "Tour Trong Nuoc",
                slug: "tour-trong-nuoc",
                position: 1,
                status: "active",
                description: "Danh muc tour trong nuoc",
            },
            {
                name: "Tour Nuoc Ngoai",
                slug: "tour-nuoc-ngoai",
                position: 2,
                status: "active",
                description: "Danh muc tour nuoc ngoai",
            },
            {
                name: "Tour Nghi Duong",
                slug: "tour-nghi-duong",
                position: 3,
                status: "active",
                description: "Danh muc tour nghi duong",
            },
        ]);
        const childCategories = await category_model_1.default.insertMany([
            {
                name: "Mien Bac",
                parent: (_b = (_a = topCategories[0]) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
                slug: "mien-bac",
                position: 1.1,
                status: "active",
            },
            {
                name: "Mien Trung",
                parent: (_d = (_c = topCategories[0]) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString(),
                slug: "mien-trung",
                position: 1.2,
                status: "active",
            },
            {
                name: "Mien Nam",
                parent: (_f = (_e = topCategories[0]) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString(),
                slug: "mien-nam",
                position: 1.3,
                status: "active",
            },
            {
                name: "Dong Nam A",
                parent: (_h = (_g = topCategories[1]) === null || _g === void 0 ? void 0 : _g._id) === null || _h === void 0 ? void 0 : _h.toString(),
                slug: "dong-nam-a",
                position: 2.1,
                status: "active",
            },
            {
                name: "Chau Au",
                parent: (_k = (_j = topCategories[1]) === null || _j === void 0 ? void 0 : _j._id) === null || _k === void 0 ? void 0 : _k.toString(),
                slug: "chau-au",
                position: 2.2,
                status: "active",
            },
        ]);
        const categories = [...topCategories, ...childCategories];
        console.log(`Inserted categories: ${categories.length}`);
        const cities = await city_model_1.default.insertMany([
            { name: "Ha Noi" },
            { name: "Da Nang" },
            { name: "TP Ho Chi Minh" },
            { name: "Nha Trang" },
            { name: "Phu Quoc" },
            { name: "Hue" },
            { name: "Bangkok" },
            { name: "Singapore" },
            { name: "Paris" },
            { name: "Tokyo" },
        ]);
        console.log(`Inserted cities: ${cities.length}`);
        const categoryBySlug = new Map(categories.map((item) => [item.slug, item]));
        const cityIds = cities.map((city) => city._id.toString());
        const demoTours = [
            {
                name: "Tour Da Nang 3N2D",
                categoryId: ((_m = (_l = categoryBySlug.get("mien-trung")) === null || _l === void 0 ? void 0 : _l._id) === null || _m === void 0 ? void 0 : _m.toString()) || topCategories[0]._id.toString(),
                basePrice: 3200000,
                cityIds: [cityIds[1], cityIds[5]],
                days: 3,
            },
            {
                name: "Tour Ha Noi Ha Long 4N3D",
                categoryId: ((_p = (_o = categoryBySlug.get("mien-bac")) === null || _o === void 0 ? void 0 : _o._id) === null || _p === void 0 ? void 0 : _p.toString()) || topCategories[0]._id.toString(),
                basePrice: 4500000,
                cityIds: [cityIds[0]],
                days: 4,
            },
            {
                name: "Tour Phu Quoc 3N2D",
                categoryId: ((_r = (_q = categoryBySlug.get("tour-nghi-duong")) === null || _q === void 0 ? void 0 : _q._id) === null || _r === void 0 ? void 0 : _r.toString()) || topCategories[2]._id.toString(),
                basePrice: 5200000,
                cityIds: [cityIds[4], cityIds[2]],
                days: 3,
            },
            {
                name: "Tour Singapore 4N3D",
                categoryId: ((_t = (_s = categoryBySlug.get("dong-nam-a")) === null || _s === void 0 ? void 0 : _s._id) === null || _t === void 0 ? void 0 : _t.toString()) || topCategories[1]._id.toString(),
                basePrice: 9800000,
                cityIds: [cityIds[7]],
                days: 4,
            },
            {
                name: "Tour Bangkok Pattaya 5N4D",
                categoryId: ((_v = (_u = categoryBySlug.get("dong-nam-a")) === null || _u === void 0 ? void 0 : _u._id) === null || _v === void 0 ? void 0 : _v.toString()) || topCategories[1]._id.toString(),
                basePrice: 8600000,
                cityIds: [cityIds[6]],
                days: 5,
            },
            {
                name: "Tour Paris 7N6D",
                categoryId: ((_x = (_w = categoryBySlug.get("chau-au")) === null || _w === void 0 ? void 0 : _w._id) === null || _x === void 0 ? void 0 : _x.toString()) || topCategories[1]._id.toString(),
                basePrice: 32900000,
                cityIds: [cityIds[8]],
                days: 7,
            },
            {
                name: "Tour Tokyo 5N4D",
                categoryId: ((_z = (_y = categoryBySlug.get("tour-nuoc-ngoai")) === null || _y === void 0 ? void 0 : _y._id) === null || _z === void 0 ? void 0 : _z.toString()) || topCategories[1]._id.toString(),
                basePrice: 23900000,
                cityIds: [cityIds[9]],
                days: 5,
            },
            {
                name: "Tour Nha Trang 3N2D",
                categoryId: ((_1 = (_0 = categoryBySlug.get("mien-trung")) === null || _0 === void 0 ? void 0 : _0._id) === null || _1 === void 0 ? void 0 : _1.toString()) || topCategories[0]._id.toString(),
                basePrice: 4100000,
                cityIds: [cityIds[3]],
                days: 3,
            },
            {
                name: "Tour Sai Gon Mekong 2N1D",
                categoryId: ((_3 = (_2 = categoryBySlug.get("tour-trong-nuoc")) === null || _2 === void 0 ? void 0 : _2._id) === null || _3 === void 0 ? void 0 : _3.toString()) || topCategories[0]._id.toString(),
                basePrice: 2600000,
                cityIds: [cityIds[2]],
                days: 2,
            },
            {
                name: "Tour Hue Da Nang Hoi An 4N3D",
                categoryId: ((_5 = (_4 = categoryBySlug.get("mien-trung")) === null || _4 === void 0 ? void 0 : _4._id) === null || _5 === void 0 ? void 0 : _5.toString()) || topCategories[0]._id.toString(),
                basePrice: 5600000,
                cityIds: [cityIds[5], cityIds[1]],
                days: 4,
            },
            {
                name: "Tour Da Lat 3N2D",
                categoryId: ((_7 = (_6 = categoryBySlug.get("tour-nghi-duong")) === null || _6 === void 0 ? void 0 : _6._id) === null || _7 === void 0 ? void 0 : _7.toString()) || topCategories[2]._id.toString(),
                basePrice: 3800000,
                cityIds: [cityIds[2]],
                days: 3,
            },
            {
                name: "Tour Chau Au 10N9D",
                categoryId: ((_9 = (_8 = categoryBySlug.get("chau-au")) === null || _8 === void 0 ? void 0 : _8._id) === null || _9 === void 0 ? void 0 : _9.toString()) || topCategories[1]._id.toString(),
                basePrice: 48900000,
                cityIds: [cityIds[8], cityIds[9]],
                days: 10,
            },
        ];
        const today = new Date();
        const tours = await tour_model_1.default.insertMany(demoTours.map((tour, index) => {
            var _a, _b;
            const departure = new Date(today);
            departure.setDate(today.getDate() + 5 + index * 2);
            const endDate = new Date(departure);
            endDate.setDate(departure.getDate() + Math.max(1, tour.days - 1));
            const discount = Math.floor(tour.basePrice * 0.1);
            const adminOwner = adminAccounts[index % adminAccounts.length];
            const salePrice = tour.basePrice - discount;
            const stock = 25 + index * 3;
            return {
                name: tour.name,
                category: tour.categoryId,
                position: index + 1,
                status: index % 7 === 0 ? "inactive" : "active",
                avatar: `https://picsum.photos/seed/tour-${index + 1}/640/420`,
                images: [`https://picsum.photos/seed/tour-${index + 1}-a/1200/800`, `https://picsum.photos/seed/tour-${index + 1}-b/1200/800`, `https://picsum.photos/seed/tour-${index + 1}-c/1200/800`],
                price: tour.basePrice,
                priceNew: salePrice,
                stock,
                priceAdult: tour.basePrice,
                priceChildren: tour.basePrice,
                priceBaby: tour.basePrice,
                priceNewAdult: salePrice,
                priceNewChildren: salePrice,
                priceNewBaby: salePrice,
                stockAdult: stock,
                stockChildren: stock,
                stockBaby: stock,
                locations: tour.cityIds,
                time: `${tour.days} ngay`,
                departureDate: departure,
                endDate,
                information: `${tour.name} la chuong trinh du lich chat luong cao, lich trinh toi uu va dich vu tron goi.`,
                schedules: [
                    {
                        title: "Ngay 1",
                        description: "Don khach, tham quan diem noi bat, nghi dem tai khach san 4 sao.",
                    },
                    {
                        title: `Ngay ${Math.min(2, tour.days)}`,
                        description: "Tham quan theo chuong trinh, an uong va huong dan vien di kem.",
                    },
                ],
                createdBy: (_a = adminOwner === null || adminOwner === void 0 ? void 0 : adminOwner._id) === null || _a === void 0 ? void 0 : _a.toString(),
                updatedBy: (_b = adminOwner === null || adminOwner === void 0 ? void 0 : adminOwner._id) === null || _b === void 0 ? void 0 : _b.toString(),
                slug: (0, slugify_1.default)(`${tour.name}-${index + 1}`, { lower: true, strict: true }),
                deleted: false,
            };
        }));
        console.log(`Inserted tours: ${tours.length}`);
        const paymentMethods = ["money", "bank", "vnpay", "zalopay"];
        const paymentStatuses = ["unpaid", "paid"];
        const orderStatuses = ["initial", "done", "cancel"];
        const customerNames = ["Nguyen Van A", "Tran Thi B", "Le Van C", "Pham Thi D", "Hoang Van E", "Do Thi F", "Vu Van G", "Bui Thi H", "Dang Van I", "Ngo Thi K"];
        const ordersPayload = Array.from({ length: 30 }).map((_, index) => {
            var _a, _b;
            const itemCount = 1 + Math.floor(Math.random() * 3);
            const pickedTours = [...tours].sort(() => 0.5 - Math.random()).slice(0, itemCount);
            const items = pickedTours.map((tour) => {
                var _a;
                const quantity = 1 + Math.floor(Math.random() * 4);
                const unitPrice = Number(tour.priceNew || tour.price || 0);
                const locationFrom = randomFrom(cityIds);
                const baseDate = new Date();
                baseDate.setDate(baseDate.getDate() + 3 + Math.floor(Math.random() * 20));
                return {
                    tourId: (_a = tour._id) === null || _a === void 0 ? void 0 : _a.toString(),
                    name: tour.name,
                    avatar: tour.avatar,
                    locationFrom,
                    departureDate: toDateISO(baseDate),
                    quantity,
                    unitPrice,
                    price: unitPrice,
                };
            });
            const subTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
            const discount = index % 4 === 0 ? Math.floor(subTotal * 0.05) : 0;
            const total = subTotal - discount;
            const customerName = randomFrom(customerNames);
            const selectedClient = randomFrom(clientAccounts);
            return {
                code: `ORDER${String(index + 1).padStart(4, "0")}`,
                fullName: customerName,
                phone: (selectedClient === null || selectedClient === void 0 ? void 0 : selectedClient.phone) || randomPhone(index + 1),
                note: index % 5 === 0 ? "Can ho tro xep cho ngoi gan cua so." : "",
                items,
                subTotal,
                discount,
                total,
                paymentMethod: randomFrom(paymentMethods),
                paymentStatus: randomFrom(paymentStatuses),
                status: randomFrom(orderStatuses),
                updatedBy: (_b = (_a = randomFrom(adminAccounts)) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
                deleted: false,
            };
        });
        const orders = await order_model_1.default.insertMany(ordersPayload);
        console.log(`Inserted orders: ${orders.length}`);
        console.log("Seed completed successfully");
        console.log("Default login:");
        console.log("- admin@example.com / Cc123456@");
        console.log("- user@example.com / Cc123456@");
    }
    catch (error) {
        console.error("Seed error:", error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log("Database connection closed");
    }
}
void seed();
