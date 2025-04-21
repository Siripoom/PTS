import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "skip-browser-warning",
  },
});

// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("user").replace(/['"]+/g, "");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Function to create a new user
export const createUser = async (userData) => {
  console.log("User data:", userData);
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to login a user
// ฟังก์ชันที่ปรับปรุงแล้วสำหรับการ login
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/login", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to Update a user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to get a single user
export const getSingleUser = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get a single user with stuff
export const getSingleUserWithStuff = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/stuff`);
    console.log("User with stuff:", response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get all bookings
export const getAllBookings = async () => {
  try {
    const response = await api.get("/api/booking");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to get a single booking
export const getSingleBooking = async (bookingId) => {
  try {
    const response = await api.get(`/api/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to create a new booking
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    const response = await api.post("/api/booking", bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to update a booking
export const updateBooking = async (bookingData) => {
  console.log("Booking data:", bookingData);
  try {
    //get body from bookingData

    const response = await api.put(
      `/api/booking/${bookingData.id}`,
      bookingData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Function to delete a booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/api/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// สำหรับเพิ่มใน api.js

// Function to get all patients
export const getAllPatients = async () => {
  try {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    const response = await api.get("/api/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to get patient by booking ID
export const getPatientsByBookingId = async (bookingId) => {
  try {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    const response = await api.get(`/api/patients/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to create a new patient with location
export const createPatient = async (patientData) => {
  try {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");

    // แปลงข้อมูลละติจูดและลองติจูดเป็นตัวเลข (ถ้ามี)
    const formattedData = {
      ...patientData,
      latitude: patientData.latitude ? parseFloat(patientData.latitude) : null,
      longitude: patientData.longitude
        ? parseFloat(patientData.longitude)
        : null,
    };

    const response = await api.post("/api/patients", formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to update a patient with location
export const updatePatient = async (patientId, patientData) => {
  try {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");

    // แปลงข้อมูลละติจูดและลองติจูดเป็นตัวเลข (ถ้ามี)
    const formattedData = {
      ...patientData,
      latitude: patientData.latitude ? parseFloat(patientData.latitude) : null,
      longitude: patientData.longitude
        ? parseFloat(patientData.longitude)
        : null,
    };

    const response = await api.put(
      `/api/patients/${patientId}`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to delete a patient
export const deletePatient = async (patientId) => {
  try {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    const response = await api.delete(`/api/patients/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Function to get location by coordinates (ใช้ reverse geocoding จาก Google Maps API)
export const getAddressByCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};
