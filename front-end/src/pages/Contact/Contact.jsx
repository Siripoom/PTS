import { Layout, Typography, Card, Divider, Row, Col } from "antd";
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./contact.css";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const ContactUs = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Navbar />
      <Layout>
        <Content className="contact-container">
          <div className="content-wrapper">
            <Card
              className="contact-card"
              title="ข้อมูลติดต่อ"
              bordered={false}
            >
              <Title
                level={3}
                style={{ textAlign: "center", fontWeight: "bold" }}
              >
                องค์การบริหารส่วนตำบลเวียง
              </Title>
              <Divider />

              <div className="contact-info">
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={12}>
                    <div className="contact-detail">
                      <EnvironmentOutlined
                        style={{
                          fontSize: 24,
                          color: "#1890ff",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <Text
                          strong
                          style={{ fontSize: "16px", display: "block" }}
                        >
                          ศูนย์กู้ชีพ กู้ภัย ภูเวียง
                        </Text>
                        <Text style={{ fontSize: "14px" }}>
                          บ้านเสาหิน. หมู่ 14. ต.เวียง อ.ฝาง. จ.เชียงใหม่. 50110
                        </Text>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12} md={12}>
                    <div className="contact-detail">
                      <PhoneOutlined
                        style={{
                          fontSize: 24,
                          color: "#1890ff",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <Text
                          strong
                          style={{ fontSize: "16px", display: "block" }}
                        >
                          เบอร์โทรศัพท์:
                        </Text>
                        <Text style={{ fontSize: "14px" }}>061 154 9790</Text>
                        <br />
                        <Text style={{ fontSize: "14px" }}>053 383 066</Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ContactUs;
