const Joi = require('joi');

module.exports.editPatch = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(5)
      .max(50)
      .required()
      .messages({
        "string.empty": "Please enter full name!",
        "string.min": "Full name must be at least 5 characters!",
        "string.max": "Full name must not exceed 50 characters!",
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Please enter email!",
        "string.email": "Email is not valid!",
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .allow('')
      .messages({
        "string.pattern.base": "Phone number must be 10-11 digits!",
      }),
    positionCompany: Joi.string()
      .allow(''),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message
    })
    return;
  }

  next();
}

module.exports.changePasswordPatch = async (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        "string.empty": "Please enter current password!",
      }),
    newPassword: Joi.string()
      .min(8)
      .custom((value, helpers) => {
        if(!/[A-Z]/.test(value)) {
          return helpers.error('password.uppercase');
        }
        if(!/[a-z]/.test(value)) {
          return helpers.error('password.lowercase');
        }
        if(!/\d/.test(value)) {
          return helpers.error('password.number');
        }
        return value;
      })
      .required()
      .messages({
        "string.empty": "Please enter new password!",
        "string.min": "New password must be at least 8 characters!",
        "password.uppercase": "New password must contain at least one uppercase letter!",
        "password.lowercase": "New password must contain at least one lowercase letter!",
        "password.number": "New password must contain at least one number!",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        "string.empty": "Please confirm password!",
        "any.only": "Confirm password does not match!",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    res.json({
      code: "error",
      message: error.details[0].message
    })
    return;
  }

  next();
}
