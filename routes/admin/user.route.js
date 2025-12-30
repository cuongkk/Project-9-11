const router = require("express").Router();

const userController = require("../../controllers/admin/user.controller.js");

router.get("/list", userController.list);

module.exports = router;
