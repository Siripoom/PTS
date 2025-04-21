import { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  message,
  Table,
} from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useParams } from "react-router-dom";
import { getSingleBooking } from "../../services/api";
import dayjs from "dayjs"; // สำหรับการแปลงวันที่และเวลา
import "./ManageBooking.css";

const { Sider, Content } = Layout;
const { Title } = Typography;

const ManageBookingDetail = () => {
  const { id } = useParams(); // ใช้ params เพื่อดึงข้อมูลที่ถูกเลือก
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true); // ใช้สำหรับการแสดงสถานะการโหลดข้อมูล

  useEffect(() => {
    // Fetch รายละเอียดของการจองจาก API
    const fetchBooking = async () => {
      try {
        const response = await getSingleBooking(id); // ใช้ id ที่มาจาก URL
        setBooking(response); // แสดงข้อมูลที่ได้รับจาก API
      } catch (error) {
        message.error("ไม่สามารถดึงข้อมูลการจองได้"); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
      } finally {
        setLoading(false); // เมื่อโหลดข้อมูลเสร็จแล้ว
      }
    };

    fetchBooking();
  }, [id]);

  // ฟังก์ชันสำหรับการนำทางไปยังพิกัดที่กำหนด
  const handleStartNavigation = () => {
    if (booking && booking.pickupLat && booking.pickupLng) {
      // สำหรับอุปกรณ์มือถือ จะเปิดแอป Google Maps หรือแอปแผนที่เริ่มต้น
      // สำหรับเดสก์ท็อป จะเปิด Google Maps ในแท็บใหม่
      const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLat},${booking.pickupLng}&travelmode=driving`;

      // เปิด URL ในแท็บใหม่
      window.open(url, "_blank");

      message.success("กำลังเริ่มการนำทาง");
    } else {
      message.error("ไม่พบข้อมูลพิกัด");
    }
  };

  // คอลัมน์สำหรับตารางผู้ป่วย
  const patientColumns = [
    {
      title: "ชื่อผู้ป่วย",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เลขบัตรประชาชน",
      dataIndex: "idCard",
      key: "idCard",
      render: (text) =>
        text
          ? text.replace(
              /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
              "$1-$2-$3-$4-$5"
            )
          : "-",
    },
  ];

  // ถ้าไม่มีข้อมูลการจองให้แสดงข้อความว่า "กำลังโหลด..."
  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", display: "flex" }}>
        <Sider width={220} className="lg:block hidden">
          <Sidebar />
        </Sider>

        <Layout>
          <Header title="รายละเอียดการจอง" />
          <Content className="dashboard-container">
            <div className="content-wrapper">
              <p>กำลังโหลดข้อมูล...</p> {/* แสดงข้อความกำลังโหลด */}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  // ถ้าข้อมูลการจองยังไม่มีหรือไม่ถูกต้อง
  if (!booking) {
    return (
      <Layout style={{ minHeight: "100vh", display: "flex" }}>
        <Sider width={220} className="lg:block hidden">
          <Sidebar />
        </Sider>

        <Layout>
          <Header title="รายละเอียดการจอง" />
          <Content className="dashboard-container">
            <div className="content-wrapper">
              <p>ไม่พบข้อมูลการจอง</p> {/* แสดงข้อความเมื่อไม่พบข้อมูล */}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  // แปลงวันที่และเวลา
  const formattedPickupDate = dayjs(booking.pickupDate).format("DD/MM/YYYY"); // วันที่
  const formattedPickupTime = dayjs(booking.pickupTime).format("HH:mm"); // เวลา

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
              <Col span={12}>
                <Card title="ข้อมูลการจอง" style={{ marginBottom: 16 }}>
                  <Title level={4}>{booking.User.fullName}</Title>
                  <p>รหัสจองที่: {booking.id}</p>
                  <p>ผู้จอง: {booking.User.fullName}</p>
                  <p>วันที่จอง: {formattedPickupDate}</p> {/* แสดงวันที่ */}
                  <p>เวลาที่ให้ไปรับ: {formattedPickupTime}</p> {/* แสดงเวลา */}
                  <p>เบอร์โทร: {booking.User.phone}</p>
                  <p>
                    พิกัด: {booking.pickupLat}, {booking.pickupLng}
                  </p>
                  <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    onClick={handleStartNavigation} // เพิ่ม event handler
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

              <Col span={12}>
                <Card title="แผนที่">
                  <div className="map-container">
                    <iframe
                      width="100%"
                      height="300"
                      src={`https://www.google.com/maps?q=${booking.pickupLat},${booking.pickupLng}&hl=th&z=14&output=embed`}
                      title="แผนที่"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen
                    ></iframe>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* แสดงข้อมูลผู้ป่วย */}
            {booking.patients && booking.patients.length > 0 && (
              <Row className="mt-4">
                <Col span={24}>
                  <Card
                    title={`รายชื่อผู้ป่วย (${booking.patients.length} คน)`}
                  >
                    <Table
                      dataSource={booking.patients}
                      columns={patientColumns}
                      pagination={false}
                      rowKey="id"
                      size="middle"
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageBookingDetail;
