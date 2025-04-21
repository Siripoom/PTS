import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Modal,
  Table,
  Tooltip,
  Popconfirm,
  Space,
} from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  createPatient,
  getAllPatients,
  deletePatient,
  updatePatient,
  getAddressByCoordinates,
} from "../../services/api";
import { jwtDecode } from "jwt-decode";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const { Title, Text } = Typography;

const PatientForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 19.9315402,
    lng: 99.2209747,
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่ามีการ login แล้วหรือไม่
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("กรุณาเข้าสู่ระบบก่อนเพิ่มข้อมูลผู้ป่วย");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
      fetchPatients();
    } catch (error) {
      console.error("Token error:", error);
      message.error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูลผู้ใช้");
      navigate("/auth/login");
    }
  }, [navigate]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getAllPatients();
      setPatients(response);
    } catch (error) {
      console.error("Error fetching patients:", error);
      message.error("ไม่สามารถดึงข้อมูลผู้ป่วยได้");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // เพิ่มข้อมูลพิกัดถ้ามีการเลือกตำแหน่งบนแผนที่
      if (selectedLocation) {
        values.latitude = selectedLocation.lat;
        values.longitude = selectedLocation.lng;
      }

      if (selectedPatient) {
        // กรณีแก้ไขข้อมูล
        await updatePatient(selectedPatient.id, values);
        message.success("แก้ไขข้อมูลผู้ป่วยเรียบร้อยแล้ว");
      } else {
        // กรณีเพิ่มข้อมูลใหม่
        await createPatient(values);
        message.success("เพิ่มข้อมูลผู้ป่วยเรียบร้อยแล้ว");
      }

      form.resetFields();
      setSelectedLocation(null);
      setSelectedPatient(null);
      fetchPatients(); // โหลดข้อมูลผู้ป่วยใหม่
    } catch (error) {
      console.error("Error saving patient:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    form.setFieldsValue({
      name: patient.name,
      idCard: patient.idCard,
      houseNumber: patient.houseNumber,
      village: patient.village,
      address: patient.address,
    });

    if (patient.latitude && patient.longitude) {
      setSelectedLocation({
        lat: patient.latitude,
        lng: patient.longitude,
      });
    } else {
      setSelectedLocation(null);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deletePatient(patientId);
      message.success("ลบข้อมูลผู้ป่วยเรียบร้อยแล้ว");
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      message.error("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วย");
    }
  };

  // ฟังก์ชันสำหรับเปิด Modal แผนที่
  const handleOpenMapModal = () => {
    setIsMapModalVisible(true);
    // หากมีการเลือกตำแหน่งไว้แล้ว ให้ตั้งค่า center ของแผนที่เป็นตำแหน่งนั้น
    if (selectedLocation) {
      setMapCenter(selectedLocation);
    }
  };

  // ฟังก์ชันสำหรับปิด Modal แผนที่
  const handleMapModalCancel = () => {
    setIsMapModalVisible(false);
    setShowInfoWindow(false);
  };

  // ฟังก์ชันสำหรับการคลิกบนแผนที่เพื่อเลือกตำแหน่ง
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });

    // อัปเดตค่าใน form
    form.setFieldsValue({
      latitude: lat,
      longitude: lng,
    });

    // พยายามดึงที่อยู่จากพิกัด
    fetchAddressFromCoordinates(lat, lng);

    // แสดง InfoWindow ชั่วคราว
    setShowInfoWindow(true);
    setTimeout(() => setShowInfoWindow(false), 3000);
  };

  // ฟังก์ชันดึงที่อยู่จากพิกัด
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const address = await getAddressByCoordinates(lat, lng);
      if (address) {
        // ถ้ามีที่อยู่ ให้แสดงใน form
        form.setFieldsValue({ address });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // ฟังก์ชันสำหรับยืนยันตำแหน่งที่เลือกและปิด Modal แผนที่
  const confirmLocation = () => {
    if (selectedLocation) {
      setIsMapModalVisible(false);
      setShowInfoWindow(false);
    } else {
      message.warning("กรุณาเลือกตำแหน่งบนแผนที่ก่อน");
    }
  };

  // ฟังก์ชันสำหรับดึงตำแหน่งปัจจุบัน
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(pos);
          setMapCenter(pos);

          // อัปเดตค่าใน form
          form.setFieldsValue({
            latitude: pos.lat,
            longitude: pos.lng,
          });

          // พยายามดึงที่อยู่จากพิกัด
          fetchAddressFromCoordinates(pos.lat, pos.lng);

          setLoadingLocation(false);
          message.success("ได้รับพิกัดปัจจุบันแล้ว");
        },
        (error) => {
          console.error("Error getting location:", error);
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

  const columns = [
    {
      title: "ชื่อผู้ป่วย",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "เลขบัตรประชาชน",
      dataIndex: "idCard",
      key: "idCard",
      render: (text) =>
        text
          ? text.replace(
              /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
              "$1-$2-$3-$4-$5"
            )
          : "-",
    },
    {
      title: "บ้านเลขที่",
      dataIndex: "houseNumber",
      key: "houseNumber",
    },
    {
      title: "หมู่",
      dataIndex: "village",
      key: "village",
    },
    {
      title: "ที่อยู่",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="แก้ไข">
            <Button
              icon={<EditOutlined />}
              type="link"
              onClick={() => handleEditPatient(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Popconfirm
              title="คุณต้องการลบข้อมูลผู้ป่วยนี้ใช่หรือไม่?"
              onConfirm={() => handleDeletePatient(record.id)}
              okText="ใช่"
              cancelText="ไม่"
            >
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-6xl">
          <div className="mb-8">
            <Title level={2} className="text-center text-blue-800">
              จัดการข้อมูลผู้ป่วย
            </Title>
            <Text className="block text-center text-gray-600 mb-6">
              เพิ่มหรือแก้ไขข้อมูลผู้ป่วยเพื่อใช้ในการจองรถฉุกเฉิน
            </Text>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ฟอร์มเพิ่มข้อมูลผู้ป่วย */}
            <Card className="w-full lg:w-1/2 shadow-md">
              <Title level={4} className="mb-4 flex items-center">
                {selectedPatient ? "แก้ไขข้อมูลผู้ป่วย" : "เพิ่มข้อมูลผู้ป่วย"}
                {selectedPatient && (
                  <Button
                    type="link"
                    className="ml-2"
                    onClick={() => {
                      setSelectedPatient(null);
                      setSelectedLocation(null);
                      form.resetFields();
                    }}
                  >
                    เพิ่มรายการใหม่
                  </Button>
                )}
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  name="name"
                  label="ชื่อผู้ป่วย"
                  rules={[{ required: true, message: "กรุณากรอกชื่อผู้ป่วย" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ป่วย" />
                </Form.Item>

                <Form.Item
                  name="idCard"
                  label="เลขบัตรประชาชน"
                  rules={[
                    { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
                    {
                      pattern: /^[0-9]{13}$/,
                      message: "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก",
                    },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined />}
                    placeholder="เลขบัตรประชาชน 13 หลัก"
                    maxLength={13}
                  />
                </Form.Item>

                <div className="flex gap-4">
                  <Form.Item
                    name="houseNumber"
                    label="บ้านเลขที่"
                    className="w-1/2"
                  >
                    <Input prefix={<HomeOutlined />} placeholder="บ้านเลขที่" />
                  </Form.Item>

                  <Form.Item name="village" label="หมู่" className="w-1/2">
                    <Input placeholder="เช่น หมู่ 1, หมู่ 2" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="address"
                  label="ที่อยู่"
                  initialValue="ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่"
                >
                  <Input.TextArea placeholder="ที่อยู่เพิ่มเติม" rows={3} />
                </Form.Item>

                <Form.Item label="ตำแหน่งผู้ป่วย (พิกัด)">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      type="primary"
                      onClick={handleOpenMapModal}
                      icon={<EnvironmentOutlined />}
                    >
                      เลือกตำแหน่งบนแผนที่
                    </Button>
                    <Button
                      onClick={getCurrentLocation}
                      icon={<AimOutlined />}
                      loading={loadingLocation}
                    >
                      ใช้ตำแหน่งปัจจุบัน
                    </Button>
                  </div>

                  {selectedLocation ? (
                    <div className="bg-blue-50 p-3 rounded-md text-blue-800">
                      <div>ละติจูด: {selectedLocation.lat.toFixed(6)}</div>
                      <div>ลองจิจูด: {selectedLocation.lng.toFixed(6)}</div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md text-gray-500 italic">
                      ยังไม่ได้เลือกตำแหน่ง
                    </div>
                  )}
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={selectedPatient ? <EditOutlined /> : <PlusOutlined />}
                    className="w-full"
                  >
                    {selectedPatient ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* ตารางแสดงข้อมูลผู้ป่วย */}
            <div className="w-full lg:w-1/2">
              <Card title="รายชื่อผู้ป่วย" className="shadow-md">
                <Table
                  columns={columns}
                  dataSource={patients}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                  }}
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal แสดงแผนที่สำหรับเลือกตำแหน่ง */}
      <Modal
        title="เลือกตำแหน่งผู้ป่วย"
        open={isMapModalVisible}
        onCancel={handleMapModalCancel}
        footer={[
          <Button key="cancel" onClick={handleMapModalCancel}>
            ยกเลิก
          </Button>,
          <Button
            key="locate"
            onClick={getCurrentLocation}
            loading={loadingLocation}
            icon={<AimOutlined />}
          >
            ตำแหน่งปัจจุบัน
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={confirmLocation}
            disabled={!selectedLocation}
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
            center={mapCenter}
            zoom={15}
            onClick={handleMapClick}
            options={{
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            }}
          >
            {selectedLocation && (
              <>
                <Marker
                  position={selectedLocation}
                  draggable={true}
                  onDragEnd={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setSelectedLocation({ lat, lng });
                    form.setFieldsValue({
                      latitude: lat,
                      longitude: lng,
                    });
                    fetchAddressFromCoordinates(lat, lng);
                  }}
                />
                {showInfoWindow && (
                  <InfoWindow
                    position={selectedLocation}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div>
                      <p className="font-bold">ตำแหน่งที่เลือก</p>
                      <p>
                        {selectedLocation.lat.toFixed(6)},{" "}
                        {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </>
            )}
          </GoogleMap>
        </LoadScript>
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="text-lg font-semibold mb-2">วิธีใช้งาน:</h4>
          <ul className="text-sm text-gray-600 ml-4 list-disc">
            <li>คลิกบนแผนที่เพื่อเลือกตำแหน่งของผู้ป่วย</li>
            <li>คุณสามารถลากหมุดเพื่อปรับตำแหน่ง</li>
            <li>กดปุ่ม "ตำแหน่งปัจจุบัน" เพื่อใช้พิกัดปัจจุบันของคุณ</li>
            <li>กดปุ่ม "ยืนยันตำแหน่ง" เมื่อเลือกตำแหน่งเรียบร้อยแล้ว</li>
          </ul>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default PatientForm;
