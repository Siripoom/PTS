import React from "react";
import { Layout, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer className="bg-gray-100 text-center p-6">
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        {/* โลโก้ */}
        <Col xs={24} md={6} className="flex justify-center md:justify-start">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
            alt="ambulance"
            className="w-12 h-12"
          />
        </Col>

        {/* เมนู */}
        <Col xs={24} md={12}>
          <Row justify="center" gutter={[16, 16]}>
            <Col>
              <Link to="/booking">Booking</Link>
            </Col>
          </Row>
        </Col>

        {/* ปุ่มติดต่อ */}
        <Col xs={24} md={6} className="flex justify-center md:justify-end">
          <Button type="primary">
            <Link to="/contact" type="primary">
              Contact
            </Link>
          </Button>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
