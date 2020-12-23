const { check, validationResult } = require("express-validator");
exports.validateUserSignUpRequest = [
  check("firstName").notEmpty().withMessage("first Name is required"),
  check("lastName").notEmpty().withMessage("last Name is Required"),
  check("email").notEmpty().withMessage("Email is required"),
  check("email").isEmail().withMessage("Valid Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password Must be 6 character long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
