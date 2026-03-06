const { Tour } = require("../../models/tour.model");

module.exports.cart = (req, res) => {
  res.render("client/pages/cart", {
    pageTitle: "Giỏ hàng",
  });
};
