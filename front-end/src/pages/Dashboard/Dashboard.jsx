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
} from "@ant-design/icons";
import { getAllBookings, getAllUsers } from "../../services/api"; // Import API functions

const { Sider, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Variables for the dashboard stats
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [failedBookings, setFailedBookings] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [trendData, setTrendData] = useState([]);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await getAllBookings();
      const usersResponse = await getAllUsers();
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
      setUsersCount(usersResponse.length); // Set users count from users API
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
            <Row gutter={16} justify="center">
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

            {/* กราฟแสดงแนวโน้มการจอง */}
            <Row gutter={16} justify="center">
              <Col xs={24} sm={24} md={24} lg={16}>
                {/* แนวโน้มการจอง */}
                <Card title="แนวโน้มการจอง">
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
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
