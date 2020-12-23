const express = require("express");
const router = express.Router();
const {
  validateUserSignUpRequest,
  isRequestValidated,
} = require("../../validators/user-auth-validator");

const {
  signUpUser,
  signInUser,
} = require("../../controllers/userController/userAuth");

router.post(
  "/user/signup",
  validateUserSignUpRequest,
  isRequestValidated,
  signUpUser
);
router.post("/user/signin", signInUser);

module.exports = router;
