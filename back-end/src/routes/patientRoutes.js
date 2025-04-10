import express from "express";
import { createPatient, getAllPatients, getPatientByBookingId, updatePatient, deletePatient } from "../controllers/patientController.js";

const router = express.Router();

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:bookingId', getPatientByBookingId);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);


export default router;