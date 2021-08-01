const User = require("../models/user");
const jwt = require("jsonwebtoken");

//signUp admin
exports.signUpAdmin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ message: "Admin User Already Exist" });
    } else if (err) {
      return res.status(400).json({
        message: "something went wrong LOCATION:adminAuth /Controller",
      });
    } else {
      const { firstName, lastName, email, password } = req.body;
      const _user = new User({
        firstName,
        lastName,
        email,
        password,
        userName: Math.random().toString(),
        role: "admin",
      });

      _user.save((err, data) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else if (data) {
          return res.status(200).json({ message: "Admin created" });
        } else {
          return res.status(400).json({
            message: "Something went wrong LOCATON:adminAuth /controller",
          });
        }
      });
    }
  });
};

//signIn admin
exports.signInAdmin = (req, res) => {
  User.findOne({ email: req.body.email, role: "admin" }).exec((err, user) => {
    if (err) {
      return res.status(400).json({ error });
    } else if (user) {
      //compare password
      if (user.authenticate(req.body.password)) {
        //user details
        const { firstName, lastName, email, role, fullName } = user;

        //generate token jwt
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        return res.status(200).json({
          token,
          user: { firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  });
};

//signout admin
exports.signoutAdmin = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ messgae: "signout success" });
};
