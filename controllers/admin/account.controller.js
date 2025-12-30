const accountAdmin = require("../../models/account-admin.models.js");

module.exports.login = (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Đăng nhập",
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
  const { fullName, email, password } = req.body;

  req.body.status = "initial";

  const newAccount = new accountAdmin(req.body);
  await newAccount.save();

  res.json({
    result: "success",
    message: "Đăng ký thành công",
  });
};

module.exports.registerInitial = (req, res) => {
  res.render("admin/pages/register-initial", {
    pageTitle: "Đăng ký",
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
