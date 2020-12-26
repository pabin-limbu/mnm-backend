const express = require("express");
const router = express.Router();

const {
  validateUserSignUpRequest,
  isRequestValidated,
} = require("../../validators/user-auth-validator");

const { signUpAdmin, signInAdmin } = require("../../controllers/adminController/adminAuth");

router.post(
  "/admin/signup",
  validateUserSignUpRequest,
  isRequestValidated,
  signUpAdmin
);

router.post("/admin/signin", signInAdmin);

module.exports = router;
