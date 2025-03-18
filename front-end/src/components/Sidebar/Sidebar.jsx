import { NavLink } from "react-router-dom";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ReadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";
import logo from "../../assets/ambulance 1.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="IAMPYOQA Logo" className="logo-icon" />
        <h2 className="logo-text">ระบบรับรถส่งผู้ป่วย</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          activeClassName="active"
          className="nav-item"
        >
          <DashboardOutlined /> <span>ภาพรวม</span>
        </NavLink>

        <NavLink
          to="/admin/manage-booking"
          activeClassName="active"
          className="nav-item"
        >
          <ReadOutlined /> <span>การจอง</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          activeClassName="active"
          className="nav-item"
        >
          <UserOutlined /> <span>ผู้ใช้งาน</span>
        </NavLink>

        <NavLink to="/" activeClassName="active" className="nav-item">
          <LogoutOutlined /> <span>Sign Out</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
