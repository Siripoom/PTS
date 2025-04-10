import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Typography, Button, message, Divider, Modal  , Row , Col} from "antd";
import { getSingleUser } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import { getSingleBooking } from "../../services/api";
import { EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { Title } = Typography;

const History = () => {
  const { id } = useParams(); // ใช้ params เพื่อดึงข้อมูลที่ถูกเลือก
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState([]);
  const [formattedPickupDate, setFormattedPickupDate] = useState("");
  const [formattedPickupTime, setFormattedPickupTime] = useState("");

  useEffect(() => {
    const fetchUserHistory = async () => {
      setLoading(true);
      try {
        const response = await getSingleUser(id);
        console.log(response);
        setUser(response.data); // ตั้งค่าผู้ใช้และข้อมูลการจอง
      } catch (error) {
        message.error("ไม่สามารถโหลดข้อมูลประวัติการจองได้");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [id]);

  // กรณีที่ยังไม่มีข้อมูลผู้ใช้
  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-20">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  // กำหนดคอลัมน์ของตาราง
  const columns = [
    {
      title: "รหัสการจอง",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "วันที่รับ",
      dataIndex: "pickupDate",
      key: "pickupDate",
      render: (text) => new Date(text).toLocaleDateString("th-TH"),
    },
    {
      title: "เวลาที่รับ",
      dataIndex: "pickupTime",
      key: "pickupTime",
      render: (text) => new Date(text).toLocaleTimeString("th-TH"),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`status-label ${
            status === "CANCELLED" ? "cancelled" : "completed"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "ดูข้อมูลผู้ป่วย",
      key: "viewPatients",
      render: (text, record) => (
        <Button onClick={() => handleBooking(record.id)}>
          <EnvironmentOutlined />
        </Button>
      ),
    },
  ];

  const handleBooking = async (id) => {
    setIsModalOpen(true);
    try {
      const response = await getSingleBooking(id); // ใช้ id ที่มาจาก URL
      console.log(response)
      setBooking(response); // แสดงข้อมูลที่ได้รับจาก API
      setFormattedPickupDate(dayjs(response.pickupDate).format("DD/MM/YYYY"));
      setFormattedPickupTime(dayjs(response.pickupTime).format("HH:mm"));
    } catch (error) {
      message.error("ไม่สามารถดึงข้อมูลการจองได้"); // แสดงข้อความเมื่อเกิดข้อผิดพลาด
    } 
  };

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

  const columnsTable = [
    {
      title:"ชื่อผู้ป่วย",
      dataIndex: "name",
      key: "name",
      render: (text) => text.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1 $2 $3 $4"),
    },
    {
      title: "เชขบัตรประชาชน",
      dataIndex: "idCard",
      key: "idCard",
      render: (text) => text.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1 $2 $3 $4"),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card style={{ width: "80%", marginTop: "20px" }}>
          <Title level={2} className="text-center">
            ประวัติการจองของ {user.fullName}
          </Title>
          <Divider />
          <Table
            columns={columns}
            dataSource={user.bookingsAsUser}
            rowKey="id"
            loading={loading}
            pagination={false}
            bordered
          />
          {user.bookingsAsUser.length === 0 && (
            <div className="text-center mt-5">
              ไม่มีการจองในประวัติการจองนี้
            </div>
          )}
        </Card>
      </div>

      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} style={{width: "80%"}}>
          <div>
          <Row gutter={16}>
              <Col span={24} sm={24} md={12}>
                <Card title="ข้อมูลการจอง" style={{ marginBottom: 16 }}>
                  <Title level={4}>{booking?.User?.fullName}</Title>
                  <p>รหัสจองที่: {booking?.id}</p>
                  <p>ผู้จอง: {booking?.User?.fullName}</p>
                  <p>วันที่จอง: {formattedPickupDate || "ไม่มีข้อมูล"}</p> {/* แสดงวันที่ */}
                  <p>เวลาที่ให้ไปรับ: {formattedPickupTime || "ไม่มีข้อมูล"}</p> {/* แสดงเวลา */}
                  <p>เบอร์โทร: {booking?.User?.phone || "ไม่มีข้อมูล"}</p>
                  <p>
                    พิกัด: {booking?.pickupLat}, {booking?.pickupLng}
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

              <Col span={24} sm={24} md={12}>
                <Card title="แผนที่">
                  <div className="map-container">
                    <iframe
                      width="100%"
                      height="300"
                      src={`https://www.google.com/maps?q=${booking.pickupLat},${booking.pickupLng}&hl=th&z=14&output=embed`}
                      title="แผนที่"
                    ></iframe>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24} sm={24} md={24}>
              <Table columns={columnsTable} dataSource={booking?.patients} />
              </Col>
            </Row>
          </div>
      </Modal>
    </>

  );
};

export default History;
