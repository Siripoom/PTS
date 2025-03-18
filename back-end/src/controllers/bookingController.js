import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ สร้างการจองรถ
export const createBooking = async (req, res) => {
  try {
    const { pickupTime, pickupLat, pickupLng, pickupDate } = req.body;
    const userId = req.user.id; // ดึงจาก Token

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        pickupTime: new Date(pickupTime),
        pickupLat,
        pickupLng,
        pickupDate,
        status: "PENDING",
      },
    });

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// ✅ ดึงรายการจองทั้งหมด (สำหรับเจ้าหน้าที่)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        User: { select: { fullName: true, email: true } },
        Driver: { select: { fullName: true } },
      },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// ✅ ดึงรายละเอียดการจองตาม ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        User: { select: { fullName: true, email: true } },
        Driver: { select: { fullName: true } },
      },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving booking", error });
  }
};

// ✅ อัปเดตสถานะการจอง (เจ้าหน้าที่เปลี่ยนสถานะ หรือมอบหมายคนขับ)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverId, isCancelled } = req.body;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status, driverId, isCancelled },
    });

    res.json({ message: "Booking status updated", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};

// ✅ ยกเลิกการจอง
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    res.json({ message: "Booking cancelled", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error });
  }
};

// ✅ มอบหมายงานให้คนขับ
export const assignDriver = async (req, res) => {
  try {
    const { bookingId, driverId } = req.body;
    const assignedBy = req.user.id; // เจ้าหน้าที่ที่มอบหมาย

    // ตรวจสอบว่ามีการจองนี้หรือไม่
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ตรวจสอบว่าคนขับมีอยู่จริง
    const driver = await prisma.user.findUnique({
      where: { id: driverId, role: "DRIVER" },
    });
    if (!driver)
      return res
        .status(400)
        .json({ message: "Driver not found or invalid role" });

    // อัปเดตการจอง
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        driverId,
        assignedBy,
        status: "ASSIGNED",
      },
    });

    res.json({
      message: "Driver assigned successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Error assigning driver", error });
  }
};

export const getDriverAssignments = async (req, res) => {
  try {
    const driverId = req.user.id;

    const assignments = await prisma.booking.findMany({
      where: { driverId, status: "ASSIGNED" },
      include: {
        User: { select: { fullName: true, email: true } },
      },
    });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params; // รับค่า bookingId จาก URL
    const driverId = req.user.id; // ดึง ID ของคนขับจาก Token

    // ตรวจสอบว่าการจองมีอยู่จริง และเป็นของคนขับที่กำลังล็อกอินอยู่
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.driverId !== driverId) {
      return res.status(403).json({
        message: "Unauthorized: You are not assigned to this booking",
      });
    }

    // อัปเดตสถานะเป็น COMPLETED และบันทึกเวลาปิดงาน
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    res.json({
      message: "Booking completed successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Error completing booking", error });
  }
};
