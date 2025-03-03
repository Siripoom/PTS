import { useState } from "react";
import { Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with", username, password);
    // TODO: Connect with authentication API
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="p-8 rounded-2xl shadow-lg w-[400px]">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="mx-auto w-12 mb-4" />
          <h2 className="text-xl font-semibold">ระบบรับส่งผู้ป่วย</h2>
          <p className="text-gray-500">เข้าสู่ระบบ</p>
        </div>
        <div className="mt-6 space-y-4">
          <Input
            size="large"
            placeholder="ชื่อผู้ใช้งาน"
            prefix={<UserOutlined />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input.Password
            size="large"
            placeholder="รหัสผ่าน"
            prefix={<LockOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="primary"
            size="large"
            block
            className="bg-blue-500"
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      </Card>
    </div>
  );
}
