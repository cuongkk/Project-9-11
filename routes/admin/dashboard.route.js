const router = require("express").Router();

const dashboardController = require("../../controllers/admin/dashboard.controller.js");

const verifyToken = require("../../middlewares/admin/auth.middleware.js");

router.get("/", verifyToken.verifyToken, dashboardController.dashboard);

module.exports = router;
