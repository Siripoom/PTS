import { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Button, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";
import "./ManageBookingDetail.css"; // ใส่ไฟล์ CSS ที่เหมาะสม

const { Sider, Content } = Layout;
const { Title } = Typography;

const ManageBookingDetail = () => {
  const { id } = useParams(); // ใช้ params เพื่อดึงข้อมูลที่ถูกเลือก
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Fetch รายละเอียดของการจองจาก API
    const mockBooking = {
      id: 59217,
      name: "นาย ทดสอบ",
      phone: "092-xxxx-xxx",
      date: "16/02/2568",
      time: "06.00",
      location: "666 หมู่ 3 ต.เวียง อ.ฝาง จ.เชียงใหม่",
      status: "สำเร็จ",
      latitude: 19.941918587683155,
      longitude: 99.21913860714844,
    };
    setBooking(mockBooking); // จำลองข้อมูล
  }, [id]);

  if (!booking) return null;

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="รายละเอียดการจอง" />

        <Content className="dashboard-container">
          <div className="content-wrapper">
            <Row gutter={16}>
              {/* ข้อมูลการจอง */}
              <Col span={12}>
                <Card title="ข้อมูลการจอง" style={{ marginBottom: 16 }}>
                  <Title level={4}>{booking.name}</Title>
                  <p>รหัสจองที่: {booking.id}</p>
                  <p>วันที่จอง: {booking.date}</p>
                  <p>เวลาที่ให้ไปรับ: {booking.time}</p>
                  <p>เบอร์โทร: {booking.phone}</p>
                  <p>ที่อยู่: {booking.location}</p>
                  <p>
                    พิกัด: {booking.latitude}, {booking.longitude}
                  </p>

                  {/* ปุ่มเริ่มนำทาง */}
                  <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    style={{
                      marginTop: 20,
                      width: "100%",
                      fontSize: "16px",
                      padding: "12px",
                    }}
                  >
                    เริ่มนำทาง
                  </Button>
                </Card>
              </Col>

              {/* แผนที่ */}
              <Col span={12}>
                <Card title="แผนที่">
                  <div className="map-container">
                    {/* ใช้ Google Maps Embed หรือ component สำหรับแสดงแผนที่ */}
                    <iframe
                      width="100%"
                      height="300"
                      src={`https://www.google.com/maps?q=${booking.latitude},${booking.longitude}&hl=th&z=14&output=embed`}
                      title="แผนที่"
                    ></iframe>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageBookingDetail;
