import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendEmail } from "../config/nodemailer.js";
import {
  orderConfirmation,
  newOrderAdmin
} from "../utils/emailTemplates.js";

export async function createPendingOrder(req, res) {
  try {
    const { deliveryAddress } = req.body;
    if (!deliveryAddress?.trim()) return res.status(400).json({ message: "Delivery address is required" });

    const cart = await Cart.findOne({ customer: req.user._id }).populate("items.menuItem");
    if (!cart || !cart.items.length) return res.status(400).json({ message: "Your cart is empty" });

    const items = cart.items.map(i => ({
      menuItem: i.menuItem._id,
      name: i.menuItem.name,
      image: i.menuItem.image,
      quantity: i.quantity,
      price: i.menuItem.price
    }));
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      customer: req.user._id, items, deliveryAddress, totalPrice,
      orderStatus: "Pending", paymentStatus: "Pending"
    });

    req.user.savedDeliveryAddress = deliveryAddress;
    await req.user.save();
    res.status(201).json({ data: order });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function getMyOrders(req, res) {
  res.json({ data: await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }) });
}

export async function getAllOrders(req, res) {
  const orders = await Order.find().populate("customer", "name email savedDeliveryAddress").sort({ createdAt: -1 });
  res.json({ data: orders });
}

export async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ data: order });
}

export async function cancelMyOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.orderStatus !== "Pending") return res.status(400).json({ message: "Only Pending orders can be cancelled by customers" });
  order.orderStatus = "Cancelled";
  await order.save();
  res.json({ data: order });
}

export async function updateOrderStatus(req, res) {
  const allowed = ["Incoming", "Preparing", "Ready", "Completed", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const order = await Order.findById(req.params.id).populate("customer", "name email");
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.orderStatus = req.body.status;
  await order.save();
  res.json({ data: order });
}

export async function markPaid(orderId, reference, io) {
  const order = await Order.findById(orderId)
    .populate("customer", "name email");

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "Paid") {
    return order;
  }

  order.paymentStatus = "Paid";
  order.paymentReference = reference;
  order.orderStatus = "Incoming";

  await order.save();

  // Clear customer's cart after successful payment
  await Cart.findOneAndUpdate(
    { customer: order.customer._id },
    { $set: { items: [] } }
  );

  // Notify connected admin/customer interfaces
  io?.emit("order:new", order);


  // ==========================================
  // CUSTOMER EMAIL
  // ==========================================

  if (order.customer?.email) {
    await sendEmail({
      to: order.customer.email,
      subject: "Your Dave's Table order is confirmed",
      html: orderConfirmation(order)
    });
  }


  // ==========================================
  // ADMIN EMAIL
  // ==========================================

  if (process.env.ADMIN_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New paid order at Dave's Table",
      html: newOrderAdmin(order)
    });
  }

  return order;
}