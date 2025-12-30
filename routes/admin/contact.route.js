const router = require("express").Router();

const contactController = require("../../controllers/admin/contact.controller.js");

router.get("/list", contactController.list);

module.exports = router;
