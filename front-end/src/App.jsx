import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Booking from "./pages/Booking/Booking";
import BookingSuccess from "./pages/Booking/BookingSuccess";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageBooking from "./pages/ManageBooking/ManageBooking";
import User from "./pages/User/User";
import ManageBookingDetail from "./pages/ManageBooking/ManageBookingDetail";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<Booking />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/manage-booking" element={<ManageBooking />} />
        <Route path="/admin/users" element={<User />} />
        <Route
          path="/admin/manage-booking/:id"
          element={<ManageBookingDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
