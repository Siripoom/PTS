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

// Register the components to make the Bar chart work

const { Sider, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Dashboard = () => {
  // Mock Data
  const trendData = [
    { x: "2025-03-01", y: 5 },
    { x: "2025-03-02", y: 8 },
    { x: "2025-03-03", y: 12 },
    { x: "2025-03-04", y: 9 },
    { x: "2025-03-05", y: 15 },
    { x: "2025-03-06", y: 20 },
    { x: "2025-03-07", y: 25 },
  ];

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
                    value={57}
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
                    value={45}
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
                    value={45}
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
                    value={2}
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
            <Row gutter={16} justify="center" style={{ marginTop: 20 }}>
              <Col xs={24} sm={24} md={24} lg={16}>
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
