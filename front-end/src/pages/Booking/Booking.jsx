import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, TimePicker } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom"; // Import for redirect

const Booking = () => {
  const [location, setLocation] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login
  const navigate = useNavigate(); // For redirecting to login page

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if token exists in localStorage
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  // Get user's current location (GPS)
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Handle form submission
  const onFinish = (values) => {
    if (!isLoggedIn) {
      alert("กรุณาล็อกอินก่อนทำการจอง!");
      return;
    }
    console.log("Booking Data:", { ...values, location });
  };

  // Redirect to login page if user is not logged in
  const handleLoginRedirect = () => {
    navigate("/login"); // Replace "/login" with your login page route
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center mt-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="ambulance"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-2xl font-bold text-center text-gray-800">
              แบบฟอร์มจองรถฉุกเฉิน
            </h2>
            <p className="text-gray-600 text-center mb-3">
              กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน
            </p>
            {!isLoggedIn && (
              <div className="text-center mb-4 ">
                {/* <Button onClick={handleLoginRedirect} type="primary">
                  เข้าสู่ระบบก่อนจอง
                </Button> */}
              </div>
            )}
          </div>

          <Form
            name="booking-form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "โปรดป้อนชื่อผู้จอง" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="ชื่อผู้จอง"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="date"
              rules={[{ required: true, message: "โปรดเลือกวันจอง" }]}
            >
              <DatePicker
                className="w-full rounded-lg"
                placeholder="วันจอง"
                style={{ padding: "8px" }}
              />
            </Form.Item>

            <Form.Item
              name="time"
              rules={[{ required: true, message: "โปรดเลือกเวลา" }]}
            >
              <TimePicker
                className="w-full rounded-lg"
                placeholder="เวลาที่ต้องการให้ไปรับ"
              />
            </Form.Item>

            <Form.Item
              name="address"
              rules={[{ required: true, message: "โปรดป้อนที่อยู่" }]}
            >
              <Input placeholder="ที่อยู่" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "โปรดป้อนเบอร์โทรศัพท์" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "กรุณากรอกเบอร์โทร 10 หลัก",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="เบอร์โทรศัพท์"
                className="rounded-lg"
              />
            </Form.Item>

            {/* พิกัด */}
            <div className="flex space-x-4">
              <Form.Item className="flex-grow">
                <Input
                  prefix={<EnvironmentOutlined />}
                  placeholder="พิกัด"
                  value={location}
                  readOnly
                  className="rounded-lg"
                />
              </Form.Item>
              <Button
                onClick={handleGetLocation}
                type="default"
                className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                เรียกดูพิกัด
              </Button>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="rounded-lg py-3 text-white bg-green-600 hover:bg-green-700"
              >
                ยืนยัน
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
