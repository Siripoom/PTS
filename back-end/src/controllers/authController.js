const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ ลงทะเบียนผู้ใช้
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, citizen_id } = req.body;

    // ตรวจสอบเลขบัตรประชาชนว่ามีอยู่หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { citizen_id },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Citizen ID already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || "USER",
        citizen_id,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// ✅ เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// ✅ ดึงข้อมูลผู้ใช้จาก JWT
exports.getUserProfile = async (req, res) => {
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
