const { Tour } = require("../../models/tour.models");

module.exports.list = (req, res) => {
  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tours",
  });
};

module.exports.detail = (req, res) => {
  res.render("client/pages/tour-detail", {
    pageTitle: "Chi tiết tour",
  });
};
