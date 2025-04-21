import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Booking from "./pages/Booking/Booking";
import BookingSuccess from "./pages/Booking/BookingSuccess";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageBooking from "./pages/ManageBooking/ManageBooking";
import User from "./pages/User/User";
import ManageBookingDetail from "./pages/ManageBooking/ManageBookingDetail";
import PatientManagement from "./pages/ManagePatients/ManagePatients"; // เพิ่มการนำเข้า
import ContactUs from "./pages/Contact/Contact";
import History from "./pages/History/้History";

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        // Allow only ADMIN and STAFF roles
        if (decoded.role === "ADMIN" || decoded.role === "STAFF") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthorized(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    // You could return a loading spinner here
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<Booking />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/history/:id" element={<History />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/manage-booking"
          element={
            <ProtectedAdminRoute>
              <ManageBooking />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <User />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/manage-booking/:id"
          element={
            <ProtectedAdminRoute>
              <ManageBookingDetail />
            </ProtectedAdminRoute>
          }
        />
        {/* เพิ่มเส้นทางไปยังหน้าจัดการผู้ป่วย */}
        <Route
          path="/admin/patients"
          element={
            <ProtectedAdminRoute>
              <PatientManagement />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
