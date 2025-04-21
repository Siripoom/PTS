import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientByBookingId,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, createPatient);
router.get("/", authMiddleware, getAllPatients);
router.get("/:bookingId", authMiddleware, getPatientByBookingId);
router.put("/:id", authMiddleware, updatePatient);
router.delete("/:id", authMiddleware, deletePatient);

export default router;
