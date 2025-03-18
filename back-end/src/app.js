import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./config/db.js"; // นำ Prisma Client มาใช้
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);

// ทดสอบ API Health Check
app.get("/", async (req, res) => {
  try {
    // ทดสอบการเชื่อมต่อกับ DB
    await prisma.$connect();
    res.json({ message: "Patient Transport API is running!" });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default app;
