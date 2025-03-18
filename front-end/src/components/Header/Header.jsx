import { Avatar, Dropdown, Menu, Breadcrumb } from "antd";
import "./Header.css";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { HomeOutlined } from "@ant-design/icons";
const Header = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้เพื่อดึง path ปัจจุบัน
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ตรวจสอบ token หรือข้อมูลผู้ใช้จาก localStorage
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username"); // สมมติว่า username ถูกเก็บไว้
    if (token && username) {
      setUser(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // ฟังก์ชันแปลง path ปัจจุบันเป็น Breadcrumb
  const generateBreadcrumb = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        {pathSnippets.map((value, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          return (
            <Breadcrumb.Item key={url}>
              <Link to={url}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  return (
    <div className="dashboard-header">
      <div className="header-left">
        <h3 className="title mb-1">{title}</h3>

        {generateBreadcrumb()}
      </div>

      <div className="header-user">
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
