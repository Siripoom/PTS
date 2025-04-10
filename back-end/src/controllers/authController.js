import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ ลงทะเบียนผู้ใช้
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, citizen_id, phone } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { citizen_id },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Citizen ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || "USER",
        citizen_id,
        phone,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      data: newUser,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error registering user", error });
  }
};

// ✅ เข้าสู่ระบบ
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, fullName: user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// ✅ ดึงข้อมูลผู้ใช้จาก JWT
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        citizen_id: true,
      },
    });

    res.json({ message: "success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile", error });
  }
};
