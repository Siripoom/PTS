import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
// ✅ สร้างการจองรถ
export const createBooking = async (req, res) => {
  try {
    const { pickupTime, pickupLat, pickupLng } = req.body;
    const pickupTimeParsed = dayjs(pickupTime);
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in token" });
    }

    if (!pickupTime || !pickupLat || !pickupLng) {
      return res
        .status(400)
        .json({ message: "Missing pickupTime or location data" });
    }

    const origin = "19.9315402,99.2209747"; // โรงพยาบาล
    const destination = `${pickupLat},${pickupLng}`;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
    const response = await axios.get(url);

    if (
      !response.data.routes ||
      !response.data.routes[0] ||
      !response.data.routes[0].legs[0]
    ) {
      return res
        .status(400)
        .json({ message: "Could not calculate distance from Google API" });
    }

    const distanceInMeters = response.data.routes[0].legs[0].distance.value;
    const duration = response.data.routes[0].legs[0].duration.value;
    const distanceInKm = distanceInMeters / 1000; // 🔁 แปลงเมตรเป็นกิโลเมตร
    const newBooking = await prisma.booking.create({
      data: {
        userId,
        pickupTime: pickupTimeParsed.toDate(),
        pickupDate: pickupTimeParsed.toDate(),
        pickupLat,
        pickupLng,
        distance: Number(distanceInKm.toFixed(2)), // 🔢 ปัดเศษเป็น 2 ตำแหน่ง
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
    // read ascending

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        User: { select: { fullName: true, phone: true } },
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
    console.log("Booking ID:", id);
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        User: { select: { fullName: true, phone: true } },
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
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
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

    const updatedBooking = await prisma.booking.delete({
      where: { id },
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
