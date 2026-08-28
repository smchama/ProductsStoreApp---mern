// backend/models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },
    // --- Flags for separate history management ---
    hiddenFromAdmin: {
      type: Boolean,
      default: false,
    },
    hiddenFromUser: {
      type: Boolean,
      default: false,
    },
    // ---------------------------------------------
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;