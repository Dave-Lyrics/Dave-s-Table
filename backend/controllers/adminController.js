import User from "../models/User.js";
export async function dashboardStats(req, res) {
  const Order = (await import("../models/Order.js")).default;
  const MenuItem = (await import("../models/MenuItem.js")).default;
  const [orders, menu, customers] = await Promise.all([
    Order.countDocuments({}),
    MenuItem.countDocuments({}),
    User.countDocuments({ role: "customer" })
  ]);
  res.json({ data: { orders, menu, customers } });
}