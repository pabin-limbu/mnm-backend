const express = require("express");
const router = express.Router();
const {
  makeOrder,
  getOrder,
  packOrder,
  getOrderById,
} = require("../controllers/orderController");

router.get("/order/getorderbyid", getOrderById);

router.get("/order/getorder", getOrder);
router.post("/order/makeorder", makeOrder);
router.post("/order/packorder", packOrder);

module.exports = router;
