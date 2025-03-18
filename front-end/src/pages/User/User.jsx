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
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./User.css";

const { Sider, Content } = Layout;

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock data (แทนที่ด้วย API จริงในอนาคต)
    const mockUsers = [
      { id: 59217, name: "A", phone: "0000000009" },
      { id: 59213, name: "B", phone: "092xxxxxxx" },
      { id: 59219, name: "C", phone: "092xxxxxxx" },
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
      width: "30%",
    },
    {
      title: "ประวัติการจอง",
      key: "history",
      width: "15%",
      render: () => (
        <Tooltip title="ดูประวัติ">
          <Button type="link" icon={<EyeOutlined />} />
        </Tooltip>
      ),
    },
    {
      title: "",
      key: "edit",
      width: "15%",
      render: (text, record) => (
        <Tooltip title="แก้ไข">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const handleAddUser = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleAddUserSubmit = (values) => {
    const newUser = { ...values, id: Date.now() }; // Simulate new user ID
    setUsers([...users, newUser]);
    setFilteredUsers([...filteredUsers, newUser]);
    handleCancel();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values) => {
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? { ...user, ...values } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    handleCancel();
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="การจัดการสมาชิก" />

        <Content className="user-container">
          <div className="content-wrapper">
            {/* ค้นหาผู้ใช้ */}
            <Input
              placeholder="ค้นหาผู้ใช้..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />

            {/* ปุ่มเพิ่มผู้ใช้ */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              className="add-user-button"
            >
              เพิ่มผู้ใช้
            </Button>

            {/* ตารางแสดงข้อมูลผู้ใช้ */}
            <Table
              columns={columns}
              dataSource={filteredUsers.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              pagination={false} // ใช้ Pagination แยก
              className="user-table"
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredUsers.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Showing 1 to 10 of ${total} results`}
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* Modal เพิ่มผู้ใช้ */}
      <Modal
        title="เพิ่มผู้ใช้"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddUserSubmit}>
          <Form.Item
            label="ชื่อ"
            name="name"
            rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item
            label="เบอร์โทร"
            name="phone"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทร" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              เพิ่มผู้ใช้
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal แก้ไขผู้ใช้ */}
      <Modal
        title="แก้ไขข้อมูลผู้ใช้"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item
            label="ชื่อ"
            name="name"
            rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item
            label="เบอร์โทร"
            name="phone"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทร" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              แก้ไขข้อมูล
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default User;
