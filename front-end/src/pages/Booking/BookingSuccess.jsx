import React from "react";
import { Layout } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const { Content } = Layout;

const BookingSuccess = () => {
  return (
    <Layout className="min-h-screen flex flex-col ">
      <Navbar />

      {/* ให้ Content เติบโตเต็มที่ เพื่อดัน Footer ไปอยู่ล่างสุด */}
      <Content className="flex-grow flex flex-col items-center justify-center text-center my-6">
        <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="ambulance"
              className="w-12 h-12 mb-2"
            />
            <h2 className="text-xl font-bold text-center text-black">
              แบบฟอร์มจองรถฉุกเฉิน
            </h2>
            <p className="text-gray-600 text-center">
              กรุณาตรวจสอบข้อมูลก่อนกดยืนยัน
            </p>
          </div>

          <h1 className="text-2xl font-bold text-black mb-4">การจองสำเร็จ</h1>

          <p className="text-lg text-black">
            <strong>ผู้จอง :</strong>{" "}
            ........................................................................
          </p>

          <p className="text-gray-500 mt-4">
            กรุณาถ่ายกล่องข้อมูลการจองไว้
            เจ้าหน้าที่จะเร่งดำเนินการให้เร็วที่สุด
          </p>
        </div>
      </Content>

      {/* <Footer /> */}
    </Layout>
  );
};

export default BookingSuccess;
