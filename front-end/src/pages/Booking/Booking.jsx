import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom"; // For redirecting to login page
import { createBooking } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const Booking = () => {
  const [location, setLocation] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Check if user is logged in on component mount and get user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setIsLoggedIn(true);

        // Pre-fill form with user's name if available
        if (decodedToken.fullName) {
          form.setFieldsValue({
            name: decodedToken.fullName,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [form]);

  // Get user's current location (GPS)
  const handleGetLocation = () => {
    message.loading("กำลังดึงพิกัดปัจจุบัน...", 1);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          message.success("ดึงพิกัดสำเร็จ");
        },
        (error) => {
          console.error("Error getting location:", error);
          message.error("ไม่สามารถดึงพิกัดได้ กรุณาลองใหม่อีกครั้ง");
        }
      );
    } else {
      message.error("เบราว์เซอร์ของคุณไม่รองรับการใช้งานพิกัด");
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    if (!isLoggedIn) {
      message.error("กรุณาล็อกอินก่อนทำการจอง!");
      navigate("/auth/login");
      return;
    }

    try {
      setLoading(true);

      // แยกละติจูดและลองจิจูด
      const [pickupLat, pickupLng] = location
        ? location.split(",").map((val) => parseFloat(val.trim()))
        : [null, null];

      // สร้าง pickupTime เป็น ISO string (รวมวันที่ + เวลา)
      const pickupDate = values.pickupDate.format("YYYY-MM-DD");
      const pickupTime = values.pickupTime;
      const combinedDateTime = dayjs(
        `${pickupDate} ${pickupTime.format("HH:mm")}`,
        "YYYY-MM-DD HH:mm"
      ).toISOString();

      const bookingData = {
        pickupDate, // เช่น "2025-04-01"
        pickupTime: combinedDateTime, // เช่น "2025-04-01T08:30:00.000Z"
        pickupLat,
        pickupLng,
      };

      console.log("📦 Sending booking data:", bookingData);

      const response = await createBooking(bookingData);
      console.log("✅ Booking created:", response);
      if (response && response.booking.id) {
        navigate(`/booking/success`, {
          state: {
            bookingId: response.booking.id,
            bookingData,
          },
        });
      } else {
        throw new Error("ไม่ได้รับข้อมูลการจองจากเซิร์ฟเวอร์");
      }
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      message.error("ไม่สามารถทำการจองได้ โปรดลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login page if user is not logged in
  const handleLoginRedirect = () => {
    navigate("/auth/login");
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="ambulance"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              แบบฟอร์มจองรถฉุกเฉิน
            </h2>
            <p className="text-gray-600 mb-4">
              กรุณากรอกข้อมูลให้ครบถ้วนก่อนกดยืนยันการจอง
            </p>
            {!isLoggedIn && (
              <div className="text-center mb-4 w-full">
                <Button
                  onClick={handleLoginRedirect}
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                >
                  เข้าสู่ระบบก่อนจอง
                </Button>
              </div>
            )}
          </div>

          <Spin spinning={loading}>
            <Form
              form={form}
              name="booking-form"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-6"
              disabled={!isLoggedIn}
            >
              <Form.Item
                name="name"
                label="ชื่อผู้จอง"
                rules={[{ required: true, message: "โปรดป้อนชื่อผู้จอง" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="ชื่อผู้จอง"
                  className="rounded-lg shadow-sm"
                />
              </Form.Item>

              <Form.Item
                name="pickupDate"
                label="วันจอง"
                rules={[{ required: true, message: "โปรดเลือกวันจอง" }]}
              >
                <DatePicker
                  className="w-full rounded-lg shadow-sm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                name="pickupTime"
                label="เวลาที่ต้องการให้ไปรับ"
                rules={[{ required: true, message: "โปรดเลือกเวลา" }]}
              >
                <TimePicker
                  className="w-full rounded-lg shadow-sm"
                  format="HH:mm"
                />
              </Form.Item>

              {/* <Form.Item
                name="address"
                label="ที่อยู่"
                rules={[{ required: true, message: "โปรดป้อนที่อยู่" }]}
              >
                <Input
                  placeholder="ที่อยู่ที่ต้องการให้ไปรับ"
                  className="rounded-lg shadow-sm"
                />
              </Form.Item> */}

              {/* <Form.Item
                name="phone"
                label="เบอร์โทรศัพท์"
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
                  className="rounded-lg shadow-sm"
                />
              </Form.Item> */}

              <div className="flex space-x-4">
                <Form.Item className="flex-grow mb-0">
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="พิกัด"
                    value={location}
                    readOnly
                    className="rounded-lg shadow-sm"
                  />
                </Form.Item>
                <Button
                  onClick={handleGetLocation}
                  type="default"
                  className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                  disabled={!isLoggedIn}
                >
                  เรียกดูพิกัด
                </Button>
              </div>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="rounded-lg py-3 text-white bg-green-600 hover:bg-green-700"
                  disabled={!isLoggedIn}
                >
                  ยืนยันการจอง
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
