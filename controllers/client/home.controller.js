const { Tour } = require("../../models/tour.models");

module.exports.home = (req, res) => {
  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
  });
};
