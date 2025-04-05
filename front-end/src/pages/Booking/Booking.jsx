import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  message,
  Spin,
  Modal,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  AimOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "dayjs/locale/th";
import th_TH from "antd/es/date-picker/locale/th_TH";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

const Booking = () => {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [address, setAddress] = useState("");

  // เพิ่มสถานะเพื่อเก็บและแสดงตำแหน่งปัจจุบัน
  const [currentPosition, setCurrentPosition] = useState({
    lat: 13.736717,
    lng: 100.523186,
  });
  const [showCurrentPosition, setShowCurrentPosition] = useState(false);
  const [currentPositionAccuracy, setCurrentPositionAccuracy] = useState(0);

  // Function to get user's current position
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          setCurrentPositionAccuracy(position.coords.accuracy);
          setShowCurrentPosition(true);

          // ตั้งค่าตำแหน่งที่เลือกเป็นตำแหน่งปัจจุบัน
          setLatitude(pos.lat);
          setLongitude(pos.lng);
          setLocation(
            `Latitude: ${pos.lat.toFixed(6)}, Longitude: ${pos.lng.toFixed(6)}`
          );

          // Try to get address from coordinates if Google Maps is loaded
          tryGetAddress(pos.lat, pos.lng);

          setLoadingLocation(false);
          message.success("ได้รับพิกัดปัจจุบันแล้ว");
        },
        (error) => {
          console.error("Error getting GPS:", error);
          message.error("ไม่สามารถดึงพิกัดปัจจุบันได้");
          setLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      message.error("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
      setLoadingLocation(false);
    }
  };

  // Try to get address from coordinates using Google Maps Geocoder
  const tryGetAddress = (lat, lng) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    }
  };

  // Check if user is logged in on component mount and get user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setIsLoggedIn(true);

        // Pre-fill form with user's name if available
        if (decodedToken.fullName) {
          form.setFieldsValue({
            name: decodedToken.fullName,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Get current position if available
    getCurrentLocation();
  }, [form]);

  // Open Modal for selecting location
  const showMapModal = () => {
    setIsModalVisible(true);
  };

  // Close the map modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setShowInfoWindow(false);
  };

  // Handle map click to place marker
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
    setLocation(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);

    // Try to get address from coordinates
    tryGetAddress(lat, lng);

    // Show info window briefly
    setShowInfoWindow(true);
    setTimeout(() => setShowInfoWindow(false), 3000);
  };

  // Confirm location selection and close modal
  const confirmLocation = () => {
    if (latitude && longitude) {
      setIsModalVisible(false);
      setShowInfoWindow(false);
    } else {
      message.warning("กรุณาเลือกตำแหน่งบนแผนที่ก่อน");
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    if (!isLoggedIn) {
      message.error("กรุณาล็อกอินก่อนทำการจอง!");
      navigate("/auth/login");
      return;
    }

    if (!latitude || !longitude) {
      message.error("กรุณาเลือกตำแหน่งบนแผนที่");
      return;
    }

    try {
      setLoading(true);

      const pickupDate = values.pickupDate.format("YYYY-MM-DD");
      const pickupTime = values.pickupTime;
      const combinedDateTime = dayjs(
        `${pickupDate} ${pickupTime.format("HH:mm")}`,
        "YYYY-MM-DD HH:mm"
      ).toISOString();

      const bookingData = {
        pickupDate,
        pickupTime: combinedDateTime,
        pickupLat: latitude,
        pickupLng: longitude,
        pickupAddress: address || undefined, // Include address if available
      };

      console.log("📦 Sending booking data:", bookingData);

      const response = await createBooking(bookingData);
      console.log("✅ Booking created:", response);
      if (response && response.booking.id) {
        navigate(`/booking/success`, {
          state: {
            bookingId: response.booking.id,
            bookingData,
          },
        });
      } else {
        throw new Error("ไม่ได้รับข้อมูลการจองจากเซิร์ฟเวอร์");
      }
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      message.error("ไม่สามารถทำการจองได้ โปรดลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // สร้างไอคอนสำหรับ Marker ที่แตกต่างกัน
  const currentLocationIcon = {
    path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    scale: 8,
  };

  const selectedLocationIcon = {
    path: window.google?.maps?.SymbolPath?.BACKWARD_CLOSED_ARROW || 0,
    fillColor: "#DB4437",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    scale: 6,
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:py-16 md:py-24">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
              alt="ambulance"
              className="w-16 h-16 mb-4"
            />
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              แบบฟอร์มจองรถฉุกเฉิน
            </h2>
            <p className="text-gray-600 mb-4">
              กรุณากรอกข้อมูลให้ครบถ้วนก่อนกดยืนยันการจอง
            </p>
            {!isLoggedIn && (
              <div className="text-center mb-4 w-full">
                <Button
                  onClick={() => navigate("/auth/login")}
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                >
                  เข้าสู่ระบบก่อนจอง
                </Button>
              </div>
            )}
          </div>

          <Spin spinning={loading}>
            <Form
              form={form}
              name="booking-form"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-6"
              disabled={!isLoggedIn}
            >
              <Form.Item
                name="name"
                label="ชื่อผู้จอง"
                rules={[{ required: true, message: "โปรดป้อนชื่อผู้จอง" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="ชื่อผู้จอง"
                  className="rounded-lg shadow-sm"
                />
              </Form.Item>

              <Form.Item
                name="pickupDate"
                label="วันจอง"
                rules={[{ required: true, message: "โปรดเลือกวันจอง" }]}
              >
                <DatePicker
                  locale={th_TH}
                  className="w-full rounded-lg shadow-sm"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
              </Form.Item>

              <Form.Item
                name="pickupTime"
                label="เวลาที่ต้องการให้ไปรับ"
                rules={[{ required: true, message: "โปรดเลือกเวลา" }]}
              >
                <TimePicker
                  className="w-full rounded-lg shadow-sm"
                  format="HH:mm"
                />
              </Form.Item>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  ตำแหน่งสำหรับรับ
                </label>
                <div className="flex space-x-2">
                  <Input
                    prefix={<EnvironmentOutlined />}
                    placeholder="พิกัด"
                    value={address || location}
                    readOnly
                    className="rounded-lg shadow-sm flex-grow"
                  />
                  <Button
                    onClick={getCurrentLocation}
                    type="default"
                    icon={<AimOutlined />}
                    loading={loadingLocation}
                    className="rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  />
                  <Button
                    onClick={showMapModal}
                    type="default"
                    className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    เลือกตำแหน่ง
                  </Button>
                </div>
              </div>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="rounded-lg py-3 text-white bg-green-600 hover:bg-green-700"
                  disabled={!isLoggedIn || !latitude || !longitude}
                >
                  ยืนยันการจอง
                </Button>
              </Form.Item>
            </Form>
          </Spin>

          {/* Modal for Google Map */}
          <Modal
            title="เลือกตำแหน่งรับ"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                ยกเลิก
              </Button>,
              <Button
                key="locate"
                onClick={getCurrentLocation}
                loading={loadingLocation}
              >
                ตำแหน่งปัจจุบัน
              </Button>,
              <Button
                key="confirm"
                type="primary"
                onClick={confirmLocation}
                disabled={!latitude || !longitude}
              >
                ยืนยันตำแหน่ง
              </Button>,
            ]}
            width="80%"
          >
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={["places", "geometry"]}
            >
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "400px",
                }}
                center={
                  latitude && longitude
                    ? { lat: latitude, lng: longitude }
                    : currentPosition
                }
                zoom={15}
                onClick={handleMapClick}
                options={{
                  zoomControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                  fullscreenControl: true,
                }}
              >
                {/* แสดงตำแหน่งปัจจุบัน */}
                {showCurrentPosition && (
                  <>
                    <Marker
                      position={currentPosition}
                      icon={currentLocationIcon}
                      zIndex={1}
                      title="ตำแหน่งปัจจุบันของคุณ"
                    />
                    <Circle
                      center={currentPosition}
                      radius={currentPositionAccuracy}
                      options={{
                        fillColor: "#4285F4",
                        fillOpacity: 0.2,
                        strokeColor: "#4285F4",
                        strokeOpacity: 0.5,
                        strokeWeight: 1,
                      }}
                    />
                  </>
                )}

                {/* แสดงตำแหน่งที่เลือก */}
                {latitude && longitude && (
                  <>
                    <Marker
                      position={{
                        lat: latitude,
                        lng: longitude,
                      }}
                      draggable={true}
                      icon={selectedLocationIcon}
                      zIndex={2}
                      onDragEnd={(e) => {
                        const lat = e.latLng.lat();
                        const lng = e.latLng.lng();
                        setLatitude(lat);
                        setLongitude(lng);
                        setLocation(
                          `Latitude: ${lat.toFixed(
                            6
                          )}, Longitude: ${lng.toFixed(6)}`
                        );
                        tryGetAddress(lat, lng);
                      }}
                      animation={window.google?.maps?.Animation?.DROP}
                    />
                    {showInfoWindow && (
                      <InfoWindow
                        position={{ lat: latitude, lng: longitude }}
                        onCloseClick={() => setShowInfoWindow(false)}
                      >
                        <div>
                          <p className="font-bold">ตำแหน่งที่เลือก</p>
                          <p>{address || "กำลังโหลดที่อยู่..."}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </>
                )}
              </GoogleMap>
            </LoadScript>
            <div className="mt-4 text-gray-600 text-sm">
              <p>
                คำแนะนำ: คลิกที่แผนที่เพื่อเลือกตำแหน่ง
                หรือลากหมุดเพื่อปรับตำแหน่ง
              </p>
              {address && (
                <div className="mt-2">
                  <strong>ที่อยู่:</strong> {address}
                </div>
              )}
              <div className="mt-2">
                <p>
                  <span
                    style={{
                      backgroundColor: "#4285F4",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    ◉
                  </span>{" "}
                  ตำแหน่งปัจจุบัน
                </p>
                <p>
                  <span
                    style={{
                      backgroundColor: "#DB4437",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    ▼
                  </span>{" "}
                  ตำแหน่งที่เลือก
                </p>
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
