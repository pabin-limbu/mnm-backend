const express = require("express");
const app = express();
const keys = require("./src/config/keys");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//routers
const userAuthRouter = require("./src/routes/userRoute/userAuthRoute");
const adminAuthRouter = require("./src/routes/adminRoute/adminAuthRoute");
const categoryRouter = require("./src/routes/categoryRoute/categoryRoute");
const productRouter = require("./src/routes/productRoute/productRoute");
const cartRouter = require("./src/routes/cartRoute/cartRoute");
//connect mongo db.
mongoose
  .connect(keys.mongodb.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
  });
app.use(cors());;
app.use(bodyParser.json()); //parse incoming payload into json format.
app.use("/api", userAuthRouter);
app.use("/api", adminAuthRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
