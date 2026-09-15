import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../config/nodemailer.js";
import { resetPasswordEmail } from "../utils/emailTemplates.js";

function tokenFor(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function setSession(res, user) {
  res.cookie("token", tokenFor(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      name, email, password: await bcrypt.hash(password, 12), role: "customer"
    });
    setSession(res, user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function login(req, res) {
  try {
    const { email, password, expectedRole } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
    if (expectedRole && user.role !== expectedRole) return res.status(403).json({ message: "This account cannot access this area" });
    setSession(res, user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, savedDeliveryAddress: req.user.savedDeliveryAddress } });
}

export async function adminSignup(req, res) {
  try {
    // if (await User.exists({ role: "admin" })) return res.status(409).json({ message: "The admin account already exists. Please log in." });
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: "admin" });
    setSession(res, user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
}

export async function adminStatus(req, res) {
  res.json({ exists: Boolean(await User.exists({ role: "admin" })) });
}

export async function forgotPassword(req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email?.toLowerCase()
    });

    if (!user) {
      return res.json({
        message: "If the account exists, a reset code has been sent."
      });
    }

    const code = String(
      crypto.randomInt(100000, 1000000)
    );

    user.resetCodeHash = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    user.resetCodeExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Dave's Table password reset",
      html: resetPasswordEmail(user.name, code)
    });

    res.json({
      message: "If the account exists, a reset code has been sent."
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    const hash = crypto.createHash("sha256").update(code || "").digest("hex");
    if (!user || user.resetCodeHash !== hash || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }
    user.password = await bcrypt.hash(password, 12);
    user.resetCodeHash = undefined;
    user.resetCodeExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (e) { res.status(500).json({ message: e.message }); }
}