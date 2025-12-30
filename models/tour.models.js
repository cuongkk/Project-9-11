const mongoose = require("mongoose");

const Tour = mongoose.model(
  "Tour",
  {
    name: String,
    time: String,
    vehicle: String,
  },
  "tours"
);

module.exports = Tour;
