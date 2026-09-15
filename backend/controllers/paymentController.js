import { paystackRequest } from "../config/paystack.js";
import Order from "../models/Order.js";
import { markPaid } from "./orderController.js";

export async function initializePayment(req, res) {
  try {
    const order = await Order.findOne({ _id: req.body.orderId, customer: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.paymentStatus === "Paid") return res.status(400).json({ message: "Order is already paid" });

    const data = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: req.user.email,
        amount: Math.round(order.totalPrice * 100),
        reference: `DT_${order._id}_${Date.now()}`,
        callback_url: process.env.PAYSTACK_CALLBACK_URL
      })
    });
    res.json({ data: data.data });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function verifyPayment(req, res) {
  try {
    const data = await paystackRequest(
      `/transaction/verify/${encodeURIComponent(req.params.reference)}`
    );

    if (data.data.status !== "success") {
      return res.status(400).json({
        message: "Payment was not successful"
      });
    }

    const order = await Order.findOne({
      _id: String(data.data.reference).split("_")[1],
      customer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found for this payment"
      });
    }

    if (
      Number(data.data.amount) !==
      Math.round(order.totalPrice * 100)
    ) {
      return res.status(400).json({
        message: "Payment amount mismatch"
      });
    }

    const io = req.app.get("io");

    const paidOrder = await markPaid(
      order._id,
      data.data.reference,
      io
    );

    res.json({
      data: paidOrder,
      message: "Payment verified and order confirmed"
    });

  } catch (e) {
    console.error("PAYMENT VERIFICATION ERROR:", e);

    res.status(500).json({
      message: e.message || "Payment verification failed"
    });
  }
}