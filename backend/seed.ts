import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import { connectDB } from "./src/configs/database.config";
import Category from "./src/modules/category/category.model";
import SettingWebsiteInfo from "./src/modules/setting/setting.model";
import Role from "./src/modules/user/role.model";
import City from "./src/modules/city/city.model";
import Tour from "./src/modules/tour/tour.model";
import AccountAdmin from "./src/modules/auth/account.model";
import Order from "./src/modules/order/order.model";

dotenv.config();

type DemoTourInput = {
  name: string;
  categoryId: string;
  basePrice: number;
  cityIds: string[];
  days: number;
};

const randomFrom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const toDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const randomPhone = (index: number): string => `09${String(10000000 + index).slice(0, 8)}`;

async function seed() {
  try {
    await connectDB();

    const plainPassword = "Cc123456@";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await Order.deleteMany({});
    await Tour.deleteMany({});
    await Category.deleteMany({});
    await City.deleteMany({});
    await AccountAdmin.deleteMany({});
    await Role.deleteMany({});
    await SettingWebsiteInfo.deleteMany({});

    const roles = await Role.insertMany([
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
        slug: slugify("Admin System", { lower: true, strict: true }),
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
        slug: slugify("Client User", { lower: true, strict: true }),
        deleted: false,
      },
      {
        fullName: "Le Van C",
        email: "clientc@example.com",
        phone: "0900000004",
        role: "client",
        status: "active",
        password: hashedPassword,
        slug: slugify("Le Van C", { lower: true, strict: true }),
        deleted: false,
      },
      {
        fullName: "Tran Thi D",
        email: "clientd@example.com",
        phone: "0900000005",
        role: "client",
        status: "active",
        password: hashedPassword,
        slug: slugify("Tran Thi D", { lower: true, strict: true }),
        deleted: false,
      },
    ];

    const accounts = await AccountAdmin.insertMany(accountPayload);
    console.log(`Inserted accounts: ${accounts.length}`);

    const adminAccounts = accounts.filter((account) => account.role === "admin");
    const clientAccounts = accounts.filter((account) => account.role === "client");

    const setting = await SettingWebsiteInfo.create({
      websiteName: "Travel Pro",
      phone: "0123456789",
      email: "info@travel.com",
      address: "123 Nguyen Hue, Quan 1, TP. Ho Chi Minh",
      logo: "/header/logo.png",
      favicon: "/favicon.ico",
    });
    console.log("Inserted setting website info", setting._id.toString());

    const topCategories = await Category.insertMany([
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

    const childCategories = await Category.insertMany([
      {
        name: "Mien Bac",
        parent: topCategories[0]?._id?.toString(),
        slug: "mien-bac",
        position: 1.1,
        status: "active",
      },
      {
        name: "Mien Trung",
        parent: topCategories[0]?._id?.toString(),
        slug: "mien-trung",
        position: 1.2,
        status: "active",
      },
      {
        name: "Mien Nam",
        parent: topCategories[0]?._id?.toString(),
        slug: "mien-nam",
        position: 1.3,
        status: "active",
      },
      {
        name: "Dong Nam A",
        parent: topCategories[1]?._id?.toString(),
        slug: "dong-nam-a",
        position: 2.1,
        status: "active",
      },
      {
        name: "Chau Au",
        parent: topCategories[1]?._id?.toString(),
        slug: "chau-au",
        position: 2.2,
        status: "active",
      },
    ]);

    const categories = [...topCategories, ...childCategories];
    console.log(`Inserted categories: ${categories.length}`);

    const cities = await City.insertMany([
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

    const demoTours: DemoTourInput[] = [
      {
        name: "Tour Da Nang 3N2D",
        categoryId: categoryBySlug.get("mien-trung")?._id?.toString() || topCategories[0]._id.toString(),
        basePrice: 3200000,
        cityIds: [cityIds[1], cityIds[5]],
        days: 3,
      },
      {
        name: "Tour Ha Noi Ha Long 4N3D",
        categoryId: categoryBySlug.get("mien-bac")?._id?.toString() || topCategories[0]._id.toString(),
        basePrice: 4500000,
        cityIds: [cityIds[0]],
        days: 4,
      },
      {
        name: "Tour Phu Quoc 3N2D",
        categoryId: categoryBySlug.get("tour-nghi-duong")?._id?.toString() || topCategories[2]._id.toString(),
        basePrice: 5200000,
        cityIds: [cityIds[4], cityIds[2]],
        days: 3,
      },
      {
        name: "Tour Singapore 4N3D",
        categoryId: categoryBySlug.get("dong-nam-a")?._id?.toString() || topCategories[1]._id.toString(),
        basePrice: 9800000,
        cityIds: [cityIds[7]],
        days: 4,
      },
      {
        name: "Tour Bangkok Pattaya 5N4D",
        categoryId: categoryBySlug.get("dong-nam-a")?._id?.toString() || topCategories[1]._id.toString(),
        basePrice: 8600000,
        cityIds: [cityIds[6]],
        days: 5,
      },
      {
        name: "Tour Paris 7N6D",
        categoryId: categoryBySlug.get("chau-au")?._id?.toString() || topCategories[1]._id.toString(),
        basePrice: 32900000,
        cityIds: [cityIds[8]],
        days: 7,
      },
      {
        name: "Tour Tokyo 5N4D",
        categoryId: categoryBySlug.get("tour-nuoc-ngoai")?._id?.toString() || topCategories[1]._id.toString(),
        basePrice: 23900000,
        cityIds: [cityIds[9]],
        days: 5,
      },
      {
        name: "Tour Nha Trang 3N2D",
        categoryId: categoryBySlug.get("mien-trung")?._id?.toString() || topCategories[0]._id.toString(),
        basePrice: 4100000,
        cityIds: [cityIds[3]],
        days: 3,
      },
      {
        name: "Tour Sai Gon Mekong 2N1D",
        categoryId: categoryBySlug.get("tour-trong-nuoc")?._id?.toString() || topCategories[0]._id.toString(),
        basePrice: 2600000,
        cityIds: [cityIds[2]],
        days: 2,
      },
      {
        name: "Tour Hue Da Nang Hoi An 4N3D",
        categoryId: categoryBySlug.get("mien-trung")?._id?.toString() || topCategories[0]._id.toString(),
        basePrice: 5600000,
        cityIds: [cityIds[5], cityIds[1]],
        days: 4,
      },
      {
        name: "Tour Da Lat 3N2D",
        categoryId: categoryBySlug.get("tour-nghi-duong")?._id?.toString() || topCategories[2]._id.toString(),
        basePrice: 3800000,
        cityIds: [cityIds[2]],
        days: 3,
      },
      {
        name: "Tour Chau Au 10N9D",
        categoryId: categoryBySlug.get("chau-au")?._id?.toString() || topCategories[1]._id.toString(),
        basePrice: 48900000,
        cityIds: [cityIds[8], cityIds[9]],
        days: 10,
      },
    ];

    const today = new Date();
    const tours = await Tour.insertMany(
      demoTours.map((tour, index) => {
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
          createdBy: adminOwner?._id?.toString(),
          updatedBy: adminOwner?._id?.toString(),
          slug: slugify(`${tour.name}-${index + 1}`, { lower: true, strict: true }),
          deleted: false,
        };
      }),
    );
    console.log(`Inserted tours: ${tours.length}`);

    const paymentMethods = ["money", "bank", "vnpay", "zalopay"];
    const paymentStatuses = ["unpaid", "paid"];
    const orderStatuses = ["initial", "done", "cancel"];

    const customerNames = ["Nguyen Van A", "Tran Thi B", "Le Van C", "Pham Thi D", "Hoang Van E", "Do Thi F", "Vu Van G", "Bui Thi H", "Dang Van I", "Ngo Thi K"];

    const ordersPayload = Array.from({ length: 30 }).map((_, index) => {
      const itemCount = 1 + Math.floor(Math.random() * 3);
      const pickedTours = [...tours].sort(() => 0.5 - Math.random()).slice(0, itemCount);

      const items = pickedTours.map((tour) => {
        const quantity = 1 + Math.floor(Math.random() * 4);
        const unitPrice = Number((tour as any).priceNew || (tour as any).price || 0);
        const locationFrom = randomFrom(cityIds);

        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + 3 + Math.floor(Math.random() * 20));

        return {
          tourId: (tour as any)._id?.toString(),
          name: (tour as any).name,
          avatar: (tour as any).avatar,
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
        phone: selectedClient?.phone || randomPhone(index + 1),
        note: index % 5 === 0 ? "Can ho tro xep cho ngoi gan cua so." : "",
        items,
        subTotal,
        discount,
        total,
        paymentMethod: randomFrom(paymentMethods),
        paymentStatus: randomFrom(paymentStatuses),
        status: randomFrom(orderStatuses),
        updatedBy: randomFrom(adminAccounts)?._id?.toString(),
        deleted: false,
      };
    });

    const orders = await Order.insertMany(ordersPayload);
    console.log(`Inserted orders: ${orders.length}`);

    console.log("Seed completed successfully");
    console.log("Default login:");
    console.log("- admin@example.com / Cc123456@");
    console.log("- user@example.com / Cc123456@");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

void seed();
