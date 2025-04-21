import { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Select,
  Typography,
  Statistic,
  Tooltip,
  message,
  Table,
  Input,
} from "antd";
import { Line } from "@ant-design/charts";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./Dashboard.css";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import {
  getAllBookings,
  getAllUsers,
  getAllPatients,
} from "../../services/api"; // Import API functions
import { jwtDecode } from "jwt-decode";

const { Sider, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Dashboard = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);

  // Variables for the dashboard stats
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [failedBookings, setFailedBookings] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [trendData, setTrendData] = useState([]);

  const pageSize = 10;

  useEffect(() => {
    // ตรวจสอบข้อมูลผู้ใช้จาก token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await getAllBookings();
      const usersResponse = await getAllUsers();

      // ดึงข้อมูลผู้ป่วย
      try {
        const patientsResponse = await getAllPatients();
        setPatientsData(patientsResponse);
        setFilteredPatients(patientsResponse);
        setPatientsCount(patientsResponse.length);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }

      setBookingsData(bookingsResponse);
      setUsersData(usersResponse);

      const trend = groupBookingsByDate(bookingsResponse);
      setTrendData(trend);

      // Calculate total bookings and stats from bookings data
      const totalBookingsCount = bookingsResponse.length;
      const totalDistanceCovered = bookingsResponse.reduce(
        (acc, booking) => acc + (booking.distance || 0),
        0
      );
      const completedCount = bookingsResponse.filter(
        (booking) => booking.status === "COMPLETED"
      ).length;
      const failedCount = bookingsResponse.filter(
        (booking) => booking.status === "CANCELLED"
      ).length;

      // Set the stats
      setTotalBookings(totalBookingsCount);
      setTotalDistance(totalDistanceCovered);
      setCompletedBookings(completedCount);
      setFailedBookings(failedCount);
      setUsersCount(usersResponse.length);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  // Group bookings by date
  const groupBookingsByDate = (data) => {
    const trend = data.reduce((acc, booking) => {
      const date = new Date(booking.pickupDate).toLocaleDateString(); // Format date
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    // Convert to array for chart
    return Object.keys(trend).map((date) => ({
      x: date,
      y: trend[date],
    }));
  };

  // ฟังก์ชันค้นหาผู้ป่วย
  const handleSearch = (value) => {
    setSearchText(value);
    if (!patientsData) return;

    const filtered = patientsData.filter(
      (patient) =>
        patient.name?.toLowerCase().includes(value.toLowerCase()) ||
        patient.idCard?.includes(value) ||
        (patient.houseNumber && patient.houseNumber.includes(value)) ||
        (patient.address &&
          patient.address.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredPatients(filtered);
  };

  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // คอลัมน์ข้อมูลผู้ป่วย
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
    {
      title: "ที่อยู่",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "ตำแหน่ง",
      key: "location",
      render: (_, record) => (
        <span>
          {record.latitude && record.longitude
            ? `${record.latitude.toFixed(4)}, ${record.longitude.toFixed(4)}`
            : "ไม่มีข้อมูล"}
        </span>
      ),
    },
  ];

  // ตรวจสอบว่าเป็น PUBLIC_HEALTH_OFFICER หรือไม่
  const isPublicHealthOfficer =
    user?.role === "PUBLIC_HEALTH_OFFICER" ||
    user?.role === "ADMIN" ||
    user?.role === "STAFF";

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="ภาพรวม" />

        <Content className="dashboard-container">
          <div className="content-wrapper">
            {/* สถิติการจอง */}
            <Row gutter={16} justify="center" className="mb-4">
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="dashboard-card">
                  <Statistic
                    title="จำนวนการจอง"
                    value={totalBookings}
                    prefix={
                      <RocketOutlined
                        style={{ fontSize: "24px", color: "#4CAF50" }}
                      />
                    }
                    valueStyle={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#4CAF50",
                    }}
                    suffix="ครั้ง"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="dashboard-card">
                  <Statistic
                    title="ระยะทางที่ใช้ไป"
                    value={totalDistance}
                    prefix={
                      <EnvironmentOutlined
                        style={{ fontSize: "24px", color: "#4CAF50" }}
                      />
                    }
                    valueStyle={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#4CAF50",
                    }}
                    suffix="กม."
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="dashboard-card">
                  <Statistic
                    title="รับส่งผู้ป่วยสำเร็จ"
                    value={completedBookings}
                    prefix={
                      <CheckCircleOutlined
                        style={{ fontSize: "24px", color: "#4CAF50" }}
                      />
                    }
                    valueStyle={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#4CAF50",
                    }}
                    suffix="ครั้ง"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Card className="dashboard-card">
                  <Statistic
                    title="รับส่งผู้ป่วยไม่สำเร็จ"
                    value={failedBookings}
                    prefix={
                      <CloseCircleOutlined
                        style={{ fontSize: "24px", color: "#F44336" }}
                      />
                    }
                    valueStyle={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#F44336",
                    }}
                    suffix="ครั้ง"
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16} className="mb-4">
              <Col xs={24} lg={16}>
                {/* แนวโน้มการจอง */}
                <Card title="แนวโน้มการจอง" className="w-full mb-4 lg:mb-0">
                  <Line
                    data={trendData}
                    xField="x"
                    yField="y"
                    point={{ size: 5 }}
                    label={{
                      style: {
                        fill: "#000",
                        fontSize: 12,
                      },
                    }}
                    smooth
                    color={"#55A6F3"}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="สถิติผู้ใช้ระบบ" className="w-full">
                  <Statistic
                    title="จำนวนผู้ใช้ระบบ"
                    value={usersCount}
                    prefix={<UserOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ color: "#1890ff" }}
                    suffix="คน"
                  />
                  <Statistic
                    title="จำนวนผู้ป่วยในระบบ"
                    value={patientsCount}
                    prefix={
                      <MedicineBoxOutlined style={{ color: "#52c41a" }} />
                    }
                    valueStyle={{ color: "#52c41a" }}
                    suffix="คน"
                    className="mt-4"
                  />
                </Card>
              </Col>
            </Row>

            {/* แสดงข้อมูลผู้ป่วยเฉพาะสำหรับเจ้าหน้าที่กู้ชีพ */}
            {isPublicHealthOfficer && (
              <Card title="ข้อมูลผู้ป่วย" className="w-full mt-4">
                <Row className="mb-4">
                  <Col span={24}>
                    <Search
                      placeholder="ค้นหาผู้ป่วย (ชื่อ, เลขบัตรประชาชน, ที่อยู่)"
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="middle"
                      onSearch={handleSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      value={searchText}
                      style={{ width: 300 }}
                    />
                  </Col>
                </Row>
                <Table
                  columns={patientColumns}
                  dataSource={filteredPatients.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize
                  )}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredPatients.length,
                    onChange: handlePageChange,
                    showSizeChanger: false,
                  }}
                  size="middle"
                />
              </Card>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
