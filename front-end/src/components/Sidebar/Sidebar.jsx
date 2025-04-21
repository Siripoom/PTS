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
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // decode token
        setUser(decodedToken); // ตั้งค่า user
        console.log(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      // ถ้าไม่มี token ให้นำทางกลับไปยังหน้า login
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ตรวจสอบว่าเป็น ADMIN หรือ STUFF หรือไม่
  const isAdminOrStuff = user?.role === "ADMIN" || user?.role === "STAFF";

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Ambulance Logo" className="logo-icon" />
        <h2 className="logo-text">ระบบรับรถส่งผู้ป่วย</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <DashboardOutlined /> <span>ภาพรวม</span>
        </NavLink>

        {/* แสดงเฉพาะเมื่อเป็น ADMIN หรือ STUFF */}
        {isAdminOrStuff && (
          <>
            <NavLink
              to="/admin/manage-booking"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <ReadOutlined /> <span>การจอง</span>
            </NavLink>

            <NavLink
              to="/admin/patients"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <MedicineBoxOutlined /> <span>ผู้ป่วย</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <UserOutlined /> <span>ผู้ใช้งาน</span>
            </NavLink>
          </>
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
