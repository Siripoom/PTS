import { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Input,
  Button,
  Pagination,
  Tooltip,
  Typography,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./ManageBooking.css";

const { Sider, Content } = Layout;
const { Title } = Typography;

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // Mock data (แทนที่ด้วย API จริงในอนาคต)
    const mockBookings = [
      {
        id: 59217,
        name: "A",
        phone: "0000000009",
        date: "12/05/2568",
        time: "06.00",
        location: "20",
        distance: 20,
        status: "กำลังดำเนินการ",
      },
      {
        id: 59213,
        name: "B",
        phone: "092xxxxxxx",
        date: "13/05/2568",
        time: "18.00",
        location: "15",
        distance: 15,
        status: "สำเร็จ",
      },
      {
        id: 59219,
        name: "C",
        phone: "092xxxxxxx",
        date: "15/05/2568",
        time: "16.00",
        location: "13",
        distance: 13,
        status: "สำเร็จ",
      },
    ];

    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = bookings.filter((booking) =>
      booking.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBookings(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "ผู้จอง",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
    },
    {
      title: "วันที่จอง",
      dataIndex: "date",
      key: "date",
      width: "15%",
    },
    {
      title: "เวลาที่ให้ไปรับ",
      dataIndex: "time",
      key: "time",
      width: "10%",
    },
    {
      title: "พิกัด",
      key: "location",
      width: "10%",
      render: () => (
        <Tooltip title="ดูพิกัด">
          <Button type="link" icon={<EnvironmentOutlined />} />
        </Tooltip>
      ),
    },
    {
      title: "ระยะทาง (กม.)",
      dataIndex: "distance",
      key: "distance",
      width: "10%",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status) => (
        <span
          className={`status-label ${
            status === "สำเร็จ" ? "success" : "pending"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "",
      key: "edit",
      width: "5%",
      render: () => (
        <Tooltip title="แก้ไข">
          <Button type="link" icon={<EditOutlined />} />
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
            {/* ค้นหาการจอง */}
            <Input
              placeholder="ค้นหาผู้ใช้..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />

            {/* ตารางแสดงข้อมูลการจอง */}
            <Table
              columns={columns}
              dataSource={filteredBookings.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              pagination={false} // ใช้ Pagination แยก
              className="booking-table"
            />

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={filteredBookings.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Showing 1 to 10 of ${total} results`}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManageBooking;
