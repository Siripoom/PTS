import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  createUser,
  getAllStuff,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.get("/stuff", getAllStuff);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/", createUser);

export default router;
