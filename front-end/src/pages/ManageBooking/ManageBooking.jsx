import { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Input,
  Button,
  Pagination,
  Tooltip,
  Typography,
  message,
  Modal,
  Form,
  Select,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {
  getAllBookings,
  getSingleBooking,
  deleteBooking,
  updateBooking,
} from "../../services/api";
import { useNavigate } from "react-router-dom"; // สำหรับการเปลี่ยนหน้า
import dayjs from "dayjs"; // ใช้ dayjs สำหรับการจัดการวันที่และเวลา
import "./ManageBooking.css";

const { Sider, Content } = Layout;
const { Title } = Typography;

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State สำหรับเปิด/ปิด Modal
  const [selectedBooking, setSelectedBooking] = useState(null); // Booking ที่เลือกสำหรับการแก้ไข
  const pageSize = 10;
  const navigate = useNavigate(); // สำหรับการนำทางไปยังหน้าอื่น

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookings();
      setBookings(response);
      setFilteredBookings(response);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลการจองได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = bookings.filter(
      (booking) =>
        booking.User.fullName.toLowerCase().includes(value.toLowerCase()) // ค้นหาจากชื่อ
    );
    setFilteredBookings(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteBooking = async (id) => {
    setLoading(true);
    try {
      await deleteBooking(id);
      message.success("ลบการจองเรียบร้อยแล้ว");
      fetchBookings(); // โหลดข้อมูลใหม่หลังจากลบ
    } catch (error) {
      message.error("ไม่สามารถลบการจองได้");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (data) => {
    setLoading(true);
    try {
      console.log("Update data:", data);
      await updateBooking(data);
      message.success("อัปเดตสถานะการจองเรียบร้อยแล้ว");
      fetchBookings(); // โหลดข้อมูลใหม่หลังจากอัปเดต
    } catch (error) {
      message.error("ไม่สามารถอัปเดตสถานะการจองได้");
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (booking) => {
    // นำทางไปยังหน้า ManageBookingDetail พร้อมกับ ID ของการจอง
    navigate(`/admin/manage-booking/${booking.id}`);
  };

  const handleEditBooking = (record) => {
    setSelectedBooking(record); // เก็บข้อมูลการจองที่เลือก
    setIsModalVisible(true); // เปิด Modal
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // ปิด Modal
    setSelectedBooking(null); // เคลียร์การเลือกข้อมูล
  };

  const handleModalOk = () => {
    // การอัปเดตข้อมูลเมื่อกดบันทึกใน Modal
    const updatedBooking = {
      ...selectedBooking,
      status: selectedBooking.status,
      isCancelled: selectedBooking.isCancelled,
    };

    handleUpdateBooking(updatedBooking); // เรียกฟังก์ชันสำหรับอัปเดตข้อมูล
    setIsModalVisible(false); // ปิด Modal หลังจากอัปเดต
    setSelectedBooking(null); // เคลียร์ข้อมูล
  };

  const columns = [
    {
      title: "ผู้จอง",
      key: "User.fullName",
      width: "15%",
      render: (text, record) => <span>{record.User.fullName}</span>,
    },
    {
      title: "เบอร์โทร",
      key: "User.phone",
      width: "15%",
      render: (text, record) => <span>{record.User.phone}</span>,
    },
    {
      title: "วันที่จอง",
      dataIndex: "pickupDate",
      key: "pickupDate",
      width: "15%",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "เวลาที่ให้ไปรับ",
      dataIndex: "pickupTime",
      key: "pickupTime",
      width: "10%",
      render: (text) => dayjs(text).format("HH:mm:ss"),
    },
    {
      title: "พิกัด",
      key: "location",
      width: "10%",
      render: (text, record) => (
        <Tooltip title="ดูพิกัด">
          <Button
            type="link"
            icon={<EnvironmentOutlined />}
            onClick={() => handleViewHistory(record)}
          />
        </Tooltip>
      ),
    },
    {
      title: "ระยะทาง",
      key: "distance",
      width: "10%",
      dataIndex: "distance",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => (
        <span
          className={`status-label ${
            status === "PENDING"
              ? "warning"
              : status === "COMPLETED"
              ? "success"
              : status === "CANCELLED"
              ? "pending"
              : status === "IN_PROGRESS"
              ? "in-progress"
              : ""
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "แก้ไข",
      key: "edit",
      width: "5%",
      render: (record) => (
        <Tooltip title="แก้ไข">
          <Button
            type="link"
            onClick={() => handleEditBooking(record)}
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
    {
      title: "ลบ",
      key: "delete",
      width: "5%",
      render: (record) => (
        <Tooltip title="ลบ">
          <Button
            type="link"
            style={{ color: "red" }}
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBooking(record.id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="การจัดการการจอง" />

        <Content className="manageBooking-container">
          <div className="content-wrapper">
            <Input
              placeholder="ค้นหาผู้ใช้..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />

            <Table
              columns={columns}
              dataSource={filteredBookings.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              loading={loading}
              pagination={false}
              className="booking-table"
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredBookings.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `แสดงผล 1 ถึง 10 จาก ${total} รายการ`}
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* Modal สำหรับการแก้ไขสถานะการจอง */}
      <Modal
        title="แก้ไขสถานะการจอง"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          initialValues={{
            status: selectedBooking ? selectedBooking.status : "",
            isCancelled: selectedBooking ? selectedBooking.isCancelled : false,
          }}
        >
          <Form.Item
            label="สถานะ"
            name="status"
            rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}
          >
            <Select
              value={selectedBooking?.status}
              onChange={(value) =>
                setSelectedBooking((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            >
              <Select.Option value="PENDING">PENDING</Select.Option>
              <Select.Option value="IN_PROGRESS">IN_PROGRESS</Select.Option>
              <Select.Option value="COMPLETED">COMPLETED</Select.Option>
              <Select.Option value="CANCELLED">CANCELLED</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ยกเลิกการจอง"
            name="isCancelled"
            valuePropName="checked"
          >
            <Checkbox
              checked={selectedBooking?.isCancelled}
              onChange={(e) =>
                setSelectedBooking((prev) => ({
                  ...prev,
                  isCancelled: e.target.checked,
                }))
              }
            >
              ยกเลิกการจอง
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ManageBooking;
