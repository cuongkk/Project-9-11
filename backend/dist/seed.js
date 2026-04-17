"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const slugify_1 = __importDefault(require("slugify"));
const database_config_1 = require("./src/configs/database.config");
const category_model_1 = __importDefault(require("./src/modules/category/category.model"));
const setting_model_1 = __importDefault(require("./src/modules/setting/setting.model"));
const role_model_1 = __importDefault(require("./src/modules/user/role.model"));
const city_model_1 = __importDefault(require("./src/modules/city/city.model"));
const tour_model_1 = __importDefault(require("./src/modules/tour/tour.model"));
const gear_model_1 = __importDefault(require("./src/modules/gear/gear.model"));
const journal_model_1 = __importDefault(require("./src/modules/journal/journal.model"));
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
    await (0, database_config_1.connectDB)();
    const plainPassword = "Cc123456@";
    const hashedPassword = await bcryptjs_1.default.hash(plainPassword, 10);
    await order_model_1.default.deleteMany({});
    await journal_model_1.default.deleteMany({});
    await gear_model_1.default.deleteMany({});
    await tour_model_1.default.deleteMany({});
    await category_model_1.default.deleteMany({});
    await city_model_1.default.deleteMany({});
    await account_model_1.default.deleteMany({});
    await role_model_1.default.deleteMany({});
    await setting_model_1.default.deleteMany({});
    const roles = await role_model_1.default.insertMany([
        {
            name: "Admin",
            description: "Toàn quyền quản trị hệ thống",
            permissions: ["*"],
            slug: "admin",
            deleted: false,
        },
        {
            name: "Operator",
            description: "Quản lý dữ liệu tour và đơn hàng",
            permissions: ["tour-view", "tour-create", "tour-edit", "tour-delete", "tour-trash"],
            slug: "operator",
            deleted: false,
        },
        {
            name: "User",
            description: "Tài khoản khách hàng",
            permissions: [],
            slug: "user",
            deleted: false,
        },
    ]);
    console.log(`Inserted roles: ${roles.length}`);
    const accountPayload = [
        {
            fullName: "Nguyễn Hoàng Nam",
            email: "admin@example.com",
            phone: "0900000000",
            positionCompany: "Quản trị hệ thống",
            role: "admin",
            status: "active",
            password: hashedPassword,
            avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=256&auto=format&fit=crop",
            slug: (0, slugify_1.default)("Nguyễn Hoàng Nam", { lower: true, strict: true }),
            deleted: false,
        },
        {
            fullName: "Trần Thu Hà",
            email: "user@example.com",
            phone: "0900000001",
            role: "client",
            status: "active",
            password: hashedPassword,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop",
            slug: (0, slugify_1.default)("Trần Thu Hà", { lower: true, strict: true }),
            deleted: false,
        },
        {
            fullName: "Lê Văn C",
            email: "clientc@example.com",
            phone: "0900000004",
            role: "client",
            status: "active",
            password: hashedPassword,
            slug: (0, slugify_1.default)("Lê Văn C", { lower: true, strict: true }),
            deleted: false,
        },
        {
            fullName: "Trần Thị D",
            email: "clientd@example.com",
            phone: "0900000005",
            role: "client",
            status: "active",
            password: hashedPassword,
            slug: (0, slugify_1.default)("Trần Thị D", { lower: true, strict: true }),
            deleted: false,
        },
    ];
    const accounts = await account_model_1.default.insertMany(accountPayload);
    console.log(`Inserted accounts: ${accounts.length}`);
    const adminAccounts = accounts.filter((account) => account.role === "admin");
    const clientAccounts = accounts.filter((account) => account.role === "client");
    const setting = await setting_model_1.default.create({
        websiteName: "TravelKa",
        phone: "0123456789",
        email: "info@travel.com",
        address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        logo: "/header/logo.png",
        favicon: "/favicon.ico",
    });
    console.log("Inserted setting website info", setting._id.toString());
    const topCategories = await category_model_1.default.insertMany([
        {
            name: "Tour Trong Nước",
            slug: "tour-trong-nuoc",
            position: 1,
            status: "active",
            description: "Danh mục tour trong nước",
        },
        {
            name: "Tour Nước Ngoài",
            slug: "tour-nuoc-ngoai",
            position: 2,
            status: "active",
            description: "Danh mục tour nước ngoài",
        },
        {
            name: "Tour Nghỉ Dưỡng",
            slug: "tour-nghi-duong",
            position: 3,
            status: "active",
            description: "Danh mục tour nghỉ dưỡng",
        },
    ]);
    const childCategories = await category_model_1.default.insertMany([
        {
            name: "Miền Bắc",
            parent: (_b = (_a = topCategories[0]) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(),
            slug: "mien-bac",
            position: 1.1,
            status: "active",
        },
        {
            name: "Miền Trung",
            parent: (_d = (_c = topCategories[0]) === null || _c === void 0 ? void 0 : _c._id) === null || _d === void 0 ? void 0 : _d.toString(),
            slug: "mien-trung",
            position: 1.2,
            status: "active",
        },
        {
            name: "Miền Nam",
            parent: (_f = (_e = topCategories[0]) === null || _e === void 0 ? void 0 : _e._id) === null || _f === void 0 ? void 0 : _f.toString(),
            slug: "mien-nam",
            position: 1.3,
            status: "active",
        },
        {
            name: "Đông Nam Á",
            parent: (_h = (_g = topCategories[1]) === null || _g === void 0 ? void 0 : _g._id) === null || _h === void 0 ? void 0 : _h.toString(),
            slug: "dong-nam-a",
            position: 2.1,
            status: "active",
        },
        {
            name: "Châu Âu",
            parent: (_k = (_j = topCategories[1]) === null || _j === void 0 ? void 0 : _j._id) === null || _k === void 0 ? void 0 : _k.toString(),
            slug: "chau-au",
            position: 2.2,
            status: "active",
        },
    ]);
    const categories = [...topCategories, ...childCategories];
    console.log(`Inserted categories: ${categories.length}`);
    const cities = await city_model_1.default.insertMany([
        { name: "Hà Nội" },
        { name: "Đà Nẵng" },
        { name: "TP Hồ Chí Minh" },
        { name: "Nha Trang" },
        { name: "Phú Quốc" },
        { name: "Huế" },
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
            name: "Đà Nẵng - Hội An 3N2Đ",
            categoryId: ((_m = (_l = categoryBySlug.get("mien-trung")) === null || _l === void 0 ? void 0 : _l._id) === null || _m === void 0 ? void 0 : _m.toString()) || topCategories[0]._id.toString(),
            basePrice: 3200000,
            cityIds: [cityIds[1], cityIds[5]],
            days: 3,
        },
        {
            name: "Hà Nội - Hạ Long 4N3Đ",
            categoryId: ((_p = (_o = categoryBySlug.get("mien-bac")) === null || _o === void 0 ? void 0 : _o._id) === null || _p === void 0 ? void 0 : _p.toString()) || topCategories[0]._id.toString(),
            basePrice: 4500000,
            cityIds: [cityIds[0]],
            days: 4,
        },
        {
            name: "Phú Quốc nghỉ dưỡng 3N2Đ",
            categoryId: ((_r = (_q = categoryBySlug.get("tour-nghi-duong")) === null || _q === void 0 ? void 0 : _q._id) === null || _r === void 0 ? void 0 : _r.toString()) || topCategories[2]._id.toString(),
            basePrice: 5200000,
            cityIds: [cityIds[4], cityIds[2]],
            days: 3,
        },
        {
            name: "Singapore khám phá đô thị 4N3Đ",
            categoryId: ((_t = (_s = categoryBySlug.get("dong-nam-a")) === null || _s === void 0 ? void 0 : _s._id) === null || _t === void 0 ? void 0 : _t.toString()) || topCategories[1]._id.toString(),
            basePrice: 9800000,
            cityIds: [cityIds[7]],
            days: 4,
        },
        {
            name: "Bangkok - Pattaya 5N4Đ",
            categoryId: ((_v = (_u = categoryBySlug.get("dong-nam-a")) === null || _u === void 0 ? void 0 : _u._id) === null || _v === void 0 ? void 0 : _v.toString()) || topCategories[1]._id.toString(),
            basePrice: 8600000,
            cityIds: [cityIds[6]],
            days: 5,
        },
        {
            name: "Paris - Châu Âu 7N6Đ",
            categoryId: ((_x = (_w = categoryBySlug.get("chau-au")) === null || _w === void 0 ? void 0 : _w._id) === null || _x === void 0 ? void 0 : _x.toString()) || topCategories[1]._id.toString(),
            basePrice: 32900000,
            cityIds: [cityIds[8]],
            days: 7,
        },
        {
            name: "Tokyo mùa lá đỏ 5N4Đ",
            categoryId: ((_z = (_y = categoryBySlug.get("tour-nuoc-ngoai")) === null || _y === void 0 ? void 0 : _y._id) === null || _z === void 0 ? void 0 : _z.toString()) || topCategories[1]._id.toString(),
            basePrice: 23900000,
            cityIds: [cityIds[9]],
            days: 5,
        },
        {
            name: "Nha Trang biển xanh 3N2Đ",
            categoryId: ((_1 = (_0 = categoryBySlug.get("mien-trung")) === null || _0 === void 0 ? void 0 : _0._id) === null || _1 === void 0 ? void 0 : _1.toString()) || topCategories[0]._id.toString(),
            basePrice: 4100000,
            cityIds: [cityIds[3]],
            days: 3,
        },
        {
            name: "Sài Gòn - Mekong 2N1Đ",
            categoryId: ((_3 = (_2 = categoryBySlug.get("tour-trong-nuoc")) === null || _2 === void 0 ? void 0 : _2._id) === null || _3 === void 0 ? void 0 : _3.toString()) || topCategories[0]._id.toString(),
            basePrice: 2600000,
            cityIds: [cityIds[2]],
            days: 2,
        },
        {
            name: "Huế - Đà Nẵng - Hội An 4N3Đ",
            categoryId: ((_5 = (_4 = categoryBySlug.get("mien-trung")) === null || _4 === void 0 ? void 0 : _4._id) === null || _5 === void 0 ? void 0 : _5.toString()) || topCategories[0]._id.toString(),
            basePrice: 5600000,
            cityIds: [cityIds[5], cityIds[1]],
            days: 4,
        },
        {
            name: "Đà Lạt săn mây 3N2Đ",
            categoryId: ((_7 = (_6 = categoryBySlug.get("tour-nghi-duong")) === null || _6 === void 0 ? void 0 : _6._id) === null || _7 === void 0 ? void 0 : _7.toString()) || topCategories[2]._id.toString(),
            basePrice: 3800000,
            cityIds: [cityIds[2]],
            days: 3,
        },
        {
            name: "Liên tuyến Châu Âu 10N9Đ",
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
        const rating = Number((4.5 + (index % 5) * 0.1).toFixed(1));
        const reviewCount = 120 + index * 37;
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
            locations: tour.cityIds,
            time: `${tour.days} ngày`,
            departureDate: departure,
            endDate,
            information: `${tour.name} là hành trình du lịch trọn gói với lịch trình hợp lý, khách sạn tiêu chuẩn và hướng dẫn viên nhiệt tình.`,
            schedules: [
                {
                    title: "Ngày 1",
                    description: "Đón khách tại điểm hẹn, khởi hành và tham quan các điểm nổi bật trong ngày.",
                },
                {
                    title: `Ngày ${Math.min(2, tour.days)}`,
                    description: "Tiếp tục tham quan, trải nghiệm đặc sản địa phương và nghỉ dưỡng theo lịch trình.",
                },
            ],
            rating,
            reviewCount,
            createdBy: (_a = adminOwner === null || adminOwner === void 0 ? void 0 : adminOwner._id) === null || _a === void 0 ? void 0 : _a.toString(),
            updatedBy: (_b = adminOwner === null || adminOwner === void 0 ? void 0 : adminOwner._id) === null || _b === void 0 ? void 0 : _b.toString(),
            slug: (0, slugify_1.default)(`${tour.name}-${index + 1}`, { lower: true, strict: true }),
            deleted: false,
        };
    }));
    console.log(`Inserted tours: ${tours.length}`);
    const gears = await gear_model_1.default.insertMany([
        {
            name: "Balo Atlas Pro 45L",
            category: "Phụ kiện",
            subtitle: "Balo đa năng cho chuyến đi dài ngày",
            description: "Balo linh hoạt, chia ngăn hợp lý cho hành trình dài ngày.",
            price: 280,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKXiUfAU51NkNI2y3m6KWXq5sEy_I5-hHjXjmDqoq-xKcLEfgOsF7i3LHGFHRmR55V63CO5LFhiukpd3eU8WmT-rewZMhVJcssqE8lKLhAS43h7gj3M1HiZ_t7Vc-Z8DHiuEhm3gDH0w9VO5tzunNVXZyRVHpgBaBDRuYk5ISuC9AIqAQFreUyd1-c4LCrnYEroLndcBPodXdEaseFADasCuCx3tFQMuyBMniDAzAZ6jTITi4MjOG3Gt7vMop8_e5ODMoE5IYEtBY",
            badge: "MỚI",
            status: "active",
        },
        {
            name: "Giày Velo Trail 2.0",
            category: "Giày",
            subtitle: "Giày leo núi nhẹ và bám đường",
            description: "Giày du lịch địa hình nhẹ, bền và ôm chân.",
            price: 145,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH_9EjokL_fsCK2Ym0OMulpok7avbSSclFDLukuKAt2AN6gGLjUtIB-9phmihUdnfOAdaWBjV4S3lRH3S81cyyTpxtvYLQoYtAAC4AVd7s6ZDc_k8uLOQqp75_dMz459APCFPzsqsCPLiTlXtaVX_tQcEP4gLo6118agZqYVHnnYlq6NNORN1mgsIATGeUoSnNRdBVw5QUtou0t6Mpk4qjmoLRgw7NbW5ZRK6PEXUM-vTuWYmmkWZqxfrip8KXe4b_zLB-cKN977U",
            badge: "ƯU ĐÃI",
            status: "active",
        },
        {
            name: "Máy ảnh Lumina X-1",
            category: "Công nghệ",
            subtitle: "Bộ chụp ảnh du lịch gọn nhẹ",
            description: "Máy ảnh gọn nhẹ cho người sáng tạo nội dung khi di chuyển.",
            price: 1200,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlOlef5-HC4fDsn9vamVgkLmSrtds1fFBONyEr82gz16AZ_0hkpgAKBb89Ge8zKxXuriuOqxn2VDlztrOAqH9Hxc-ajP5SUTNDo3kR9Pm6HW03B9-POamARZtY3LPwv3DXiiG2afQXp3P79Kw6UMCd9C38_TpWd6WKUTMyd_BangpaWn2qZZjBqiV_kO7twPrh0uPixoSFE8jdtoQJcUovGPG-17KeNtdUtNI2apgMdq-aak8-aP3t7ndOxsLMfUKamtBxCDw_a7g",
            status: "active",
        },
        {
            name: "Bình giữ nhiệt Iso-Flask Elite",
            category: "Đồ dùng",
            subtitle: "Bình giữ nhiệt cho hoạt động ngoài trời",
            description: "Bình giữ nhiệt bền, phù hợp cho trekking và camping.",
            price: 65,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_tA4qy7CPtfOzDSHSy6Verj2dCXciLVMfGKespYd_tcX8cGRcQ3_xCASz1vi19cErTk2M5fT0PkzHgP8v65CNNJqzu1ZPokHUQCnUYSWFOzY_GUKhZbEBHTVlSdHFPHWQCFGgZGb6rhOYpKeS3KQh90zxq_knI2JRP6uMvy_l5dZMaNfEDLVvDVdaETfutfqd_BJgv4HnCVt9Qs15ag9aNUke0FjQ8sVepTlrkzuC4FnZKQmD0sjuM-PgLXJw7bFI0xoaxz-oH6A",
            badge: "NỔI BẬT",
            status: "active",
        },
    ]);
    console.log(`Inserted gears: ${gears.length}`);
    const journals = await journal_model_1.default.insertMany([
        {
            title: "Nghỉ dưỡng xanh tại Bali: trải nghiệm cao cấp bền vững",
            summary: "Khám phá một khu nghỉ dưỡng theo đuổi phong cách sống xanh nhưng vẫn giữ trọn sự sang trọng.",
            tag: "ĐÁNH GIÁ KHÁCH SẠN",
            author: "Lê Minh Thư",
            dateLabel: "24/10/2024",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrvSuc1qJ3fTto2_-t7MHrm1t8LsCC2fGE7thQN6obGLsMwCgyToU_cD23hQUFoyvBCP7QXv4d8c7dtKrjeSEP5GuSxilYFsMH6GzYz1Qmxqg7BzfC0TwJ17Hru1OF-evgnH-2RSb5jQUYsmd3u0wqXDWWgrUDZoBqeP4c-Ve5a_Ekw78YIXZku8BcKLl0xMJcXv6FbSBIYkBSDUykvtr77D34ycf5Cop97pZpSeHNVwswJRGgTAxMCgtt9XYrghhf4wqMIqtz6Zc",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx0T42DCxqSHSikJLsVlQ8jBXqYw36gEA6UjdaA9AIetxC4nsb9SftO-lGzuZTrPnirDygQnqQtFZR-vXOHG-kqPQ3ug1dXXh0HwivO94J3X9hljsuSh3oeIeSVAZsj6CQxHQxG20DBhSEQLrSez3xyKjJzMCfFed2AoE0C4q1BGDlx7cCevnbjwPyBk5YwNozb6oZoGF6iFoYAiVGdFSfuZiH6Q8VJZX4A64MeerVL2eTmgwBrcmh-Fyc1xF99Qp7YaVpg0nmkaM",
            trendingScore: 85,
            status: "active",
        },
        {
            title: "Trekking Andes một mình: hành trình vượt giới hạn",
            summary: "Nhật ký vượt núi ở độ cao lớn và những bài học về thể lực, tinh thần trên cung đường khắc nghiệt.",
            tag: "HÀNH TRÌNH",
            author: "Nguyễn Tuấn Kiệt",
            dateLabel: "19/10/2024",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZszjkq1awXYWGv0STIyvCy1lEuDhAI-08ZzmbcZvFQE_iibR_GLuP8ghWj1A6HayDeY5RBsmUY8jjRDc59TQKJyJe6UdKXuRXHvCsuCzHamxtniPOkRC-KQPpUzMlwEL4b4JI-7SI9LIoxhLFeFzE70BK1fP6noR6dZcbqTgU4xeF2blfsrorJ3P_f8D4IhaJLZbHAbtwZcS8sr3JQ7rgXu90drbB-epWn-J_hm4xPrVpz4U7QWAM8X6qRNcyZVC2JtyrYqqPVAo",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmfeMxdfkG5uKdchB4u_B4gtCRg4getijNvgsmwv_1Eb3QpwpuQkUXwwcgmJz22pYNwX-s9FfY8A-G30NFByMYiGawQCjQAiZ674i5hQn4yYtag7tRDYdgsBSHyqIbVSyL3UVWqWHfS5EQchQnNwd3DoLyOPlrjT_jy7LL4hiwr27yei-8RJHOK_H-HZ69dlPRc92c2e9V_8AfO-6c-pBeXLnh0BEfvP658DOmJ8dFnfUIMFB-jE7VwVDHihNVkgBk1psLGnlTuLc",
            trendingScore: 78,
            status: "active",
        },
        {
            title: "Người du mục biển Bajau Laut và nét văn hóa độc đáo",
            summary: "Cùng tìm hiểu làng nổi và kỹ năng lặn biển truyền thống của cộng đồng sống giữa đại dương.",
            tag: "VĂN HÓA",
            author: "Phạm Gia Huy",
            dateLabel: "15/10/2024",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUmEQV2VE8GYOkUDTbrxOfLaZwr7QQRao0fuZaFILJ9KXTznQsAaQS8OXllrP5KYw7L2akGLMUiih-YRZq3JXKQnCwCVSWNqvqMDlXwbaYnmv4TMVXBec0wCkgvnHYveSWpfbUrtASnQo26cPIy8ZOWNI-2tyRf30xx188Dn4GI7GCFyAt0VE4pk_ZaaL6Uu7sPKEzW2ensmIDkyplDbipFj16-_cxI9NvHwVAcuHReWzKHycYswgBXH5vOHowLNESofzoUusp6D8",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxS-iRNGdPa5zMRgCDQTl1e77Dl6DUFm2luvDB9THatrGRqGWva09HiX0d7Il78edzLFhH37ZZoSl7BEjhxtzRNC9OgiXpd6flF5vwhQOX52ueBZlZkqHSr1q9zHiwKnP8CKlNKpl7z-bNOB3Vr268c00XyXclWAzmxsh-dqGsSsCbWqzGXS2DUpeIET5oRzW5jPLSqh3M_DU-6Il-8DIpa2Ml3gzAZZun-Btlc65N-HVMRyfX7wkwnnnRGbOd7yQWBW8jYUGT9Cw",
            trendingScore: 92,
            status: "active",
        },
        {
            title: "Vì sao con người luôn khao khát xuất phát",
            summary: "Góc nhìn tâm lý về nhu cầu dịch chuyển, khám phá và tìm kiếm ý nghĩa qua mỗi chuyến đi.",
            tag: "TẢN MẠN",
            author: "Trần Bảo Linh",
            dateLabel: "08/10/2024",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtfGWjGXNXVG4l8kY_LEE9RQv_dxRwI-goNkUQZi300a_3KC45A_byCn2broxHCCf9FsUYIUN76g1GKwu-9SWmgTD4rOeA0wDHrgyCA3fFd5uhXHFQEPVr4o4gLtgt_LkS3DIC-IxKFuD4RkstxDhhhM8eRHUAOCIZv6OO_cLB7LFb0DyOW4WMfZfu-4kZCLKKvVi_vfnLJzwmM-pTNtCZ7ZVSPe3phvdX7tFLhxe4zXapKARVh9njmWpLhjrSayU5Xnb20Jw42H8",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDzn2qkgmPW6fHsRfPXnkLrM7PsfZKeQV1QyisGi9i7HfsHs0g62CyxGvHKmlOenUStYkDMjIzd27oSuL_fifX85Wnlqolco8Fc1ZUdx4b3TC8nPJO_smYbH9psEMkNnSYP-eWWgBbkO8gBGdLvJoMhtFa_BO9pC94CGlMT3C6MmNWr19mBj-JMp_fUhk9IGsc597-XXlJEpQGWu7AOHhZ0ElXxi5Raf6j78X1McIy-012gP7swxL-AijWu-e44esEjTk3tn84c84",
            trendingScore: 66,
            status: "active",
        },
    ]);
    console.log(`Inserted journals: ${journals.length}`);
    const paymentMethods = ["money", "bank", "vnpay", "zalopay"];
    const paymentStatuses = ["unpaid", "paid"];
    const orderStatuses = ["initial", "done", "cancel"];
    const customerNames = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E", "Đỗ Thị F", "Vũ Văn G", "Bùi Thị H", "Đặng Văn I", "Ngô Thị K"];
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
            note: index % 5 === 0 ? "Cần hỗ trợ xếp chỗ ngồi gần cửa sổ." : "",
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
    console.log("Default login emails:");
    console.log("- admin@example.com");
    console.log("- user@example.com");
    console.log("Default password đã được seed từ biến cấu hình nội bộ.");
}
void seed();
