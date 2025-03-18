import { useState } from "react";
import { Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/ambulance 1.png";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with", username, password);
    // TODO: Connect with authentication API
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <Card className="p-10 rounded-3xl shadow-xl w-[400px] bg-white border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              🚑 ระบบรับส่งผู้ป่วย
            </h2>
            <p className="text-gray-500 text-sm ">
              เข้าสู่ระบบเพื่อดำเนินการต่อ
            </p>
          </div>
          <div className="mt-8 space-y-5">
            <Input
              size="large"
              placeholder="ชื่อผู้ใช้งาน"
              prefix={<UserOutlined className="text-gray-400" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg"
            />

            <Input.Password
              size="large"
              placeholder="รหัสผ่าน"
              prefix={<LockOutlined className="text-gray-400" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
            />
            <Button
              type="primary"
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg font-medium"
              onClick={handleLogin}
            >
              เข้าสู่ระบบ
            </Button>
            <p className="text-center text-gray-500 text-sm mt-4">
              ไม่มีบัญชี?{" "}
              <Link
                to="/auth/register"
                className="text-blue-600 hover:underline"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
