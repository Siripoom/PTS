import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPatient = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const {
      name,
      idCard,

      houseNumber,
      village,
      address,
      latitude,
      longitude,
    } = req.body;
    const patient = await prisma.patient.create({
      data: {
        name,
        idCard,

        houseNumber,
        village,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });
    res.status(201).json(patient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const patients = await prisma.patient.findMany();
    res.status(200).json(patients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getPatientByBookingId = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { bookingId } = req.params;
    const patients = await prisma.patient.findMany({
      where: { bookingId },
    });
    res.status(200).json(patients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    const { name, idCard, houseNumber, village, address, latitude, longitude } =
      req.body;
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        name,
        idCard,
        houseNumber,
        village,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      },
    });
    res.status(200).json(patient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { id } = req.params;
    await prisma.patient.delete({ where: { id } });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
