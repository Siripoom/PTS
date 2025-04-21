import React from "react";
import { Form, Input, Button, Card, message, Select } from "antd";
import { UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { createUser } from "../../services/api";

const { Option } = Select;

const Register = () => {
  const onFinish = async (values) => {
    try {
      await createUser(values);
      message.success("ลงทะเบียนสําเร็จ");
      window.location.href = "/auth/login";
    } catch (error) {
      message.error(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  // คำอธิบายสำหรับแต่ละ role
  const roleDescriptions = {
    USER: "ผู้ใช้งานทั่วไป",
    VILLAGE_HEADMAN: "ผู้ใหญ่บ้าน",
    ABBOT: "อบต",
    PATIENT: "ผู้ป่วย/ญาติผู้ป่วย",
    EXECUTIVE: "ฝ่ายบริหาร",
    PUBLIC_HEALTH_OFFICER: "จนท.กองสาธารณสุข/เจ้าหน้าที่กู้ชีพ",
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white">
          <div className="flex flex-col items-center mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="ambulance"
              className="w-12 h-12 mb-2"
            />
            <h2 className="text-xl font-bold text-center">ระบบรับส่งผู้ป่วย</h2>
            <p className="text-gray-600 text-center">ลงทะเบียน</p>
          </div>

          <Form
            name="register-form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: "โปรดป้อนชื่อผู้ใช้" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ใช้งาน" />
            </Form.Item>

            <Form.Item
              name="email"
              type="email"
              rules={[
                { required: true, message: "โปรดป้อนอีเมลล์" },
                { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="อีเมลล์" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "โปรดป้อนรหัสผ่าน" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="รหัสผ่าน"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "โปรดยืนยันรหัสผ่าน" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="ยืนยันรหัสผ่าน"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "โปรดป้อนเบอร์โทรศัพท์" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "กรุณากรอกเบอร์โทร 10 หลัก",
                },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="เบอร์โทรศัพท์" />
            </Form.Item>

            <Form.Item
              name="citizen_id"
              rules={[
                { required: true, message: "โปรดป้อนเลขบัตรประชาชน" },
                {
                  pattern: /^[0-9]{13}$/,
                  message: "กรุณากรอกเลขบัตรประชาชน 13 หลัก",
                },
              ]}
            >
              <Input placeholder="เลขบัตรประชาชน" />
            </Form.Item>

            <Form.Item
              name="role"
              label="ประเภทผู้ใช้งาน"
              rules={[{ required: true, message: "โปรดเลือกประเภทผู้ใช้งาน" }]}
              initialValue="USER"
            >
              <Select placeholder="เลือกประเภทผู้ใช้งาน">
                {Object.entries(roleDescriptions).map(([role, description]) => (
                  <Option key={role} value={role}>
                    {description}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-blue-500 hover:bg-blue-600"
              >
                สมัครสมาชิก
              </Button>
            </Form.Item>
            <p className="text-center text-gray-500 text-sm mt-4">
              มีบัญชีแล้ว?{" "}
              <Link to="/auth/login" className="text-blue-600 hover:underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Register;
