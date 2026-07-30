const Joi = require('joi');

module.exports.searchGet = (req, res, next) => {
  const schema = Joi.object({
    locationTo: Joi.string().allow('').optional(),
    locationFrom: Joi.string().allow('').optional(),
    departureDate: Joi.date()
      .min('2000-01-01')
      .max('2099-12-31')
      .allow('')
      .optional()
      .messages({
        "date.min": "Departure date must be from year 2000 onwards",
        "date.max": "Departure date must be before year 2100",
        "date.base": "Departure date is not valid"
      }),
    stockAdult: Joi.number().integer().min(0).allow('').optional(),
    stockChildren: Joi.number().integer().min(0).allow('').optional(),
    stockBaby: Joi.number().integer().min(0).allow('').optional(),
    price: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).allow('').optional()
  });

  const { error } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    // Invalid query params: drop them and show the plain search page
    res.redirect("/search");
    return;
  }

  next();
};
