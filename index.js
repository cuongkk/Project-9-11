const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

//Thiết lập thư mục chứa pug
// app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));

//Thiết lập pug làm view engine
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
  });
});

app.get("/tours", (req, res) => {
  res.render("client/pages/tour-list", {
    pageTitle: "Danh sách tours",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
