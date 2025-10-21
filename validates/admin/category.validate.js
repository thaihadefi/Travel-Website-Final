const Joi = require('joi');

module.exports.createPost = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.empty": "Please enter a category name!",
        "string.min": "Category name must be at least 3 characters long!",
        "string.max": "Category name must not exceed 100 characters!",
      }),
    parent: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow("").messages({
      "string.pattern.base": "Parent category is not valid!"
    }),
    position: Joi.number().integer().min(0).allow(null, ""),
    status: Joi.string().valid("active", "inactive").default("active"),
    avatar: Joi.string().uri().allow(""),
    description: Joi.string().max(1000).allow(""),
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