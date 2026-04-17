import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import { dashboardAdminRouter, dashboardPublicRouter } from "../modules/dashboard/dashboard.route";
import categoryRouter from "../modules/category/category.route";
import tourRouter from "../modules/tour/tour.route";
import contactRouter from "../modules/contact/contact.route";
// import searchRouter from "../modules/search/search.route";
import cartRouter from "../modules/cart/cart.route";
import orderRouter from "../modules/order/order.route";
import uploadRoutes from "../modules/upload/upload.route";
import userAdminRouter from "../modules/user/user.route";
import settingRouter from "../modules/setting/setting.route";
import gearRouter from "../modules/gear/gear.route";
import journalRouter from "../modules/journal/journal.route";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin, isClient } from "../middlewares/role.middleware";

const router = Router();

router.use("/auth", authRoute);

// Nhóm route dành cho ADMIN (cần token + role admin)
router.use("/category", verifyToken, isAdmin, categoryRouter);
router.use("/setting", verifyToken, isAdmin, settingRouter);
router.use("/admin/order", verifyToken, isAdmin, orderRouter);
router.use("/upload", verifyToken, isAdmin, uploadRoutes);
router.use("/user", verifyToken, isAdmin, userAdminRouter);
router.use("/tour", verifyToken, isAdmin, tourRouter);
router.use("/gear", verifyToken, isAdmin, gearRouter);
router.use("/journal", verifyToken, isAdmin, journalRouter);
router.use("/admin/dashboard", verifyToken, isAdmin, dashboardAdminRouter);

// Nhóm route dành cho CLIENT (có thể yêu cầu đăng nhập tuỳ chức năng)
// router.use("/search", searchRouter);
router.use("/dashboard", dashboardPublicRouter);
router.use("/cart", verifyToken, isClient, cartRouter);
router.use("/order", verifyToken, isClient, orderRouter);
router.use("/contact", contactRouter);

export default router;
