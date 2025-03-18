import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  assignDriver,
  getDriverAssignments,
  completeBooking,
} from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdminOrStaff from "../middlewares/isAdminOrStaff.js";

const router = express.Router();

router.post("/", createBooking); // ผู้ป่วยจองรถ
router.get("/", getAllBookings); // เจ้าหน้าที่ดูการจองทั้งหมด
router.get("/:id", getBookingById); // ดูข้อมูลการจอง
router.put("/:id", updateBookingStatus); // อัปเดตสถานะ
router.delete("/:id", cancelBooking); // ยกเลิกการจอง
router.post("/assign-driver", assignDriver); //authMiddleware, isAdminOrStaff,
router.get("/driver-assignments", getDriverAssignments); //authMiddleware,
router.put("/:id/complete", completeBooking);
export default router;
