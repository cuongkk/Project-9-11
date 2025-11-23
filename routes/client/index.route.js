const router = require("express").Router();
const tourRouter = require("./tour.route");
const homeRouter = require("./home.route");

router.use("/", homeRouter);

router.use("/tours", tourRouter);

module.exports = router;
