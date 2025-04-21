import { useState } from "react";
import { Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/ambulance 1.png";
import Navbar from "../../components/Navbar/Navbar";
import { loginUser } from "../../services/api";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [login, setLogin] = useState(""); // เปลี่ยนจาก email เป็น login
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!login || !password) {
      message.warning("กรุณากรอกอีเมล/เลขบัตรประชาชน และรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      const data = { login, password }; // ส่งข้อมูล login แทน email
      const res = await loginUser(data);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        message.success("เข้าสู่ระบบสำเร็จ");
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = jwtDecode(token);

            // จัดการการนำทางตาม role
            if (
              decodedToken.role === "ADMIN" ||
              decodedToken.role === "STAFF" ||
              decodedToken.role === "PUBLIC_HEALTH_OFFICER" ||
              decodedToken.role === "EXECUTIVE"
            ) {
              navigate("/admin/dashboard");
            } else {
              navigate("/");
            }
            console.log(decodedToken);
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      } else {
        message.error("เข้าสู่ระบบไม่สำเร็จ: ข้อมูลไม่ถูกต้อง");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <Card className="p-10 rounded-3xl shadow-xl w-[400px] bg-white border border-gray-200">
          <div className="text-center">
            <img src={logo} alt="logo" className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-700">
              🚑 ระบบรับส่งผู้ป่วย
            </h2>
            <p className="text-gray-500 text-sm">
              เข้าสู่ระบบเพื่อดำเนินการต่อ
            </p>
          </div>
          <div className="mt-8 space-y-5">
            <Input
              size="large"
              placeholder="อีเมล หรือ เลขบัตรประชาชน"
              prefix={<IdcardOutlined className="text-gray-400" />}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="rounded-lg"
              name="login"
            />
            <Input.Password
              size="large"
              placeholder="รหัสผ่าน"
              prefix={<LockOutlined className="text-gray-400" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
              name="password"
              onPressEnter={handleLogin}
            />
            <Button
              type="primary"
              size="large"
              block
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg font-medium"
              onClick={handleLogin}
              loading={loading}
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
