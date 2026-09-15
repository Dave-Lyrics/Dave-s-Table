import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { registerSocketHandlers } from "./socket/socketHandler.js";


// ======================================================
// PATH SETUP
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ======================================================
// APP SETUP
// ======================================================

const app = express();
const server = http.createServer(app);


// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

app.set("io", io);

registerSocketHandlers(io);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());


// ======================================================
// API HEALTH CHECK
// ======================================================

app.get("/api/health", (_, res) => {
  res.json({
    ok: true,
    brand: "Dave's Table"
  });
});


// ======================================================
// API ROUTES
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);


// ======================================================
// SERVE REACT FRONTEND
// ======================================================

const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));


// ======================================================
// REACT SPA FALLBACK
// ======================================================

app.get("/{*splat}", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      message: "API route not found"
    });
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Server error"
  });
});


// ======================================================
// START SERVER
// ======================================================

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(() => {
    server.listen(port, "0.0.0.0", () => {
      console.log(`Dave's Table server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });