const express = require("express");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE);

const Tour = mongoose.model(
  "Tour",
  {
    name: String,
    time: String,
    vehicle: String,
  },
  "tours"
);

const app = express();
const port = 3000;

//Thiết lập thư mục chứa pug
// app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));

//Thiết lập pug làm view engine
app.set("view engine", "pug");

//Thiết lập thư mục chứa file tĩnh
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
  });
});

app.get("/tours", async (req, res) => {
  const toursList = await Tour.find({});

  console.log(toursList);
  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tours",
    toursList: toursList,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// ntuancuong2005_db_user
// onMygY1AhsddcO23
