const express = require("express");
const app = express();
const keys = require("./src/config/keys");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routers
const userAuthRouter = require("./src/routes/userRoute/userAuthRoute");
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


app.use(bodyParser.json()); //parse incoming payload into json format.
app.use("/api", userAuthRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
