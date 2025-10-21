const Joi = require('joi');

module.exports.createPost = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(200)
      .required()
      .messages({
        "string.empty": "Please enter a tour name!",
        "string.min": "Tour name must be at least 3 characters long!",
        "string.max": "Tour name must not exceed 200 characters!",
      }),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      "string.empty": "Please select a category!",
      "string.pattern.base": "Category is not valid!"
    }),
    position: Joi.number().integer().min(0).allow(null, ""),
    status: Joi.string().valid('active', 'inactive').default('active'),
    avatar: Joi.string().uri().allow('').messages({
      "string.uri": "Tour thumbnail must be a valid URL!"
    }),
    priceAdult: Joi.number().min(0).required().messages({
      "number.base": "Adult price must be a number!",
      "number.min": "Adult price must be at least 0!",
      "any.required": "Please enter adult price!"
    }),
    priceChildren: Joi.number().min(0).required().messages({
      "number.base": "Children price must be a number!",
      "number.min": "Children price must be at least 0!",
      "any.required": "Please enter children price!"
    }),
    priceBaby: Joi.number().min(0).required().messages({
      "number.base": "Baby price must be a number!",
      "number.min": "Baby price must be at least 0!",
      "any.required": "Please enter baby price!"
    }),
    priceNewAdult: Joi.number().min(0).required().messages({
      "number.base": "Adult discounted price must be a number!",
      "number.min": "Adult discounted price must be at least 0!",
      "any.required": "Please enter adult discounted price!"
    }),
    priceNewChildren: Joi.number().min(0).required().messages({
      "number.base": "Children discounted price must be a number!",
      "number.min": "Children discounted price must be at least 0!",
      "any.required": "Please enter children discounted price!"
    }),
    priceNewBaby: Joi.number().min(0).required().messages({
      "number.base": "Baby discounted price must be a number!",
      "number.min": "Baby discounted price must be at least 0!",
      "any.required": "Please enter baby discounted price!"
    }),
    stockAdult: Joi.number().integer().min(0).required().messages({
      "number.base": "Adult stock must be a number!",
      "number.integer": "Adult stock must be an integer!",
      "number.min": "Adult stock must be at least 0!",
      "any.required": "Please enter adult stock!"
    }),
    stockChildren: Joi.number().integer().min(0).required().messages({
      "number.base": "Children stock must be a number!",
      "number.integer": "Children stock must be an integer!",
      "number.min": "Children stock must be at least 0!",
      "any.required": "Please enter children stock!"
    }),
    stockBaby: Joi.number().integer().min(0).required().messages({
      "number.base": "Baby stock must be a number!",
      "number.integer": "Baby stock must be an integer!",
      "number.min": "Baby stock must be at least 0!",
      "any.required": "Please enter baby stock!"
    }),
    locations: Joi.string()
      .custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed) || parsed.length === 0) {
            return helpers.error('locations.empty');
          }
          return value;
        } catch (error) {
          return helpers.error('locations.invalid');
        }
      })
      .required()
      .messages({
        "string.empty": "Please select at least one departure!",
        "any.required": "Please select at least one departure!",
        "locations.empty": "Please select at least one departure!",
        "locations.invalid": "Places data is invalid!"
      }),
    time: Joi.string().max(255).required().messages({
      "string.empty": "Please enter tour duration!",
      "string.max": "Tour duration must not exceed 255 characters!"
    }),
    vehicle: Joi.string().max(255).required().messages({
      "string.empty": "Please enter vehicle information!",
      "string.max": "Vehicle information must not exceed 255 characters!"
    }),
    departureDate: Joi.date().iso().required().messages({
      "date.base": "Departure date must be a valid date!",
      "any.required": "Please select a departure date!"
    }),
    information: Joi.string().allow(''),
    schedules: Joi.string().allow(''),
    images: Joi.string().allow(''),
  })

  const { error } = schema.validate(req.body);

  if(error) {
    const errorMessage = error.details[0].message;
    
    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}