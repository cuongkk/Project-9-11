module.exports.list = (req, res) => {
  res.render("admin/pages/setting", {
    pageTitle: "Cài đặt",
  });
};

module.exports.infoWeb = (req, res) => {
  res.render("admin/pages/info-web", {
    pageTitle: "Thông tin website",
  });
};

module.exports.accountAdminList = (req, res) => {
  res.render("admin/pages/account-admin-list", {
    pageTitle: "Quản lý tài khoản quản trị",
  });
};

module.exports.accountAdminCreate = (req, res) => {
  res.render("admin/pages/account-admin-create", {
    pageTitle: "Tạo tài khoản quản trị",
  });
};

module.exports.roleList = (req, res) => {
  res.render("admin/pages/role-list", {
    pageTitle: "Quản lý nhóm quyền",
  });
};

module.exports.roleCreate = (req, res) => {
  res.render("admin/pages/role-create", {
    pageTitle: "Tạo nhóm quyền",
  });
};
