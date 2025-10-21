const Joi = require('joi');

module.exports.editPatch = async (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty": "Please enter full name!",
        "string.min": "Full name must be at least 2 characters!",
        "string.max": "Full name must not exceed 100 characters!",
      }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .required()
      .messages({
        "string.empty": "Please enter phone number!",
        "string.pattern.base": "Phone number must be 10-11 digits!",
      }),
    note: Joi.string()
      .allow('')
      .max(500)
      .messages({
        "string.max": "Note must not exceed 500 characters!",
      }),
    status: Joi.string()
      .valid('initial', 'confirmed', 'canceled', 'completed')
      .required()
      .messages({
        "string.empty": "Please select status!",
        "any.only": "Invalid status!",
      }),
    paymentMethod: Joi.string()
      .valid('cash', 'zalopay', 'vnpay', 'bank-transfer')
      .required()
      .messages({
        "string.empty": "Please select payment method!",
        "any.only": "Invalid payment method!",
      }),
    paymentStatus: Joi.string()
      .valid('unpaid', 'paid')
      .required()
      .messages({
        "string.empty": "Please select payment status!",
        "any.only": "Invalid payment status!",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    req.flash("error", errors);
    res.redirect("back");
    return;
  }

  next();
}
