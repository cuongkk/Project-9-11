const router = require("express").Router();

const homeRouter = require("./home.route");
const tourListRouter = require("./tour-list.route");
const cartRouter = require("./cart.route");

router.use("/", homeRouter);

router.use("/cart", cartRouter);

router.use("/tours", tourListRouter);

module.exports = router;
