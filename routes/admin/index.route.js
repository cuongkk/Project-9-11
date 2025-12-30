const router = require("express").Router();

const accountRouter = require("./account.route");
const dashboardController = require("./dashboard.route");
const categoryRouter = require("./category.route");
const tourRouter = require("./tour.route");
const orderRouter = require("./order.route");
const userRouter = require("./user.route");
const contactRouter = require("./contact.route");
const settingRouter = require("./setting.route");
const profileRouter = require("./profile.route");

router.use("/account", accountRouter);
router.use("/dashboard", dashboardController);
router.use("/category", categoryRouter);
router.use("/tour", tourRouter);
router.use("/order", orderRouter);
router.use("/user", userRouter);
router.use("/contact", contactRouter);
router.use("/setting", settingRouter);
router.use("/profile", profileRouter);

router.use((req, res) => {
  res.render("admin/pages/error-404", {
    pageTitle: "Trang không tồn tại",
  });
});
module.exports = router;
