const router = require("express").Router();

const { list } = require("../../controllers/client/tour.controller.js");

router.get("/tours", list);

module.exports = router;
