const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ message: "success", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    res.json({ message: "success", data: user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        fullName,
        email,
        role,
      },
    });

    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.createUser = async (req, res) => {
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
