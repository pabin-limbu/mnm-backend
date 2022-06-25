const Order = require("../models/order");
const Counter = require("../models/counter");

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await Counter.findOneAndUpdate(
    { id_of: sequenceName },
    { $inc: { sequence_number: 1 } },
    { new: true }
  );
  return sequenceDocument.sequence_number;
}

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

  const order = new Order({
    user: req.body.selectedAddress.name,
    address: { ...req.body.selectedAddress },
    totalAmount: req.body.totalAmount,
    items: req.body.cartItems,
    paymentStatus: req.body.paymentStatus,
    paymentType: req.body.payment,
    orderStatus: req.body.orderStatus,
    orderId: await getNextSequenceValue("orderid"),
  });

  order.save((error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error });
    }
    if (result) {
      console.log(result);
      res.status(200).json({
        orderid: result.orderId,
      });
    }
  });
};

exports.getOrder = async (req, res) => {
  try {
    // set time interval from start of am to end of pm.
    let currentDate = new Date(req.query.orderDate);
    currentDate.setHours(0, 0, 0, 0);
    let nextDate = new Date(req.query.orderDate);
    nextDate.setHours(24, 0, 0, 0);

    const orders = await Order.find({
      createdAt: {
        $gte: currentDate,
        $lte: nextDate,
      },
    })
      // .populate({ path: "items.productId", select: "_id slug" })
      .exec();

    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await Order.findOne({ orderId })
      .select("user address totalAmount items paymentType orderId createdAt")
      .exec();
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.packOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    await Order.findOneAndUpdate(
      { _id: orderId, "orderStatus.type": "packed" },
      {
        $set: { "orderStatus.$.isCompleted": true },
      },
      { new: true },
      (err, data) => {
        if (data) {
          return res.status(200).json({ data });
        }
        if (err) {
          err.reason = "no item with such id found";
          return res.status(200).json({ err });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
