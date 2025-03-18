import React from "react";
import { Menu, Button, Layout } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;

const Navbar = () => {
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
        {/* <Menu.Item key="history">
          <Link to="/history">History</Link>
        </Menu.Item> */}
        <Menu.Item key="contact">
          <Link to="/contact">ติดต่อเจ้าหน้าที่</Link>
        </Menu.Item>
      </Menu>

      <Button type="default" className="text-black border-gray-300">
        <Link to="/auth/login">ลงชื่อเข้าใช้/สมัครสมาชิก</Link>
      </Button>
    </Header>
  );
};

export default Navbar;
