const Order = require("../models/order");

exports.makeOrder = async (req, res) => {
  //create order object
  req.body.orderStatus = [
    {
      type: "ordered",
      date: new Date(),
      isCompleted: true,
    },
    {
      type: "packed",
      isCompleted: false,
    },
    {
      type: "shipped",
      isCompleted: false,
    },
    {
      type: "delivered",
      isCompleted: false,
    },
  ];

  //console.log(req.body);
  const order = new Order({
    user: req.body.selectedAddress.name,
    address: { ...req.body.selectedAddress },
    totalAmount: req.body.totalAmount,
    items: req.body.cartItems,
    paymentStatus: req.body.paymentStatus,
    paymentType: req.body.payment,
    orderStatus: req.body.orderStatus,
  });

  await order.save((error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error });
    }
    if (result) {
      res.status(200).json({ orderid: result._id });
    }
  });
};

exports.getOrder = (req, res) => {
  res.send("get orders");
};
