const Joi = require('joi');

module.exports.sendMessage = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.empty": "Full name is required",
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name must not exceed 100 characters",
        "any.required": "Full name is required"
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required"
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .allow('')
      .messages({
        "string.pattern.base": "Phone number must be 10-15 digits"
      }),
    subject: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        "string.empty": "Subject is required",
        "string.min": "Subject must be at least 5 characters",
        "string.max": "Subject must not exceed 200 characters",
        "any.required": "Subject is required"
      }),
    message: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        "string.empty": "Message is required",
        "string.min": "Message must be at least 10 characters",
        "string.max": "Message must not exceed 1000 characters",
        "any.required": "Message is required"
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
