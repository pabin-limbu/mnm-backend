const express = require("express");
const router = express.Router();
const { makeOrder, getOrder } = require("../controllers/orderController");

router.post("/users/getorder", getOrder);
router.post("/users/makeorder", makeOrder);

module.exports = router;
