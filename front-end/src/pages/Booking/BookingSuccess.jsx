import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Result, Button, Card, Descriptions, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import dayjs from "dayjs";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  console.log(bookingData);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Spin size="large" tip="กำลังโหลดข้อมูล..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-blue-600">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            title="จองรถฉุกเฉินสำเร็จ!"
            subTitle="ทีมงานของเราจะติดต่อกลับไปเพื่อยืนยันการจอง"
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          />

          <Card title="รายละเอียดการจอง" className="shadow-lg mb-6">
            <Descriptions bordered column={1}>
              {bookingData.name && (
                <Descriptions.Item label="ชื่อผู้จอง">
                  {bookingData.name}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="วันที่จอง">
                {bookingData.pickupDate}
              </Descriptions.Item>
              <Descriptions.Item label="เวลานัดรับ">
                {dayjs(bookingData.pickupTime).format("HH:mm น.")}
              </Descriptions.Item>
              {bookingData.address && (
                <Descriptions.Item label="ที่อยู่">
                  {bookingData.address}
                </Descriptions.Item>
              )}
              {bookingData.phone && (
                <Descriptions.Item label="เบอร์โทรศัพท์">
                  {bookingData.phone}
                </Descriptions.Item>
              )}
              {bookingData.pickupLat && bookingData.pickupLng && (
                <Descriptions.Item label="พิกัด">
                  {`${bookingData.pickupLat}, ${bookingData.pickupLng}`}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          <div className="flex space-x-4 justify-center">
            <Link to="/">
              <Button type="primary" size="large" className="bg-blue-500">
                กลับหน้าแรก
              </Button>
            </Link>
            {bookingData.userId && (
              <Link to={`/history/${bookingData.userId}`}>
                <Button size="large">ดูประวัติการจอง</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingSuccess;
