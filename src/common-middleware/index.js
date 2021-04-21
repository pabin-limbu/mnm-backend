const jwt = require("jsonwebtoken");

//middleware to vallidate if user is logged-in
exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET); // conditional verification needed if wrong jwt.
    //  console.log(user);
    //req.body.user = user; // decrypt jwt token and attactch user to the req obj.
    req.user = user; // decrypt jwt token and attactch user to the req obj.
    next();
  } else {
    return res.status(400).json({ message: "authorization required" });
  }
};

exports.isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    //   console.log(req.body.role);
    return res
      .status(400)
      .json({ message: " USER ACCESS DENIED " + req.user.role });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    //   console.log(req.body.role);  
    return res.status(400).json({ message: " ADMIN ACCESS DENIED" });
  }
  next();
};
