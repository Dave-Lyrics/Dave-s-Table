import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: String,
    image: String,
    quantity: Number,
    price: Number
  }],
  deliveryAddress: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ["Pending", "Incoming", "Preparing", "Ready", "Completed", "Cancelled"],
    default: "Pending"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending"
  },
  paymentReference: String
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
