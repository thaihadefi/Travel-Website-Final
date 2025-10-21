const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { generateRandomNumber } = require("../../helpers/generate.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const mailHelper = require("../../helpers/mail.helper");

module.exports.login = async (req, res) => {
  res.render("admin/pages/login", {
    pageTitle: "Login"
  });
}

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  })

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email does not exist in the system!"
    })
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);

  if(!isPasswordValid) {
    res.json({
      code: "error",
      message: "Password is incorrect!"
    })
    return;
  }

  if(existAccount.status != "active") {
    res.json({
      code: "error",
      message: "Account is not activated!"
    })
    return;
  }

  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? "7d" : "1d"
    }
  );

  res.cookie("token", token, {
    maxAge: rememberPassword ? (7 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Login successful!"
  })
}

module.exports.register = async (req, res) => {
  res.render("admin/pages/register", {
    pageTitle: "Register"
  });
}

module.exports.registerPost = async (req, res) => {
  const existAccount = await AccountAdmin.findOne({
    email: req.body.email
  })

  if(existAccount) {
    res.json({
      code: "error",
      message: "Email already exists in the system!"
    })
    return;
  }

  req.body.status = "initial";

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const newAccount = new AccountAdmin(req.body);
  await newAccount.save();

  res.json({
    code: "success",
    message: "Register account successfully!"
  })
}

module.exports.registerInitial = async (req, res) => {
  res.render("admin/pages/register-initial", {
    pageTitle: "Account has been created"
  });
}

module.exports.forgotPassword = async (req, res) => {
  res.render("admin/pages/forgot-password", {
    pageTitle: "Forgot Password"
  });
}

module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  // Check if email exists in the database
  const existAccount = await AccountAdmin.findOne({
    email: email,
    status: "active"
  })

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email does not exist in the system!"
    })
    return;
  }

  // Check if email exists in ForgotPassword
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  })

  if(existEmailInForgotPassword) {
    res.json({
      code: "error",
      message: "Please send the request again after 5 minutes!"
    })
    return;
  }

  // Create OTP 
  const otp = generateRandomNumber(6);

  // Save to database: email and otp (expire in 5 minutes)
  const newRecord = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + 5*60*1000
  });
  await newRecord.save();

  // Send OTP to email
  const title = `OPT for password recovery`;
  const content = `Your OTP is <b style="color: green; font-size: 20px;">${otp}</b>. The OTP is valid for 5 minutes, please do not provide it to anyone.`;
  mailHelper.sendMail(email, title, content);

  res.json({
    code: "success",
    message: "OTP has been sent to your email!"
  })
}

module.exports.otpPassword = async (req, res) => {
  res.render("admin/pages/otp-password", {
    pageTitle: "Enter OTP"
  });
}

module.exports.otpPasswordPost = async (req, res) => {
  const { email, otp } = req.body;

  // Check if email exists in database
  const existAccount = await AccountAdmin.findOne({
    email: email,
    status: "active"
  })

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email does not exist in the system!"
    })
    return;
  }

  // Verify OTP
  const existRecordInForgotPassword = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  })

  if(!existRecordInForgotPassword) {
    res.json({
      code: "error",
      message: "OTP is invalid!"
    })
    return;
  }

  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Authentication successful!"
  })
}

module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/reset-password", {
    pageTitle: "Reset Password"
  });
}

module.exports.resetPasswordPost = async (req, res) => {
  const { password } = req.body;

  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  await AccountAdmin.updateOne({
    _id: req.account.id
  }, {
    password: hashPassword
  });

  res.json({
    code: "success",
    message: "Password has been changed successfully!"
  })
}

module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Logged out successfully!"
  })
}