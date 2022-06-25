const Counter = require("../models/counter");

//only create database collection once if its not created.

exports.configCouterCollection = async () => {
    //check if document of orderid exist.
    //if not exist
    var orderCounter = await Counter.find({ id_of: "orderid" });
    if (orderCounter.length == 0) {
      const counter = new Counter({
        id_of: "orderid",
        sequence_number: 0,
      });
      counter.save((err, result) => {
        if (err) console.log(err);
        if (result) console.log(result);
      });
    }
};
