import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ReadOutlined,
  FileTextOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";
import logo from "../../assets/ambulance 1.png";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        console.log(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ตรวจสอบสิทธิ์การเข้าถึงของผู้ใช้
  const canManageUsers = ["ADMIN", "STAFF"].includes(user?.role);
  const canManageBookings = ["ADMIN", "STAFF"].includes(user?.role);
  const canViewPatients = ["ADMIN", "STAFF", "PUBLIC_HEALTH_OFFICER"].includes(
    user?.role
  );
  const canAccessDashboard = [
    "ADMIN",
    "STAFF",
    "PUBLIC_HEALTH_OFFICER",
    "EXECUTIVE",
  ].includes(user?.role);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Ambulance Logo" className="logo-icon" />
        <h2 className="logo-text">ระบบรับรถส่งผู้ป่วย</h2>
      </div>
      <nav className="sidebar-nav">
        {canAccessDashboard && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <DashboardOutlined /> <span>ภาพรวม</span>
          </NavLink>
        )}

        {canManageBookings && (
          <NavLink
            to="/admin/manage-booking"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <ReadOutlined /> <span>การจอง</span>
          </NavLink>
        )}

        {canViewPatients && (
          <NavLink
            to="/admin/patients"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <MedicineBoxOutlined /> <span>ผู้ป่วย</span>
          </NavLink>
        )}

        {canManageUsers && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <UserOutlined /> <span>ผู้ใช้งาน</span>
          </NavLink>
        )}

        <div
          className="nav-item"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <LogoutOutlined /> <span>ออกจากระบบ</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
