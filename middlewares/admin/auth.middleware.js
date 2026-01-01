const jwt = require("jsonwebtoken");
const accountAdmin = require("../../models/account-admin.models.js");

module.exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect(`/${pathAdmin}/account/login`);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email } = decode;

    const existAccount = await accountAdmin.findOne({ email: email, status: "active" });

    console.log("a");
    console.log(email);
    if (!existAccount) {
      res.clearCookie("token");
      return res.redirect(`/${pathAdmin}/account/login`);
    }
    console.log("b");

    req.account = existAccount;

    console.log(token);

    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect(`/${pathAdmin}/account/login`);
  }
};
