const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");

module.exports.edit = async (req, res) => {
  res.render("admin/pages/profile-edit", {
    pageTitle: "Profile",
  });
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.account.id;

    const existEmail = await AccountAdmin.findOne({
      _id: { $ne: id }, // ne: not equal
      email: req.body.email
    })

    if(existEmail) {
      res.json({
        code: "error",
        message: "Email already exists in the system!"
      })
      return;
    }

    req.body.updatedBy = id;
    
    if(req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    await AccountAdmin.updateOne({
      _id: id
    }, req.body)

    res.json({
      code: "success",
      message: "Update account successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.changePassword = async (req, res) => {
  res.render("admin/pages/profile-change-password", {
    pageTitle: "Change Password"
  });
}

module.exports.changePasswordPatch = async (req, res) => {
  try {
    const id = req.account.id;

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    req.body.updatedBy = id;

    await AccountAdmin.updateOne({
      _id: id
    }, req.body)

    res.json({
      code: "success",
      message: "Change password successfully!"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}