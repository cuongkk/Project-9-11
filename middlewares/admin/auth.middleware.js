const jwt = require("jsonwebtoken");
const accountAdmin = require("../../models/account-admin.models.js");

module.exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect(`/${pathAdmin}/account/login`);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { id, email } = decode;

    const existAccount = await accountAdmin.findOne({ _id: id, email: email, status: "active" });

    if (!existAccount) {
      res.clearCookie("token");
      return res.redirect(`/${pathAdmin}/account/login`);
    }
    console.log(decode);
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect(`/${pathAdmin}/account/login`);
  }
};
