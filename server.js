const express = require("express");
const app = express();
const keys = require("./src/config/keys");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

//routers
const userAuthRouter = require("./src/routes/userAuthRoute");
const adminAuthRouter = require("./src/routes/adminAuthRoute");
const categoryRouter = require("./src/routes/categoryRoute");
const productRouter = require("./src/routes/productRoute");
const cartRouter = require("./src/routes/cartRoute");
const initialDataRouter = require("./src/routes/initialdataRoute");
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
app.use(cors());
app.use(bodyParser.json()); //parse incoming payload into json format.
//expose static file to browser like upload file where images are stored.
app.use("/public", express.static(path.join(__dirname, "src/uploads")));
app.use("/api", userAuthRouter);
app.use("/api", adminAuthRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/api", initialDataRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
