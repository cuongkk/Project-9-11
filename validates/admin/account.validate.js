const Joi = require("joi");

module.exports.loginPost = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Vui lòng nhập đúng định dạng email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Vui lòng nhập mật khẩu",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.json({
      result: "error",
      message: errorMessage,
    });
  }
  next();
};

module.exports.registerPost = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required().messages({
      "string.empty": "Vui lòng nhập họ và tên",
      "string.min": "Họ và tên phải có ít nhất 5 ký tự",
      "string.max": "Họ và tên không được vượt quá 50 ký tự",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Vui lòng nhập đúng định dạng email",
    }),
    password: Joi.string()
      .custom((value, helpers) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
        if (!passwordRegex.test(value)) {
          return helpers.error("password.invalid");
        }
        return value;
      })
      .min(6)
      .max(30)
      .required()
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu",
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
        "string.max": "Mật khẩu không được vượt quá 30 ký tự",
        "password.invalid": "Mật khẩu phải chứa ít nhất một chữ cái và một số",
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.json({
      result: "error",
      message: errorMessage,
    });
  }
  next();
};
