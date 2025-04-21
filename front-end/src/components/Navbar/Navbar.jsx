import React, { useState, useEffect } from "react";
import { Button, Layout, Menu, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  HistoryOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // สร้าง userMenu เมื่อ user มีค่า เพื่อป้องกัน error
  const userMenu = user ? (
    <Menu>
      <Menu.Item key="patients" icon={<MedicineBoxOutlined />}>
        <Link to="/patients">จัดการข้อมูลผู้ป่วย</Link>
      </Menu.Item>
      <Menu.Item key="profile" icon={<HistoryOutlined />}>
        <Link to={`/history/${user.id}`}>ประวัติการจอง</Link>
      </Menu.Item>
      {/* เพิ่มลิงก์ไปยังแดชบอร์ดเฉพาะสำหรับผู้มีสิทธิ์ */}
      {["ADMIN", "STAFF", "PUBLIC_HEALTH_OFFICER", "EXECUTIVE"].includes(
        user.role
      ) && (
        <Menu.Item key="dashboard" icon={<HomeOutlined />}>
          <Link to="/admin/dashboard">หลังบ้าน</Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  ) : null;

  return (
    <Header
      className="bg-white shadow-md flex justify-between items-center px-6"
      style={{ backgroundColor: "white" }}
    >
      <Link to="/">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
          alt="ambulance"
          className="w-12 h-12"
        />
      </Link>
      <h1 className="text-lg font-bold text-black ml-1">ระบบรับส่งผู้ป่วย</h1>

      <Menu
        mode="horizontal"
        className="border-none flex-grow justify-center bg-white text-black"
      >
        <Menu.Item key="booking">
          <Link to="/">จองรถฉุกเฉิน</Link>
        </Menu.Item>
        {user && (
          <Menu.Item key="patients">
            <Link to="/patients">ข้อมูลผู้ป่วย</Link>
          </Menu.Item>
        )}
        <Menu.Item key="contact">
          <Link to="/contact">ติดต่อเจ้าหน้าที่</Link>
        </Menu.Item>
      </Menu>

      {user ? (
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Button type="default" className="text-black border-gray-300">
            {user.fullName} <UserOutlined />
          </Button>
        </Dropdown>
      ) : (
        <Button type="default" className="text-black border-gray-300">
          <Link to="/auth/login">ลงชื่อเข้าใช้/สมัครสมาชิก</Link>
        </Button>
      )}
    </Header>
  );
};

export default Navbar;
