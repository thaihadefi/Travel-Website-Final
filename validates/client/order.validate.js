const Joi = require('joi');

module.exports.trackPost = (req, res, next) => {
  const schema = Joi.object({
    orderCode: Joi.string()
      .pattern(/^OD[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "Order code is required",
        "string.pattern.base": "Order code must be in format OD + 10 digits (e.g., OD1234567890)",
        "any.required": "Order code is required"
      }),
    phone: Joi.string()
      .pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number is not in the correct format",
        "any.required": "Phone number is required"
      })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.reduce((acc, err) => {
      acc[err.path[0]] = err.message;
      return acc;
    }, {});
    
    res.json({
      code: "error",
      errors: errors
    });
    return;
  }

  next();
};
