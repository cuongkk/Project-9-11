const router = require("express").Router();

const profileController = require("../../controllers/admin/profile.controller.js");

router.get("/edit", profileController.edit);

router.get("/change-password", profileController.changePassword);
module.exports = router;
