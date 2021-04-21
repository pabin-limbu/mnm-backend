const express = require("express");
const router = express.Router();

const {
  validateUserSignUpRequest,
  isRequestValidated,
} = require("../validators/user-auth-validator");

const { signUpAdmin, signInAdmin, signoutAdmin } = require("../controllers/adminAuth");

router.post(
  "/admin/signup",
  validateUserSignUpRequest,
  isRequestValidated,
  signUpAdmin
);

router.post("/admin/signin", signInAdmin);
router.post("/admin/signout", signoutAdmin);

module.exports = router;
