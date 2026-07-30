const Joi = require('joi');

module.exports.websiteInfoPatch = async (req, res, next) => {
  const schema = Joi.object({
    websiteName: Joi.string()
      .required()
      .messages({
        "string.empty": "Please enter website name!",
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .allow('')
      .messages({
        "string.pattern.base": "Phone number must be 10-11 digits!",
      }),
    email: Joi.string()
      .email()
      .allow('')
      .messages({
        "string.email": "Email is not valid!",
      }),
    address: Joi.string()
      .allow(''),
    logo: Joi.string()
      .allow(''),
    favicon: Joi.string()
      .allow(''),
    categoryIdSection4: Joi.string()
      .allow(''),
    categoryIdSection6: Joi.string()
      .allow(''),
    backgroundSection1: Joi.string()
      .allow(''),
    bannersSection3: Joi.array()
      .items(Joi.string())
      .allow(null),
    bannerSection5: Joi.string()
      .allow(''),
    bannerSection7: Joi.string()
      .allow(''),
    workingHours: Joi.string()
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

module.exports.accountAdminCreatePost = async (req, res, next) => {
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
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.empty": "Please enter password!",
        "string.min": "Password must be at least 8 characters!",
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .allow('')
      .messages({
        "string.pattern.base": "Phone number must be 10-11 digits!",
      }),
    role: Joi.string()
      .allow(''),
    positionCompany: Joi.string()
      .allow(''),
    status: Joi.string()
      .valid('initial', 'active', 'inactive')
      .required()
      .messages({
        "string.empty": "Please select status!",
        "any.only": "Invalid status!",
      }),
    avatar: Joi.string().allow(''),
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

module.exports.accountAdminEditPatch = async (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().allow(''),
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
    role: Joi.string()
      .allow(''),
    positionCompany: Joi.string()
      .allow(''),
    status: Joi.string()
      .valid('initial', 'active', 'inactive')
      .required()
      .messages({
        "string.empty": "Please select status!",
        "any.only": "Invalid status!",
      }),
    password: Joi.string()
      .min(8)
      .allow('')
      .messages({
        "string.min": "Password must be at least 8 characters!",
      }),
    avatar: Joi.string().allow(''),
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

module.exports.roleCreatePost = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Please enter role name!",
        "string.min": "Role name must be at least 3 characters!",
        "string.max": "Role name must not exceed 50 characters!",
      }),
    description: Joi.string()
      .allow('')
      .max(200)
      .messages({
        "string.max": "Description must not exceed 200 characters!",
      }),
    permissions: Joi.alternatives()
      .try(
        Joi.array().items(Joi.string()),
        Joi.string()
      )
      .default([]),
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

module.exports.roleEditPatch = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Please enter role name!",
        "string.min": "Role name must be at least 3 characters!",
        "string.max": "Role name must not exceed 50 characters!",
      }),
    description: Joi.string()
      .allow('')
      .max(200)
      .messages({
        "string.max": "Description must not exceed 200 characters!",
      }),
    permissions: Joi.alternatives()
      .try(
        Joi.array().items(Joi.string()),
        Joi.string()
      )
      .default([]),
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
