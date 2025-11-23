const router = require("express").Router();

const { home } = require("../../controllers/client/home.controller.js");

router.get("/", home);

module.exports = router;
