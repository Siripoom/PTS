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
import PatientManagement from "./pages/ManagePatients/ManagePatients";
import PatientForm from "./pages/PatientForm/PatientForm"; // นำเข้าคอมโพเนนต์ PatientForm
import ContactUs from "./pages/Contact/Contact";
import History from "./pages/History/้History";

// Protected Route Component สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
const ProtectedUserRoute = ({ children }) => {
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
        // ผู้ใช้ที่เข้าสู่ระบบแล้วทุกคนมีสิทธิ์เข้าถึง
        setIsAuthorized(true);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthorized(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }

  return isAuthorized ? children : <Navigate to="/auth/login" replace />;
};

// Protected Route Component สำหรับ Admin และ Staff
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
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
};

// Protected Route Component สำหรับเจ้าหน้าที่กู้ชีพ
const ProtectedHealthOfficerRoute = ({ children }) => {
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
        // Allow ADMIN, STAFF and PUBLIC_HEALTH_OFFICER roles
        if (
          ["ADMIN", "STAFF", "PUBLIC_HEALTH_OFFICER"].includes(decoded.role)
        ) {
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
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }

  return isAuthorized ? children : <Navigate to="/" replace />;
};

// Protected Route Component สำหรับผู้บริหาร
const ProtectedExecutiveRoute = ({ children }) => {
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
        // Allow ADMIN, STAFF, PUBLIC_HEALTH_OFFICER and EXECUTIVE roles
        if (
          ["ADMIN", "STAFF", "PUBLIC_HEALTH_OFFICER", "EXECUTIVE"].includes(
            decoded.role
          )
        ) {
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

        {/* Protected User Routes - ผู้ใช้ที่เข้าสู่ระบบแล้วเท่านั้น */}
        <Route
          path="/patients"
          element={
            <ProtectedUserRoute>
              <PatientForm />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/history/:id"
          element={
            <ProtectedUserRoute>
              <History />
            </ProtectedUserRoute>
          }
        />

        {/* Dashboard Route - สำหรับผู้ดูแลระบบ เจ้าหน้าที่ และผู้บริหาร */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedExecutiveRoute>
              <Dashboard />
            </ProtectedExecutiveRoute>
          }
        />

        {/* Booking Management Routes - สำหรับเจ้าหน้าที่ และผู้ดูแลระบบ */}
        <Route
          path="/admin/manage-booking"
          element={
            <ProtectedHealthOfficerRoute>
              <ManageBooking />
            </ProtectedHealthOfficerRoute>
          }
        />
        <Route
          path="/admin/manage-booking/:id"
          element={
            <ProtectedHealthOfficerRoute>
              <ManageBookingDetail />
            </ProtectedHealthOfficerRoute>
          }
        />

        {/* User Management Routes - สำหรับผู้ดูแลระบบและเจ้าหน้าที่เท่านั้น */}
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <User />
            </ProtectedAdminRoute>
          }
        />

        {/* Patient Management Routes - สำหรับเจ้าหน้าที่และผู้ดูแลระบบ */}
        <Route
          path="/admin/patients"
          element={
            <ProtectedHealthOfficerRoute>
              <PatientManagement />
            </ProtectedHealthOfficerRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
