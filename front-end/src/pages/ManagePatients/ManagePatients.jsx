import { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Input,
  Button,
  Pagination,
  Tooltip,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Space,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  AimOutlined,
} from "@ant-design/icons";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {
  getAllPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getAllBookings,
} from "../../services/api";
import "./ManagePatients.css";

const { Sider, Content } = Layout;
const { Option } = Select;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// กำหนดค่าเริ่มต้นของแผนที่ (ตำแหน่งโรงพยาบาล หรือตำบลเวียง)
const defaultMapCenter = {
  lat: 19.9315402, // ละติจูดเริ่มต้น
  lng: 99.2209747, // ลองติจูดเริ่มต้น
};

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [form] = Form.useForm();
  const pageSize = 10;

  useEffect(() => {
    fetchPatients();
    fetchBookings();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getAllPatients();
      setPatients(response);
      setFilteredPatients(response);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลผู้ป่วยได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings();
      setBookings(response);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลการจองได้");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.idCard.includes(value) ||
        (patient.houseNumber && patient.houseNumber.includes(value)) ||
        (patient.address &&
          patient.address.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredPatients(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    form.resetFields();
    setSelectedLocation(null);
    setIsModalVisible(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setSelectedLocation(
      patient.latitude && patient.longitude
        ? { lat: patient.latitude, lng: patient.longitude }
        : null
    );
    form.setFieldsValue({
      name: patient.name,
      idCard: patient.idCard,
      houseNumber: patient.houseNumber,
      village: patient.village,
      address: patient.address,
      bookingId: patient.bookingId,
      latitude: patient.latitude,
      longitude: patient.longitude,
    });
    setIsModalVisible(true);
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await deletePatient(patientId);
      message.success("ลบข้อมูลผู้ป่วยสำเร็จ");
      fetchPatients();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูลผู้ป่วย");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
  };

  const handleSubmit = async (values) => {
    try {
      // เพิ่มข้อมูลละติจูดและลองติจูดที่เลือกจากแผนที่
      const patientData = {
        ...values,
        latitude: selectedLocation?.lat || null,
        longitude: selectedLocation?.lng || null,
      };

      if (editingPatient) {
        await updatePatient(editingPatient.id, patientData);
        message.success("แก้ไขข้อมูลผู้ป่วยสำเร็จ");
      } else {
        await createPatient(patientData);
        message.success("เพิ่มผู้ป่วยสำเร็จ");
      }
      setIsModalVisible(false);
      fetchPatients();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดำเนินการ");
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

    // แสดง InfoWindow ชั่วคราว
    setShowInfoWindow(true);
    setTimeout(() => setShowInfoWindow(false), 3000);
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

  // ฟังก์ชันสำหรับเปิดการนำทางใน Google Maps
  const handleNavigateToPatient = (patient) => {
    if (patient.latitude && patient.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${patient.latitude},${patient.longitude}&travelmode=driving`;
      window.open(url, "_blank");
    } else {
      message.warning("ไม่มีข้อมูลตำแหน่งของผู้ป่วย");
    }
  };

  const columns = [
    {
      title: "ชื่อผู้ป่วย",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "เลข ปปช 13",
      dataIndex: "idCard",
      key: "idCard",
      width: "12%",
      render: (text) =>
        text.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, "$1-$2-$3-$4-$5"),
    },
    {
      title: "บ้านเลขที่",
      dataIndex: "houseNumber",
      key: "houseNumber",
      width: "10%",
    },
    {
      title: "หมู่",
      dataIndex: "village",
      key: "village",
      width: "8%",
    },
    {
      title: "ต.เวียง อ.ฝาง จ.เชียงใหม่",
      dataIndex: "address",
      key: "address",
      width: "18%",
    },
    {
      title: "ตำแหน่งผู้ป่วย",
      key: "location",
      width: "12%",
      render: (_, record) => (
        <Space>
          {record.latitude && record.longitude ? (
            <Tooltip title="นำทางไปยังผู้ป่วย">
              <Button
                type="primary"
                icon={<EnvironmentOutlined />}
                onClick={() => handleNavigateToPatient(record)}
                size="small"
              />
            </Tooltip>
          ) : (
            <Tooltip title="ไม่มีข้อมูลตำแหน่ง">
              <Button
                type="default"
                icon={<EnvironmentOutlined />}
                disabled
                size="small"
              />
            </Tooltip>
          )}
          <span>
            {record.latitude ? record.latitude.toFixed(6) : "-"},
            {record.longitude ? record.longitude.toFixed(6) : "-"}
          </span>
        </Space>
      ),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <>
          <Tooltip title="แก้ไข">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditPatient(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Popconfirm
              title="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ป่วยนี้?"
              onConfirm={() => handleDeletePatient(record.id)}
              okText="ใช่"
              cancelText="ยกเลิก"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="การจัดการผู้ป่วย" />

        <Content className="patient-management-container">
          <div className="content-wrapper">
            <div className="controls-container">
              <Input
                placeholder="ค้นหาผู้ป่วย..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={handleSearch}
                className="search-input"
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddPatient}
                className="add-patient-button"
              >
                เพิ่มผู้ป่วย
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={filteredPatients.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              loading={loading}
              pagination={false}
              className="patient-table"
              scroll={{ x: true }}
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredPatients.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) =>
                  `แสดงผล 1 ถึง ${Math.min(
                    pageSize,
                    total
                  )} จาก ${total} รายการ`
                }
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* Modal สำหรับเพิ่ม/แก้ไขข้อมูลผู้ป่วย */}
      <Modal
        title={editingPatient ? "แก้ไขข้อมูลผู้ป่วย" : "เพิ่มผู้ป่วย"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="ชื่อผู้ป่วย"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ป่วย" }]}
          >
            <Input placeholder="ชื่อผู้ป่วย" />
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
            <Input placeholder="เลขบัตรประชาชน 13 หลัก" maxLength={13} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="houseNumber" label="บ้านเลขที่">
                <Input placeholder="บ้านเลขที่" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="village" label="หมู่">
                <Input placeholder="เช่น หมู่ 1-20" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="ที่อยู่"
            initialValue="ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่"
          >
            <Input placeholder="ตำบล อำเภอ จังหวัด" />
          </Form.Item>

          <Form.Item label="ตำแหน่งผู้ป่วย">
            <Input.Group compact>
              <Form.Item name="latitude" noStyle rules={[{ required: false }]}>
                <Input
                  style={{ width: "40%" }}
                  placeholder="ละติจูด"
                  readOnly
                  value={selectedLocation?.lat}
                />
              </Form.Item>
              <Form.Item name="longitude" noStyle rules={[{ required: false }]}>
                <Input
                  style={{ width: "40%" }}
                  placeholder="ลองติจูด"
                  readOnly
                  value={selectedLocation?.lng}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={handleOpenMapModal}
                style={{ width: "20%" }}
              >
                เลือกตำแหน่ง
              </Button>
            </Input.Group>
            <div className="map-location-display">
              {selectedLocation ? (
                <span className="location-selected">
                  ตำแหน่งที่เลือก: {selectedLocation.lat.toFixed(6)},{" "}
                  {selectedLocation.lng.toFixed(6)}
                </span>
              ) : (
                <span className="location-not-selected">
                  ยังไม่ได้เลือกตำแหน่ง
                </span>
              )}
            </div>
          </Form.Item>

          <Form.Item name="bookingId" label="รหัสการจอง">
            <Select placeholder="เลือกรหัสการจอง">
              {bookings.map((booking) => (
                <Option key={booking.id} value={booking.id}>
                  {booking.id} - {booking.User?.fullName || "ไม่มีชื่อผู้จอง"}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="form-actions">
              <Button type="default" onClick={handleModalCancel}>
                ยกเลิก
              </Button>
              <Button type="primary" htmlType="submit">
                {editingPatient ? "บันทึกการแก้ไข" : "เพิ่มผู้ป่วย"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal สำหรับเลือกตำแหน่งบนแผนที่ */}
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
        <div className="map-instructions mt-4">
          <p>
            คำแนะนำ: คลิกบนแผนที่เพื่อเลือกตำแหน่ง หรือลากหมุดเพื่อปรับตำแหน่ง
          </p>
          <p>คุณสามารถกดปุ่ม "ตำแหน่งปัจจุบัน" เพื่อใช้ตำแหน่งของคุณ</p>
          {selectedLocation && (
            <p className="selected-coordinates">
              <strong>พิกัดที่เลือก:</strong> {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default PatientManagement;
