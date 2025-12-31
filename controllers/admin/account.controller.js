const accountAdmin = require("../../models/account-admin.models.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng nhập",
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const existAccount = await accountAdmin.findOne({ email: email });

  if (!existAccount) {
    return res.json({
      result: "error",
      message: "Email không tồn tại trong hệ thống",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);

  if (isPasswordValid === false) {
    return res.json({
      result: "error",
      message: "Mật khẩu không đúng",
    });
  }

  if (existAccount.status === "initial") {
    return res.json({
      result: "error",
      message: "Tài khoản chưa được kích hoạt",
    });
  }

  // Tạo JWT token
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Chỉ cho phép truy cập cookie từ phía server
    sameSite: "strict", // Không gửi cookie trong các yêu cầu bên thứ ba
  });
  res.json({
    result: "success",
    message: "Đăng nhập thành công",
  });
};

module.exports.register = (req, res) => {
  res.render("admin/pages/register", {
    pageTitle: "Đăng ký",
  });
};

module.exports.registerPost = async (req, res) => {
  const existAccount = await accountAdmin.findOne({ email: req.body.email });

  if (existAccount) {
    return res.json({
      result: "error",
      message: "Email đã tồn tại, vui lòng sử dụng email khác",
    });
  }

  req.body.status = "initial";

  // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu

  req.body.password = await bcrypt.hash(req.body.password, 10);

  const newAccount = new accountAdmin(req.body);
  await newAccount.save();

  res.json({
    result: "success",
    message: "Đăng ký thành công",
  });
};

module.exports.registerInitial = (req, res) => {
  res.render("admin/pages/register-initial", {
    pageTitle: "Thành công",
  });
};

module.exports.forgotPassword = (req, res) => {
  res.render("admin/pages/forget-password", {
    pageTitle: "Quên mật khẩu",
  });
};

module.exports.otpPassword = (req, res) => {
  res.render("admin/pages/otp-password", {
    pageTitle: "Xác nhận OTP",
  });
};

module.exports.resetPassword = (req, res) => {
  res.render("admin/pages/reset-password", {
    pageTitle: "Đặt lại mật khẩu",
  });
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`/${pathAdmin}/account/login`);
};
