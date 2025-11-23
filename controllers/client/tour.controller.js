const { Tour } = require("../../models/tour.models");

module.exports.list = async (req, res) => {
  const toursList = await Tour.find({});

  console.log(toursList);
  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tours",
    toursList: toursList,
  });
};
