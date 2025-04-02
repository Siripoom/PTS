import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
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
