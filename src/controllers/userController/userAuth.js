const User = require("../../models/user");
const jwt = require("jsonwebtoken");
//signup User
exports.signUpUser = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ message: "User Already Exist" });
    } else if (err) {
      return res
        .status(400)
        .json({ message: "something went wrong LOCATION:userAuth" });
    } else {
      const { firstName, lastName, email, password } = req.body;
      const _user = new User({
        firstName,
        lastName,
        email,
        password,
        userName: Math.random().toString(),
      });

      _user.save((err, data) => {
        if (err) {
          return res.status(400).json({ message: err });
        } else if (data) {
          return res.status(200).json({ message: "user created" });
        } else {
          return res
            .status(400)
            .json({ message: "Something went wrong LOCATON:userAuth" });
        }
      });
    }
  });
};

//signIn user
exports.signInUser = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
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
            expiresIn: "1h",
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
