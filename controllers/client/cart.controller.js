const { Tour } = require("../../models/tour.models");

module.exports.cart = (req, res) => {
  res.render("client/pages/cart", {
    pageTitle: "Giỏ hàng",
  });
};
