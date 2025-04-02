import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Card, Typography, Button, message, Divider } from "antd";
import { getSingleUser } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";

const { Title } = Typography;

const History = () => {
  const { id } = useParams(); // ใช้ params เพื่อดึงข้อมูลที่ถูกเลือก
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
    </>
  );
};

export default History;
