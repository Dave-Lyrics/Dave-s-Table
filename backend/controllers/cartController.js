import Cart from "../models/Cart.js";
import MenuItem from "../models/MenuItem.js";

async function getOrCreate(userId) {
  let cart = await Cart.findOne({ customer: userId });
  if (!cart) cart = await Cart.create({ customer: userId, items: [] });
  return cart;
}

export async function getCart(req, res) {
  const cart = await getOrCreate(req.user._id);
  await cart.populate("items.menuItem");
  res.json({ data: cart });
}

export async function addToCart(req, res) {
  const { menuItemId, quantity = 1 } = req.body;
  const menu = await MenuItem.findById(menuItemId);
  if (!menu || !menu.availability) return res.status(400).json({ message: "Item is unavailable" });

  const cart = await getOrCreate(req.user._id);
  const existing = cart.items.find(i => i.menuItem.toString() === menuItemId);
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ menuItem: menuItemId, quantity: Number(quantity) });
  await cart.save();
  await cart.populate("items.menuItem");
  res.json({ data: cart });
}

export async function updateCartItem(req, res) {
  const cart = await getOrCreate(req.user._id);
  const item = cart.items.find(i => i.menuItem.toString() === req.params.menuItemId);
  if (!item) return res.status(404).json({ message: "Cart item not found" });
  item.quantity = Math.max(1, Number(req.body.quantity));
  await cart.save();
  await cart.populate("items.menuItem");
  res.json({ data: cart });
}

export async function removeCartItem(req, res) {
  const cart = await getOrCreate(req.user._id);
  cart.items = cart.items.filter(i => i.menuItem.toString() !== req.params.menuItemId);
  await cart.save();
  await cart.populate("items.menuItem");
  res.json({ data: cart });
}