const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, min: 3, max: 50 },
  mobileNumber: { type: String, required: true, trim: true },
  locality: { type: String, required: true, trim: true, min: 10, max: 100 },
  address: { type: String, required: true, trim: true, min: 10, max: 100 },
  cityDistrictTown: { type: String, required: true, trim: true },
  landmark: { type: String, required: true, trim: true },
  alternatePhone: { type: String },
});
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: Number },
    user: {
      name: String,
      type: String,
    },
    address: addressSchema,
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: { type: String },
        category: { type: Object },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "card"],
      required: true,
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
