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
  Input as AntInput,
  message,
  Popconfirm,
  Select,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
} from "../../services/api";
import dayjs from "dayjs"; // ใช้ dayjs เพื่อจัดการวันที่
import "./User.css";

const { Sider, Content } = Layout;

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  // สำหรับ Modal การแสดงประวัติการจอง
  const [isBookingHistoryModalVisible, setIsBookingHistoryModalVisible] =
    useState(false);
  const [bookingData, setBookingData] = useState([]); // ข้อมูลการจอง
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddUser = () => {
    setIsEditModalVisible(true); // แสดง Modal สำหรับการเพิ่มผู้ใช้
  };

  const handleCancel = () => {
    setIsBookingHistoryModalVisible(false); // ปิด Modal การดูประวัติการจอง
    setIsEditModalVisible(false); // ปิด Modal การเพิ่ม/แก้ไขผู้ใช้
    form.resetFields();
    setEditingUser(null);
  };

  const handleAddUserSubmit = async (values) => {
    try {
      await createUser(values);
      message.success("เพิ่มผู้ใช้สำเร็จ");
      handleCancel();
      fetchUsers();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      citizen_id: user.citizen_id,
      role: user.role,
    });
    setIsEditModalVisible(true); // เปิด Modal แก้ไขข้อมูลผู้ใช้
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateUser(editingUser.id, values);
      message.success("แก้ไขข้อมูลผู้ใช้สำเร็จ");
      handleCancel();
      fetchUsers();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("ลบผู้ใช้สำเร็จ");
      fetchUsers();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบผู้ใช้");
    }
  };

  const handleViewHistory = async (user) => {
    try {
      const response = await getSingleUser(user.id);
      setBookingData(response.data.bookingsAsUser); // ตั้งค่าการจองที่เชื่อมกับผู้ใช้
      setIsBookingHistoryModalVisible(true); // เปิด Modal ประวัติการจอง
    } catch (error) {
      message.error("ไม่สามารถโหลดประวัติการจองได้");
    }
  };

  const columns = [
    {
      title: "เลขบัตรประชาชน",
      dataIndex: "citizen_id",
      key: "citizen_id",
      width: "20%",
    },
    {
      title: "ชื่อ",
      dataIndex: "fullName",
      key: "fullName",
      width: "20%",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
    },
    {
      title: "ระดับผู้ใช้",
      dataIndex: "role",
      key: "role",
      width: "15%",
    },
    {
      title: "ประวัติการจอง",
      key: "history",
      width: "15%",
      render: (text, record) => (
        <Tooltip title="ดูประวัติ">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewHistory(record)} // เปิด Modal ประวัติการจอง
          />
        </Tooltip>
      ),
    },
    {
      title: "การจัดการ",
      key: "actions",
      width: "25%",
      render: (text, record) => (
        <>
          <Tooltip title="แก้ไข">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Popconfirm
              title="คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?"
              onConfirm={() => handleDeleteUser(record.id)}
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
        <Header title="การจัดการสมาชิก" />

        <Content className="user-container">
          <div className="content-wrapper">
            <Input
              placeholder="ค้นหาผู้ใช้..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              className="add-user-button"
            >
              เพิ่มผู้ใช้
            </Button>

            <Table
              columns={columns}
              dataSource={filteredUsers.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="_id"
              loading={loading}
              pagination={false}
              className="user-table"
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredUsers.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `แสดงผล 1 ถึง 10 จาก ${total} รายการ`}
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* Modal สำหรับการดูประวัติการจอง */}
      <Modal
        title="ประวัติการจอง"
        open={isBookingHistoryModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Table
          columns={[
            {
              title: "วันที่รับ",
              dataIndex: "pickupDate",
              key: "pickupDate",
              render: (text) => dayjs(text).format("YYYY-MM-DD"), // แสดงแค่วันที่
            },
            {
              title: "เวลารับ",
              dataIndex: "pickupTime",
              key: "pickupTime",
              render: (text) => dayjs(text).format("HH:mm"), // แสดงแค่เวลา
            },
            { title: "สถานะ", dataIndex: "status", key: "status" },
          ]}
          dataSource={bookingData}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Modal สำหรับเพิ่มผู้ใช้ */}
      <Modal
        title="เพิ่มผู้ใช้"
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddUserSubmit} layout="vertical">
          {/* ฟอร์มสำหรับการเพิ่มผู้ใช้ */}
        </Form>
      </Modal>

      {/* Modal สำหรับแก้ไขข้อมูลผู้ใช้ */}
      <Modal
        title="แก้ไขข้อมูลผู้ใช้"
        open={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          {/* ฟอร์มสำหรับการแก้ไขผู้ใช้ */}
        </Form>
      </Modal>
    </Layout>
  );
};

export default User;
