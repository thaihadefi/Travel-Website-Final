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

module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required(),
  phone: Joi.string().required(),
  // Allow optional order note
  note: Joi.string().allow('').optional(),
  paymentMethod: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        tourId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        locationFrom: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
          'string.pattern.base': 'Please select a valid departure location for each tour.'
        }),
        quantityAdult: Joi.number().integer().min(0).required(),
        quantityChildren: Joi.number().integer().min(0).required(),
        quantityBaby: Joi.number().integer().min(0).required()
      }).custom((value, helpers) => {
        const total = (value.quantityAdult || 0) + (value.quantityChildren || 0) + (value.quantityBaby || 0);
        if (total <= 0) {
          return helpers.message('Total passengers must be greater than 0');
        }
        return value;
      })
    ).min(1).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.reduce((acc, err) => {
      acc[err.path.join('.')] = err.message;
      return acc;
    }, {});

    // Return message field for client compatibility
    const firstError = error.details[0]?.message || 'Invalid data';
    res.json({
      code: 'error',
      message: firstError,
      errors: errors
    });
    return;
  }

  next();
};
