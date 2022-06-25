const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  id_of: { type: String },
  sequence_number: { type: Number },
});
module.exports = mongoose.model("Counter", counterSchema);
