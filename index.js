const express = require("express");
require("dotenv").config();
const path = require("path");
const { connectDB } = require("./configs/database.config");

const clientRoutes = require("./routes/client/index.route");

const app = express();
const port = 3000;

connectDB();
//Thiết lập thư mục chứa pug
// app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));

//Thiết lập pug làm view engine
app.set("view engine", "pug");

//Thiết lập thư mục chứa file tĩnh
app.use(express.static(path.join(__dirname, "public")));

app.use("/", clientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// ntuancuong2005_db_user
// onMygY1AhsddcO23
